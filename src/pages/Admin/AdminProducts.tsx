import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import {
  FiTrash2,
  FiEdit,
  FiPlus,
  FiLoader,
  FiFilter,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useState } from "react";
import type { PageResponse, Perfume, ApiError } from "../../types/perfume";
import AddProduct from "./AddProduct";
import type { AxiosError } from "axios";
import { useOutletContext } from "react-router-dom";

interface ProductFilters {
  name: string;
  brand: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  sortBy: "id" | "price";
  sortDir: "asc" | "desc";
}

const AdminProducts = () => {
const query = useOutletContext<string>(); // <-- Budur! Global axtarış sözü artıq əlindədir.



  const queryClient = useQueryClient();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Perfume | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState<string>("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

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

  const deleteMutation = useMutation<void, AxiosError<ApiError>, number>({
    mutationFn: (id: number) => api.delete(`/perfumes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.info("Product removed.");
      setConfirmDeleteId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete product");
    },
  });

  // ANLIQ FİLTRLƏMƏ MƏNTİQİ (Digərlərində olduğu kimi)
 const displayedProducts = (data?.content || [])
  .filter((p: Perfume) => {
    const q = query?.toLowerCase() || "";
    
    // Global Search (Header)
    const matchesGlobal = 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q);

    // Local Filter (Pəncərə)
    const matchesName = p.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesBrand = p.brand.toLowerCase().includes(filters.brand.toLowerCase());
    const matchesMinPrice = filters.minPrice !== undefined ? p.price >= filters.minPrice : true;
    const matchesMaxPrice = filters.maxPrice !== undefined ? p.price <= filters.maxPrice : true;

    return matchesGlobal && matchesName && matchesBrand && matchesMinPrice && matchesMaxPrice;
  })
  .sort((a: Perfume, b: Perfume) => {
    const dir = filters.sortDir === "asc" ? 1 : -1;
    if (filters.sortBy === "price") {
      return (a.price - b.price) * dir;
    }
    // Default olaraq ID-yə görə sırala
    return (a.id - b.id) * dir;
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

  const handleConfirmDelete = () => {
    if (confirmDeleteId) deleteMutation.mutate(confirmDeleteId);
  };

const handleAddNew = () => {
  setSelectedProduct(null); // Yeni məhsul üçün datanı sıfırla
  setIsAddOpen(true);       // Paneli aç
};

  if (isLoading) return <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 font-[Playfair]">
      {/* Ürək kimi döyünən Logo Area */}
      <div className="relative flex items-center justify-center">
        
        {/* Dalğa effekti (Logonun arxasından yayılan halqalar) */}
        <div className="absolute inset-0 rounded-3xl bg-teal-500/20 animate-ping shadow-2xl"></div>
        <div className="absolute inset-0 rounded-3xl bg-teal-500/10 animate-[ping_2s_linear_infinite] shadow-xl"></div>

        {/* Ana Logo Bloqu */}
        <div className="relative w-20 h-20 bg-[#0F172A] text-white flex items-center justify-center rounded-3xl shadow-2xl z-10 animate-[heartbeat_1.5s_ease-in-out_infinite]">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black tracking-tighter italic">Mi</span>
            <div className="w-4 h-[1px] bg-teal-500 mt-0.5"></div>
          </div>
        </div>
      </div>

      {/* Yazı Hissəsi */}
      <div className="text-center space-y-2">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-900 animate-pulse">
          Mi-Parfum
        </h2>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-teal-600/60">
          Syncing Product Inventory...
        </p>
      </div>

      {/* Arxa planda solğun skeleton cədvəl (istifadəçiyə dərinlik hissi vermək üçün) */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none px-10 pt-32">
        <div className="space-y-6">
          {[1, 2, 3, 4]?.map((i) => (
            <div key={i} className="h-16 bg-black rounded-3xl w-full"></div>
          ))}
        </div>
      </div>

      {/* Ürək döyüntüsü üçün lazım olan xüsusi CSS (Tailwind ilə birlikdə) */}
      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          15% { transform: scale(1.12); }
          30% { transform: scale(1); }
          45% { transform: scale(1.15); }
          70% { transform: scale(1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>;

  return (
    <div className="space-y-8 font-[Playfair]">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-tight">Products</h1>
          <p className="text-gray-400 text-sm uppercase tracking-widest mt-1">
            {displayedProducts.length} items showing
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* FİLTR DROPDOWN */}
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
              Filter 
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-3 w-[350px] md:w-[450px] bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 p-6 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Filter Inventory</p>
                  <button onClick={() => setIsFilterOpen(false)} className="cursor-pointer">
                    <FiX size={16} className="text-gray-400 hover:text-black" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase text-gray-400">Name</label>
                      <input
                        type="text" value={filters.name}
                        onChange={(e) => { setFilters(p => ({...p, name: e.target.value})); setIsFiltered(true); }}
                        className="border border-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-black bg-gray-50/30"
                        placeholder="e.g Dior Sauvage"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase text-gray-400">Brand</label>
                      <input
                        type="text" value={filters.brand}
                        onChange={(e) => { setFilters(p => ({...p, brand: e.target.value})); setIsFiltered(true); }}
                        className="border border-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-black bg-gray-50/30"
                        placeholder="e.g Chanel"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase text-gray-400">Min Price</label>
                      <input
                        type="number" value={filters.minPrice ?? ""}
                        onChange={(e) => { setFilters(p => ({...p, minPrice: e.target.value ? Number(e.target.value) : undefined})); setIsFiltered(true); }}
                        className="border border-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-black bg-gray-50/30"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase text-gray-400">Max Price</label>
                      <input
                        type="number" value={filters.maxPrice ?? ""}
                        onChange={(e) => { setFilters(p => ({...p, maxPrice: e.target.value ? Number(e.target.value) : undefined})); setIsFiltered(true); }}
                        className="border border-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-black bg-gray-50/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase text-gray-400">Sort By</label>
                      <select 
                        value={filters.sortBy} 
                        onChange={(e) => { setFilters(p => ({...p, sortBy: e.target.value as "id" | "price"})); setIsFiltered(true); }}
                        className="border border-gray-100 rounded-xl px-3 py-2 text-sm outline-none bg-transparent cursor-pointer"
                      >
                        <option value="id">Date Added</option>
                        <option value="price">Price</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase text-gray-400">Order</label>
                      <select 
                        value={filters.sortDir} 
                        onChange={(e) => { setFilters(p => ({...p, sortDir: e.target.value as "asc" | "desc"})); setIsFiltered(true); }}
                        className="border border-gray-100 rounded-xl px-3 py-2 text-sm outline-none bg-transparent cursor-pointer"
                      >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-8 pt-4 border-t border-gray-50">
                  <button onClick={handleClearFilter} className="cursor-pointer px-4 py-3 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all">Reset</button>
                  <button onClick={() => setIsFilterOpen(false)} className="cursor-pointer flex-1 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Apply & Close</button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-[#0F172A] text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-[2px] hover:bg-black transition-all cursor-pointer shadow-sm"
          >
            <FiPlus size={16} /> Add Product
          </button>
        </div>
      </div>

      <AddProduct isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} initialData={selectedProduct} />

      {/* PRODUCT TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase tracking-[2px] text-gray-400">
                <th className="px-8 py-6">Product</th>
                <th className="px-6 py-6">Brand</th>
                <th className="px-6 py-6">Price</th>
                <th className="px-6 py-6">Gender</th>
                <th className="px-6 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayedProducts?.map((product) => (
                <tr key={product.id} className="group hover:bg-gray-50/40 transition-all duration-300">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 p-1 group-hover:rotate-2 transition-transform">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="font-bold text-gray-800 text-sm uppercase">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.brand}</span>
                  </td>
                  <td className="px-6 py-6 font-bold text-gray-900 text-sm">{product.price.toFixed(2)} Azn</td>
                  <td className="px-6 py-6">
                    <span className="text-[10px] font-black px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 uppercase tracking-tighter">{product.gender}</span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setSelectedProduct(product); setIsAddOpen(true); }} className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all cursor-pointer">
                        <FiEdit size={18} />
                      </button>
                      <button onClick={() => { setConfirmDeleteId(product.id); setConfirmDeleteName(`${product.brand} ${product.name}`); }} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayedProducts.length === 0 && (
            <div className="py-24 text-center text-gray-300 font-black uppercase tracking-[3px] italic">No matching products found.</div>
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[150] backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl space-y-6 mx-4 text-center transform animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-500 animate-bounce">
              <FiTrash2 size={36} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tighter">Discard Item?</h3>
              <p className="text-sm text-gray-400 mt-2">
                <span className="font-bold text-black">{confirmDeleteName}</span> will be permanently removed.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="cursor-pointer flex-1 py-4 border border-gray-100 rounded-2xl text-[10px] font-black uppercase text-gray-400 hover:bg-gray-50">Cancel</button>
              <button onClick={handleConfirmDelete} disabled={deleteMutation.isPending} className="cursor-pointer flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-red-600 shadow-lg shadow-red-200 transition-all flex items-center justify-center">
                {deleteMutation.isPending ? <FiLoader className="animate-spin" /> : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;