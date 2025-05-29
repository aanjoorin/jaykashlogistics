import React, { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import { useInView } from 'react-intersection-observer';
import RoroRequestForm from '../components/forms/RoroRequestForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendEmail, sendCustomerConfirmationEmail } from '../lib/emailjs';
import { createPaymentIntent } from '../lib/stripe';
import StripeCheckout from '../components/payment/StripeCheckout';

const OceanFreightBooking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBooking = location.pathname.includes('/book-now');
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    document.title = isBooking ? 'Ocean Freight Booking - Jaykash' : 'Ocean Freight Quote - Jaykash';
    window.scrollTo(0, 0);
  }, [isBooking]);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleSubmit = async (data: any) => {
    try {
      // Store form data
      setFormData(data);

      // Send email notification to admin
      await sendEmail('ocean_freight_template', {
        ...data,
        service_type: isBooking ? 'Ocean Freight Booking' : 'Ocean Freight Quote'
      });

      // Send confirmation email to customer
      await sendCustomerConfirmationEmail('template_qogh09d', {
        ...data,
        service_type: isBooking ? 'Ocean Freight Booking' : 'Ocean Freight Quote'
      });

      if (isBooking) {
        // Generate a unique booking reference
        const bookingRef = `OCN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // For bookings, create payment intent and show payment form
        const secret = await createPaymentIntent(1000, bookingRef, data.email);
        setClientSecret(secret);
        setShowPayment(true);
      } else {
        // For quotes, show success message
        alert('Quote request submitted successfully! We will contact you shortly.');
        navigate('/');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Send confirmation email to admin
      await sendEmail('booking_confirmation_template', {
        ...formData,
        payment_status: 'completed'
      });
      
      // Send payment confirmation to customer
      await sendCustomerConfirmationEmail('payment_confirmation_template', {
        ...formData,
        payment_status: 'completed'
      });
      
      alert('Booking confirmed! Check your email for confirmation details.');
      navigate('/');
    } catch (error) {
      console.error('Error processing success:', error);
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
              <RoroRequestForm onSubmit={handleSubmit} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OceanFreightBooking;