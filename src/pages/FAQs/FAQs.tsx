import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus, FiHelpCircle, FiMessageCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

const faqData = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How long does delivery take?",
        a: "For orders within Baku, we offer same-day or next-day delivery. Domestic shipping to regions usually takes 2-3 business days. International shipping varies by destination, typically between 7-14 days."
      },
      {
        q: "Can I track my order?",
        a: "Yes, absolutely. Once your order status is updated to 'Shipped', you can find the courier's contact details and estimated arrival time in your Profile under the 'Order History' section."
      },
      {
        q: "Do you offer free shipping?",
        a: "We offer complimentary (free) shipping on all orders over 150 AZN within Azerbaijan."
      }
    ]
  },
  {
    category: "Product & Quality",
    questions: [
      {
        q: "Are your perfumes 100% authentic?",
        a: "Yes. MI-Parfum only sources original fragrances directly from official distributors and reputable niche perfume houses. Every bottle comes with its original batch code and packaging."
      },
      {
        q: "How should I store my perfume?",
        a: "To preserve the essence, store your bottles in a cool, dark place away from direct sunlight and humidity. Avoid keeping them in bathrooms for long periods."
      }
    ]
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "Due to hygiene and safety standards, we only accept returns for items that are unopened, unused, and still in their original sealed cellophane packaging within 14 days of purchase."
      }
    ]
  }
];

const FAQs = () => {
  const [activeIdx, setActiveIdx] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setActiveIdx(activeIdx === id ? null : id);
  };

  return (
    <div className="bg-white text-black font-[Playfair] min-h-screen">
      
      {/* 1. ELEGANT HERO SECTION */}
      <section className="relative py-24 bg-[#FAFAF9] border-b border-gray-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <span className="text-[25vw] font-black uppercase tracking-tighter">QUESTIONS</span>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black uppercase tracking-[6px] text-[#81d8d0] mb-4"
          >
            Concierge Support
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-gray-900"
          >
            How can we <span className="italic font-light text-gray-400">help?</span>
          </motion.h1>
        </div>
      </section>

      {/* 2. FAQ CONTENT */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        {faqData.map((category, catIdx) => (
          <div key={catIdx} className="mb-16">
            <h2 className="text-xs font-black uppercase tracking-[4px] text-[#81d8d0] mb-8 border-b pb-4 border-gray-50">
              {category.category}
            </h2>
            
            <div className="space-y-4">
              {category.questions.map((item, qIdx) => {
                const id = `${catIdx}-${qIdx}`;
                const isOpen = activeIdx === id;

                return (
                  <div 
                    key={id} 
                    className={`border rounded-2xl transition-all duration-300 ${isOpen ? "border-black bg-white shadow-xl" : "border-gray-100 bg-[#FAFAF9]"}`}
                  >
                    <button
                      onClick={() => toggleAccordion(id)}
                      className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                    >
                      <span className="font-bold text-sm md:text-base uppercase tracking-tight pr-4">
                        {item.q}
                      </span>
                      <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? "bg-black text-white rotate-180" : "bg-white text-gray-400"}`}>
                        {isOpen ? <FiMinus size={14} /> : <FiPlus size={14} />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 text-gray-500 italic text-sm md:text-base leading-relaxed border-t border-gray-50 pt-4">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* 3. STILL HAVE QUESTIONS? (CTA) */}
      <section className="py-20 px-6 bg-[#FAFAF9] text-center border-t border-gray-100">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-gray-100 text-[#81d8d0]">
            <FiHelpCircle size={30} />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold uppercase tracking-tight">Still have questions?</h2>
            <p className="text-gray-400 italic">
              Our concierge team is available 24/7 to assist you with any inquiries.
            </p>
          </div>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-3 bg-black text-white px-10 py-4 rounded-full font-bold uppercase text-[10px] tracking-[3px] hover:bg-gray-800 transition-all shadow-lg active:scale-95"
          >
            <FiMessageCircle /> Contact Concierge
          </Link>
        </div>
      </section>

      {/* Bottom Padding */}
      <div className="h-20 bg-[#FAFAF9]"></div>
    </div>
  );
};

export default FAQs;