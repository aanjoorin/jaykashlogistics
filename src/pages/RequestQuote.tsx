import React, { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { carriers, originPorts } from '../data/services';
import { sendEmailToAdmin, sendCustomerConfirmationEmail } from '../lib/emailjs';

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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<QuoteFormData>();

  const serviceType = watch('serviceType');
  const weight = watch('weight');
  const origin = watch('origin');
  const destination = watch('destination');
  const pickupLocationType = watch('pickupLocationType');
  const deliveryLocationType = watch('deliveryLocationType');

  useEffect(() => {
    document.title = 'Request a Quote - Jaykash Integrated Services LLC';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Simple price estimation logic
    if (serviceType && weight && origin && destination) {
      let basePrice = 0;

      if (serviceType === 'ocean') basePrice = 1000;
      else if (serviceType === 'inland') basePrice = 500;
      else if (serviceType === 'express') basePrice = 1500;

      const weightNum = parseFloat(weight) || 0;
      const weightFactor = weightNum > 1000 ? 1.5 : weightNum > 500 ? 1.3 : 1;

      const calculatedPrice = basePrice * weightFactor;
      setEstimatedPrice(Math.round(calculatedPrice));
    } else {
      setEstimatedPrice(null);
    }
  }, [serviceType, weight, origin, destination]);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await sendEmailToAdmin({
        to_name: 'Admin',
        from_name: `${data.firstName} ${data.lastName}`,
        from_email: data.email,
        subject: 'New Quote Request',
        message: `
          Quote Request Details:
          ---------------------
          Service: ${data.serviceType}
          Vehicle: ${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}
          VIN: ${data.vinNumber}
          From: ${data.origin}
          To: ${data.destination}
          
          Customer Details:
          ----------------
          Name: ${data.firstName} ${data.lastName}
          Email: ${data.email}
          Phone: ${data.phone}
          Company: ${data.company || 'N/A'}
          
          Special Requirements:
          -------------------
          ${data.specialRequirements || 'None specified'}
        `
      });

      // Send confirmation email to customer
      await sendCustomerConfirmationEmail({
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
        }
      });

      setIsSubmitted(true);
      reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting quote:', err);
      setError('Failed to submit quote request. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Request a Quote" 
        subtitle="Get a free, no-obligation quote for your car shipping needs."
        breadcrumbs={[{ name: "Request Quote", path: "/request-quote" }]}
        backgroundImage="https://images.pexels.com/photos/2226458/pexels-photo-2226458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <section className="section bg-white">
        <div 
          ref={ref}
          className={`container-custom transition-all duration-500 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {isSubmitted ? (
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-success-light/20 text-success p-6 rounded-lg mb-8">
                <CheckCircle className="h-16 w-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Quote Request Submitted!</h2>
                <p className="mb-6">
                  Thank you for your quote request. Our team will review your information and get back to you within 24 hours with a detailed quote tailored to your needs.
                </p>
                <p className="font-medium">
                  A confirmation email has been sent to your email address.
                </p>
              </div>
              <a href="/" className="btn btn-primary">
                Return to Home
              </a>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Contact Information */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
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
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Shipping Details</h3>
                  
                  <div className="mb-4">
                    <label htmlFor="serviceType" className="label">Service Type *</label>
                    <select 
                      id="serviceType" 
                      className={`input-field ${errors.serviceType ? 'border-error' : ''}`}
                      {...register("serviceType", { required: "Please select a service type" })}
                    >
                      <option value="">Select a service</option>
                      <option value="ocean">International Car Shipping</option>
                      <option value="inland">Domestic Car Transport</option>
                      <option value="express">Express Auto Transport</option>
                    </select>
                    {errors.serviceType && <p className="text-error text-sm mt-1">{errors.serviceType.message}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="label">Pickup Location Type *</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="residence"
                          {...register("pickupLocationType", { required: true })}
                          className="mr-2"
                        />
                        Residence
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="auction"
                          {...register("pickupLocationType", { required: true })}
                          className="mr-2"
                        />
                        Auction
                      </label>
                    </div>
                    {errors.pickupLocationType && <p className="text-error text-sm mt-1">Please select a pickup location type</p>}
                  </div>

                  <div className="mb-4">
                    <label className="label">Delivery Location Type *</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="port"
                          {...register("deliveryLocationType", { required: true })}
                          className="mr-2"
                        />
                        Port
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="residence"
                          {...register("deliveryLocationType", { required: true })}
                          className="mr-2"
                        />
                        Residence
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="business"
                          {...register("deliveryLocationType", { required: true })}
                          className="mr-2"
                        />
                        Business
                      </label>
                    </div>
                    {errors.deliveryLocationType && <p className="text-error text-sm mt-1">Please select a delivery location type</p>}
                  </div>

                  {serviceType === 'ocean' && (
                    <>
                      <div className="mb-4">
                        <label htmlFor="shipline" className="label">Shipping Line *</label>
                        <select 
                          id="shipline" 
                          className={`input-field ${errors.shipline ? 'border-error' : ''}`}
                          {...register("shipline", { required: "Please select a shipping line" })}
                        >
                          <option value="">Select shipping line</option>
                          {carriers.map(carrier => (
                            <option key={carrier} value={carrier}>{carrier}</option>
                          ))}
                        </select>
                        {errors.shipline && <p className="text-error text-sm mt-1">{errors.shipline.message}</p>}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="originPort" className="label">Origin Port *</label>
                        <select 
                          id="originPort" 
                          className={`input-field ${errors.originPort ? 'border-error' : ''}`}
                          {...register("originPort", { required: "Please select an origin port" })}
                        >
                          <option value="">Select origin port</option>
                          {originPorts.map(port => (
                            <option key={port} value={port}>{port}</option>
                          ))}
                        </select>
                        {errors.originPort && <p className="text-error text-sm mt-1">{errors.originPort.message}</p>}
                      </div>
                    </>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="origin" className="label">Pickup Location *</label>
                      <input 
                        type="text" 
                        id="origin" 
                        className={`input-field ${errors.origin ? 'border-error' : ''}`}
                        placeholder="City, State or ZIP"
                        {...register("origin", { required: "Pickup location is required" })}
                      />
                      {errors.origin && <p className="text-error text-sm mt-1">{errors.origin.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="destination" className="label">Delivery Location *</label>
                      <input 
                        type="text" 
                        id="destination" 
                        className={`input-field ${errors.destination ? 'border-error' : ''}`}
                        placeholder="City, State or ZIP"
                        {...register("destination", { required: "Delivery location is required" })}
                      />
                      {errors.destination && <p className="text-error text-sm mt-1">{errors.destination.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Vehicle Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="vehicleYear" className="label">Year *</label>
                      <input 
                        type="text" 
                        id="vehicleYear" 
                        className={`input-field ${errors.vehicleYear ? 'border-error' : ''}`}
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
                      {...register("vinNumber", { required: "VIN number is required" })}
                    />
                    {errors.vinNumber && <p className="text-error text-sm mt-1">{errors.vinNumber.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label htmlFor="buyerName" className="label">Buyer Name *</label>
                      <input 
                        type="text" 
                        id="buyerName" 
                        className={`input-field ${errors.buyerName ? 'border-error' : ''}`}
                        {...register("buyerName", { required: "Buyer name is required" })}
                      />
                      {errors.buyerName && <p className="text-error text-sm mt-1">{errors.buyerName.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="buyerPhone" className="label">Buyer Phone *</label>
                      <input 
                        type="tel" 
                        id="buyerPhone" 
                        className={`input-field ${errors.buyerPhone ? 'border-error' : ''}`}
                        {...register("buyerPhone", { required: "Buyer phone is required" })}
                      />
                      {errors.buyerPhone && <p className="text-error text-sm mt-1">{errors.buyerPhone.message}</p>}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="lotNumber" className="label">Lot Number</label>
                    <input 
                      type="text" 
                      id="lotNumber" 
                      className="input-field"
                      {...register("lotNumber")}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox"
                        {...register("isCarTitleReady")}
                      />
                      <span>Car/Title Ready</span>
                    </label>
                  </div>
                </div>
                
                {/* Additional Information */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
                  <div>
                    <label htmlFor="specialRequirements" className="label">Special Requirements or Instructions</label>
                    <textarea 
                      id="specialRequirements" 
                      rows={4} 
                      className="input-field"
                      placeholder="Any special requirements, vehicle condition details, or specific instructions..."
                      {...register("specialRequirements")}
                    ></textarea>
                  </div>
                </div>
                
                {estimatedPrice && (
                  <div className="bg-primary-light/10 p-6 rounded-lg border border-primary-light">
                    <h3 className="text-xl font-semibold text-primary mb-2">Estimated Quote</h3>
                    <p className="text-slate-600 mb-3">Based on the information provided, your estimated price range is:</p>
                    <div className="text-3xl font-bold text-primary mb-3">${estimatedPrice} - ${Math.round(estimatedPrice * 1.2)}</div>
                    <p className="text-sm text-slate-500">
                      <AlertCircle className="inline h-4 w-4 mr-1" />
                      This is just an estimate. Your final quote may vary based on additional factors and will be provided by our team.
                    </p>
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-full flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      Submit Quote Request <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RequestQuote;