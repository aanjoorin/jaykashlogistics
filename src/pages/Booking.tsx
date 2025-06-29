import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { useInView } from 'react-intersection-observer';
import { useForm } from 'react-hook-form';
import { ArrowRight, CheckCircle, Truck, Ship, Calendar, MapPin, Mail, Phone, Building } from 'lucide-react';
import { submitQuoteRequest, verifyQuoteReference } from '../lib/zoho';
import PayPalPayment from '../components/payment/PayPalPayment';

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  serviceType: string;
  cargoType: string;
  origin: string;
  destination: string;
  weight: string;
  dimensions: string;
  pickupDate: string;
  deliveryDate: string;
  specialRequirements: string;
  expectedShipDate: string;
  vehicleType: string;
  vehicleCondition: string;
  insuranceRequired: boolean;
  customsClearance: boolean;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vinNumber: string;
  buyerName: string;
  buyerPhone: string;
  lotNumber: string;
  isCarTitleReady: boolean;
  shipline: string;
  originPort: string;
}

const Booking: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<Partial<BookingFormData>>({});
  const [showPayPal, setShowPayPal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'invoice' | 'paypal'>('paypal');
  const [currentStep, setCurrentStep] = useState(1);
  const [quoteReference, setQuoteReference] = useState<string | null>(null);
  const [quoteDetails, setQuoteDetails] = useState<any>(null);

  const { register, formState: { errors }, watch, trigger, handleSubmit } = useForm<BookingFormData>();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'Book a Service - Jaykash Integrated Services LLC';
    window.scrollTo(0, 0);

    // Get quote reference from URL if present
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setQuoteReference(ref);
      verifyQuoteReference(ref).then(quote => {
        if (quote.valid) {
          setQuoteDetails(quote.details);
        }
      });
    }
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const onSubmit = (data: BookingFormData) => {
    setBookingDetails(data);
    setIsSubmitted(true);

    // Save to local storage and navigate to payment
    localStorage.setItem('bookingFormData', JSON.stringify(data));
    navigate('/payment');
  };

  return (
    <div>
      <PageHeader 
        title="Book a Service" 
        subtitle="Book your freight service online in just a few simple steps."
        breadcrumbs={[{ name: "Book a Service", path: "/booking" }]}
        backgroundImage="https://images.pexels.com/photos/1554646/pexels-photo-1554646.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <section className="section bg-white">
        <div 
          ref={ref}
          className={`container-custom transition-all duration-500 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {!quoteReference && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">
                Please request a quote first to receive pricing for your shipment.
                <Link to="/request-quote" className="ml-2 text-primary hover:text-accent">
                  Request Quote
                </Link>
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ...your form fields... */}
            <button type="submit">Book & Pay</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Booking;