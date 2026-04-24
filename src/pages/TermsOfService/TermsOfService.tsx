import { motion } from "framer-motion";
import { FiFileText, FiTruck, FiRefreshCw, FiAlertTriangle } from "react-icons/fi";

const TermsOfService = () => {
  const highlights = [
    {
      id: "01",
      icon: <FiTruck />,
      title: "Logistics",
      desc: "Worldwide luxury shipping. Domestic orders in Baku are fulfilled within 24 hours."
    },
    {
      id: "02",
      icon: <FiRefreshCw />,
      title: "Returns",
      desc: "Due to hygiene standards, returns are only accepted for unopened, sealed original packaging."
    },
    {
      id: "03",
      icon: <FiAlertTriangle />,
      title: "Authenticity",
      desc: "Every essence is guaranteed 100% original, sourced directly from niche distillers."
    }
  ];

  return (
    <div className="bg-white text-black font-[Playfair] min-h-screen">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative py-24 bg-[#FAFAF9] border-b border-gray-100 overflow-hidden">
        {/* Background Decorative Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <span className="text-[25vw] font-black uppercase tracking-tighter">TERMS</span>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black uppercase tracking-[6px] text-[#81d8d0] mb-4"
          >
            Guidelines of the House
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-gray-900"
          >
            Terms of <span className="italic font-light text-gray-400">Service</span>
          </motion.h1>
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-12 h-[1px] bg-black"></div>
            <div className="w-2 h-[1px] bg-[#81d8d0]"></div>
            <div className="w-12 h-[1px] bg-black"></div>
          </div>
        </div>
      </section>

      {/* 2. KEY HIGHLIGHTS CARDS */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {highlights.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ y: -5 }}
              className="p-10 bg-[#FAFAF9] rounded-[2.5rem] border border-gray-50 space-y-6 transition-all duration-500 hover:shadow-xl hover:bg-white group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-xl text-gray-400 group-hover:text-[#81d8d0] transition-colors shadow-sm border border-gray-100">
                {item.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold uppercase tracking-widest">{item.title}</h3>
                <p className="text-gray-500 text-sm italic leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. DETAILED ARTICLES */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="space-y-16">
          
          {/* Article 1 */}
          <div className="flex gap-8 group">
            <span className="text-xs font-black text-gray-200 group-hover:text-[#81d8d0] transition-colors pt-2">1.0</span>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold uppercase tracking-tight">Acceptance of Terms</h2>
              <p className="text-gray-500 leading-relaxed font-[Jost]">
                By accessing and placing an order with <strong>MI-Parfum</strong>, you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below. These terms apply to the entire website and any email or other type of communication between you and MI-Parfum.
              </p>
            </div>
          </div>

          {/* Article 2 */}
          <div className="flex gap-8 group">
            <span className="text-xs font-black text-gray-200 group-hover:text-[#81d8d0] transition-colors pt-2">2.0</span>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold uppercase tracking-tight">Products & Pricing</h2>
              <p className="text-gray-500 leading-relaxed font-[Jost]">
                We reserve the right to change prices and revise the resource usage policy at any moment. Fragrances are subject to availability. As many of our scents use natural raw materials, slight variations in color between batches may occur, which is a sign of authenticity and purity.
              </p>
            </div>
          </div>

          {/* Article 3 */}
          <div className="flex gap-8 group">
            <span className="text-xs font-black text-gray-200 group-hover:text-[#81d8d0] transition-colors pt-2">3.0</span>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold uppercase tracking-tight">Intellectual Property</h2>
              <p className="text-gray-500 leading-relaxed font-[Jost]">
                The Site and its original content, features, and functionality are owned by MI-Parfum and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>
            </div>
          </div>

          {/* Article 4 */}
          <div className="flex gap-8 group">
            <span className="text-xs font-black text-gray-200 group-hover:text-[#81d8d0] transition-colors pt-2">4.0</span>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold uppercase tracking-tight">Governing Law</h2>
              <p className="text-gray-500 leading-relaxed font-[Jost]">
                These terms shall be governed by and construed in accordance with the laws of the Republic of Azerbaijan, without regard to its conflict of law provisions.
              </p>
            </div>
          </div>

        </div>

        {/* Final Statement */}
        <div className="mt-32 p-12 bg-black text-white rounded-[3rem] text-center space-y-6 shadow-2xl">
          <FiFileText className="mx-auto text-[#81d8d0]" size={32} />
          <h3 className="text-xl font-bold uppercase tracking-[4px]">Legal Integrity</h3>
          <p className="text-gray-400 text-sm italic max-w-md mx-auto">
            Our terms are designed to protect both the craftsmanship of our atelier and the rights of our esteemed clientele.
          </p>
          <div className="pt-4">
            <p className="text-[10px] font-black uppercase tracking-[2px] opacity-40">Last Updated: April 2024</p>
          </div>
        </div>
      </section>

      {/* Decorative Padding for bottom */}
      <div className="h-20"></div>
    </div>
  );
};

export default TermsOfService;