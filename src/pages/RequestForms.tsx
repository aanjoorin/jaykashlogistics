import React, { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import DispatchRequestForm from '../components/forms/DispatchRequestForm';
import RoroRequestForm from '../components/forms/RoroRequestForm';
import { serviceTypes } from '../data/services';

const RequestForms: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>('');

  const handleDispatchSubmit = async (data: any) => {
    try {
      // Handle dispatch form submission
      console.log('Dispatch form data:', data);
      // Submit to your backend/email service
    } catch (error) {
      console.error('Error submitting dispatch request:', error);
    }
  };

  const handleRoroSubmit = async (data: any) => {
    try {
      // Handle RORO form submission
      console.log('RORO form data:', data);
      // Submit to your backend/email service
    } catch (error) {
      console.error('Error submitting RORO request:', error);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Service Request Forms" 
        subtitle="Choose your service type and fill out the appropriate form"
        breadcrumbs={[{ name: "Request Forms", path: "/request-forms" }]}
      />
      
      <section className="section bg-white">
        <div className="container-custom">
          {/* Service Selection */}
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl font-semibold text-primary mb-6">Select Service Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceTypes.map(service => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    selectedService === service.id
                      ? 'border-primary bg-primary-light/10'
                      : 'border-slate-200 hover:border-primary/50'
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                  <p className="text-slate-600 text-sm">{service.description}</p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Forms */}
          {selectedService && (
            <div className="max-w-4xl mx-auto">
              {selectedService === 'dispatch' ? (
                <DispatchRequestForm onSubmit={handleDispatchSubmit} />
              ) : (
                <RoroRequestForm onSubmit={handleRoroSubmit} />
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RequestForms;