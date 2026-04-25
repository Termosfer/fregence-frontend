import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import type { BrandGroup, PageResponse, Perfume } from "../../types/perfume";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion"; // Animasiyalı giriş üçün

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

  // Məhsulları brendlərə görə qruplaşdıran məntiq
  const brandStats = data?.content.reduce((acc: Record<string, BrandGroup>, product) => {
    const brandName = product.brand;
    if (!acc[brandName]) {
      acc[brandName] = {
        name: brandName,
        count: 0,
        mainImage: product.imageUrl,
        products: [],
      };
    }
    acc[brandName].count += 1;
    acc[brandName].products.push(product.name);
    return acc;
  }, {}) || {};

  const brandsArray = Object.values(brandStats);

  if (isError) {
    return (
      <div className="py-40 text-center text-red-500 font-bold font-[Playfair]">
        <h2 className="text-2xl uppercase">Connection Error</h2>
        <p className="text-gray-400 mt-2 font-light italic">Please check your internet connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 sm:px-8 lg:px-20 font-[Playfair] bg-[#fafafa] min-h-screen">
      {/* HEADER SECTION - Həmişə görünür (Footer yuxarı qaçmır) */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-gray-900 mb-4">
          All Collections
        </h1>
        <div className="w-20 h-1 bg-[#81d8d0] mx-auto mb-6"></div>
        <p className="text-gray-500 leading-relaxed italic text-sm md:text-base">
          Explore our curated world of luxury fragrances. From timeless classics to modern niche essences, 
          discover the perfect brand that resonates with your character.
        </p>
      </div>

      {/* BRANDS GRID - Skeleton və Real kartlar buradadır */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto min-h-[400px]">
        {isLoading ? (
          /* SKELETON LOADING - Dizaynı qoruyur */
          [...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="relative aspect-[3/4] bg-white rounded-[2rem] border border-gray-100 p-6 flex flex-col items-center justify-between shadow-sm"
            >
              {/* Şəkil yeri üçün daxili skelet */}
              <div className="w-full h-2/3 bg-gray-50 rounded-2xl animate-pulse"></div>
              
              {/* Yazı yeri üçün alt hissə */}
              <div className="w-[85%] h-16 bg-gray-50 rounded-2xl mt-4 animate-pulse relative">
                <div className="absolute inset-x-4 top-4 h-3 bg-gray-100 rounded-full w-1/2 mx-auto"></div>
                <div className="absolute inset-x-4 bottom-4 h-2 bg-gray-100 rounded-full w-1/3 mx-auto"></div>
              </div>
            </div>
          ))
        ) : (
          /* REAL CARDS */
          brandsArray.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/products?brand=${encodeURIComponent(brand.name)}`)}
              className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100"
            >
              {/* Image Container */}
              <div className="aspect-[3/4] overflow-hidden bg-gray-50 p-6 flex items-center justify-center">
                <img
                  src={brand.mainImage}
                  alt={brand.name}
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

              <div className="absolute top-4 left-6">
                  <span className="bg-black text-white text-[9px] font-black px-3 py-1 rounded-full tracking-[2px] uppercase">
                      Premium
                  </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* EMPTY STATE */}
      {!isLoading && brandsArray.length === 0 && (
        <div className="py-20 text-center text-gray-400 italic font-light animate-fade-in">
          No collections found at the moment.
        </div>
      )}
    </div>
  );
};

export default Shops;