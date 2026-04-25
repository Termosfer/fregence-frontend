import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Animasiyalar üçün
import { FiHeart, FiSearch, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import api from "../../api/axios";
import QuickModal from "../../components/QuickModal";
import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/useCart";
import type { PageResponse, Perfume } from "../../types/perfume";

import img1 from "../../assets/s56-1.webp";
import img2 from "../../assets/s56-2.webp";
import img3 from "../../assets/Floral.webp";
import img4 from "../../assets/Warm-_-Spicy.webp";
import img5 from "../../assets/Woody-_-Earthy.webp";
import img6 from "../../assets/Lavender.webp";
import img7 from "../../assets/Vanilla.webp";
import img8 from "../../assets/Fresh.webp";
import img9 from "../../assets/b9-1.webp";
import img10 from "../../assets/b9-2.webp";
import img11 from "../../assets/b9-3.webp";
import img13 from "../../assets/b124-1.webp";



 const scentCards = [
    { img: img9, title: "Sandalwood" },
    { img: img10, title: "Pure Lavender" },
    { img: img11, title: "Midnight Jasmine" }
  ];
 const notes = [
    { img: img3, title: "Floral" }, { img: img4, title: "Warm & Spicy" },
    { img: img5, title: "Woody" }, { img: img6, title: "Lavender" },
    { img: img7, title: "Vanilla" }, { img: img8, title: "Fresh" }
  ];

const Home = () => {
  const [current, setCurrent] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const { addToWishlist } = useWishlist();
  const { addToCart } = useCart();

  const slides = [img1, img2];

  // 1. Datanı çəkirik
  const { data, isLoading } = useQuery<PageResponse<Perfume>>({
    queryKey: ["perfumes-home"],
    queryFn: () => api.get("/perfumes?page=0&size=4").then(res => res.data),
  });

  // Avtomatik Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Animasiya variantları
  const fadeInUp = {
    initial: { y: 60, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
  };

  
 const handleOpenQuickView = (id: number) => {
    setSelectedProductId(id);
    setShowModal(true);
  };
  return (
    <div className="bg-white overflow-hidden">
      
      {/* --- SECTION 1: HERO SLIDER (CInematic Reveal) --- */}
      <section className="relative w-full h-[85vh] lg:h-screen overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={slides[current]}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 px-4">
          <motion.span 
            initial={{ opacity: 0, letterSpacing: "10px" }}
            animate={{ opacity: 1, letterSpacing: "4px" }}
            transition={{ duration: 1.5 }}
            className="text-[10px] md:text-xs font-black uppercase mb-4"
          >
            Niche & Luxury Fragrances
          </motion.span>
          
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl md:text-8xl font-light tracking-tighter mb-8 font-[Playfair]"
          >
            The Art of <span className="italic font-bold text-[#81d8d0]">Scent</span>
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            <Link to="/products" className="group relative px-12 py-4 border border-white overflow-hidden inline-block">
              <span className="relative z-10 text-xs font-bold tracking-[3px] group-hover:text-black transition-colors duration-500 uppercase">Explore Collection</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. THE NOTES - ANIMATED MOLECULES (img3 - img8) */}
<section className="py-24 max-w-[1440px] mx-auto px-6 lg:px-20 overflow-hidden">
  <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
    <motion.div 
      initial={{ x: -50, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-2"
    >
      <h2 className="text-[10px] font-black uppercase tracking-[4px] text-[#81d8d0]">Olfactory Gallery</h2>
      <h3 className="text-4xl font-bold font-[Playfair] tracking-tight text-gray-900">Shop by Scent Profile</h3>
    </motion.div>
    <div className="h-[1px] flex-1 bg-gray-100 hidden md:block mx-10 mb-3"></div>
    <Link to="/shops" className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-[#81d8d0] hover:border-[#81d8d0] transition-colors">
      All families
    </Link>
  </div>

  {/* Konteyner üçün Stagger effekti */}
  <motion.div 
    initial="initial"
    whileInView="animate"
    viewport={{ once: true }}
    variants={{
      animate: { transition: { staggerChildren: 0.1 } }
    }}
    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10"
  >
    {notes.map((note, i) => (
      <motion.div 
        key={i}
        variants={{
          initial: { y: 30, opacity: 0 },
          animate: { y: 0, opacity: 1 }
        }}
        className="flex flex-col items-center group cursor-pointer"
      >
        {/* Dairəvi Konteyner: Həmişə yavaşca süzən (floating) animasiya */}
        <motion.div 
          animate={{
            y: [0, -10, 0], // Aşağı-yuxarı hərəkət
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.2, // Hər biri fərqli vaxtda tərpənsin deyə
            ease: "easeInOut"
          }}
          whileHover={{ scale: 1.08, rotate: [0, -2, 2, 0] }}
          className="relative w-full aspect-square rounded-full overflow-hidden border border-gray-100 bg-white p-4 shadow-sm group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] group-hover:border-black transition-all duration-500"
        >
          {/* Şəkil daxilində yüngül zoom */}
          <motion.img 
            src={note.img} 
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" 
            alt={note.title}
          />
          
          {/* Hover zamanı zərif parıltı (Aura) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#81d8d0]/0 via-[#81d8d0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>

        {/* Yazı üçün animasiya */}
        <div className="mt-6 flex flex-col items-center overflow-hidden">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black transition-all duration-300 transform translate-y-0 group-hover:-translate-y-1">
            {note.title}
          </span>
          {/* Altdan çıxan incə xətt */}
          <div className="w-0 h-[1.5px] bg-[#81d8d0] group-hover:w-full transition-all duration-500 mt-1" />
        </div>
      </motion.div>
    ))}
  </motion.div>
</section>
 {/* 3. SCENT DISCOVERY - ASYMMETRIC (img9, img10, img11) */}
      <section className="py-24 bg-black text-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-4 space-y-8">
                <h2 className="text-5xl font-bold font-[Playfair] leading-tight tracking-tighter text-[#81d8d0]">The Discovery <br/> Set</h2>
                <p className="text-gray-400 italic text-lg leading-relaxed">Experience the transition of Sandalwood to Jasmine in a single breath. Our most iconic textures.</p>
                <div className="flex gap-4">
                    {scentCards.map((_, i) => <div key={i} className="w-12 h-[2px] bg-white/20" />)}
                </div>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {scentCards.map((card, i) => (
                    <motion.div key={i} whileHover={{ y: -20 }} className="relative h-[450px] rounded-[3rem] overflow-hidden group">
                        <img src={card.img} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <h4 className="absolute bottom-10 left-1/2 -translate-x-1/2 font-bold uppercase tracking-[4px] text-xs text-nowrap">{card.title}</h4>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>
     {/* --- SECTION 3: FEATURED PRODUCTS (Fluid Luxury Grid) --- */}
<section className="py-24 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-20 overflow-hidden">
  <div className="flex flex-col items-center mb-16 space-y-4">
    <motion.span 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-[10px] font-black uppercase tracking-[6px] text-[#81d8d0]"
    >
      Handpicked for you
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-4xl md:text-6xl font-bold tracking-tighter font-[Playfair] text-gray-900"
    >
      Masterpieces
    </motion.h2>
  </div>

  <motion.div 
    variants={{
      animate: { transition: { staggerChildren: 0.15 } }
    }}
    initial="initial"
    whileInView="animate"
    viewport={{ once: true }}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
  >
    {isLoading ? (
      [...Array(4)].map((_, i) => (
        <div key={i} className="h-[450px] bg-gray-50 animate-pulse rounded-[2.5rem]" />
      ))
    ) : 
data?.content.map((item) => (
  <motion.div 
    key={item.id}
    variants={fadeInUp}
    className="group relative flex flex-col" // 'group' burada mütləq olmalıdır
  >
    {/* IMAGE CONTAINER */}
    <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-[#fdfdfd] border border-gray-100 shadow-sm transition-all duration-700 group-hover:shadow-2xl">
      
      {/* Şəkil və Link */}
      <div className="block w-full h-full p-8">
        <img 
          src={item.imageUrl} 
          alt={item.name}
          className="w-full h-full object-contain transition-transform duration-1000 ease-out group-hover:scale-110" 
        />
      </div>

      {/* İKONLAR PANELI (DOCK) */}
      <div className="absolute top-6 right-6 flex flex-col gap-3 z-30">
        {[
          { icon: <FiSearch />, action: () => handleOpenQuickView(item.id), delay: "delay-100" },
          { icon: <FiHeart />, action: () => addToWishlist(item), delay: "delay-200" },
          { icon: <FiShoppingCart />, action: () => addToCart(item), delay: "delay-300" }
        ].map((btn, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              btn.action();
            }}
            // Mobildə həmişə görünür, Desktopda (xl) hover olanda çıxır
            className={`
              w-10 h-10 md:w-12 md:h-12 
              bg-white/90 
              rounded-full flex items-center justify-center 
              text-gray-800 shadow-xl border border-gray-100 
              cursor-pointer transition-all duration-400
              /* Animasiya: XL ölçüdə gizlədirik, hoverdə gətiririk */
              opacity-100 translate-x-0 
              xl:opacity-0 xl:translate-x-10 
              xl:group-hover:opacity-100 xl:group-hover:translate-x-0 
              ${btn.delay} 
              hover:bg-black hover:text-white 
            ` }
          >
            {btn.icon}
          </button>
        ))}
      </div>

      {/* SALE/NEW TAG */}
      {item.isNew && (
        <div className="absolute top-6 left-6 z-20">
          <span className="bg-black text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">New</span>
        </div>
      )}
    </div>

    {/* PRODUCT INFO */}
    <div className="mt-6 text-center">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[3px]">{item.brand}</p>
      <div >
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight mt-1 hover:text-[#81d8d0] transition-colors">{item.name}</h4>
      </div>
       <div className="flex justify-center items-center gap-3 font-[Jost]">
                {item.discountPrice && item.discountPrice > 0  ? (
                  // Ehtimal 1: Endirim VARSA
                  <>
                    {/* Yeni qiymət (Endirimli) */}
                    <span className="text-[#81d8d0] text-sm font-black">
                      {item.discountPrice}{" "}AZN
                    </span>

                    {/* Köhnə qiymət (Üstü xətli) */}
                    <span className="line-through text-[11px] text-gray-400">
                      {item.price} AZN
                    </span>
                  </>
                ) : (
                  // Ehtimal 2: Endirim YOXDURSA (Yalnız normal qiymət)
                  <span className="text-gray-900 text-sm font-black">
                    {item.price} AZN
                  </span>
                )}
              </div>
    </div>
  </motion.div>
))}
  </motion.div>

  {/* VIEW ALL BUTTON (Fluid transition) */}
  <div className="mt-20 flex justify-center">
    <Link to="/products" className="group flex items-center gap-4 text-xs font-black uppercase tracking-[4px] hover:text-[#81d8d0] transition-colors duration-500">
      Browse all Masterpieces
      <div className="w-10 h-[2px] bg-black group-hover:bg-[#81d8d0] group-hover:w-20 transition-all duration-500" />
    </Link>
  </div>
</section>

      {/* --- SECTION 4: STORY BANNER (Parallax-ish) --- */}
      <section className="py-24 bg-stone-900 text-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden">
               <img src={img13} className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#81d8d0] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          </motion.div>

          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter font-[Playfair]">Crafting <br/> Memories in <br/> a Bottle.</h2>
            <p className="text-gray-400 text-lg italic font-light leading-relaxed">
              "A perfume is like a piece of clothing, a message, a way of presenting oneself, a costume that according to the person who wears it."
            </p>
            <button className="flex items-center gap-4 group text-xs font-black uppercase tracking-[4px]">
              Discover Our Story <div className="w-12 h-[1px] bg-white group-hover:w-20 transition-all" />
            </button>
          </div>
        </div>
      </section>

      <QuickModal show={showModal} setShowModal={setShowModal} productId={selectedProductId} />
    </div>
  );
};

export default Home;