import { IoMdClose } from "react-icons/io";
import { FiMinus, FiPlus, FiLoader, FiShoppingBag, FiCheck } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import type { Perfume } from "../types/perfume"; // Variant tipini də əlavə etdik
import { useCart } from "../hooks/useCart";
import { toast } from "react-toastify";

interface QuickModalProps {
  show: boolean;
  setShowModal: (open: boolean) => void;
  productId: number | null;
}

const QuickModal = ({ show, setShowModal, productId }: QuickModalProps) => {
  const { cartItems, updateQuantity, isUpdating } = useCart();
  const [localCount, setLocalCount] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: "50%", y: "50%" });
  
  // SEÇİLMİŞ VARİANT STATE-İ
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

  const { data: product, isLoading, isError } = useQuery<Perfume>({
    queryKey: ["product-detail", productId],
    queryFn: async () => {
      const response = await api.get<Perfume>(`/perfumes/${productId}`);
      return response.data;
    },
    enabled: !!productId && show,
  });

  // Seçilmiş variantı tapırıq
  const currentVariant = product?.variants?.find(v => v.id === selectedVariantId) || product?.variants?.[0];
  
  // Səbətdə bu konkret variant varmı?
  const itemInCart = cartItems.find((item) => item.variantId === selectedVariantId);

  useEffect(() => {
    if (show && product) {
      // Modal açılanda backend-dən gələn default ml-i və ya ilk variantı seçirik
      const defaultVar = product.variants.find(v => v.ml === product.defaultMl) || product.variants[0];
      setSelectedVariantId(defaultVar.id);
    }
  }, [show, product]);

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
    
    // Stok yoxlanışı (opsional)
    if (currentVariant && nextCount > currentVariant.stock) {
        toast.warn(`Only ${currentVariant.stock} items available in stock`);
        return;
    }

    setLocalCount(nextCount);
    if (itemInCart && selectedVariantId) {
      updateQuantity({ variantId: selectedVariantId, quantity: delta });
    }
  };

  const handleMainAction = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first!");
      return;
    }

    if (currentVariant && !itemInCart) {
      updateQuantity({ 
        variantId: currentVariant.id, // ARTIQ variantId GÖNDƏRİRİİK
        quantity: localCount, 
        isNew: true 
      }); 
    } else {
      setShowModal(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x: `${x}%`, y: `${y}%` });
  };

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="relative bg-white w-full max-w-5xl max-h-[95dvh] lg:max-h-[85dvh] flex flex-col lg:flex-row rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden font-[Playfair]">
        
        <button aria-label="close" onClick={() => setShowModal(false)} className="cursor-pointer absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full bg-white/90 text-black hover:bg-black hover:rotate-360 hover:text-white z-50 shadow-lg border border-gray-100 transition-all duration-300">
          <IoMdClose size={20} />
        </button>

        {isLoading ? (
          <div className="w-full h-[400px] flex flex-col items-center justify-center gap-4 bg-white">
            <FiLoader className="animate-spin text-gray-300" size={40} />
            <p className="text-neutral uppercase tracking-widest text-[10px] font-bold">Essence Loading...</p>
          </div>
        ) : isError || !product ? (
          <div className="w-full h-[400px] flex items-center justify-center text-neutral bg-white">Unable to load product.</div>
        ) : (
          <>
            <div className="w-full lg:w-[50%] h-[280px] sm:h-[350px] md:h-[400px] lg:h-auto overflow-hidden bg-[#FAFAFA] flex items-center justify-center p-6 md:p-12 relative shrink-0"
              onMouseMove={handleMouseMove} onMouseEnter={() => setZoom(true)} onMouseLeave={() => setZoom(false)}>
              <img src={product?.imageUrl || undefined}  alt={product.name}
                style={{ transformOrigin: `${origin.x} ${origin.y}`, transform: zoom ? "scale(1.6)" : "scale(1)" }}
                className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out drop-shadow-2xl"
              />
            </div>

            <div className="w-full lg:w-[50%] p-6 sm:p-8 md:p-12 overflow-y-auto bg-white flex flex-col custom-scrollbar">
              <div className="border-b border-gray-100 pb-6 md:pb-8">
                <p className="text-[10px] md:text-[11px] text-[#81d8d0] font-black uppercase tracking-[3px] mb-2">{product.brand}</p>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight tracking-tighter uppercase mb-4">{product.name}</h1>
                
                {/* DİNAMİİK QİYMƏT SEÇİLMİŞ VARİANTA GÖRƏ */}
                <div className="flex items-center gap-3 font-[Jost]">
                  {currentVariant?.discountPrice && currentVariant.discountPrice > 0 ? (
                    <>
                      <span className="text-[#81d8d0] text-xl font-black">{currentVariant.discountPrice} AZN</span>
                      <span className="line-through text-sm text-neutral">{currentVariant.price} AZN</span>
                    </>
                  ) : (
                    <span className="text-gray-900 text-xl font-black">{currentVariant?.price} AZN</span>
                  )}
                </div>
              </div>

              <div className="py-6 md:py-8 space-y-6 flex-1">
                <p className="text-gray-500 leading-relaxed italic text-sm md:text-base">"{product.description}"</p>
                
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-neutral uppercase tracking-widest">Select Volume</span>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`cursor-pointer px-6 py-2 rounded-full text-xs font-bold transition-all border
                          ${selectedVariantId === v.id 
                            ? "bg-black text-white border-black" 
                            : "bg-white text-gray-600 border-gray-200 hover:border-black"}`}
                      >
                        {v.ml} ML
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                    <div>
                        <span className="text-[8px] font-black text-neutral uppercase tracking-widest block mb-1">Gender</span>
                        <span className="text-xs font-bold text-gray-800 uppercase">{product.gender}</span>
                    </div>
                    {currentVariant && currentVariant.stock <= 5 && (
                        <div className="text-right">
                             <span className="text-[8px] font-black text-red-500 uppercase tracking-widest block mb-1">Stock Status</span>
                             <span className="text-[10px] font-bold text-red-600">Only {currentVariant.stock} left!</span>
                        </div>
                    )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between border border-gray-200 px-6 py-4 rounded-full w-full sm:w-auto min-w-[140px] bg-white">
                  <button onClick={() => handleQtyChange(-1)} className="cursor-pointer text-neutral hover:text-black">
                    <FiMinus size={16} />
                  </button>
                  <span className="font-bold text-lg w-8 text-center tabular-nums text-gray-800">{localCount}</span>
                  <button onClick={() => handleQtyChange(1)} className="cursor-pointer text-neutral hover:text-black">
                    <FiPlus size={16} />
                  </button>
                </div>

                <button onClick={handleMainAction} disabled={isUpdating}
                  className={`flex-1 w-full h-16 rounded-full font-bold uppercase tracking-[3px] text-[10px] transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer
                    ${itemInCart ? "bg-teal-500 text-white" : "bg-black text-white hover:bg-gray-800"}`}
                >
                  {isUpdating ? <FiLoader className="animate-spin" size={18} /> : itemInCart ? <><FiCheck size={18} /> In Cart - Close</> : <><FiShoppingBag size={18} /> Add to Cart</>}
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