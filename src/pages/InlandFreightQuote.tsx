import React, { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import { useInView } from 'react-intersection-observer';
import DispatchRequestForm from '../components/forms/DispatchRequestForm';
import { sendEmailToAdmin, sendCustomerConfirmationEmail } from '../lib/emailjs';
import QuoteSuccessMessage from '../components/common/QuoteSuccessMessage';

const InlandFreightQuote: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Inland Freight Quote - Jaykash';
    window.scrollTo(0, 0);
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleSubmit = async (data: any) => {
    try {
      const emailData = {
        service_type: 'Inland Freight',
        shipper_info: {
          name: data.shipperName,
          email: data.shipperEmail,
          phone: data.shipperPhone
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

      // The existing emailData object already has the right structure
      await sendEmailToAdmin(emailData);
      
      // Send confirmation email to customer using the same data structure
      await sendCustomerConfirmationEmail(emailData);
      
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('Failed to submit quote request. Please try again.');
    }
  };

  return (
    <div>
      <PageHeader 
        title="Inland Freight Quote"
        subtitle="Get a quote for domestic vehicle transport services"
        breadcrumbs={[{ name: "Inland Freight", path: "/request-quote/inland-freight" }]}
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
            {isSubmitted ? (
              <QuoteSuccessMessage />
            ) : (
              <DispatchRequestForm onSubmit={handleSubmit} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default InlandFreightQuote;