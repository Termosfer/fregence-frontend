import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { useWishlist } from "../hooks/useWishlist";
import { FiHeart, FiSearch, FiShoppingCart } from "react-icons/fi";
import QuickModal from "./QuickModal";
import type { Perfume } from "../types/perfume";

const Recomendation = () => {
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { wishlist, addToWishlist } = useWishlist();

  // 1. Ümumi məhsul siyahısını çəkirik (məsələn ilk 20 məhsul)
  const { data: allProducts = [], isLoading } = useQuery<Perfume[]>({
    queryKey: ["all-perfumes-rec"],
    queryFn: async () => {
      const res = await api.get("/perfumes?size=20");
      return res.data.content; // PageResponse formatında olduğu üçün content-i götürürük
    },
  });

  // 2. MƏNTİQ: Favoritlərdə olan məhsulları ümumi siyahıdan çıxarırıq
  // Beləliklə, aşağıda heç vaxt eyni məhsul təkrarlanmır
  const filteredProducts = allProducts.filter(
    (product) => !wishlist.some((wishItem) => wishItem.id === product.id)
  );

  // Responsive slider ölçüləri
  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else if (window.innerWidth < 1280) setVisibleCount(3);
      else setVisibleCount(4);
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const maxIndex = Math.max(0, filteredProducts.length - visibleCount);
  const translateValue = (index * 100) / visibleCount;

  if (isLoading) return <div className="py-10 text-center animate-pulse">Yeni ətirlər axtarılır...</div>;
  if (filteredProducts.length === 0) return null;

  return (
    <section className="py-12 md:py-16 font-[Playfair]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-10">
          You May Also Like
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => setIndex((p) => Math.max(0, p - 1))}
            disabled={index === 0}
            className="p-2 border border-gray-200 rounded-full disabled:opacity-20 cursor-pointer hover:bg-black hover:text-white transition-all duration-300"
          >
            <MdOutlineKeyboardArrowLeft size={24} />
          </button>
          <button
            onClick={() => setIndex((p) => Math.min(maxIndex, p + 1))}
            disabled={index >= maxIndex}
            className="p-2 border border-gray-200 rounded-full disabled:opacity-20 cursor-pointer hover:bg-black hover:text-white transition-all duration-300"
          >
            <MdOutlineKeyboardArrowRight size={24} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${translateValue}%)` }}
        >
          {filteredProducts.map((product) => (
            <div key={product.id} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-3">
              <div className="relative overflow-hidden group img-hover-effect bg-white p-6 shadow-sm rounded-xl border border-gray-50 flex flex-col items-center">
                <div className="w-full aspect-[4/5] overflow-hidden flex items-center justify-center">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="shopIconContainer">
                  <div className="loginStyle1" onClick={() => { setSelectedId(product.id); setShowModal(true); }}>
                    <FiSearch size={18} />
                    <div className="loginHover1 text-[10px]">Quickview</div>
                  </div>
                  <div className="loginStyle1" onClick={() => addToWishlist(product)}>
                    <FiHeart size={18} />
                    <div className="loginHover1 text-[10px]">Wishlist</div>
                  </div>
                  <div className="loginStyle1">
                    <FiShoppingCart size={18} />
                    <div className="loginHover1 text-[10px]">Add to Cart</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 text-center px-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{product.brand}</p>
                <h5 className="text-sm md:text-base font-bold mb-2 truncate text-gray-800">{product.name}</h5>
                <p className="text-[#81d8d0] font-bold text-lg">{product.price}.00 AZN</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <QuickModal show={showModal} setShowModal={setShowModal} productId={selectedId} />
    </section>
  );
};

export default Recomendation;