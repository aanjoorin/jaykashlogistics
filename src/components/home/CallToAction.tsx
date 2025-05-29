import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CallToAction: React.FC = () => {
  return (
    <section className="bg-primary py-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to streamline your logistics?</h2>
            <p className="text-lg text-slate-200 mb-8">
              Get started with Jaykash Integrated Services today and experience seamless freight solutions tailored to your business needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/request-quote" className="btn btn-accent">
                Request a Quote <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/contact" className="btn bg-white bg-opacity-20 text-white hover:bg-opacity-30 focus:ring-white">
                Contact Us
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-primary mb-6">Book a Service</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="label">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    className="input-field" 
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="label">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    className="input-field" 
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="label">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="input-field" 
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="phone" className="label">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  className="input-field" 
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label htmlFor="service" className="label">Service Required</label>
                <select id="service" className="input-field">
                  <option value="">Select a service</option>
                  <option value="ocean">Ocean Freight</option>
                  <option value="inland">Inland Freight</option>
                  <option value="express">Express Delivery</option>
                  <option value="insurance">Cargo Insurance</option>
                  <option value="warehousing">Warehousing</option>
                  <option value="customs">Customs Clearance</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-full"
              >
                Book Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;