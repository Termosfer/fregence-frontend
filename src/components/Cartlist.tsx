import { FiHeart, FiSearch, FiShoppingCart } from "react-icons/fi";
import { useState } from "react";
import QuickModal from "./QuickModal";
import type { PageResponse, Perfume } from "../types/perfume";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";

interface CartlistProps {
  data: PageResponse<Perfume>;
  onPageChange: (page: number) => void;
  page: number;
}

const Cartlist = ({ data, onPageChange, page }: CartlistProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  
  const { addToWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleOpenQuickView = (id: number) => {
    setSelectedProductId(id);
    setShowModal(true);
  };

  const getPaginationRange = () => {
    const total = data?.totalPages || 0;
    const current = data?.number || 0;
    const range: (number | string)[] = [];
    if (total <= 7) return Array.from({ length: total }, (_, i) => i);
    range.push(0);
    if (current > 2) range.push("...");
    const start = Math.max(1, current - 1);
    const end = Math.min(total - 2, current + 1);
    for (let i = start; i <= end; i++) range.push(i);
    if (current < total - 3) range.push("...");
    range.push(total - 1);
    return range;
  };

  if (!data || !data.content) return null;

  return (
    <>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
        {data.content.map((item) => (
          <div
            key={item.id}
            className="relative flex flex-col items-center justify-between text-center group shadow-md rounded-xl p-4 bg-white hover:shadow-xl transition-all duration-500 h-full border border-gray-50"
          >
            {/* ŞƏKİL SAHƏSİ */}
            <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-white flex items-center justify-center">
              <div className="block w-full h-full p-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                  className="object-contain w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <span className="absolute top-2 -right-10 bg-red-500 text-white text-[10px] font-black px-10 py-1 rotate-45 shadow-lg z-10 uppercase">
                Sale
              </span>

              {/* SIRA İLƏ SAĞDAN SOLA GƏLƏN İKONLAR */}
              <div className="absolute top-10 right-0 flex flex-col gap-4 p-1 z-20 overflow-hidden ">
                
                {/* 1. Quick View (Gecikməsiz) */}
                <button
                  onClick={(e) => { e.preventDefault(); handleOpenQuickView(item.id); }}
                  className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg border-none cursor-pointer hover:bg-black hover:text-white transition-all duration-500 translate-x-20 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 delay-0"
                >
                  <FiSearch size={16} />
                </button>

                {/* 2. Wishlist (75ms Gecikmə) */}
                <button
                  onClick={(e) => { e.stopPropagation(); addToWishlist(item); }}
                  className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg border-none cursor-pointer hover:bg-black hover:text-white transition-all duration-500 translate-x-20 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 delay-[75ms]"
                >
                  <FiHeart size={16} />
                </button>

                {/* 3. Add to Cart (150ms Gecikmə) */}
                <button
                  onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                  className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg border-none cursor-pointer hover:bg-black hover:text-white transition-all duration-500 translate-x-20 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 delay-[150ms]"
                >
                  <FiShoppingCart size={16} />
                </button>
              </div>
            </div>

            {/* MƏTN SAHƏSİ */}
            <div className="mt-4 w-full px-1">
              <h5 className="text-sm font-bold mb-1 text-gray-800 uppercase tracking-tight truncate px-2">
                {item.name}
              </h5>
              <div className="flex justify-center items-center gap-3 font-[Jost]">
                <span className="text-[#81d8d0] text-sm font-black">
                  {item.price}.00 <span className="text-[9px]">AZN</span>
                </span>
                {item.discountPrice && (
                  <span className="line-through text-[11px] text-gray-400">
                    {item.discountPrice}.00
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <QuickModal show={showModal} setShowModal={setShowModal} productId={selectedProductId} />

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-2 mt-16 mb-10">
        {getPaginationRange().map((p, index) => {
          if (p === "...") return <span key={index} className="text-gray-300 px-1">...</span>;
          const isActive = page === p;
          return (
            <button
              key={index}
              onClick={() => { onPageChange(p as number); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`w-9 h-9 border rounded-md transition-all duration-300 font-bold text-xs uppercase tracking-widest ${
                isActive ? "bg-black text-white border-black scale-105 shadow-md" : "bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black"
              }`}
            >
              {(p as number) + 1}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default Cartlist;