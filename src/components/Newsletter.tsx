import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { IoMailOpenOutline } from "react-icons/io5";
import api from "../api/axios";
import { toast } from "react-toastify";
import type { ApiError } from "../types/perfume";
import type { AxiosError } from "axios";
import { FiLoader, FiArrowRight } from "react-icons/fi";

const Newsletter = () => {
  const [email, setEmail] = useState<string>("");

  const mutation = useMutation<void, AxiosError<ApiError>, string>({
    mutationFn: (newEmail: string) => api.post("/subscribers", { email: newEmail }),
    onSuccess: () => {
      toast.success("Subscription successful!");
      setEmail("");
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.warn("Please enter a valid email.");
    mutation.mutate(email);
  };

  return (
    <section className="bg-[#FAFAF9] border-y border-gray-100 py-24 px-4 sm:px-8 lg:px-20 font-[Playfair]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* TEXT SECTION */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:w-1/2">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#81d8d0] shadow-sm">
            <IoMailOpenOutline className="text-3xl md:text-4xl" />
          </div>
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-gray-900 text-2xl md:text-4xl font-bold uppercase tracking-tighter leading-none">
              Sign Up <br /> <span className="italic font-light text-gray-400">for Newsletter</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-medium italic">
              Receive the latest updates on niche fragrances and exclusive events.
            </p>
          </div>
        </div>

        {/* FORM SECTION */}
        <form onSubmit={handleSubscribe} className="w-full lg:w-1/2 max-w-lg">
          <div className="relative group flex items-center border-b-2 border-gray-200 focus-within:border-black transition-all duration-500 pb-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={mutation.isPending}
              type="email"
              placeholder="Enter your email address..."
              className="w-full bg-transparent py-4 text-black outline-none placeholder:text-gray-300 italic text-lg"
            />
            <button
              type="submit"
              disabled={mutation.isPending}
              className="ml-4 flex items-center gap-2 group/btn"
            >
              <span className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 group-hover/btn:text-black transition-colors cursor-pointer">
                {mutation.isPending ? "Wait..." : "Subscribe"}
              </span>
              {mutation.isPending ? (
                <FiLoader className="animate-spin text-black" />
              ) : (
                <FiArrowRight className="text-gray-300 group-hover/btn:text-black group-hover/btn:translate-x-1 transition-all" />
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;