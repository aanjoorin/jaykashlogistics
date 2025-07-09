import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import RoroRequestForm from '../components/forms/RoroRequestForm';
import PaymentPage from '../components/payment/PaymentPage';
import { sendQuoteRequestEmails } from '../lib/emailjs';
import { generateBookingReference, navigateToPayment, PaymentData } from '../lib/payment';

const OceanFreightBooking: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<any>(null);
  const [amount, setAmount] = useState<number>(0);
  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooking] = useState(true);

  useEffect(() => {
    document.title = 'Ocean Freight Booking - Jaykash';
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (isBooking) {
        // Generate a unique booking reference
        const bookingRef = generateBookingReference('OCEAN');
        // Calculate payment amount (you can adjust this based on your pricing logic)
        const baseAmount = 1250; // Base service fee
        setFormData(data);
        setAmount(baseAmount);
        setShowPayment(true);
      } else {
        // For quotes, show success message and send email
        const emailData = {
          service_type: 'Ocean Freight',
          shipper_info: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            phone: data.phone
          },
          shipline_info: {
            loading_port: data.loadingPort,
            discharge_port: data.dischargePort,
            carrier: data.carrier
          },
          receiver_info: {
            consignee_name: data.consigneeName,
            consignee_address: data.consigneeAddress,
            consignee_phone: data.consigneePhone,
            notify_party: data.notifyParty || 'Not specified'
          },
          vehicle_info: {
            year: data.vehicleYear,
            make: data.vehicleMake,
            model: data.vehicleModel,
            vin: data.vinNumber,
            category: data.vehicleCategory,
            title_number: data.titleNumber,
            title_state: data.titleState,
            declared_value: data.declaredValue,
            condition: data.vehicleCondition || 'Not specified'
          },
          additional_info: {
            is_runner: false,
            car_title_ready: data.isCarTitleReady || false
          }
        };
        await sendQuoteRequestEmails(emailData);
        alert('Quote request submitted successfully! We will contact you shortly.');
        navigate('/');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
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
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {showPayment ? (
              <PaymentPage
                amount={amount * 100} // Convert to cents
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                customerEmail={formData?.email}
                customerName={`${formData?.firstName} ${formData?.lastName}`}
                serviceType="Ocean Freight"
                bookingReference={`OCEAN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`}
                bookingDetails={`From ${formData?.loadingPort} to ${formData?.dischargePort}`}
              />
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