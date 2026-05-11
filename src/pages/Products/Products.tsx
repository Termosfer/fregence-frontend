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
import ProductSkeleton from "../../components/ProductSkeleton";

const sortOptions = [
  { label: "Featured", sortBy: "id", direction: "DESC" },
  { label: "A-Z", sortBy: "name", direction: "ASC" },
  { label: "Z-A", sortBy: "name", direction: "DESC" },
  { label: "Price, low to high", sortBy: "price", direction: "ASC" },
  { label: "Price, high to low", sortBy: "price", direction: "DESC" },
];

const volumes = [50, 75, 100, 150]; // ML seçimləri

const Products = () => {
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [sliderPrice, setSliderPrice] = useState(1000);
  const [searchParams, setSearchParams] = useSearchParams();
  


  const initialBrand = searchParams.get("brand") || "";
  const globalQuery = searchParams.get("query") || "";

  const [filters, setFilters] = useState({
    brand: initialBrand,
    gender: "",
    ml: null as number | null, // YENİ: ML filtri üçün
    minPrice: 0,
    maxPrice: 1000,
    sortBy: "id",
    direction: "DESC",
    page: 0,
    size: 12,
  });

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
        filters.ml !== null || // ML yoxlanışı
        filters.maxPrice < 1000;

      const endpoint =
        isSidebarFiltered || (isSearchActive && filters.brand)
          ? "/perfumes/filter"
          : "/perfumes";

      const response = await api.get(endpoint, {
        params: {
          query: globalQuery || undefined,
          brand: filters.brand || undefined,
          gender: filters.gender || undefined,
          ml: filters.ml || undefined, // ML parametri backend-ə gedir
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

  const currentSortLabel =
    sortOptions.find(
      (opt) =>
        opt.sortBy === filters.sortBy && opt.direction === filters.direction,
    )?.label || "Featured";

  const resetAllFilters = () => {
    setSearchParams({});
    setSliderPrice(1000);
    setFilters({
      brand: "",
      gender: "",
      ml: null,
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

  return (
    <div className="py-10 font-[Playfair]">
      <div className="px-10 flex flex-col lg:flex-row gap-10">
        {/* MOBILE OVERLAY */}
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
          {/* BRAND SECTION */}
          <div className="flex items-center gap-3 py-3 px-5 border-l-4 border-black mb-8">
            <h2 className="text-md font-bold tracking-wider uppercase">
              Brand
            </h2>
            <span className="h-[.5px] bg-gray-200 w-full"></span>
          </div>
          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 mb-10">
            {isBrandsLoading ? (
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-5 w-3/4 bg-gray-100 rounded animate-pulse"
                />
              ))
            ) : (
              <>
                <button
                  onClick={resetAllFilters}
                  className={`cursor-pointer text-left text-sm transition-all ${filters.brand === "" ? "text-black font-bold" : "text-gray-400"}`}
                >
                  All Brands
                </button>
                {brands?.map((brandName) => (
                  <div
                    key={brandName}
                    onClick={() => updateFilter({ brand: brandName })}
                    className={`group relative flex items-center font-semibold cursor-pointer transition-all duration-300 ${filters.brand === brandName ? "text-black" : "text-gray-400 hover:text-black"}`}
                  >
                    <MdKeyboardArrowRight
                      className={`absolute left-0 transition-all ${filters.brand === brandName ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`}
                    />
                    <p
                      className={`text-sm transition-transform ${filters.brand === brandName ? "translate-x-6" : "group-hover:translate-x-6"}`}
                    >
                      {brandName}
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* PRICE SECTION */}
          <div className="flex items-center gap-3 py-3 px-5 border-l-4 border-black mb-8">
            <h2 className="text-md font-bold tracking-wider uppercase">
              Price
            </h2>
            <span className="h-[.5px] bg-gray-200 w-full"></span>
          </div>
          <div className="flex flex-col gap-3 pr-5 mb-10">
            <input
              type="range"
              min="0"
              max="1000"
              value={sliderPrice}
              onChange={(e) => setSliderPrice(Number(e.target.value))}
              className="h-1 rounded-lg accent-black cursor-pointer bg-gray-200"
            />
            <span className="text-sm text-gray-600 font-medium">
              Range: $0 - ${sliderPrice}
            </span>
          </div>

          {/* VOLUME (ML) SECTION - YENİ! */}
          <div className="flex items-center gap-3 py-3 px-5 border-l-4 border-black mb-8">
            <h2 className="text-md font-bold tracking-wider uppercase">
              Volume
            </h2>
            <span className="h-[.5px] bg-gray-200 w-full"></span>
          </div>
          <div className="flex flex-wrap gap-2 mb-10">
            {volumes.map((v) => (
              <button
                key={v}
                onClick={() =>
                  updateFilter({ ml: filters.ml === v ? null : v })
                }
                className={`cursor-pointer px-4 py-1.5 border rounded-full text-[10px] font-black tracking-widest transition-all 
                  ${filters.ml === v ? "bg-black text-white border-black" : "bg-white text-black border-gray-200 hover:border-black"}`}
              >
                {v} ML
              </button>
            ))}
          </div>

          {/* GENDER SECTION */}
          <div className="flex items-center gap-3 py-3 px-5 border-l-4 border-black mb-8">
            <h2 className="text-md font-bold tracking-wider uppercase">
              Gender
            </h2>
            <span className="h-[.5px] bg-gray-200 w-full"></span>
          </div>
          <div className="flex gap-2 mb-10">
            {["MEN", "WOMEN", "UNISEX"].map((g) => (
              <button
                key={g}
                onClick={() =>
                  updateFilter({ gender: filters.gender === g ? "" : g })
                }
                className={`cursor-pointer px-4 py-1.5 border rounded-full text-[10px] font-black tracking-widest transition-all 
                  ${filters.gender === g ? "bg-[#81d8d0] text-white border-[#81d8d0]" : "bg-white text-black border-gray-200 hover:border-black"}`}
              >
                {g}
              </button>
            ))}
          </div>
          {/* CUSTOM REQUEST SECTION */}
{/* --- TELEGRAM BOT SECTION --- */}
<div className="flex items-center gap-3 py-3 px-5 border-l-4 border-[#81d8d0] my-8">
  <h2 className="text-md font-bold tracking-wider uppercase">Special Requests</h2>
  <span className="h-[.5px] bg-gray-200 w-full"></span>
</div>


        </div>

        {/* PRODUCTS AREA */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-10 px-2">
            <button
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-semibold"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <MdFilterList size={20} /> Filter
            </button>

            <p className="hidden md:block text-gray-400 italic text-sm">
              {productsData?.totalElements || 0} products found
            </p>

            <div className="relative">
              <button
                className="flex items-center px-4 py-2 cursor-pointer border border-gray-200 rounded-lg shadow-sm font-semibold hover:bg-gray-50 transition-all"
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                <span className="text-xs uppercase tracking-tighter">
                  Sort: {currentSortLabel}
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
                  />
                  <div className="absolute right-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-xl p-2 z-20 w-48 animate-in fade-in zoom-in duration-200">
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
                        className={`cursor-pointer py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors mb-1 ${currentSortLabel === option.label ? "bg-black text-white" : "text-gray-500 hover:bg-gray-100 hover:text-black"}`}
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
            {isProductsLoading ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : (
              <Cartlist
                data={productsData!}
                onPageChange={(newPage) => updateFilter({ page: newPage })}
                page={filters.page}
                activeMl={filters.ml}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
