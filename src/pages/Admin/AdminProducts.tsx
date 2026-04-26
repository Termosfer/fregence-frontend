import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import {
  FiTrash2,
  FiEdit,
  FiPlus,
  FiLoader,
  FiFilter,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useState } from "react";
import type { PageResponse, Perfume, ApiError } from "../../types/perfume"; // ApiError əlavə edildi
import AddProduct from "./AddProduct";
import type { AxiosError } from "axios";

// Filtr üçün xüsusi interfeys
interface ProductFilters {
  name: string;
  brand: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  sortBy: "id" | "price"; // Hansı sahələrə görə sort etmək olar
  sortDir: "asc" | "desc";
}

const AdminProducts = () => {
  const queryClient = useQueryClient();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Perfume | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState<string>("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  // Filters state-i artıq ProductFilters tipindədir
  const [filters, setFilters] = useState<ProductFilters>({
    name: "",
    brand: "",
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: "id",
    sortDir: "desc",
  });

  const { data, isLoading } = useQuery<PageResponse<Perfume>>({
    queryKey: ["admin-products"],
    queryFn: () => api.get("/perfumes?size=100").then((res) => res.data),
  });

  // deleteMutation üçün xəta tipini təyin etdik
  const deleteMutation = useMutation<void, AxiosError<ApiError>, number>({
    mutationFn: (id: number) => api.delete(`/perfumes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.info("Product removed.");
      setConfirmDeleteId(null);
    },
    onError: (err) => {
      const message = err.response?.data?.message || "Failed to delete product";
      toast.error(message);
    },
  });

  const handleClearFilter = () => {
    setFilters({
      name: "",
      brand: "",
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: "id",
      sortDir: "desc",
    });
    setIsFiltered(false);
    setIsFilterOpen(false);
  };

  // .sort() daxilindəki (a: any, b: any) artıq (a: Perfume, b: Perfume) oldu
  const displayedProducts = (data?.content || [])
    .filter((p) => {
      if (!isFiltered) return true;
      const matchesName = p.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const matchesBrand = p.brand
        .toLowerCase()
        .includes(filters.brand.toLowerCase());
      const matchesMinPrice = filters.minPrice
        ? p.price >= filters.minPrice
        : true;
      const matchesMaxPrice = filters.maxPrice
        ? p.price <= filters.maxPrice
        : true;
      return matchesName && matchesBrand && matchesMinPrice && matchesMaxPrice;
    })
    .sort((a: Perfume, b: Perfume) => {
      const dir = filters.sortDir === "asc" ? 1 : -1;
      if (filters.sortBy === "price") {
        return (a.price - b.price) * dir;
      }
      // id-yə görə sıralama (Default)
      return (a.id - b.id) * dir;
    });

  const handleEdit = (product: Perfume) => {
    setSelectedProduct(product);
    setIsAddOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsAddOpen(true);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId) deleteMutation.mutate(confirmDeleteId);
  };

  if (isLoading)
    return (
      <div className="py-20 text-center animate-pulse font-bold">
        LOADING...
      </div>
    );

  return (
    <div className="space-y-8 font-[Playfair]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-tight">
            Products
          </h1>
          <p className="text-gray-400 text-sm uppercase tracking-widest mt-1">
            {displayedProducts.length} items showing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                isFilterOpen || isFiltered
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              <FiFilter size={14} />
              Filter {isFiltered && <FiCheck className="ml-1" />}
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-3 w-[350px] md:w-[450px] bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 p-6 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Filter Inventory
                  </p>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="cursor-pointer"
                  >
                    <FiX size={16} className="text-gray-400 hover:text-black" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase text-gray-400">
                        Name
                      </label>
                      <input
                        type="text"
                        value={filters.name}
                        onChange={(e) =>
                          setFilters((p) => ({ ...p, name: e.target.value }))
                        }
                        className="border border-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-black"
                        placeholder="E.g. Sauvage"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase text-gray-400">
                        Brand
                      </label>
                      <input
                        type="text"
                        value={filters.brand}
                        onChange={(e) =>
                          setFilters((p) => ({ ...p, brand: e.target.value }))
                        }
                        className="border border-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-black"
                        placeholder="E.g. Dior"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase text-gray-400">
                        Min Price
                      </label>
                      <input
                        type="number"
                        value={filters.minPrice ?? ""}
                        onChange={(e) =>
                          setFilters((p) => ({
                            ...p,
                            minPrice: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          }))
                        }
                        className="border border-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-black"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase text-gray-400">
                        Max Price
                      </label>
                      <input
                        type="number"
                        value={filters.maxPrice ?? ""}
                        onChange={(e) =>
                          setFilters((p) => ({
                            ...p,
                            maxPrice: e.target.value
                              ? Number(e.target.value)
                              : undefined,
                          }))
                        }
                        className="border border-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase text-gray-400">
                        Sort By
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) =>
                          setFilters((p) => ({
                            ...p,
                            sortBy: e.target.value as "id" | "price",
                          }))
                        }
                        className="border border-gray-100 rounded-xl px-3 py-2 text-sm outline-none bg-transparent cursor-pointer"
                      >
                        <option value="id">Date Added</option>
                        <option value="price">Price</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase text-gray-400">
                        Order
                      </label>
                      <select
                        value={filters.sortDir}
                        onChange={(e) =>
                          setFilters((p) => ({
                            ...p,
                            sortDir: e.target.value as "asc" | "desc",
                          }))
                        }
                        className="border border-gray-100 rounded-xl px-3 py-2 text-sm outline-none bg-transparent cursor-pointer"
                      >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6 pt-4 border-t border-gray-50">
                  <button
                    onClick={handleClearFilter}
                    className="cursor-pointer px-4 py-2.5 border border-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => {
                      setIsFiltered(true);
                      setIsFilterOpen(false);
                    }}
                    className="cursor-pointer flex-1 py-2.5 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-[#0F172A] text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-[2px] hover:bg-black transition-all cursor-pointer"
          >
            <FiPlus size={16} /> Add Product
          </button>
        </div>
      </div>

      <AddProduct
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        initialData={selectedProduct}
      />

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase tracking-[2px] text-gray-400">
                <th className="px-8 py-5">Product</th>
                <th className="px-6 py-5">Brand</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5">Gender</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayedProducts.map((product) => (
                <tr
                  key={product.id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 p-1">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-bold text-gray-800 text-sm uppercase">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {product.brand}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-800">
                    {product.price.toFixed(2)} Azn
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black px-3 py-1 rounded-full bg-gray-100 text-gray-500 uppercase">
                      {product.gender}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setConfirmDeleteId(product.id);
                          setConfirmDeleteName(
                            `${product.brand} ${product.name}`,
                          );
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayedProducts.length === 0 && (
            <div className="py-20 text-center text-gray-400 italic text-sm">
              No products found for the selected filters.
            </div>
          )}
        </div>
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[150] backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl space-y-4 mx-4">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-500 animate-bounce">
              <FiTrash2 size={36} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Remove product?</h3>
            <p className="text-sm text-gray-500">
              <span className="font-bold text-gray-800">
                {confirmDeleteName}
              </span>{" "}
              will be removed from the store.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="cursor-pointer flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="cursor-pointer flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition flex items-center justify-center disabled:bg-gray-400"
              >
                {deleteMutation.isPending ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  "Remove"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
