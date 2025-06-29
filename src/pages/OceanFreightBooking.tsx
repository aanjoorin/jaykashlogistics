import React, { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import { useInView } from 'react-intersection-observer';
import RoroRequestForm from '../components/forms/RoroRequestForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendEmailToAdmin, sendCustomerConfirmationEmail } from '../lib/emailjs';
import { createPaymentIntent } from '../lib/stripe';
import StripeCheckout from '../components/payment/StripeCheckout';

const OCEAN_FREIGHT_TEMPLATE = 'ocean_freight_template';
const CUSTOMER_QUOTE_TEMPLATE = 'template_qogh09d';
const BOOKING_CONFIRMATION_TEMPLATE = 'booking_confirmation_template';
const PAYMENT_CONFIRMATION_TEMPLATE = 'payment_confirmation_template';

const OceanFreightBooking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBooking = location.pathname.includes('/book-now');
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = isBooking ? 'Ocean Freight Booking - Jaykash' : 'Ocean Freight Quote - Jaykash';
    window.scrollTo(0, 0);
  }, [isBooking]);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Handles both quote and booking form submissions
  const handleSubmit = async (data: any) => {
    try {
      setFormData(data);

      if (isBooking) {
        // Generate a unique booking reference
        const bookingRef = `OCN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        if (!data.email) {
          alert('Email is required for booking.');
          return;
        }
        setLoading(true);
        // Create payment intent and show payment form
        const secret = await createPaymentIntent(1000, bookingRef, data.email);
        setClientSecret(secret);
        setShowPayment(true);
        setLoading(false);
      } else {
        // For quotes, send emails immediately
        await sendEmailToAdmin({ ...data, service_type: 'Ocean Freight Quote' });
        await sendCustomerConfirmationEmail({ ...data, service_type: 'Ocean Freight Quote' });
        alert('Quote request submitted successfully! We will contact you shortly.');
        navigate('/');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error submitting request:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Called after successful payment
  const handlePaymentSuccess = async () => {
    try {
      await sendEmailToAdmin({ ...formData, service_type: 'Ocean Freight Booking', payment_status: 'completed' });
      await sendCustomerConfirmationEmail({ ...formData, service_type: 'Ocean Freight Booking', payment_status: 'completed' });
      alert('Booking confirmed! Check your email for confirmation details.');
      navigate('/');
    } catch (error) {
      console.error('Error processing success:', error);
      alert('Booking confirmed, but failed to send confirmation email.');
      navigate('/');
    }
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}`);
  };

  return (
    <div>
      <PageHeader 
        title={isBooking ? "Ocean Freight Booking" : "Ocean Freight Quote"}
        subtitle={isBooking ? 
          "Book your international vehicle shipping service" :
          "Get a quote for your international vehicle shipping service"
        }
        breadcrumbs={[{ 
          name: isBooking ? "Ocean Freight Booking" : "Ocean Freight Quote", 
          path: isBooking ? "/book-now/ocean-freight" : "/request-quote/ocean-freight" 
        }]}
        backgroundImage="https://images.pexels.com/photos/1554646/pexels-photo-1554646.jpeg"
      />
      
      <section className="section bg-white">
        <div 
          ref={ref}
          className={`container-custom transition-all duration-500 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-4xl mx-auto">
            {showPayment && clientSecret ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6">Complete Payment</h2>
                <StripeCheckout
                  clientSecret={clientSecret}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            ) : (
              <RoroRequestForm onSubmit={handleSubmit} loading={loading} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OceanFreightBooking;