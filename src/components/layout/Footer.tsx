import React from 'react';
import { Link } from 'react-router-dom';
import { Ship, Truck, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center">
                <Ship className="text-white h-7 w-7" />
                <Truck className="text-accent h-7 w-7 -ml-1" />
              </div>
              <span className="font-bold text-xl">Jaykash</span>
            </Link>
            <p className="text-slate-300">
              Jaykash Integrated Services LLC specializes in ocean freight and inland freight services, providing reliable logistics solutions for businesses worldwide.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-slate-300 hover:text-accent transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-slate-300 hover:text-accent transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-slate-300 hover:text-accent transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-slate-300 hover:text-accent transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-slate-700 pb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-accent transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-accent transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-300 hover:text-accent transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/request-quote" className="text-slate-300 hover:text-accent transition-colors">Request Quote</Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-slate-300 hover:text-accent transition-colors">Testimonials</Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-300 hover:text-accent transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-slate-700 pb-2">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services#ocean-freight" className="text-slate-300 hover:text-accent transition-colors">Ocean Freight</Link>
              </li>
              <li>
                <Link to="/services#inland-freight" className="text-slate-300 hover:text-accent transition-colors">Inland Freight</Link>
              </li>
              <li>
                <Link to="/services#express-delivery" className="text-slate-300 hover:text-accent transition-colors">Express Delivery</Link>
              </li>
              <li>
                <Link to="/services#cargo-insurance" className="text-slate-300 hover:text-accent transition-colors">Cargo Insurance</Link>
              </li>
              <li>
                <Link to="/services#warehousing" className="text-slate-300 hover:text-accent transition-colors">Warehousing</Link>
              </li>
              <li>
                <Link to="/services#customs-clearance" className="text-slate-300 hover:text-accent transition-colors">Customs Clearance</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-slate-700 pb-2">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="text-accent mt-1 h-5 w-5 flex-shrink-0" />
                <span className="text-slate-300">123 Logistics Avenue, Suite 456, New York, NY 10001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-accent h-5 w-5 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-slate-300 hover:text-accent transition-colors">+1 (234) 567-890</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-accent h-5 w-5 flex-shrink-0" />
                <a href="mailto:info@jaykash.com" className="text-slate-300 hover:text-accent transition-colors">info@jaykash.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-700 text-center text-slate-300">
          <p>&copy; {currentYear} Jaykash Integrated Services LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;