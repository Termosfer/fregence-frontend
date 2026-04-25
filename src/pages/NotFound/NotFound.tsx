import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const NotFound = () => {
  // 40 dənə tünd və dolğun qabarcıq
  const bubbles = Array.from({ length: 40 });

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden font-[Playfair] 
      bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-white">
      
      {/* 1. TÜND VƏ DOLĞUN QABARCIQLAR (BUBBLES) */}
      {bubbles.map((_, i) => {
        const size = Math.random() * 50 + 15; // 15px - 65px arası
        return (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/10 shadow-2xl"
            style={{
              width: size,
              height: size,
              // Daha tünd və doymuş Tiffany Blue / Teal rəngi
              background: "radial-gradient(circle, rgba(0, 128, 128, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              zIndex: 1
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.7, 0.4, 0.7, 0],
              scale: [1, 1.3, 1, 1.2, 1],
              x: [0, Math.random() * 120 - 60, Math.random() * 120 - 60, 0],
              y: [0, Math.random() * 120 - 60, Math.random() * 120 - 60, 0],
            }}
            transition={{
              duration: Math.random() * 12 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* 2. MƏRKƏZİ MƏZMUN */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="relative"
        >
          {/* 404 Mətni - Ağdan qaraya keçid effekti üçün ağ rəngdə və kölgəli */}
          <h1 className="text-[15vw] md:text-[20vw] font-black leading-none tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] select-none text-white opacity-90">
            404
          </h1>
          {/* Rəqəmin arxasındakı güclü parıltı */}
          <div className="absolute inset-0 bg-[#81d8d0]/30 blur-[150px] -z-10 rounded-full animate-pulse"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="max-w-2xl -mt-5 md:-mt-10"
        >
          {/* Başlıq rəngi fonun alt hissəsinə uyğun olaraq tünd qara-boz */}
          <h2 className="text-3xl md:text-6xl font-bold uppercase tracking-tight text-[#0F172A]">
            Lost in <span className="text-[#008080] italic font-light underline decoration-1">Essence</span>
          </h2>
          
          <div className="w-24 h-[3px] bg-[#0F172A] mx-auto my-3 opacity-90"></div>

          <p className="text-gray-700 text-lg md:text-2xl font-medium italic leading-relaxed px-4">
            The fragrance you are seeking has evaporated into the night sky. <br/>
            Let us guide you back to the morning light.
          </p>

          <motion.div
            className="mt-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-4 bg-[#0F172A] text-white px-14 py-5 rounded-2xl font-bold uppercase tracking-[4px] text-[11px] hover:bg-white hover:text-black transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-2 border-[#0F172A]"
            >
              <FiArrowLeft size={20} />
              Return to Atelier
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* 3. ALT LOGO */}
      <div className="absolute bottom-20 flex flex-col items-center gap-2 opacity-50 z-20">
        <p className="text-[10px] font-black uppercase tracking-[12px] text-gray-900">MI-PARFUM</p>
      </div>

    </div>
  );
};

export default NotFound;