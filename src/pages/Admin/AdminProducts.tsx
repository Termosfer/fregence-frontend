import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { FiTrash2, FiEdit, FiPlus, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import { useState } from "react";
import type { PageResponse, Perfume } from "../../types/perfume";
import AddProduct from "./AddProduct";

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Perfume | null>(null);

  // 1. Məhsulları çəkirik (Admin panelində hamısını görmək üçün size=100 edirik)
  const { data, isLoading } = useQuery<PageResponse<Perfume>>({
    queryKey: ["admin-products"],
    queryFn: () => api.get("/perfumes?size=100").then((res) => res.data),
  });

  // 2. Məhsulu silmək üçün Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/perfumes/${id}`),
    onSuccess: () => {
      // Siyahını yeniləyirik
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  // Edit düyməsinə basanda
  const handleEdit = (product: Perfume) => {
    const freshProduct = data?.content?.find((p: Perfume) => p.id === product.id);
    setSelectedProduct(freshProduct || product);
    setIsAddOpen(true);
  };

  // Əlavə et (Add) düyməsinə basanda
  const handleAddNew = () => {
    setSelectedProduct(null); // Seçilmişi təmizlə (yeni məhsul üçün)
    setIsAddOpen(true);
  };

  const handleDelete = (id: number) => {
   
    deleteMutation.mutate(id);
  };

  // Axtarış filtrasiyası
  const filteredProducts = data?.content?.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()),
  );

 if (isLoading) return <div className="py-20 text-center animate-pulse font-bold">LOADING...</div>;

  return (
    <div className="space-y-8 font-[Playfair]">
      {/* ÜST HİSSƏ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-tight">
            Products
          </h1>
          <p className="text-gray-400 text-sm uppercase tracking-widest mt-1">
            Manage your store inventory ({data?.totalElements} items)
          </p>
        </div>

        <button
          onClick={handleAddNew} // Drawer-i açır
          className="
    flex items-center gap-2 
    bg-[#0F172A] text-white 
    px-6 py-3 rounded-xl 
    font-bold text-[10px] uppercase tracking-[2px] 
    hover:bg-black hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] 
    transition-all duration-300 active:scale-95 
    cursor-pointer
  "
        >
          <FiPlus size={16} /> Add New Product
        </button>
        <AddProduct
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          initialData={selectedProduct}
        />
      </div>

      {/* AXTARIŞ PANELİ */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <FiSearch className="text-gray-400 ml-2" />
        <input
          type="text"
          placeholder="Search by name or brand..."
          className="w-full outline-none text-sm bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* MƏHSUL CƏDVƏLİ */}
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
              {filteredProducts?.map((product) => (
                <tr
                  key={product.id}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 p-1">
                        <img
                          src={product.imageUrl}
                          alt=""
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
                  <td className="px-6 py-5">
                    <span className="font-bold text-gray-800">
                      {product.price}.00 Azn
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black px-3 py-1 rounded-full bg-gray-100 text-gray-500 uppercase">
                      {product.gender}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts?.length === 0 && (
          <div className="py-20 text-center text-gray-400 italic">
            No products found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
