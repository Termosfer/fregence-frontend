import { useState  } from "react";
import { useMutation } from "@tanstack/react-query";
import { FiSend, FiMapPin, FiPhone, FiMail, FiClock, FiLoader } from "react-icons/fi";
import api from "../../api/axios";
import { AxiosError } from "axios";
import type { ApiError } from "../../types/perfume";
import img22 from "../../assets/map.webp";
import Newsletter from "../../components/Newsletter";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  
  // Mesaj statusunu idarə etmək üçün state
  const [status, setStatus] = useState<{ message: string; type: "success" | "error" | null }>({
    message: "",
    type: null,
  });

  const contactInfo = [
    { icon: FiMapPin, title: "Our Boutique", text: "Luxury Row, 101, Baku, AZ" },
    { icon: FiPhone, title: "Telephone", text: "+994 50 123 45 67" },
    { icon: FiMail, title: "Email Inquiry", text: "concierge@mparfum.com" },
    { icon: FiClock, title: "Hours", text: "Mon-Sun: 10:00 - 22:00" },
  ];

  const mutation = useMutation<void, AxiosError<ApiError>, typeof formData>({
    mutationFn: (data) => api.post("/contact", data),
    onSuccess: () => {
      setStatus({ 
        message: "Thank you. Your inquiry has been sent successfully.", 
        type: "success" 
      });
      setFormData({ name: "", email: "", message: "" });
    },
    onError: (error) => {
      const serverMessage = error.response?.data?.message || "An error occurred while sending your message.";
      setStatus({ message: serverMessage, type: "error" });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // İstifadəçi yazmağa başlayanda köhnə mesajı silirik
    if (status.message) setStatus({ message: "", type: null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!localStorage.getItem("token")) {
      setStatus({ message: "Please login to contact us.", type: "error" });
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ message: "Please fill in all required fields.", type: "error" });
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <div className="bg-white text-black font-[Playfair] min-h-screen">
      
      {/* 1. MINIMAL HERO */}
      <section className="relative h-[45vh] flex items-center justify-center bg-[#F9F9F8]">
        <img 
          src={img22} 
          className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" 
          alt="Atelier" 
        />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-gray-900">Contact Us</h1>
          <div className="w-16 h-1 bg-[#81d8d0] mx-auto mt-6"></div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          
          {/* 2. LEFT SIDE: INFO */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold uppercase tracking-tight text-gray-800">The Concierge</h2>
              <p className="text-gray-400 text-lg leading-relaxed italic">
                Our fragrance experts are at your service for consultations, gifting advice, and order inquiries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-10">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-5 group">
                  <div className="w-10 h-10 rounded-full bg-[#FAFAF9] flex items-center justify-center text-[#81d8d0] border border-gray-100 flex-shrink-0 transition-colors group-hover:bg-black group-hover:text-white">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 mb-1">{item.title}</h4>
                    <p className="text-sm font-bold text-gray-800 tracking-wide">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. RIGHT SIDE: WHITE FORM */}
          <div className="lg:col-span-7 bg-[#FAFAF9] p-8 md:p-16 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="group relative">
                <label className="text-[10px] font-black uppercase text-gray-400  tracking-[3px] mb-2 block group-focus-within:text-black transition-colors font-[Jost]">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name} 
                  onChange={handleChange}
                  placeholder="Tell us who you are..."
                  className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-black transition-all text-lg font-medium placeholder:text-gray-300"
                />
              </div>

              <div className="group relative">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[3px] mb-2 block group-focus-within:text-black transition-colors font-[Jost]">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email} 
                  onChange={handleChange}
                  placeholder="Where can we reach you?"
                  className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-black transition-all text-lg font-medium placeholder:text-gray-300"
                />
              </div>

              <div className="group relative">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[3px] mb-2 block group-focus-within:text-black transition-colors font-[Jost]">Your Message</label>
                <textarea 
                  name="message"
                  rows={3} 
                  value={formData.message} 
                  onChange={handleChange}
                  placeholder="How can we help you today?"
                  className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-black transition-all text-lg font-medium resize-none placeholder:text-gray-300"
                />
              </div>

              <div className="space-y-4">
                <button 
                  type="submit" 
                  disabled={mutation.isPending}
                  className="w-full bg-black text-white py-6 rounded-2xl font-bold uppercase tracking-[4px] text-[11px] flex items-center justify-center gap-4 hover:bg-gray-800 transition-all active:scale-[0.98] cursor-pointer shadow-xl shadow-gray-200 disabled:bg-gray-400"
                >
                  {mutation.isPending ? (
                    <>
                      <FiLoader className="animate-spin" /> SENDING...
                    </>
                  ) : (
                    <>
                      SUBMIT INQUIRY <FiSend />
                    </>
                  )}
                </button>

                {/* DÜYMƏNİN ALTINDAKI STATUS MESAJI */}
                <div className="h-4 text-center">
                  {status.message && (
                    <p className={`text-[11px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-1 duration-300 ${
                      status.type === "success" ? "text-green-600" : "text-red-500"
                    }`}>
                      {status.message}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>

      <Newsletter />
    </div>
  );
};

export default Contact;