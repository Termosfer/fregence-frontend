import { IoMdClose } from "react-icons/io";
import { FiMinus, FiPlus, FiLoader, FiShoppingBag, FiCheck } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import type { Perfume } from "../types/perfume";
import { useCart } from "../hooks/useCart";
import { toast } from "react-toastify";

interface QuickModalProps {
  show: boolean;
  setShowModal: (open: boolean) => void;
  productId: number | null;
}

const QuickModal = ({ show, setShowModal, productId }: QuickModalProps) => {
  const { cartItems, updateQuantity, isUpdating, updatingVariables } = useCart();
  const [localCount, setLocalCount] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: "50%", y: "50%" });

  const itemInCart = cartItems.find((item) => item.perfumeId === productId);

  const { data: product, isLoading, isError } = useQuery<Perfume>({
    queryKey: ["product-detail", productId],
    queryFn: async () => {
      const response = await api.get<Perfume>(`/perfumes/${productId}`);
      return response.data;
    },
    enabled: !!productId && show,
  });

  useEffect(() => {
    if (show) {
      setLocalCount(itemInCart ? itemInCart.quantity : 1);
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [show, itemInCart]);

  if (!show) return null;

  const handleQtyChange = (delta: number) => {
    const nextCount = localCount + delta;
    if (nextCount < 1) return;
    setLocalCount(nextCount);
    if (itemInCart && productId) {
      updateQuantity({ perfumeId: productId, quantity: delta });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return; // Mobildə zoom-u deaktiv edirik
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x: `${x}%`, y: `${y}%` });
  };

  const isThisItemUpdating = isUpdating && updatingVariables?.perfumeId === productId;
const handleMainAction  = () => {
  // 1. TOKEN YOXLANIŞI
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please log in first!"); // Giriş edilməyibsə bu mesaj çıxacaq
    return; // Funksiyanı burada dayandırır, aşağıdakı add-to-cart işləmir
  }

  // 2. ƏGƏR GİRİŞ EDİLİBSƏ MƏHSULU ƏLAVƏ ET
  if (product && !itemInCart) {
    // Sənin useCart hook-unda yazdığımız updateQuantity-ni çağırırıq
    // 'isNew: true' göndəririk ki, useCart-dakı onSuccess tosteri göstərsin
    updateQuantity({ 
      perfumeId: product.id, 
      quantity: localCount, 
      isNew: true 
    }); 
  } else {
    // Artıq səbətdədirsə bağla
    setShowModal(false);
  }
};
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Overlay */}
      <div 
        onClick={() => setShowModal(false)} 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-500" 
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-5xl max-h-[95dvh] lg:max-h-[85dvh] flex flex-col lg:flex-row rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden font-[Playfair] animate-in fade-in zoom-in duration-300">
        
        {/* Close Button - Mobildə daha görünən və asan kliklənən */}
        <button 
          onClick={() => setShowModal(false)} 
          className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full bg-white/90 text-black hover:bg-black hover:text-white hover:rotate-180  transition-all duration-300 z-50 shadow-lg cursor-pointer border border-gray-100"
        >
          <IoMdClose size={20} />
        </button>

        {isLoading ? (
          <div className="w-full h-[400px] flex flex-col items-center justify-center gap-4 bg-white">
            <FiLoader className="animate-spin text-gray-300" size={40} />
            <p className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">Essence Loading...</p>
          </div>
        ) : isError || !product ? (
          <div className="w-full h-[400px] flex items-center justify-center text-gray-400 bg-white">Unable to load product.</div>
        ) : (
          <>
            {/* LEFT: IMAGE SECTION - Mobildə hündürlüyü məhdudlaşdırırıq */}
            <div 
              className="w-full lg:w-[50%] h-[280px] sm:h-[350px] md:h-[400px] lg:h-auto overflow-hidden bg-[#FAFAFA] flex items-center justify-center p-6 md:p-12 relative flex-shrink-0"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  transformOrigin: `${origin.x} ${origin.y}`,
                  transform: zoom ? "scale(1.6)" : "scale(1)",
                }}
                className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out drop-shadow-2xl"
              />
              
              {product.isNew && (
                <span className="absolute top-6 left-6 bg-black text-white text-[9px] font-black px-3 py-1 rounded-full tracking-widest">NEW</span>
              )}
            </div>

            {/* RIGHT: CONTENT SECTION - Mobildə öz daxilində skrol olmalıdır */}
            <div className="w-full lg:w-[50%] p-6 sm:p-8 md:p-12 overflow-y-auto bg-white flex flex-col custom-scrollbar">
              <div className="border-b border-gray-100 pb-6 md:pb-8">
                <p className="text-[10px] md:text-[11px] text-[#81d8d0] font-black uppercase tracking-[3px] mb-2">{product.brand}</p>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight tracking-tighter uppercase mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4">
                  <span className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tighter">
                    {product.price}.00 AZN
                  </span>
                  {product.discountPrice && (
                    <span className="line-through text-gray-400 text-base md:text-lg">
                      {product.discountPrice}.00 AZN
                    </span>
                  )}
                </div>
              </div>

              <div className="py-6 md:py-8 space-y-6 flex-1">
                <p className="text-gray-500 leading-relaxed italic text-sm md:text-base">
                  "{product.description}"
                </p>
                
                {/* ML & Gender grid */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                   <div className="bg-gray-50 p-3 md:p-4 rounded-xl border border-gray-100">
                      <span className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Volume</span>
                      <span className="text-xs md:text-sm font-bold text-gray-800">{product.ml} ML</span>
                   </div>
                   <div className="bg-gray-50 p-3 md:p-4 rounded-xl border border-gray-100">
                      <span className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Gender</span>
                      <span className="text-xs md:text-sm font-bold text-gray-800 uppercase tracking-tighter">{product.gender}</span>
                   </div>
                </div>
              </div>

              {/* STICKY-LIKE ACTION BAR: Mobildə rahat klikləmək üçün alt hissə */}
              <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 mt-6 md:mt-auto pt-6 border-t border-gray-100">
                
                {/* Quantity Controls */}
                <div className="flex items-center justify-between border border-gray-200 px-4 py-3 md:px-6 md:py-4 rounded-full w-full sm:w-auto sm:min-w-[140px] bg-white shadow-sm">
                  <button 
                    onClick={() => handleQtyChange(-1)} 
                    disabled={isThisItemUpdating}
                    className="cursor-pointer text-gray-400 hover:text-black transition-colors"
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className={`font-bold text-base md:text-lg w-8 text-center tabular-nums ${isThisItemUpdating ? "animate-pulse text-[#81d8d0]" : "text-gray-800"}`}>
                    {localCount}
                  </span>
                  <button 
                    onClick={() => handleQtyChange(1)} 
                    disabled={isThisItemUpdating}
                    className="cursor-pointer text-gray-400 hover:text-black transition-colors"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>

                {/* Main Action Button */}
                <button 
                  onClick={handleMainAction}
                  disabled={isThisItemUpdating}
                  className={`flex-1 w-full h-[56px] py-3  md:h-[64px] rounded-full font-bold uppercase tracking-[2px] md:tracking-[3px] text-[10px] transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer
                    ${itemInCart ? "bg-teal-500 text-white" : "bg-black text-white hover:bg-gray-800 active:scale-95 disabled:bg-gray-200"}`}
                >
                  {isThisItemUpdating ? (
                    <FiLoader className="animate-spin" size={18} />
                  ) : itemInCart ? (
                    <><FiCheck size={18} /> Already in Cart</>
                  ) : (
                    <><FiShoppingBag size={18} /> Add to Cart</>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuickModal;