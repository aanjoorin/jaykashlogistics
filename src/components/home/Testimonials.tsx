import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

interface TestimonialCardProps {
  quote: string;
  name: string;
  company: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, company, rating }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 h-full flex flex-col">
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
          />
        ))}
      </div>
      <blockquote className="text-slate-700 italic mb-6 flex-grow">"{quote}"</blockquote>
      <div>
        <p className="font-semibold text-primary">{name}</p>
        <p className="text-sm text-slate-500">{company}</p>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const testimonials = [
    {
      quote: "Jaykash Integrated Services has been our logistics partner for over 3 years now. Their ocean freight services are reliable, and their team is always responsive to our needs.",
      name: "Sarah Johnson",
      company: "Global Imports Ltd.",
      rating: 5
    },
    {
      quote: "We've been using Jaykash for all our inland freight needs. Their attention to detail and commitment to on-time delivery has significantly improved our supply chain efficiency.",
      name: "Michael Chen",
      company: "Tech Distributors Inc.",
      rating: 5
    },
    {
      quote: "The customs clearance services provided by Jaykash are exceptional. They handle all the complex paperwork and ensure smooth clearance of our international shipments.",
      name: "David Williams",
      company: "Fashion Exports Co.",
      rating: 4
    },
    {
      quote: "Since partnering with Jaykash, we've seen a 30% reduction in logistics costs. Their team found efficiencies in our supply chain that we hadn't considered before.",
      name: "Emily Rodriguez",
      company: "Organic Foods Market",
      rating: 5
    },
    {
      quote: "The warehousing solutions from Jaykash have been a game-changer for our business. Their inventory management system provides real-time visibility and has reduced our order fulfillment time.",
      name: "Robert Thompson",
      company: "E-commerce Solutions",
      rating: 4
    }
  ];

  return (
    <section className="section bg-slate-50" id="testimonials">
      <div 
        ref={ref}
        className={`container-custom transition-all duration-500 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h2 className="section-title">What Our Clients Say</h2>
        <p className="section-subtitle">
          Don't just take our word for it. Here's what our clients have to say about their experience working with Jaykash Integrated Services.
        </p>
        
        <div className="mt-12">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            className="pb-12"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index} className="h-auto">
                <TestimonialCard
                  quote={testimonial.quote}
                  name={testimonial.name}
                  company={testimonial.company}
                  rating={testimonial.rating}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        
        <div className="text-center mt-8">
          <Link to="/testimonials" className="inline-flex items-center text-primary hover:text-accent transition-colors font-medium">
            View All Testimonials <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;