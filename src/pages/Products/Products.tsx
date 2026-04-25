import { useEffect, useState } from "react";
import {
  MdFilterList,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdKeyboardArrowUp,
} from "react-icons/md";
import Cartlist from "../../components/Cartlist";
import api from "../../api/axios";
import type { PageResponse, Perfume } from "../../types/perfume";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

const sortOptions = [
  { label: "Featured", sortBy: "id", direction: "DESC" },
  { label: "A-Z", sortBy: "name", direction: "ASC" },
  { label: "Z-A", sortBy: "name", direction: "DESC" },
  { label: "Price, low to high", sortBy: "price", direction: "ASC" },
  { label: "Price, high to low", sortBy: "price", direction: "DESC" },
];

const Products = () => {
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [sliderPrice, setSliderPrice] = useState(1000);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBrand = searchParams.get("brand") || "";
  const globalQuery = searchParams.get("query") || ""; // Header-dən gələn axtarış sözü
  const [filters, setFilters] = useState({
    brand: initialBrand,
    gender: "",
    minPrice: 0,
    maxPrice: 1000,
    sortBy: "id",
    direction: "DESC",
    page: 0,
    size: 12,
  });

  // Əgər URL-dəki brand dəyişərsə state-i yenilə (Shops-dan gələndə lazım olur)
  useEffect(() => {
    setFilters((prev) => ({ ...prev, brand: initialBrand, page: 0 }));
    if (initialBrand === "" && globalQuery === "") {
      setSliderPrice(1000);
    }
  }, [initialBrand, globalQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, maxPrice: sliderPrice, page: 0 }));
    }, 1000);
    return () => clearTimeout(handler);
  }, [sliderPrice]);

  // Brendləri çəkirik
  const { data: brands, isLoading: isBrandsLoading } = useQuery<string[]>({
    queryFn: () => api.get("/perfumes/brands").then((res) => res.data),
    queryKey: ["brands"],
  });

  const { data: productsData, isLoading: isProductsLoading } = useQuery<
    PageResponse<Perfume>
  >({
    queryKey: ["perfumes", filters, globalQuery],
    queryFn: async () => {
      const isSearchActive = globalQuery !== "";
      const isSidebarFiltered =
        filters.brand !== "" ||
        filters.gender !== "" ||
        filters.maxPrice < 1000;

      const endpoint =
        isSidebarFiltered || (isSearchActive && filters.brand)
          ? "/perfumes/filter"
          : "/perfumes";

      const response = await api.get(endpoint, {
        params: {
          query: globalQuery || undefined, // Header axtarışı
          brand: filters.brand || undefined, // Sidebar brend seçimi
          gender: filters.gender || undefined,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          sortBy: filters.sortBy,
          direction: filters.direction,
          page: filters.page,
          size: filters.size,
        },
      });
      return response.data;
    },
  });
  // Hal-hazırda aktiv olan sıralamanın adını tapmaq üçün
  const currentSortLabel =
    sortOptions.find(
      (opt) =>
        opt.sortBy === filters.sortBy && opt.direction === filters.direction,
    )?.label || "Featured";

  const resetAllFilters = () => {
    // URL-dəki bütün parametrləri (brand və query) təmizləyirik
    setSearchParams({});

    // Slayderi sıfırlayırıq
    setSliderPrice(1000);

    // State-i ilkin vəziyyətinə qaytarırıq
    setFilters({
      brand: "",
      gender: "",
      minPrice: 0,
      maxPrice: 1000,
      sortBy: "id",
      direction: "DESC",
      page: 0,
      size: 12,
    });
  };

  const updateFilter = (newVal: Partial<typeof filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newVal,
      page: newVal.page !== undefined ? newVal.page : 0,
    }));
  };

  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFilterOpen]);

  console.log(productsData, "data");

  return (
    <div className="py-10 font-[Playfair]">
      <div className="px-10 flex flex-col lg:flex-row gap-10">
        {isFilterOpen && (
          <div
            onClick={() => setIsFilterOpen(false)}
            className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          />
        )}

        {/* SIDEBAR */}
        <div
          className={`
          fixed top-0 left-0 z-30 h-screen w-3/4 bg-white overflow-y-auto p-6 transition-transform duration-300
          lg:static lg:z-auto lg:w-1/4 lg:h-auto lg:overflow-visible
          ${isFilterOpen ? "translate-y-0" : "-translate-y-full lg:translate-y-0"}
        `}
        >
          <div className="flex items-center gap-3 py-3 px-5 border-l-4 border-black mb-8">
            <h2 className="text-md md:text-lg 2xl:text-xl font-bold tracking-wider">
              BRAND
            </h2>
            <span className="h-[.5px] bg-gray-300 w-full"></span>
          </div>

          <div
            className=" flex flex-col gap-3 
    max-h-[370px]          
    overflow-y-auto         
                        
    scrollbar-thin          
    scrollbar-thumb-black   
    scrollbar-track-gray-100
    
    [&::-webkit-scrollbar]:w-1 
    [&::-webkit-scrollbar-thumb]:bg-gray-300 
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-track]:bg-transparent"
          >
            <div className="flex flex-col gap-4">
            {isBrandsLoading ? (
              // Brendlər üçün skelet sətirləri
              [...Array(10)].map((_, i) => (
                <div key={i} className="h-5 w-3/4 bg-gray-100 rounded animate-pulse ml-5"></div>
              ))
            ) : (
              /* Brend siyahısı kodu buraya gəlir... */
              <div className="flex flex-col gap-3 max-h-[370px] overflow-y-auto custom-scrollbar">
                 <button onClick={resetAllFilters} className={`cursor-pointer text-left text-base transition-all ${filters.brand === "" && !globalQuery ? "text-black font-bold" : "text-[#00000080]"}`}>All Brands</button>
                 {brands?.map((brandName, index) => (
                   <div key={index} onClick={() => updateFilter({ brand: brandName })} className={`group relative flex items-center font-semibold text-base cursor-pointer transition-all duration-300 mb-2 ${filters.brand === brandName ? "text-black" : "text-[#00000080] hover:text-black"}`}>
                     <MdKeyboardArrowRight className={`absolute left-0 transition-all duration-300 ${filters.brand === brandName ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                     <p className={`text-sm md:text-base transition-transform duration-300 ${filters.brand === brandName ? "translate-x-6" : "group-hover:translate-x-6"}`}>{brandName}</p>
                   </div>
                 ))}
              </div>
            )}
          </div>
          </div>

          <div className="flex items-center gap-3 py-3 px-5 border-l-4 border-black my-8">
            <h2 className="text-md md:text-lg 2xl:text-xl font-bold tracking-wider">
              PRICE
            </h2>
            <span className="h-[.5px] bg-gray-300 w-full"></span>
          </div>
          <div className="flex flex-col gap-3 pr-5">
            <input
              type="range"
              min="0"
              max="1000"
              value={sliderPrice}
              onChange={(e) => setSliderPrice(Number(e.target.value))}
              className="h-1 rounded-lg accent-black cursor-pointer bg-gray-200"
            />
            <div className="flex justify-between text-gray-600 font-medium">
              <span className="text-sm">Price: $0 - ${sliderPrice}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 py-3 px-5 border-l-4 border-black my-8">
            <h2 className="text-md md:text-lg 2xl:text-xl font-bold tracking-wider">
              GENDER
            </h2>
            <span className="h-[.5px] bg-gray-300 w-full"></span>
          </div>
          <div className="flex gap-2 mb-10">
            {["MEN", "WOMEN", "UNISEX"].map((g) => (
              <button
                key={g}
                onClick={() =>
                  updateFilter({ gender: filters.gender === g ? "" : g })
                }
                className={`cursor-pointer px-4 py-1 border rounded-full text-xs font-bold transition-all 
                  ${filters.gender === g ? "bg-black text-white border-black" : "bg-white text-black border-gray-300 hover:border-black"}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* SAĞ TƏRƏF */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-10 px-2">
            <button
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-semibold"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <MdFilterList size={20} /> Filter
            </button>

            <p className="hidden md:block text-gray-400 italic text-sm">
              {productsData?.totalElements} products found
            </p>

            {/* SORT BÖLMƏSİ */}
            <div className="ml-auto relative">
              <button
                className="flex items-center justify-end  px-4 py-2 cursor-pointer border border-gray-300 rounded-lg shadow-sm font-semibold hover:bg-gray-50 transition-all min-w-fit"
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                <span className="text-sm  tracking-tighter">
                  Sort by: {currentSortLabel}
                </span>
                {isSortOpen ? (
                  <MdKeyboardArrowUp size={20} />
                ) : (
                  <MdKeyboardArrowDown size={20} />
                )}
              </button>

              {isSortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsSortOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 bg-white border border-gray-100 shadow-xl rounded-lg p-2 z-20 animate-in fade-in zoom-in duration-200">
                    {sortOptions.map((option) => (
                      <div
                        key={option.label}
                        onClick={() => {
                          updateFilter({
                            sortBy: option.sortBy,
                            direction: option.direction,
                          });
                          setIsSortOpen(false);
                        }}
                        className={`cursor-pointer py-2.5 px-4 whitespace-nowrap rounded-md text-sm transition-colors mb-1
                          ${
                            currentSortLabel === option.label
                              ? "bg-black text-white font-bold"
                              : "text-gray-600 hover:bg-gray-100 hover:text-black"
                          }
                        `}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex-1">
            {isBrandsLoading || isProductsLoading ? (
              <div
                className="grid gap-10
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          2xl:grid-cols-4"
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-100 rounded-lg h-[300px] w-[230px]"
                  ></div>
                ))}
              </div>
            ) : (
              <Cartlist
                data={productsData!}
                onPageChange={(newPage) => updateFilter({ page: newPage })}
                page={filters.page}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
