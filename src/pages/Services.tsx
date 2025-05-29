import React, { useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { Ship, Truck, Package, Shield, Warehouse, FileText, ArrowRight, CheckCircle } from 'lucide-react';

interface ServiceProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  image: string;
  index: number;
}

const ServiceSection: React.FC<ServiceProps> = ({ id, title, description, icon, features, image, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const isEven = index % 2 === 0;
  
  return (
    <div
      id={id}
      ref={ref}
      className={`py-16 ${isEven ? 'bg-white' : 'bg-slate-50'} scroll-mt-24 transition-all duration-500 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="container-custom">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
          <div className={`order-2 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
            <div className="flex items-center mb-4">
              <div className="p-3 bg-primary-light rounded-full text-white mr-4">
                {icon}
              </div>
              <h2 className="text-3xl font-bold text-primary">{title}</h2>
            </div>
            <p className="text-slate-600 mb-6">{description}</p>
            <ul className="space-y-3 mb-8">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <CheckCircle className="text-accent h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link to="/request-quote" className="btn btn-primary">
              Request a Quote <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className={`order-1 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
            <img 
              src={image} 
              alt={title} 
              className="rounded-lg shadow-lg object-cover w-full h-80 lg:h-96"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Services: React.FC = () => {
  useEffect(() => {
    document.title = 'Our Services - Jaykash Integrated Services LLC';
    window.scrollTo(0, 0);
    
    // Check if there's a hash in the URL and scroll to that section
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const services = [
    {
      id: "ocean-freight",
      title: "Ocean Freight",
      description: "Reliable and cost-effective ocean freight services for global shipments. We handle both Full Container Load (FCL) and Less than Container Load (LCL) shipments to meet your specific needs.",
      icon: <Ship className="h-8 w-8" />,
      features: [
        "Full Container Load (FCL) shipping",
        "Less than Container Load (LCL) consolidation",
        "Temperature-controlled containers",
        "Hazardous cargo handling",
        "Door-to-door delivery options",
        "Real-time shipment tracking"
      ],
      image: "https://images.pexels.com/photos/1554646/pexels-photo-1554646.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      id: "inland-freight",
      title: "Inland Freight",
      description: "Efficient inland transportation solutions including road and rail services to complement your logistics chain. We ensure your cargo reaches its final destination safely and on time.",
      icon: <Truck className="h-8 w-8" />,
      features: [
        "Truck load (TL) services",
        "Less than truck load (LTL) options",
        "Intermodal rail transportation",
        "Specialized equipment for oversized cargo",
        "GPS tracking for all vehicles",
        "Expedited delivery services"
      ],
      image: "https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      id: "express-delivery",
      title: "Express Delivery",
      description: "Fast and reliable express delivery services for urgent shipments with real-time tracking capabilities. We understand that time-sensitive cargo requires special handling and prioritization.",
      icon: <Package className="h-8 w-8" />,
      features: [
        "Next-day and same-day delivery options",
        "Priority handling for urgent shipments",
        "Minute-by-minute tracking updates",
        "Proof of delivery documentation",
        "Weekend and holiday services",
        "Dedicated customer support"
      ],
      image: "https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      id: "cargo-insurance",
      title: "Cargo Insurance",
      description: "Comprehensive cargo insurance solutions to protect your valuable shipments against loss or damage. Our policies provide peace of mind throughout the shipping process.",
      icon: <Shield className="h-8 w-8" />,
      features: [
        "All-risk coverage options",
        "Door-to-door protection",
        "Customized insurance plans",
        "Quick claims processing",
        "Coverage for high-value goods",
        "Insurance certificates for each shipment"
      ],
      image: "https://images.pexels.com/photos/3856989/pexels-photo-3856989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      id: "warehousing",
      title: "Warehousing",
      description: "Secure warehousing and distribution services with inventory management and order fulfillment. Our strategically located facilities ensure efficient storage and handling of your goods.",
      icon: <Warehouse className="h-8 w-8" />,
      features: [
        "Short and long-term storage solutions",
        "Climate-controlled facilities",
        "Inventory management systems",
        "Order fulfillment services",
        "Cross-docking capabilities",
        "Distribution center services"
      ],
      image: "https://images.pexels.com/photos/4483608/pexels-photo-4483608.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      id: "customs-clearance",
      title: "Customs Clearance",
      description: "Expert customs clearance services to navigate complex regulations and ensure smooth border crossings. Our team stays updated on international trade laws to prevent delays.",
      icon: <FileText className="h-8 w-8" />,
      features: [
        "Import and export documentation",
        "Customs brokerage services",
        "Tariff classification assistance",
        "Duty and tax calculation",
        "Regulatory compliance management",
        "Free trade agreement utilization"
      ],
      image: "https://images.pexels.com/photos/262353/pexels-photo-262353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Our Services" 
        subtitle="Comprehensive logistics solutions tailored to your business needs."
        breadcrumbs={[{ name: "Services", path: "/services" }]}
        backgroundImage="https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      {/* Services Overview */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-6">Comprehensive Logistics Solutions</h2>
            <p className="text-slate-600 mb-8">
              At Jaykash Integrated Services, we offer a wide range of freight and logistics services designed to meet your specific business needs. From ocean freight to customs clearance, we provide end-to-end solutions to optimize your supply chain.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
              {services.map((service, index) => (
                <a 
                  key={index}
                  href={`#${service.id}`} 
                  className="flex flex-col items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-primary transition-all"
                >
                  <div className="p-3 bg-primary-light rounded-full text-white mb-3">
                    {service.icon}
                  </div>
                  <span className="text-center text-sm font-medium">{service.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Individual Service Sections */}
      {services.map((service, index) => (
        <ServiceSection
          key={service.id}
          id={service.id}
          title={service.title}
          description={service.description}
          icon={service.icon}
          features={service.features}
          image={service.image}
          index={index}
        />
      ))}
      
      {/* Call to Action */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Streamline Your Logistics?</h2>
          <p className="text-slate-200 max-w-2xl mx-auto mb-8">
            Contact us today to discuss your freight needs and discover how Jaykash Integrated Services can provide tailored solutions for your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/request-quote" className="btn bg-accent text-white hover:bg-accent-dark">
              Request a Quote
            </Link>
            <Link to="/contact" className="btn bg-white text-primary hover:bg-slate-100">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;