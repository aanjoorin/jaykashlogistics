import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ship, Truck, Package, Shield, Warehouse, FileText, ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import { sendEmailToAdmin, sendCustomerConfirmationEmail } from '../../lib/emailjs';

// Dummy implementations for demonstration. Replace with your actual implementations.
const sendEmailToAdmin = async (data: any) => Promise.resolve();
const sendCustomerConfirmationEmail = async (data: any) => Promise.resolve();

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  delay: number;
}

const stripePromise = loadStripe('YOUR_PUBLISHABLE_KEY'); // Use your Stripe publishable key

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, link, delay }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div 
      ref={ref}
      className={`card p-6 transition-all duration-500 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay * 0.1}s` }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 bg-primary-light rounded-full inline-block mb-4 text-white">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-slate-600 mb-6 flex-grow">{description}</p>
        <Link 
          to={link} 
          className="inline-flex items-center text-primary hover:text-accent transition-colors font-medium"
        >
          Learn More <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    // Call your backend to create a PaymentIntent
    const res = await fetch('http://localhost:4242/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000, currency: 'usd' }), // $10.00
    });
    const { clientSecret } = await res.json();

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      alert('Card element not found.');
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      alert(result.error.message);
    } else {
      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        alert('Payment successful!');
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        Pay
      </button>
    </form>
  );
};

const Services: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const navigate = useNavigate();

  // Replace with your actual logic
  const isBooking = false;

  const services = [
    {
      icon: <Ship className="h-8 w-8" />,
      title: "Ocean Freight",
      description: "Reliable and cost-effective ocean freight services for global shipments, including FCL and LCL options.",
      link: "/services#ocean-freight",
      delay: 0
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Inland Freight",
      description: "Efficient inland transportation solutions including road and rail services to complement your logistics chain.",
      link: "/services#inland-freight",
      delay: 1
    },
    {
      icon: <Package className="h-8 w-8" />,
      title: "Express Delivery",
      description: "Fast and reliable express delivery services for urgent shipments with real-time tracking capabilities.",
      link: "/services#express-delivery",
      delay: 2
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Cargo Insurance",
      description: "Comprehensive cargo insurance solutions to protect your valuable shipments against loss or damage.",
      link: "/services#cargo-insurance",
      delay: 3
    },
    {
      icon: <Warehouse className="h-8 w-8" />,
      title: "Warehousing",
      description: "Secure warehousing and distribution services with inventory management and order fulfillment.",
      link: "/services#warehousing",
      delay: 4
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Customs Clearance",
      description: "Expert customs clearance services to navigate complex regulations and ensure smooth border crossings.",
      link: "/services#customs-clearance",
      delay: 5
    }
  ];

  const handleSubmit = async (data: any) => {
    try {
      setFormData(data);

      if (isBooking) {
        setShowPayment(true);
      } else {
        await sendEmailToAdmin({
          ...data,
          service_type: 'Quote Request'
        });
        await sendCustomerConfirmationEmail({
          ...data,
          service_type: 'Quote Request'
        });
        alert('Quote request submitted successfully! We will contact you shortly.');
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit quote request. Please try again.');
    }
  };

  return (
    <section className="section bg-slate-50" id="services">
      <div className="container-custom">
        <div 
          ref={ref}
          className={`transition-all duration-500 delay-100 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive logistics solutions tailored to your business needs. We offer a wide range of freight and transportation services.
          </p>
          <div className="mt-8">
            <Link to="/request-quote" className="btn btn-accent text-white text-lg px-8 py-3 rounded-md shadow-lg hover:bg-accent-dark transition-all">
              Get a Quote
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              link={service.link}
              delay={service.delay}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/services" className="btn btn-primary">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;