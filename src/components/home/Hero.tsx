import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const luxuryCarImages = [
    "https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/3786091/pexels-photo-3786091.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === luxuryCarImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background Image with Fade Transition */}
      {luxuryCarImages.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${image}')`,
            opacity: currentImageIndex === index ? 1 : 0,
            zIndex: 0
          }}
        >
          <div className="absolute inset-0 bg-primary bg-opacity-70"></div>
        </div>
      ))}
      
      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div 
            className="text-white space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 rounded-full px-4 py-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-accent"></span>
              <span>Trusted Car Shipping Nationwide & International</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Safe & Reliable Car Shipping Services
            </h1>
            
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto">
              Expert vehicle transportation services across the USA and worldwide. Door-to-door delivery with full insurance coverage.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="relative group">
                <div className="btn btn-accent cursor-pointer">
                  Get a Quote <ArrowRight className="ml-2 h-5 w-5" />
                </div>
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible transition-all duration-200 opacity-0 group-hover:opacity-100 z-50">
                  <Link to="/request-quote/ocean-freight" className="block px-4 py-2 text-slate-700 hover:bg-slate-50">
                    Ocean Freight Quote
                  </Link>
                  <Link to="/request-quote/inland-freight" className="block px-4 py-2 text-slate-700 hover:bg-slate-50">
                    Inland Freight Quote
                  </Link>
                  <Link to="/request-quote/dispatch" className="block px-4 py-2 text-slate-700 hover:bg-slate-50">
                    Dispatch Service Quote
                  </Link>
                </div>
              </div>
              <Link to="/services" className="btn bg-white bg-opacity-20 text-white hover:bg-opacity-30 focus:ring-white">
                Our Services
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;