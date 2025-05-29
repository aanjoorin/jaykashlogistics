import React, { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import { useInView } from 'react-intersection-observer';
import DispatchRequestForm from '../components/forms/DispatchRequestForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendEmail, sendCustomerConfirmationEmail } from '../lib/emailjs';
// import { sendEmail } from '../lib/emailjs';
import PaymentPage from '../components/payment/PaymentPage';

const DispatchBooking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBooking = location.pathname.includes('/book-now');
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    document.title = isBooking ? 'Dispatch Service Booking - Jaykash' : 'Dispatch Service Quote - Jaykash';
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
        service_type: 'Dispatch Service',
        subject: 'Dispatch Service Booking Request',
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

      await sendEmail('template_qogh09d', emailData);
      
      const calculatedAmount = 1000;
      setAmount(calculatedAmount);

      if (isBooking) {
        setShowPayment(true);
      } else {
        alert('Quote request sent successfully! We will contact you shortly.');
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit quote request. Please try again.');
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      await sendEmail('template_ene1r37', {
        to_name: `${formData.firstName} ${formData.lastName}`,
        service_type: 'Dispatch Service',
        booking_details: `From ${formData.pickupAddress} to ${formData.deliveryAddress}`,
        to_email: formData.email
      });

      alert('Booking confirmed! Check your email for details.');
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      alert('Booking confirmed but confirmation email failed to send.');
    }
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}`);
  };

  return (
    <div>
      <PageHeader 
        title={isBooking ? "Dispatch Service Booking" : "Dispatch Service Quote"}
        subtitle={isBooking ? 
          "Book our professional dispatch service for vehicle transport needs" :
          "Get our professional service quote for vehicle transport needs"
        }
        breadcrumbs={[{ 
          name: isBooking ? "Dispatch Service Booking" : "Dispatch Service Quote", 
          path: isBooking ? "/book-now/dispatch" : "/request-quote/dispatch" 
        }]}
        backgroundImage="https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg"
      />
      
      <section className="section bg-white">
        <div 
          ref={ref}
          className={`container-custom transition-all duration-500 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-4xl mx-auto">
            {showPayment ? (
              <PaymentPage
                amount={amount}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                customerEmail={formData?.email}
              />
            ) : (
              <DispatchRequestForm onSubmit={handleSubmit} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DispatchBooking;