import React, { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import { useInView } from 'react-intersection-observer';
import { Star, User, Building } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  company: string;
  role: string;
  quote: string;
  rating: number;
  image?: string;
  category: string;
}

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
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
    >
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
          />
        ))}
      </div>
      <blockquote className="text-slate-700 italic mb-6">"{testimonial.quote}"</blockquote>
      <div className="flex items-center">
        {testimonial.image ? (
          <img 
            src={testimonial.image} 
            alt={testimonial.name} 
            className="h-12 w-12 rounded-full object-cover mr-4"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-primary-light flex items-center justify-center text-white mr-4">
            <User className="h-6 w-6" />
          </div>
        )}
        <div>
          <p className="font-semibold text-primary">{testimonial.name}</p>
          <div className="flex items-center text-sm text-slate-500">
            <Building className="h-3 w-3 mr-1" />
            <span>{testimonial.company}, {testimonial.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    document.title = 'Client Testimonials - Jaykash Integrated Services LLC';
    window.scrollTo(0, 0);
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "Global Imports Ltd.",
      role: "Logistics Manager",
      quote: "Jaykash Integrated Services has been our logistics partner for over 3 years now. Their ocean freight services are reliable, and their team is always responsive to our needs. What sets them apart is their attention to detail and proactive communication throughout the shipping process.",
      rating: 5,
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "ocean"
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "Tech Distributors Inc.",
      role: "Supply Chain Director",
      quote: "We've been using Jaykash for all our inland freight needs. Their attention to detail and commitment to on-time delivery has significantly improved our supply chain efficiency. Their tracking system gives us real-time visibility that helps us better plan our operations.",
      rating: 5,
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "inland"
    },
    {
      id: 3,
      name: "David Williams",
      company: "Fashion Exports Co.",
      role: "Operations Manager",
      quote: "The customs clearance services provided by Jaykash are exceptional. They handle all the complex paperwork and ensure smooth clearance of our international shipments. Their expertise has saved us from delays and penalties numerous times.",
      rating: 4,
      category: "customs"
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      company: "Organic Foods Market",
      role: "CEO",
      quote: "Since partnering with Jaykash, we've seen a 30% reduction in logistics costs. Their team found efficiencies in our supply chain that we hadn't considered before. For a small business like ours, this cost saving has been transformative.",
      rating: 5,
      image: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "express"
    },
    {
      id: 5,
      name: "Robert Thompson",
      company: "E-commerce Solutions",
      role: "Logistics Coordinator",
      quote: "The warehousing solutions from Jaykash have been a game-changer for our business. Their inventory management system provides real-time visibility and has reduced our order fulfillment time. Their facilities are clean, secure, and well-managed.",
      rating: 4,
      category: "warehousing"
    },
    {
      id: 6,
      name: "Jennifer Lee",
      company: "Global Pharmaceuticals",
      role: "Head of Distribution",
      quote: "We deal with temperature-sensitive products that require special handling. Jaykash's team understands our specific needs and has never disappointed us. Their attention to compliance and documentation is particularly impressive.",
      rating: 5,
      image: "https://images.pexels.com/photos/3746155/pexels-photo-3746155.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "special"
    },
    {
      id: 7,
      name: "Carlos Mendez",
      company: "International Traders Group",
      role: "Import Manager",
      quote: "Jaykash has handled our ocean freight for over 5 years. Their rates are competitive, but it's their reliability that keeps us coming back. Even during the supply chain disruptions of recent years, they managed to find solutions when others couldn't.",
      rating: 5,
      category: "ocean"
    },
    {
      id: 8,
      name: "Lisa Wong",
      company: "Retail Chain Enterprises",
      role: "Supply Chain Analyst",
      quote: "The express delivery service from Jaykash is consistently on-time and dependable. For our retail operations, timing is everything, and they understand this perfectly. Their team goes above and beyond to meet our tight schedules.",
      rating: 4,
      category: "express"
    },
    {
      id: 9,
      name: "Ahmed Hassan",
      company: "Middle East Importers",
      role: "Chief Operations Officer",
      quote: "The customs clearance expertise that Jaykash brings to the table is unmatched. They navigate complex international regulations with ease and keep our shipments moving without delays. Their knowledge of documentation requirements is exceptional.",
      rating: 5,
      category: "customs"
    },
    {
      id: 10,
      name: "Sophia Martinez",
      company: "Furniture Wholesalers",
      role: "Logistics Director",
      quote: "We ship large, fragile items that require special handling. Jaykash has consistently delivered our products safely and on schedule. Their damage rates are impressively low, which has significantly reduced our insurance claims.",
      rating: 5,
      image: "https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "inland"
    },
    {
      id: 11,
      name: "Daniel Clark",
      company: "Electronics Distributors Ltd.",
      role: "Operations Manager",
      quote: "Jaykash's warehouse management has streamlined our distribution process. Their strategic locations have reduced our delivery times, and their inventory control is impeccable. We've eliminated stockouts since working with them.",
      rating: 4,
      category: "warehousing"
    },
    {
      id: 12,
      name: "Emma Wilson",
      company: "Luxury Goods International",
      role: "Shipping Coordinator",
      quote: "For high-value shipments, security is our top concern. Jaykash provides the peace of mind we need with their secure handling procedures and comprehensive insurance options. Their professional approach aligns perfectly with our brand values.",
      rating: 5,
      category: "special"
    }
  ];

  const filteredTestimonials = filter === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.category === filter);

  const categories = [
    { id: 'all', name: 'All Testimonials' },
    { id: 'ocean', name: 'Ocean Freight' },
    { id: 'inland', name: 'Inland Freight' },
    { id: 'express', name: 'Express Delivery' },
    { id: 'customs', name: 'Customs Clearance' },
    { id: 'warehousing', name: 'Warehousing' },
    { id: 'special', name: 'Specialized Services' }
  ];

  return (
    <div>
      <PageHeader 
        title="Client Testimonials" 
        subtitle="Read what our clients have to say about their experience working with Jaykash Integrated Services."
        breadcrumbs={[{ name: "Testimonials", path: "/testimonials" }]}
      />
      
      <section className="section bg-white">
        <div 
          ref={ref}
          className={`container-custom transition-all duration-500 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="mb-12 overflow-x-auto">
            <div className="flex space-x-2 min-w-max pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setFilter(category.id)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    filter === category.id
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map(testimonial => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
          
          {filteredTestimonials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600">No testimonials found for this category.</p>
            </div>
          )}
          
          {/* Call to Action */}
          <div className="mt-16 bg-primary text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Join Our Satisfied Clients</h3>
            <p className="text-slate-200 max-w-2xl mx-auto mb-8">
              Experience the Jaykash difference for yourself. Contact us today to discuss your freight and logistics needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/request-quote" className="btn bg-accent text-white hover:bg-accent-dark">
                Request a Quote
              </a>
              <a href="/contact" className="btn bg-white text-primary hover:bg-slate-100">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;