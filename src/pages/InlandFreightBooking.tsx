import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import DispatchRequestForm from '../components/forms/DispatchRequestForm';
import PaymentPage from '../components/payment/PaymentPage';
import { sendQuoteRequestEmails } from '../lib/emailjs';

const InlandFreightBooking: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<any>(null);
  const [amount, setAmount] = useState<number>(0);
  const [showPayment, setShowPayment] = useState(false);
  const [isBooking] = useState(true);

  useEffect(() => {
    document.title = 'Inland Freight Booking - Jaykash';
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      setFormData(data);
      if (isBooking) {
        const calculatedAmount = 1000;
        setAmount(calculatedAmount);
        setShowPayment(true);
      } else {
        // Only send email for quotes
        const emailData = {
          service_type: 'Inland Freight',
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
        alert('Quote request submitted successfully! We will contact you shortly.');
        navigate('/');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit quote request. Please try again.');
    }
  };

  const handlePaymentSuccess = async () => {
    alert('Booking confirmed! Check your email for confirmation details.');
    navigate('/');
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
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {showPayment ? (
              <PaymentPage
                amount={amount * 100} // Convert to cents
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                customerEmail={formData?.email}
                customerName={`${formData?.firstName} ${formData?.lastName}`}
                serviceType="Inland Freight"
                bookingReference={`INL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`}
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

export default InlandFreightBooking;