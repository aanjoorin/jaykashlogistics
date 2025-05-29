import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { useInView } from 'react-intersection-observer';
import { useForm } from 'react-hook-form';
import { ArrowRight, CheckCircle, Truck, Ship, Calendar, MapPin, Mail, Phone, Building } from 'lucide-react';
import PayPalPayment from '../components/payment/PayPalPayment';
import { submitQuoteRequest, verifyQuoteReference } from '../lib/zoho';

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
  
  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm<BookingFormData>();
  
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

  // ... (rest of the component implementation remains exactly the same)

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
          
          {/* Rest of the JSX remains exactly the same */}
        </div>
      </section>
    </div>
  );
};

export default Booking;