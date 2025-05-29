import React, { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import { useInView } from 'react-intersection-observer';
import DispatchRequestForm from '../components/forms/DispatchRequestForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendEmail, sendCustomerConfirmationEmail } from '../lib/emailjs';
import { createPaymentIntent } from '../lib/stripe';
import StripeCheckout from '../components/payment/StripeCheckout';

const InlandFreightBooking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBooking = location.pathname.includes('/book-now');
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    document.title = isBooking ? 'Inland Freight Booking - Jaykash' : 'Inland Freight Quote - Jaykash';
    window.scrollTo(0, 0);
  }, [isBooking]);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleSubmit = async (data: any) => {
    try {
      setFormData(data);

      const emailData = {
        service_type: 'Inland Freight',
        subject: 'Inland Freight Booking Request',
        shipper_info: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone
        },
        pickup_info: {
          location_type: data.pickupLocationType || 'Not specified',
          address: data.pickupAddress || 'Not specified',
          contact_name: data.pickupContactName || 'Not specified',
          contact_phone: data.pickupContactPhone || 'Not specified'
        },
        delivery_info: {
          location_type: data.deliveryLocationType || 'Not specified',
          address: data.deliveryAddress || 'Not specified'
        },
        vehicle_info: {
          year: data.vehicleYear,
          make: data.vehicleMake,
          model: data.vehicleModel,
          vin: data.vinNumber
        },
        additional_info: {
          lot_number: data.lotNumber || 'Not specified',
          is_runner: data.isRunner || false,
          car_title_ready: data.isCarTitleReady || false
        }
      };

      // Send email to admin
      await sendEmail('template_qogh09d', emailData);

      // Send confirmation email to customer
      await sendCustomerConfirmationEmail('template_ene1r37', emailData);

      if (isBooking) {
        const bookingRef = `INL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const secret = await createPaymentIntent(1000, bookingRef, data.email);
        setClientSecret(secret);
        setShowPayment(true);
      } else {
        alert('Quote request submitted successfully! We will contact you shortly.');
        navigate('/');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit quote request. Please try again.');
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Send confirmation to admin
      await sendEmail('template_ene1r37', {
        to_name: `${formData.firstName} ${formData.lastName}`,
        service_type: 'Inland Freight',
        booking_details: `From ${formData.pickupAddress} to ${formData.deliveryAddress}`,
        to_email: formData.email
      });
      
      // Send payment confirmation to customer
      await sendCustomerConfirmationEmail('payment_confirmation_template', {
        shipper_info: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone || ''
        },
        service_type: 'Inland Freight',
        pickup_info: {
          address: formData.pickupAddress
        },
        delivery_info: {
          address: formData.deliveryAddress
        },
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
        title={isBooking ? "Inland Freight Booking" : "Inland Freight Quote"}
        subtitle={isBooking ? 
          "Book your domestic vehicle transport service" :
          "Get a quote for your domestic vehicle transport service"
        }
        breadcrumbs={[{ 
          name: isBooking ? "Inland Freight Booking" : "Inland Freight Quote", 
          path: isBooking ? "/book-now/inland-freight" : "/request-quote/inland-freight" 
        }]}
        backgroundImage="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg"
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
              <DispatchRequestForm onSubmit={handleSubmit} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default InlandFreightBooking;