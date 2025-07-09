import React, { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { carriers, originPorts } from '../data/services';
import { sendQuoteRequestEmails } from '../lib/emailjs';

interface QuoteFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  serviceType: string;
  origin: string;
  destination: string;
  cargoType: string;
  weight: string;
  dimensions: string;
  specialRequirements: string;
  expectedShipDate: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vinNumber: string;
  buyerName: string;
  buyerPhone: string;
  lotNumber: string;
  isCarTitleReady: boolean;
  pickupLocationType: 'residence' | 'auction';
  deliveryLocationType: 'port' | 'residence' | 'business';
  shipline: string;
  originPort: string;
}

const RequestQuote: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<QuoteFormData>();
  const serviceType = watch('serviceType');
  
  useEffect(() => {
    document.title = 'Request Quote - Jaykash';
    window.scrollTo(0, 0);
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const emailData = {
        service_type: data.serviceType,
        shipper_info: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone
        },
        vehicle_info: {
          year: data.vehicleYear,
          make: data.vehicleMake,
          model: data.vehicleModel,
          vin: data.vinNumber
        },
        pickup_info: {
          location_type: data.pickupLocationType || 'Not specified',
          address: data.origin,
          contact_name: `${data.firstName} ${data.lastName}`,
          contact_phone: data.phone
        },
        delivery_info: {
          location_type: data.deliveryLocationType || 'Not specified',
          address: data.destination
        },
        additional_info: {
          lot_number: data.lotNumber || 'Not specified',
          is_runner: false,
          car_title_ready: data.isCarTitleReady || false
        }
      };

      await sendQuoteRequestEmails(emailData);

      setIsSubmitted(true);
      reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Failed to submit quote request. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Request Quote"
        subtitle="Get a personalized quote for your vehicle shipping needs"
        breadcrumbs={[{ name: "Request Quote", path: "/request-quote" }]}
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
              <div className="text-center">
                <div className="bg-green-50 rounded-lg p-8 mb-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Quote Request Submitted!</h2>
                  <p className="text-gray-600 mb-4">
                  Thank you for your quote request. Our team will review your information and get back to you within 24 hours with a detailed quote tailored to your needs.
                </p>
                  <p className="text-gray-600">
                  A confirmation email has been sent to your email address.
                </p>
              </div>
              <a href="/" className="btn btn-primary">
                Return to Home
              </a>
            </div>
          ) : (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6">Request Your Quote</h2>
                
                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Service Type */}
                  <div>
                    <label htmlFor="serviceType" className="label">Service Type *</label>
                    <select 
                      id="serviceType" 
                      className={`input-field ${errors.serviceType ? 'border-error' : ''}`}
                      {...register("serviceType", { required: "Service type is required" })}
                    >
                      <option value="">Select a service</option>
                      <option value="Ocean Freight">Ocean Freight</option>
                      <option value="Inland Freight">Inland Freight</option>
                      <option value="Dispatch Service">Dispatch Service</option>
                    </select>
                    {errors.serviceType && <p className="text-error text-sm mt-1">{errors.serviceType.message}</p>}
                  </div>

                  {/* Customer Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                    
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="label">First Name *</label>
                      <input 
                        type="text" 
                        id="firstName" 
                        className={`input-field ${errors.firstName ? 'border-error' : ''}`}
                        {...register("firstName", { required: "First name is required" })}
                      />
                      {errors.firstName && <p className="text-error text-sm mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="label">Last Name *</label>
                      <input 
                        type="text" 
                        id="lastName" 
                        className={`input-field ${errors.lastName ? 'border-error' : ''}`}
                        {...register("lastName", { required: "Last name is required" })}
                      />
                      {errors.lastName && <p className="text-error text-sm mt-1">{errors.lastName.message}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label htmlFor="email" className="label">Email Address *</label>
                      <input 
                        type="email" 
                        id="email" 
                        className={`input-field ${errors.email ? 'border-error' : ''}`}
                        {...register("email", { 
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                      />
                      {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="label">Phone Number *</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        className={`input-field ${errors.phone ? 'border-error' : ''}`}
                        {...register("phone", { required: "Phone number is required" })}
                      />
                      {errors.phone && <p className="text-error text-sm mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="company" className="label">Company Name</label>
                    <input 
                      type="text" 
                      id="company" 
                      className="input-field"
                      {...register("company")}
                    />
                  </div>
                </div>
                
                {/* Shipping Details */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Shipping Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="origin" className="label">Origin *</label>
                      <input 
                        type="text" 
                        id="origin" 
                        className={`input-field ${errors.origin ? 'border-error' : ''}`}
                          placeholder="City, State"
                          {...register("origin", { required: "Origin is required" })}
                      />
                      {errors.origin && <p className="text-error text-sm mt-1">{errors.origin.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="destination" className="label">Destination *</label>
                      <input 
                        type="text" 
                        id="destination" 
                        className={`input-field ${errors.destination ? 'border-error' : ''}`}
                          placeholder="City, State"
                          {...register("destination", { required: "Destination is required" })}
                      />
                      {errors.destination && <p className="text-error text-sm mt-1">{errors.destination.message}</p>}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="expectedShipDate" className="label">Expected Ship Date</label>
                      <input 
                        type="date" 
                        id="expectedShipDate" 
                        className="input-field"
                        {...register("expectedShipDate")}
                      />
                  </div>
                </div>

                {/* Vehicle Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
                    
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="vehicleYear" className="label">Year *</label>
                      <input 
                        type="text" 
                        id="vehicleYear" 
                        className={`input-field ${errors.vehicleYear ? 'border-error' : ''}`}
                          placeholder="2020"
                        {...register("vehicleYear", { required: "Vehicle year is required" })}
                      />
                      {errors.vehicleYear && <p className="text-error text-sm mt-1">{errors.vehicleYear.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="vehicleMake" className="label">Make *</label>
                      <input 
                        type="text" 
                        id="vehicleMake" 
                        className={`input-field ${errors.vehicleMake ? 'border-error' : ''}`}
                          placeholder="Toyota"
                        {...register("vehicleMake", { required: "Vehicle make is required" })}
                      />
                      {errors.vehicleMake && <p className="text-error text-sm mt-1">{errors.vehicleMake.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="vehicleModel" className="label">Model *</label>
                      <input 
                        type="text" 
                        id="vehicleModel" 
                        className={`input-field ${errors.vehicleModel ? 'border-error' : ''}`}
                          placeholder="Camry"
                        {...register("vehicleModel", { required: "Vehicle model is required" })}
                      />
                      {errors.vehicleModel && <p className="text-error text-sm mt-1">{errors.vehicleModel.message}</p>}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="vinNumber" className="label">VIN Number *</label>
                    <input 
                      type="text" 
                      id="vinNumber" 
                      className={`input-field ${errors.vinNumber ? 'border-error' : ''}`}
                        placeholder="17-character VIN"
                      {...register("vinNumber", { required: "VIN number is required" })}
                    />
                    {errors.vinNumber && <p className="text-error text-sm mt-1">{errors.vinNumber.message}</p>}
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Additional Information</h3>

                  <div className="mt-4">
                      <label htmlFor="specialRequirements" className="label">Special Requirements</label>
                    <textarea 
                      id="specialRequirements" 
                        className="input-field h-24"
                        placeholder="Any special requirements or additional information..."
                      {...register("specialRequirements")}
                      />
                </div>
                  </div>
                
                <button 
                  type="submit" 
                    disabled={isSubmitting}
                  className="btn btn-primary w-full flex items-center justify-center"
                >
                  {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                  ) : (
                    <>
                        Submit Quote Request
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RequestQuote;