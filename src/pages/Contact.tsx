import React, { useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  
  useEffect(() => {
    document.title = 'Contact Us - Jaykash Integrated Services LLC';
    window.scrollTo(0, 0);
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Here you would typically send the form data to your backend or API
    alert('Your message has been sent! We will get back to you soon.');
    reset();
  };

  return (
    <div>
      <PageHeader 
        title="Contact Us" 
        subtitle="Get in touch with our team for any inquiries or to learn more about our services."
        breadcrumbs={[{ name: "Contact Us", path: "/contact" }]}
        backgroundImage="https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <section className="section bg-white">
        <div className="container-custom">
          <div 
            ref={ref}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 transition-all duration-500 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Get In Touch</h2>
              <p className="text-slate-600 mb-8">
                Have questions about our services? Need a custom logistics solution? Our team is here to help. Reach out to us using any of the methods below.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-light rounded-full p-3 text-white flex-shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Our Location</h3>
                    <p className="text-slate-600">123 Logistics Avenue, Suite 456, New York, NY 10001</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-light rounded-full p-3 text-white flex-shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email Us</h3>
                    <a href="mailto:info@jaykash.com" className="text-primary hover:text-accent transition-colors">info@jaykash.com</a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-light rounded-full p-3 text-white flex-shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Call Us</h3>
                    <a href="tel:+1234567890" className="text-primary hover:text-accent transition-colors">+1 (234) 567-890</a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-light rounded-full p-3 text-white flex-shrink-0">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Business Hours</h3>
                    <p className="text-slate-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-slate-600">Saturday: 9:00 AM - 1:00 PM</p>
                    <p className="text-slate-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                    <a 
                      key={social}
                      href="#" 
                      className="bg-slate-100 hover:bg-primary hover:text-white transition-colors rounded-full p-3"
                      aria-label={`Visit our ${social} page`}
                    >
                      <span className="capitalize">{social.charAt(0)}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-slate-50 rounded-lg p-8 shadow-md">
              <h2 className="text-2xl font-semibold text-primary mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="label">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className={`input-field ${errors.name ? 'border-error' : ''}`}
                    placeholder="Enter your full name"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="label">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className={`input-field ${errors.email ? 'border-error' : ''}`}
                    placeholder="Enter your email address"
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
                  <label htmlFor="phone" className="label">Phone Number (Optional)</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="input-field"
                    placeholder="Enter your phone number"
                    {...register("phone")}
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="label">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className={`input-field ${errors.subject ? 'border-error' : ''}`}
                    placeholder="What is this regarding?"
                    {...register("subject", { required: "Subject is required" })}
                  />
                  {errors.subject && <p className="text-error text-sm mt-1">{errors.subject.message}</p>}
                </div>
                
                <div>
                  <label htmlFor="message" className="label">Message</label>
                  <textarea 
                    id="message" 
                    rows={5} 
                    className={`input-field ${errors.message ? 'border-error' : ''}`}
                    placeholder="How can we help you?"
                    {...register("message", { required: "Message is required" })}
                  ></textarea>
                  {errors.message && <p className="text-error text-sm mt-1">{errors.message.message}</p>}
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-full flex items-center justify-center"
                >
                  Send Message <Send className="ml-2 h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
          
          {/* Map */}
          <div className="mt-16">
            <h3 className="text-2xl font-semibold text-primary mb-6">Our Location</h3>
            <div className="rounded-lg overflow-hidden shadow-md h-96">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304045!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1658936593740!5m2!1sen!2s" 
                className="w-full h-full border-0" 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Jaykash Integrated Services LLC Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;