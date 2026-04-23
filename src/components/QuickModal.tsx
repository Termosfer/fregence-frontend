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
  // Hooks
  const { cartItems, updateQuantity, isUpdating, updatingVariables } = useCart();
  
  // Local States
  const [localCount, setLocalCount] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: "50%", y: "50%" });

  // 1. Səbətdə bu məhsulun olub-olmadığını yoxlayırıq
  const itemInCart = cartItems.find((item) => item.perfumeId === productId);

  // 2. Məhsul detallarını API-dan çəkirik
  const { data: product, isLoading, isError } = useQuery<Perfume>({
    queryKey: ["product-detail", productId],
    queryFn: async () => {
      const response = await api.get<Perfume>(`/perfumes/${productId}`);
      return response.data;
    },
    enabled: !!productId && show,
    staleTime: 1000 * 60 * 5, // 5 dəqiqəlik keş
  });

  // 3. Modal hər açılanda rəqəmi sinxronlaşdırırıq
  useEffect(() => {
    if (show) {
      if (itemInCart) {
        setLocalCount(itemInCart.quantity);
      } else {
        setLocalCount(1);
      }
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show, itemInCart]);

  if (!show) return null;

  // 4. Sayı Dəyişmə Məntiqi (Canlı Səbət Bağlantısı ilə)
  const handleQtyChange = (delta: number) => {
    const nextCount = localCount + delta;
    if (nextCount < 1) return;

    setLocalCount(nextCount);

    // Əgər məhsul artıq səbətdədirsə, birbaşa backend-i yeniləyirik
    if (itemInCart && productId) {
      updateQuantity({ perfumeId: productId, quantity: delta });
    }
  };

  // 5. Səbətə Əlavə Et (Əgər ilk dəfə əlavə olunursa)
  const handleMainAction = () => {
    if (product && !itemInCart) {
      // Seçilmiş say qədər səbətə göndər
      updateQuantity({ perfumeId: product.id, quantity: localCount });
      toast.success(`${product.name} added to bag`);
    } else {
      // Artıq səbətdədirsə modalı bağla və ya istifadəçini səbətə yönləndir
      setShowModal(false);
    }
  };

  const isThisItemUpdating = isUpdating && updatingVariables?.perfumeId === productId;

  // Zoom Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x: `${x}%`, y: `${y}%` });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        onClick={() => setShowModal(false)} 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500" 
      />

      <div className="relative bg-white w-full max-w-5xl max-h-[90dvh] flex flex-col lg:flex-row rounded-[2.5rem] shadow-2xl overflow-hidden font-[Playfair] animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={() => setShowModal(false)} 
          className="absolute top-6 right-6 p-2 rounded-full bg-white/90 hover:bg-black hover:text-white hover:rotate-180  transition-all  duration-300  z-20  cursor-pointer"
        >
          <IoMdClose size={22} />
        </button>

        {isLoading ? (
          <div className="w-full h-[500px] flex flex-col items-center justify-center gap-4">
            <FiLoader className="animate-spin text-gray-300" size={40} />
            <p className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">Fetching Essence...</p>
          </div>
        ) : isError || !product ? (
          <div className="w-full h-[500px] flex items-center justify-center text-gray-400">Failed to load product.</div>
        ) : (
          <>
            {/* LEFT: IMAGE & ZOOM */}
            <div 
              className="w-full lg:w-[55%] h-[350px] sm:h-[450px] lg:h-auto overflow-hidden lg:cursor-zoom-in bg-[#FAFAFA] flex items-center justify-center p-12"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  transformOrigin: `${origin.x} ${origin.y}`,
                  transform: zoom ? "scale(1.8)" : "scale(1)",
                }}
                className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out"
              />
            </div>

            {/* RIGHT: CONTENT */}
            <div className="w-full lg:w-[45%] p-8 sm:p-12 overflow-y-auto bg-white flex flex-col">
              <div className="border-b border-gray-100 pb-8">
                <p className="text-[11px] text-[#81d8d0] font-black uppercase tracking-[4px] mb-3">{product.brand}</p>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight tracking-tighter uppercase">{product.name}</h1>
                
                <div className="flex items-center gap-5 mt-6">
                  <span className="text-3xl font-bold text-gray-800 tracking-tighter">
                    {product.price}.00 AZN
                  </span>
                  {product.discountPrice && (
                    <span className="line-through text-gray-400 text-lg">
                      {product.discountPrice}.00 AZN
                    </span>
                  )}
                </div>
              </div>

              <div className="py-8 space-y-6 flex-1">
                <p className="text-gray-500 leading-relaxed italic text-base">
                  "{product.description}"
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Volume</span>
                      <span className="text-sm font-bold text-gray-800">{product.ml} ML</span>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Cins</span>
                      <span className="text-sm font-bold text-gray-800 uppercase tracking-tighter">{product.gender}</span>
                   </div>
                </div>
              </div>

              {/* ACTION: QTY & BUTTON */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto pt-8 border-t border-gray-50">
                
                {/* Quantity Switcher */}
                <div className="flex items-center justify-between border border-gray-200 px-6 py-4 rounded-full min-w-[150px] bg-white shadow-sm">
                  <button 
                    onClick={() => handleQtyChange(-1)} 
                    disabled={isThisItemUpdating}
                    className="cursor-pointer text-gray-400 hover:text-black transition-colors p-1"
                  >
                    <FiMinus size={18} />
                  </button>
                  <span className={`font-bold text-xl w-8 text-center tabular-nums ${isThisItemUpdating ? "animate-pulse text-[#81d8d0]" : "text-gray-800"}`}>
                    {localCount}
                  </span>
                  <button 
                    onClick={() => handleQtyChange(1)} 
                    disabled={isThisItemUpdating}
                    className="cursor-pointer text-gray-400 hover:text-black transition-colors p-1"
                  >
                    <FiPlus size={18} />
                  </button>
                </div>

                {/* CTA Button */}
                <button 
                  onClick={handleMainAction}
                  disabled={isThisItemUpdating}
                  className={`flex-1 w-full h-[64px] rounded-full font-bold uppercase tracking-[3px] text-[11px] transition-all shadow-xl flex items-center justify-center gap-3 cursor-pointer
                    ${itemInCart ? "bg-teal-500 text-white hover:bg-teal-600" : "bg-black text-white hover:bg-gray-800 active:scale-95"}`}
                >
                  {isThisItemUpdating ? (
                    <FiLoader className="animate-spin" size={20} />
                  ) : itemInCart ? (
                    <><FiCheck size={20} /> In Your Bag</>
                  ) : (
                    <><FiShoppingBag size={20} /> Add to Bag</>
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