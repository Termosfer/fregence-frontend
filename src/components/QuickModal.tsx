import { IoMdClose } from "react-icons/io";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import type { Perfume } from "../types/perfume";

interface QuickModalProps {
  show: boolean;
  setShowModal: (open: boolean) => void;
  productId: number | null;
}

const QuickModal = ({ show, setShowModal, productId }: QuickModalProps) => {
  const [count, setCount] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState({ x: "50%", y: "50%" });

  
  const { data: product, isLoading, isError } = useQuery<Perfume>({
    queryKey: ["perfume", productId],
    queryFn: async () => {
      const response = await api.get<Perfume>(`/perfumes/${productId}`);
      return response.data;
    },
    enabled: !!productId && show, 
  });

  useEffect(() => {
    if (show) setCount(1); 
    document.body.style.overflow = show ? "hidden" : "auto";
  }, [show]);

  if (!show) return null;


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x: `${x}%`, y: `${y}%` });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 bg-white w-full sm:w-[90%] lg:w-[80%] max-w-[1200px] max-h-[90vh] flex flex-col lg:flex-row rounded-xl shadow-xl overflow-hidden animate-[scaleIn_0.25s_ease-out]">
        
        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-black hover:text-white transition-all z-20 hover:bg-black hover:text-white hover:rotate-180 transition-all duration-300 cursor-pointer">
          <IoMdClose className="text-xl " />
        </button>

        {isLoading ? (
          <div className="w-full h-64 flex items-center justify-center">Yüklənir...</div>
        ) : isError || !product ? (
          <div className="w-full h-64 flex items-center justify-center">Məlumat tapılmadı.</div>
        ) : (
          <>
            
            <div className="w-full lg:w-[55%] h-[300px] lg:h-auto overflow-hidden lg:cursor-zoom-in"
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
                className="w-full h-full object-contain transition-transform duration-300"
              />
            </div>

            
            <div className="w-full lg:w-[45%] p-8 overflow-y-auto text-left">
              <div className="border-b pb-4">
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <p className="text-gray-400 mt-1">{product.brand}</p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-2xl font-bold text-[#81d8d0]">{product.price}.00 AZN</span>
                  {product.discountPrice && (
                    <span className="line-through text-gray-400">{product.discountPrice}.00 AZN</span>
                  )}
                </div>
              </div>

              <p className="text-gray-600 mt-6 leading-relaxed">{product.description}</p>
              <p className="mt-2 font-semibold">Həcm: {product.ml} ml</p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <div className="flex items-center justify-between border rounded-xl px-4 py-3 min-w-[120px]">
                  <FiMinus onClick={() => setCount(c => Math.max(1, c - 1))} className="cursor-pointer" />
                  <span className="font-bold">{count}</span>
                  <FiPlus onClick={() => setCount(c => c + 1)} className="cursor-pointer" />
                </div>

                <button className="flex-1 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors py-4">
                  ADD TO CART
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