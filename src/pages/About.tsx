import React, { useEffect } from 'react';
import PageHeader from '../components/common/PageHeader';
import { useInView } from 'react-intersection-observer';
import { Award, Users, Target, MapPin, CheckCircle } from 'lucide-react';

const About: React.FC = () => {
  useEffect(() => {
    document.title = 'About Us - Jaykash Integrated Services LLC';
    window.scrollTo(0, 0);
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: missionRef, inView: missionInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: teamRef, inView: teamInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const values = [
    {
      icon: <CheckCircle className="h-6 w-6 text-accent" />,
      title: "Reliability",
      description: "We deliver on our promises, ensuring your freight arrives safely and on time, every time."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-accent" />,
      title: "Transparency",
      description: "Clear communication and visibility throughout the entire shipping process."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-accent" />,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our service, constantly improving our processes."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-accent" />,
      title: "Customer Focus",
      description: "Our clients' needs are at the center of everything we do, providing tailored solutions."
    }
  ];

  const team = [
    {
      name: "John Adams",
      position: "Founder & CEO",
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "With over 20 years in the logistics industry, John founded Jaykash with a vision to provide reliable and efficient freight services globally."
    },
    {
      name: "Sarah Williams",
      position: "Operations Director",
      image: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Sarah oversees all operational aspects of our freight services, ensuring smooth execution and customer satisfaction."
    },
    {
      name: "Michael Chen",
      position: "Head of International Freight",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Michael manages our global shipping network, leveraging his expertise in international logistics and customs regulations."
    },
    {
      name: "Emily Rodriguez",
      position: "Customer Relations Manager",
      image: "https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      bio: "Emily leads our customer service team, ensuring our clients receive personalized support and exceptional service."
    }
  ];

  return (
    <div>
      <PageHeader 
        title="About Jaykash Integrated Services" 
        subtitle="Learn about our story, mission, and the team behind our logistics excellence."
        breadcrumbs={[{ name: "About Us", path: "/about" }]}
      />
      
      {/* Company Story */}
      <section className="section bg-white">
        <div className="container-custom">
          <div 
            ref={ref}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-500 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Our Story</h2>
              <p className="text-slate-700 mb-4">
                Founded in 2010, Jaykash Integrated Services LLC started as a small local freight company with a vision to provide reliable logistics solutions to businesses of all sizes.
              </p>
              <p className="text-slate-700 mb-4">
                Over the years, we have grown into a global freight service provider, specializing in ocean freight and inland freight services, serving clients across multiple industries and continents.
              </p>
              <p className="text-slate-700 mb-4">
                Today, with over a decade of experience, we pride ourselves on our ability to provide tailored logistics solutions that help our clients optimize their supply chains and grow their businesses.
              </p>
              <p className="text-slate-700">
                Our commitment to reliability, efficiency, and customer satisfaction has earned us the trust of hundreds of businesses worldwide, making us their preferred logistics partner.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Jaykash team" 
                className="rounded-lg shadow-lg object-cover h-full w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-white p-6 rounded-lg shadow-lg">
                <h4 className="text-2xl font-bold">12+</h4>
                <p>Years of Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission, Vision, Values */}
      <section className="section bg-slate-50">
        <div className="container-custom">
          <div 
            ref={missionRef}
            className={`transition-all duration-500 ${
              missionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="section-title">Our Mission & Vision</h2>
            <p className="section-subtitle">
              Guided by our core values, we strive to be the most trusted and reliable logistics partner for businesses worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            <div 
              className={`card p-8 border-t-4 border-primary transition-all duration-500 delay-100 ${
                missionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-primary-light rounded-full p-3 inline-block mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
              <p className="text-slate-600">
                To provide reliable, efficient, and cost-effective logistics solutions that enable our clients to focus on their core business while we handle their freight needs with the highest level of professionalism and care.
              </p>
            </div>
            
            <div 
              className={`card p-8 border-t-4 border-secondary transition-all duration-500 delay-200 ${
                missionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-secondary rounded-full p-3 inline-block mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
              <p className="text-slate-600">
                To be the global leader in integrated logistics services, recognized for our innovation, reliability, and commitment to exceeding client expectations, while setting new standards of excellence in the freight industry.
              </p>
            </div>
            
            <div 
              className={`card p-8 border-t-4 border-accent transition-all duration-500 delay-300 ${
                missionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-accent rounded-full p-3 inline-block mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Our Values</h3>
              <ul className="space-y-3">
                {values.map((value, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    {value.icon}
                    <div>
                      <span className="font-medium">{value.title}:</span> {value.description}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Team */}
      <section className="section bg-white">
        <div className="container-custom">
          <div 
            ref={teamRef}
            className={`transition-all duration-500 ${
              teamInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="section-title">Meet Our Leadership Team</h2>
            <p className="section-subtitle">
              Our experienced team of logistics professionals is dedicated to providing exceptional service and innovative solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {team.map((member, index) => (
              <div 
                key={index}
                className={`card overflow-hidden transition-all duration-500 ${
                  teamInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 0.1 + 0.2}s` }}
              >
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-accent font-medium mb-3">{member.position}</p>
                  <p className="text-slate-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Global Presence */}
      <section className="section bg-primary text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Global Presence</h2>
            <p className="max-w-3xl mx-auto text-slate-300">
              With operations in multiple countries and a network of trusted partners, we provide seamless logistics solutions worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { region: "North America", count: "12 Locations" },
              { region: "Europe", count: "8 Locations" },
              { region: "Asia Pacific", count: "10 Locations" },
              { region: "Africa & Middle East", count: "5 Locations" }
            ].map((location, index) => (
              <div 
                key={index}
                className="bg-primary-light p-6 rounded-lg text-center"
              >
                <MapPin className="h-10 w-10 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{location.region}</h3>
                <p className="text-slate-300">{location.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;