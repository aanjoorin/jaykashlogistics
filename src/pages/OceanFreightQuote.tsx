import React, { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import { useInView } from 'react-intersection-observer';
import RoroRequestForm from '../components/forms/RoroRequestForm';
import { sendEmailToAdmin, sendCustomerConfirmationEmail } from '../lib/emailjs';
import QuoteSuccessMessage from '../components/common/QuoteSuccessMessage';

const OceanFreightQuote: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Ocean Freight Quote - Jaykash';
    window.scrollTo(0, 0);
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleSubmit = async (data: any) => {
    try {
      const emailData = {
        service_type: 'Ocean Freight',
        subject: 'Quote Request - Ocean Freight',
        shipper_info: {
          name: data.firstName + ' ' + data.lastName,
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

      // The existing emailData object already has the right structure
      await sendEmailToAdmin(emailData);
      await sendCustomerConfirmationEmail(emailData);
      
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error submitting quote:', error);
      // More specific error message
      if (error instanceof Error) {
        alert(`Failed to submit quote request: ${error.message}`);
      } else {
        alert('Failed to submit quote request. Please try again.');
      }
    }
  };

  return (
    <div>
      <PageHeader 
        title="Ocean Freight Quote"
        subtitle="Get a quote for international vehicle shipping services"
        breadcrumbs={[{ name: "Ocean Freight", path: "/request-quote/ocean-freight" }]}
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
            {isSubmitted ? (
              <QuoteSuccessMessage />
            ) : (
              <RoroRequestForm onSubmit={handleSubmit} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OceanFreightQuote;