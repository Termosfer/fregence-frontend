import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import type { BrandGroup, PageResponse, Perfume } from "../../types/perfume";
import { FiArrowRight } from "react-icons/fi";

// Bütün brendləri analiz etmək üçün böyük ölçüdə data çəkirik
const fetchAllForBrands = async (): Promise<PageResponse<Perfume>> => {
  const response = await api.get<PageResponse<Perfume>>(`/perfumes?size=100`);
  return response.data;
};

const Shops = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery<PageResponse<Perfume>>({
    queryKey: ["all-perfumes-for-shops"],
    queryFn: fetchAllForBrands,
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center animate-pulse">
        <h2 className="text-xl font-bold uppercase tracking-[4px] text-gray-400">Loading Collections...</h2>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center text-red-500 font-bold">
        Error loading collections. Please try again later.
      </div>
    );
  }

  // Məhsulları brendlərə görə qruplaşdıran məntiq
  const brandStats = data?.content.reduce((acc: Record<string, BrandGroup>, product) => {
    const brandName = product.brand;
    if (!acc[brandName]) {
      acc[brandName] = {
        name: brandName,
        count: 0,
        mainImage: product.imageUrl, // Brendin ilk məhsulunun şəkli
        products: [],
      };
    }
    acc[brandName].count += 1;
    acc[brandName].products.push(product.name);
    return acc;
  }, {}) || {};

  const brandsArray = Object.values(brandStats);

  return (
    <div className="py-16 px-4 sm:px-8 lg:px-20 font-[Playfair] bg-[#fafafa] min-h-screen">
      {/* HEADER SECTION */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-gray-900 mb-4">
          All Collections
        </h1>
        <div className="w-20 h-1 bg-[#81d8d0] mx-auto mb-6"></div>
        <p className="text-gray-500 leading-relaxed italic">
          Explore our curated world of luxury fragrances. From timeless classics to modern niche essences, 
          discover the perfect brand that resonates with your character.
        </p>
      </div>

      {/* BRANDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {brandsArray.map((brand) => (
          <div
            key={brand.name}
            onClick={() => navigate(`/products?brand=${encodeURIComponent(brand.name)}`)}
            className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100"
          >
            {/* Image Container */}
            <div className="aspect-[3/4] overflow-hidden bg-gray-50 p-6 flex items-center justify-center">
              <img
                src={brand.mainImage}
                alt={brand.name}
                loading="lazy"
                className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] transition-all duration-500">
               <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/50 text-center transform group-hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-lg font-bold text-gray-800 uppercase tracking-widest mb-1">
                    {brand.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {brand.count} Fragrances
                    </span>
                    <FiArrowRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-[#81d8d0]" />
                  </div>
               </div>
            </div>

            {/* Badge */}
            <div className="absolute top-4 left-6">
                <span className="bg-black text-white text-[9px] font-black px-3 py-1 rounded-full tracking-[2px] uppercase">
                    Premium
                </span>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE (Əgər heç nə tapılmasa) */}
      {brandsArray.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          No collections found at the moment.
        </div>
      )}
    </div>
  );
};

export default Shops;