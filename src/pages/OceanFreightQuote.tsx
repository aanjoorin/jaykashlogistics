import React, { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import { useInView } from 'react-intersection-observer';
import RoroRequestForm from '../components/forms/RoroRequestForm';
import QuoteSuccessMessage from '../components/common/QuoteSuccessMessage';
import { supabase } from '../lib/supabase';

const OceanFreightQuote: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Ocean Freight Quote - Jaykash';
    window.scrollTo(0, 0);
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      const quoteData = {
        ...data,
        serviceType: 'Ocean Freight',
      };

      const { data: response, error: invokeError } = await supabase.functions.invoke('handle-quote', {
        body: {
          action: 'submit_quote',
          quoteData,
        },
      });

      if (invokeError) throw new Error(invokeError.message);
      if (response?.error) throw new Error(response.error);

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error submitting quote:', err);
      alert('Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
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
              <RoroRequestForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OceanFreightQuote;