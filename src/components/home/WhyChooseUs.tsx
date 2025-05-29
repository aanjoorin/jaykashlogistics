import React from 'react';
import { Clock, Truck, Users, Globe, CheckCircle } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const WhyChooseUs: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const features = [
    {
      icon: <Clock className="h-12 w-12 text-accent" />,
      title: "On-Time Delivery",
      description: "We understand the importance of timely delivery and ensure your cargo reaches its destination on schedule."
    },
    {
      icon: <Truck className="h-12 w-12 text-accent" />,
      title: "Modern Fleet",
      description: "Our modern fleet of vehicles and vessels ensures safe and efficient transportation of your goods."
    },
    {
      icon: <Users className="h-12 w-12 text-accent" />,
      title: "Expert Team",
      description: "Our experienced team of logistics professionals provides personalized service and expert solutions."
    },
    {
      icon: <Globe className="h-12 w-12 text-accent" />,
      title: "Global Network",
      description: "With our extensive global network, we can handle shipments to and from virtually any location worldwide."
    }
  ];

  return (
    <section className="section bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary opacity-5"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-accent opacity-5"></div>
      
      <div className="container-custom">
        <div 
          ref={ref}
          className={`transition-all duration-500 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="section-title">Why Choose Jaykash</h2>
          <p className="section-subtitle">
            With years of experience in the logistics industry, we deliver exceptional service and reliability that sets us apart.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 mt-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`flex space-x-6 transition-all duration-500 delay-${index * 100} ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 0.1 + 0.2}s` }}
            >
              <div className="flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Stats and Callout */}
        <div 
          className={`mt-20 bg-primary rounded-lg overflow-hidden shadow-lg transition-all duration-500 delay-500 ${
            inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="lg:col-span-3 p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to simplify your logistics?</h3>
              <p className="text-slate-200 mb-6">
                Partner with Jaykash Integrated Services LLC for all your freight needs and experience the difference of working with a dedicated logistics provider.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Personalized logistics solutions",
                  "Transparent pricing with no hidden fees",
                  "24/7 customer support",
                  "Real-time shipment tracking"
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="text-accent h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-white">{item}</span>
                  </li>
                ))}
              </ul>
              <a href="/contact" className="btn bg-white text-primary hover:bg-slate-100">
                Contact Us Today
              </a>
            </div>
            <div 
              className="lg:col-span-2 bg-cover bg-center"
              style={{ 
                backgroundImage: "url('https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;