import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { FiCheckCircle, FiPackage, FiArrowRight, FiMail } from "react-icons/fi";

const OrderSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>(); // URL-dən sifariş nömrəsini götürürük
  useEffect(() => {
    // Səhifə açılan kimi professional konfeti animasiyası
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      // Tiffany Blue və Qızılı rənglərdə konfetilər
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#81d8d0", "#000000"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#81d8d0", "#ffffff"],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-20 font-[Playfair]">
      {/* 1. ANİMASİYALI İKON */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-10 shadow-inner"
      >
        <FiCheckCircle size={48} />
      </motion.div>

      {/* 2. TƏBRİK MƏTNİ */}
      <div className="text-center space-y-4 max-w-lg">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-gray-900"
        >
          Thank you for <br /> your{" "}
          <span className="italic font-light text-gray-400">purchase</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 text-lg italic"
        >
          Your fragrance journey has officially begun.
        </motion.p>
      </div>

      {/* 3. SİFARİŞ DETALI KARTI */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-12 w-full max-w-md bg-[#FAFAF9] rounded-[2.5rem] p-8 border border-gray-100 shadow-sm"
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Order Number
            </span>
            <span className="font-bold text-black">#{orderId || "N/A"}</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm text-[#81d8d0]">
              <FiMail />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">
                Confirmation Sent
              </p>
              <p className="text-[11px] text-gray-500 mt-1 italic">
                We've sent a detailed receipt to your registered email address.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm text-[#81d8d0]">
              <FiPackage />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">
                Estimated Delivery
              </p>
              <p className="text-[11px] text-gray-500 mt-1 italic">
                Our concierge will arrange your delivery within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4. NAVİQASİYA DÜYMƏLƏRİ */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link
          to="/orders"
          className="flex-1 bg-black text-white py-4 rounded-2xl font-bold uppercase tracking-[2px] text-[10px] text-center hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
        >
          Track Order <FiArrowRight />
        </Link>
        <Link
          to="/products"
          className="flex-1 bg-white text-black border border-black py-4 rounded-2xl font-bold uppercase tracking-[2px] text-[10px] text-center hover:bg-gray-50 transition-all"
        >
          Continue Shopping
        </Link>
      </div>

      <p className="mt-12 text-[10px] font-black uppercase tracking-[8px] text-gray-300 opacity-50">
        MI-PARFUM ATELIER
      </p>
    </div>
  );
};

export default OrderSuccess;
