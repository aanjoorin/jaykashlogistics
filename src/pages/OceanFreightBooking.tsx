import React, { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import { useInView } from 'react-intersection-observer';
import RoroRequestForm from '../components/forms/RoroRequestForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendEmail } from '../lib/emailjs';
import { navigateToPayment, generateBookingReference, PaymentData } from '../lib/payment';

const OceanFreightBooking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBooking = location.pathname.includes('/book-now');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = isBooking ? 'Ocean Freight Booking - Jaykash' : 'Ocean Freight Quote - Jaykash';
    window.scrollTo(0, 0);
  }, [isBooking]);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // DO NOT send email here!
      // Only prepare payment and redirect to payment page
      if (isBooking) {
        // Generate a unique booking reference
        const bookingRef = generateBookingReference('OCEAN');
        // Calculate payment amount (you can adjust this based on your pricing logic)
        const baseAmount = 1250; // Base service fee
        // Prepare payment data
        const paymentData: PaymentData = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          pickupAddress: data.pickupAddress,
          deliveryAddress: data.deliveryAddress,
          vehicleMake: data.vehicleMake,
          vehicleModel: data.vehicleModel,
          vehicleYear: data.vehicleYear,
          serviceType: 'Ocean Freight Booking',
          amount: baseAmount,
          bookingReference: bookingRef,
        };
        // Navigate to payment page with form data
        navigateToPayment(navigate, paymentData, 'state');
      } else {
        // For quotes, show success message and send email
        await sendEmail('ocean_freight_template', {
          ...data,
          service_type: 'Ocean Freight Quote'
        });
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
            <RoroRequestForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default OceanFreightBooking;