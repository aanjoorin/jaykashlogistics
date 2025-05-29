import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ship, Truck, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const bookingLinks = [
    { name: 'Ocean Freight Booking', path: '/book-now/ocean-freight' },
    { name: 'Inland Freight Booking', path: '/book-now/inland-freight' },
    { name: 'Dispatch Service Booking', path: '/book-now/dispatch' },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <Ship className="text-primary h-7 w-7" />
              <Truck className="text-accent h-7 w-7 -ml-1" />
            </div>
            <span className={`font-bold text-xl ${isScrolled ? 'text-primary' : 'text-white'}`}>
              Jaykash
            </span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-medium transition-colors duration-300 ${
                  isActive(link.path)
                    ? 'text-accent'
                    : isScrolled
                    ? 'text-slate-800 hover:text-accent'
                    : 'text-white hover:text-accent-light'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="relative group">
              <button 
                className="btn btn-accent"
              >
                Book Now
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible transition-all duration-200 opacity-0 group-hover:opacity-100">
                {bookingLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
          
          <button
            className="lg:hidden text-2xl focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={`h-6 w-6 ${isScrolled ? 'text-primary' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? 'text-primary' : 'text-white'}`} />
            )}
          </button>
        </div>
        
        {isOpen && (
          <div className="lg:hidden animate-fadeIn">
            <nav className="flex flex-col mt-4 pb-4 bg-white rounded-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`font-medium px-4 py-2 transition-colors ${
                    isActive(link.path)
                      ? 'text-accent'
                      : 'text-slate-800 hover:text-accent'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="px-4 py-2">
                <p className="font-medium text-slate-700 mb-2">Book Now</p>
                {bookingLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block py-2 text-slate-600 hover:text-primary"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;