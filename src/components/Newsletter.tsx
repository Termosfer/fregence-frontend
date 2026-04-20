import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { IoMailOpenOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

const Newsletter = () => {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  // 1. Mutation: Backend-ə email göndərir
  const mutation = useMutation({
    mutationFn: (newEmail: string) => {
      // Backend obyekt formatında gözləyirsə: { email: "..." }
      return api.post("/subscribers", { email: newEmail });
    },
    onSuccess: () => {
      toast.success("Uğurla abunə oldunuz!");
      setEmail("");
    },
    onError: (error: any) => {
      // 401 və ya 403 gələrsə token problemi var deməkdir
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Sessiyanızın vaxtı bitib, yenidən giriş edin.");
      } else {
        toast.error("Bu email artıq abunə olub və ya xəta baş verdi.");
      }
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    // 2. Token Yoxlanışı
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error(
        toast.warn("Zəhmət olmasa əvvəlcə giriş edin.")
      )
      // İstəsəniz istifadəçini login səhifəsinə yönləndirə bilərsiniz:
       navigate("/login");
      return;
    }

    // 3. Validasiya
    if (!email) {
      toast.warn("Zəhmət olmasa email adresinizi yazın.");
      return;
    }

    if (!email.includes("@")) {
      toast.warn("Düzgün email formatı daxil edin.");
      return;
    }

    // Hər şey qaydasındadırsa, sorğunu göndər
    mutation.mutate(email);
  };
  return (
    <section className="border-t  py-20 px-4 sm:px-8 lg:px-20 mt-20 border-[#00000080]">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-5 w-full">
        <div className="flex items-center  gap-10 w-full">
          <div className="flex items-center justify-center gap-2 sm:gap-5 border-r-1 pr-5 border-[#00000080]">
            <IoMailOpenOutline className="text-lg lg:text-4xl 2xl:text-6xl" />
            <div className="flex flex-col">
              <span className="text-sm sm:text-md 2xl:text-xl font-semibold text-left ">
                SIGN UP
              </span>
              <span className="text-sm sm:text-md 2xl:text-xl font-semibold text-left text-nowrap">
                FOR NEWSLETTER
              </span>
            </div>
          </div>
          <p className="text-[#00000080] text-xs sm:text-sm 2xl:text-lg text-left ">
            Subscribe to the weekly newsletter for all the latest updates
          </p>
        </div>
        <form
          className="flex items-center   overflow-hidden rounded-lg w-full"
          onSubmit={handleSubscribe}
        >
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={mutation.isPending}
            type="text"
            placeholder="Enter your email..."
            className={`py-4 lg:py-5 text-sm sm:text-md 2xl:text-lg text-[#00000080] px-5 lg:px-10 rounded-l-lg w-full bg-[#f2f2f2] outline-none"
            `}
          />
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-black text-white text-sm sm:text-md 2xl:text-lg py-4 lg:py-5  px-10 rounded-r-lg cursor-pointer"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
