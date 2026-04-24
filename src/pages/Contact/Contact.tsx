import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FiSend, FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import api from "../../api/axios";
import { AxiosError } from "axios";
import type  { ApiError } from "../../types/perfume";
import img22 from "../../assets/map.webp";
import Newsletter from "../../components/Newsletter";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const mutation = useMutation<void, AxiosError<ApiError>, typeof formData>({
    mutationFn: (data) => api.post("/contact", data),
    onSuccess: () => {
      toast.success("Thank you. Your inquiry has been sent.");
      setFormData({ name: "", email: "", message: "" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) return toast.error("Please login to contact us.");
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
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          
          {/* 2. LEFT SIDE: INFO (5 Columns) */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold uppercase tracking-tight">The Concierge</h2>
              <p className="text-gray-400 text-lg leading-relaxed italic">
                Our fragrance experts are at your service for consultations, gifting advice, and order inquiries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-10">
              {[
                { icon: FiMapPin, title: "Our Boutique", text: "Luxury Row, 101, Baku, AZ" },
                { icon: FiPhone, title: "Telephone", text: "+994 50 123 45 67" },
                { icon: FiMail, title: "Email Inquiry", text: "concierge@mparfum.com" },
                { icon: FiClock, title: "Hours", text: "Mon-Sun: 10:00 - 22:00" },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-[#FAFAF9] flex items-center justify-center text-[#81d8d0] border border-gray-100 flex-shrink-0">
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

          {/* 3. RIGHT SIDE: WHITE FORM (7 Columns) */}
          <div className="lg:col-span-7 bg-[#FAFAF9] p-8 md:p-16 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="group relative">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[3px] mb-2 block group-focus-within:text-black transition-colors">Full Name</label>
                <input 
                  type="text" required placeholder="Tell us who you are..."
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-black transition-all text-lg font-medium placeholder:text-gray-300"
                />
              </div>

              <div className="group relative">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[3px] mb-2 block group-focus-within:text-black transition-colors">Email Address</label>
                <input 
                  type="email" required placeholder="Where can we reach you?"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-black transition-all text-lg font-medium placeholder:text-gray-300"
                />
              </div>

              <div className="group relative">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[3px] mb-2 block group-focus-within:text-black transition-colors">Your Message</label>
                <textarea 
                  required rows={3} placeholder="How can we help you today?"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-black transition-all text-lg font-medium resize-none placeholder:text-gray-300"
                />
              </div>

              <button 
                type="submit" disabled={mutation.isPending}
                className="w-full bg-black text-white py-6 rounded-2xl font-bold uppercase tracking-[4px] text-[11px] flex items-center justify-center gap-4 hover:bg-gray-800 transition-all active:scale-[0.98] cursor-pointer shadow-xl shadow-gray-200"
              >
                {mutation.isPending ? "SENDING..." : "SUBMIT INQUIRY"}
                <FiSend />
              </button>
            </form>
          </div>

        </div>
      </div>

      <Newsletter />
    </div>
  );
};

export default Contact;