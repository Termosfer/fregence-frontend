import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import type { BrandGroup, PageResponse, Perfume } from "../../types/perfume";
import "./shops.css";

// API funksiyası
const fetchPerfumes = async (page = 0): Promise<PageResponse<Perfume>> => {
  const response = await api.get<PageResponse<Perfume>>(
    `/perfumes?page=${page}&size=50`,
  );
  return response.data;
};

const Shops = () => {
  const { data, isLoading, isError, error } = useQuery<PageResponse<Perfume>>({
    queryKey: ["perfumes"],
    queryFn: () => fetchPerfumes(0),
  });

  if (isLoading)
    return <div className="text-center py-20 text-xl font-bold animate-pulse uppercase tracking-widest">
        Yüklənir...
      </div>;

  if (isError) {
    return (
      <div className="text-red-500 text-center py-20">
        Xəta: {(error as Error).message}
      </div>
    );
  }
  console.log(data);

  const brandStats =
    data?.content.reduce((acc: Record<string, BrandGroup>, product) => {
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
  console.log(brandsArray);
  return (
    <div className="py-10 px-4 sm:px-8 lg:px-20">
      <div className="text-center ">
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter font-[Playfair]">
          All Collections
        </h1>
        <p className="text-sm  text-[#00000080] max-w-[450px] lg:max-w-[700px] mx-auto">
          Our new cozy collection is made with environmentally friendly
          materials and simple to care for so you can stay cozy wherever.
        </p>
      </div>
      <div
        className="flex justify-center
        items-center flex-wrap gap-10  mt-10  mx-auto  "
      >
        {brandsArray.map((brands) => (
          <div
            key={brands.name}
            className="shadow-lg rounded-xl relative rounded-xl overflow-hidden group w-full
    sm:w-[45%]
    lg:w-[30%]
    2xl:w-[23%] "
          >
            <img
              src={brands.mainImage}
              alt={brands.name}
              loading="lazy"
              className="
        w-full h-[400px]  lg:h-[420px] 2xl:h-[420px]
        object-contain rounded-xl
        transition-transform duration-500
        group-hover:scale-110
      "
            />
            <div
              className="
        absolute bottom-6 left-1/2 -translate-x-1/2
        w-[85%]
        p-5
        bg-white/80 backdrop-blur-md
        rounded-lg shadow-lg
        text-center cursor-pointer
        transition-all duration-300
        group-hover:translate-y-[-4px]
      "
            >
              <h1 className="text-md  2xl:text-lg font-semibold">
                {brands.name}
              </h1>
              <p className="text-xs 2xl:text-sm text-gray-600">
                ({brands.count} Products)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shops;
