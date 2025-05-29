import React, { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import { useInView } from 'react-intersection-observer';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const Faq: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  useEffect(() => {
    document.title = 'Frequently Asked Questions - Jaykash Integrated Services LLC';
    window.scrollTo(0, 0);
  }, []);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems: FaqItem[] = [
    {
      question: "What freight services does Jaykash offer?",
      answer: "Jaykash Integrated Services offers a comprehensive range of freight services including ocean freight (FCL and LCL), inland freight (road and rail), express delivery, cargo insurance, warehousing, and customs clearance services. We provide end-to-end logistics solutions tailored to your business needs.",
      category: "general"
    },
    {
      question: "How do I request a quote for shipping?",
      answer: "You can request a quote by filling out our online quote form on the 'Request Quote' page, calling our customer service team, or sending an email to info@jaykash.com. Please provide details about your shipment including origin, destination, cargo type, dimensions, and timeline for the most accurate quote.",
      category: "quotes"
    },
    {
      question: "What is the difference between FCL and LCL shipping?",
      answer: "FCL (Full Container Load) means you're shipping enough goods to fill an entire container, which is sealed at origin and opened at destination. LCL (Less than Container Load) means your goods share container space with other shipments, making it more economical for smaller volumes but potentially adding transit time for consolidation and deconsolidation.",
      category: "shipping"
    },
    {
      question: "How can I track my shipment?",
      answer: "We provide real-time tracking for all shipments. You can track your cargo by entering your tracking number on our website, through our mobile app, or by contacting your designated account manager. Our tracking system provides updates on location, estimated arrival times, and any relevant status changes.",
      category: "tracking"
    },
    {
      question: "What documentation is required for international shipping?",
      answer: "Required documentation typically includes a commercial invoice, packing list, bill of lading or airway bill, certificate of origin, and customs declaration forms. Depending on the cargo type and destination, additional documents like permits, licenses, or certificates may be required. Our customs clearance team can assist with all necessary paperwork.",
      category: "documentation"
    },
    {
      question: "Does Jaykash handle hazardous materials?",
      answer: "Yes, we handle hazardous materials with proper certification and compliance with international regulations. You must declare any hazardous materials in advance and provide appropriate classification, documentation, and packaging according to international standards. Please contact us directly for specific requirements related to your hazardous cargo.",
      category: "shipping"
    },
    {
      question: "What cargo insurance options do you offer?",
      answer: "We offer comprehensive cargo insurance options including all-risk coverage, named perils coverage, and customized policies based on your specific needs. Our insurance packages can cover door-to-door transit, protect against physical loss or damage, and include additional coverage for special circumstances. We recommend appropriate coverage based on your cargo value and risk factors.",
      category: "insurance"
    },
    {
      question: "How are shipping rates calculated?",
      answer: "Shipping rates are calculated based on several factors including cargo dimensions and weight, shipping distance, service type (ocean, road, express), container type, fuel surcharges, seasonal demand, and any special handling requirements. For the most accurate pricing, please request a detailed quote for your specific shipment.",
      category: "quotes"
    },
    {
      question: "What is your claim process for damaged or lost cargo?",
      answer: "In the event of damage or loss, please contact our customer service team immediately. You'll need to submit a claim form along with supporting documentation such as photos of damage, packing lists, and value declaration. Our claims department will process your claim promptly, typically within 30 days of receiving complete documentation.",
      category: "insurance"
    },
    {
      question: "Can you handle oversized or project cargo?",
      answer: "Yes, we specialize in handling oversized and project cargo that requires special equipment and planning. Our team has extensive experience with heavy lift, out-of-gauge, and breakbulk shipments. We provide customized solutions including route surveys, special permits, and appropriate equipment selection to ensure safe and efficient delivery.",
      category: "shipping"
    },
    {
      question: "What warehousing services do you provide?",
      answer: "Our warehousing services include short and long-term storage, inventory management, order fulfillment, cross-docking, distribution services, and value-added services such as labeling, kitting, and quality control. Our facilities are strategically located to optimize your supply chain with modern security systems and climate-controlled options as needed.",
      category: "warehousing"
    },
    {
      question: "How do you handle customs clearance for international shipments?",
      answer: "Our customs clearance team manages all aspects of the process including documentation preparation, classification of goods, duty and tax calculation, regulatory compliance, and communication with customs authorities. We stay updated on changing regulations to ensure smooth clearance and minimize delays at borders.",
      category: "documentation"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'general', name: 'General Information' },
    { id: 'quotes', name: 'Quotes & Pricing' },
    { id: 'shipping', name: 'Shipping Services' },
    { id: 'tracking', name: 'Tracking & Delivery' },
    { id: 'documentation', name: 'Documentation' },
    { id: 'insurance', name: 'Insurance & Claims' },
    { id: 'warehousing', name: 'Warehousing' }
  ];

  const filteredFaqs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <PageHeader 
        title="Frequently Asked Questions" 
        subtitle="Find answers to common questions about our freight and logistics services."
        breadcrumbs={[{ name: "FAQ", path: "/faq" }]}
      />
      
      <section className="section bg-white">
        <div 
          ref={ref}
          className={`container-custom transition-all duration-500 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Search and Filter */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row items-stretch gap-6">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="input-field pl-10"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="md:w-64">
                <select
                  className="input-field"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item, index) => (
                <div 
                  key={index} 
                  className="border border-slate-200 rounded-lg overflow-hidden transition-all duration-300"
                >
                  <button
                    className="flex justify-between items-center w-full p-5 text-left bg-white hover:bg-slate-50 transition-colors"
                    onClick={() => toggleFaq(index)}
                  >
                    <h3 className="text-lg font-medium text-primary">{item.question}</h3>
                    {activeIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-5 border-t border-slate-200 bg-slate-50">
                      <p className="text-slate-700">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600">No results found. Please try another search term or category.</p>
              </div>
            )}
          </div>
          
          {/* Contact Section */}
          <div className="mt-16 bg-primary text-white rounded-lg p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
              <p className="mb-6 text-slate-200">
                If you couldn't find the answer to your question, our team is here to help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/contact" className="btn bg-white text-primary hover:bg-slate-100">
                  Contact Us
                </a>
                <a href="tel:+1234567890" className="btn bg-accent text-white hover:bg-accent-dark">
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq;