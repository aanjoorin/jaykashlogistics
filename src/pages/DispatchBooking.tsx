import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import DispatchRequestForm from '../components/forms/DispatchRequestForm';
import PaymentPage from '../components/payment/PaymentPage';
import { sendQuoteRequestEmails } from '../lib/emailjs';

const DispatchBooking: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<any>(null);
  const [amount, setAmount] = useState<number>(0);
  const [showPayment, setShowPayment] = useState(false);
  const [isBooking] = useState(true);

  useEffect(() => {
    document.title = 'Dispatch Service Booking - Jaykash';
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      setFormData(data);
      const calculatedAmount = 1000;
      setAmount(calculatedAmount);
      if (isBooking) {
        setShowPayment(true);
      } else {
        // Only send email for quotes
        const emailData = {
          service_type: 'Dispatch Service',
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
        await sendQuoteRequestEmails(emailData);
        alert('Quote request sent successfully! We will contact you shortly.');
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit quote request. Please try again.');
    }
  };

  const handlePaymentSuccess = async () => {
    alert('Booking confirmed! Check your email for details.');
    navigate('/');
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
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {showPayment ? (
              <PaymentPage
                amount={amount * 100} // Convert to cents
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                customerEmail={formData?.email}
                customerName={`${formData?.firstName} ${formData?.lastName}`}
                serviceType="Dispatch Service"
                bookingReference={`DISP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`}
                bookingDetails={`From ${formData?.pickupAddress} to ${formData?.deliveryAddress}`}
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