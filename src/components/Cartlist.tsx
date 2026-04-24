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
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const { addToWishlist } = useWishlist();
  const { addToCart } = useCart();
  const handleOpenQuickView = (id: number) => {
    setSelectedProductId(id);
    setShowModal(true);
  };

  // Mürəkkəb Pagination Məntiqi (Həmişə İlk, Son və Cari ətrafını göstərir)
  const getPaginationRange = () => {
    const total = data?.totalPages || 0;
    const current = data?.number || 0;
    const range: (number | string)[] = [];

    // Əgər səhifə sayı 7-dən azdırsa, hamısını göstər (üç nöqtəyə ehtiyac yoxdur)
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i);
    }

    // 1. Həmişə ilk səhifəni əlavə et
    range.push(0);

    // Sol tərəfdə üç nöqtə lazımdırsa
    if (current > 2) {
      range.push("...");
    }

    // 2. Cari səhifənin ətrafındakı rəqəmlər (Current - 1, Current, Current + 1)
    const start = Math.max(1, current - 1);
    const end = Math.min(total - 2, current + 1);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Sağ tərəfdə üç nöqtə lazımdırsa
    if (current < total - 3) {
      range.push("...");
    }

    // 3. Həmişə sonuncu səhifəni əlavə et
    range.push(total - 1);

    return range;
  };
  if (!data || !data.content) {
    return (
      <div className="text-center py-10 w-full font-bold">
        Məhsul yüklənir və ya tapılmadı...
      </div>
    );
  }

  return (
    <>
      <div
        className="
          grid gap-10
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          2xl:grid-cols-4
          
        "
      >
        {data?.content?.map((item) => (
          <div
            key={item.id}
            className=" relative overflow-hidden flex flex-col items-center justify-between text-center group shadow-lg rounded-lg p-4 bg-white"
          >
            <div className=" w-full aspect-square  overflow-hidden img-hover-effect ">
              <img
                src={item.imageUrl}
                alt={item.name}
                loading="lazy"
                className="object-cover w-full h-full "
              />

              <span className="absolute top-3 -right-14 bg-red-500 text-white text-xs font-semibold px-16 py-1 rotate-45 shadow-lg">
                SALE
              </span>

              <div
                className="
  absolute bottom-20 left-1/2 transform -translate-x-1/2 
  flex items-center justify-center gap-4
  transition-all duration-500

  opacity-100 translate-y-0
  xl:opacity-0 xl:translate-y-40
xl:group-hover:opacity-100 xl:group-hover:translate-y-0
"
              >
                <div
                  className="group relative inline-flex items-center justify-center w-[40px] h-[40px] md:w-[50px] md:h-[50px] bg-white rounded-full shadow-lg cursor-pointer hover:bg-black hover:text-white transition-colors duration-500"
                  onClick={() => handleOpenQuickView(item.id)}
                >
                  <FiSearch className="w-3 h-3 md:w-4 md:h-4 " />
                  
                </div>

                <div
                  className="group relative inline-flex items-center justify-center w-[40px] h-[40px] md:w-[50px] md:h-[50px] bg-white rounded-full shadow-lg cursor-pointer hover:bg-black hover:text-white transition-colors duration-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToWishlist(item);
                  }}
                >
                  <FiHeart className="w-3 h-3 md:w-4 md:h-4" />
                  
                </div>

                <div
                  className=" group relative inline-flex items-center justify-center w-[40px] h-[40px] md:w-[50px] md:h-[50px] bg-white rounded-full shadow-lg cursor-pointer hover:bg-black hover:text-white transition-colors duration-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item);
                  }}
                >
                  <FiShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
                  
                </div>
              </div>
            </div>
            <div className="mt-5">
              <h5 className="text-base font-semibold mb-2">{item.name}</h5>
              <div className="flex justify-center items-center gap-3 font-[Jost]">
                <span className="text-[#81d8d0] text-base font-semibold">
                  {item.price}<span className="text-xs">.00 Azn</span>
                </span>
                {item.discountPrice && (
                  <span className="line-through text-xs text-gray-500">
                    {item.discountPrice}.00 Azn
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <QuickModal
        show={showModal}
        setShowModal={setShowModal}
        productId={selectedProductId}
      />

      <div className="flex justify-center items-center gap-2 mt-14 flex-wrap">
        {getPaginationRange().map((p, index) => {
          if (p === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="px-3 py-2 text-gray-400 font-bold"
              >
                ...
              </span>
            );
          }

          const isActive = page === p;

          return (
            <button
              key={`page-${p}`}
              onClick={() => {
                onPageChange(p as number);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`
          w-10 h-10 border rounded-md transition-all duration-300 cursor-pointer font-bold text-sm
          ${
            isActive
              ? "bg-black text-white border-black scale-110 shadow-lg"
              : "bg-white text-black border-gray-200 hover:border-black hover:bg-gray-50"
          }
        `}
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
