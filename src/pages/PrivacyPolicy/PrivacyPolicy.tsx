import { motion } from "framer-motion";
import { FiShield, FiLock, FiEye, FiUserCheck } from "react-icons/fi";

const PrivacyPolicy = () => {
  const sections = [
    {
      id: "01",
      icon: <FiUserCheck />,
      title: "Data Collection",
      content: "We collect personal information that you provide to us such as name, email address, and shipping details when you create an account or place an order. This information is essential for fulfilling your fragrance journey."
    },
    {
      id: "02",
      icon: <FiLock />,
      title: "Payment Security",
      content: "Your financial security is our priority. We do not store credit card information on our servers. All transactions are processed through secure, PCI-compliant payment gateways using advanced encryption."
    },
    {
      id: "03",
      icon: <FiShield />,
      title: "How We Protect You",
      content: "MI-Parfum employs industry-standard administrative and technical measures to safeguard your personal data against unauthorized access, loss, or alteration."
    },
    {
      id: "04",
      icon: <FiEye />,
      title: "Cookie Policy",
      content: "We use cookies to enhance your browsing experience, remember your shopping cart, and analyze site traffic. You can manage your cookie preferences through your browser settings at any time."
    }
  ];

  return (
    <div className="bg-white text-black font-[Playfair] min-h-screen">
      
      {/* 1. ELEGANT HERO SECTION */}
      <section className="relative py-24 bg-[#FAFAF9] border-b border-gray-100 overflow-hidden">
        {/* Decorative Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <span className="text-[25vw] font-black uppercase tracking-tighter">PRIVACY</span>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black uppercase tracking-[6px] text-[#81d8d0] mb-4"
          >
            Trust & Transparency
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-gray-900"
          >
            Privacy <span className="italic font-light text-gray-400">Policy</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            className="h-[2px] bg-black mx-auto mt-8"
          />
        </div>
      </section>

      {/* 2. CORE POLICY SECTIONS */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {sections.map((section) => (
            <motion.div 
              key={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4 group"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs font-black text-[#81d8d0]">{section.id}</span>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all duration-500 shadow-inner">
                  {section.icon}
                </div>
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-tight">{section.title}</h2>
              <p className="text-gray-500 leading-relaxed italic font-light text-sm md:text-base">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. DETAILED LEGAL TEXT */}
      <section className="py-20 bg-[#FAFAF9] border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div className="prose prose-sm md:prose-base text-gray-600 leading-relaxed font-[Jost]">
            <h3 className="text-black font-bold uppercase tracking-widest text-lg mb-6">Full Disclosure</h3>
            <p className="mb-6">
              This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from <strong>MI-Parfum</strong> (the “Site”).
            </p>
            
            <h4 className="text-black font-bold uppercase text-sm mt-10 mb-4">Sharing Your Personal Information</h4>
            <p className="mb-6">
              We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Google Analytics to help us understand how our customers use the Site. We also use Cloudinary to manage our visual assets securely.
            </p>

            <h4 className="text-black font-bold uppercase text-sm mt-10 mb-4">Your Rights</h4>
            <p className="mb-6">
              If you are a resident of Azerbaijan or the EU, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.
            </p>

            <h4 className="text-black font-bold uppercase text-sm mt-10 mb-4">Changes</h4>
            <p className="mb-10">
              We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.
            </p>
          </div>

          {/* Contact for Privacy */}
          <div className="p-10 bg-white rounded-[2rem] border border-gray-100 text-center space-y-4 shadow-sm">
             <h4 className="text-xs font-black uppercase tracking-[4px]">Privacy Concierge</h4>
             <p className="text-sm text-gray-400 italic">For any questions regarding your data, please reach out to us at:</p>
             <p className="text-lg font-bold text-[#81d8d0] underline cursor-pointer">privacy@miparfum.com</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;