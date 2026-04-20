import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { FiTrash2, FiMail, FiUserCheck, FiChevronDown } from "react-icons/fi";
import { toast } from "react-toastify";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

interface Subscriber {
  id: number;
  email: string;
}

const AdminSubscribers = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [filterDomain, setFilterDomain] = useState("ALL");

  // 1. URL-dəki axtarış sözünü (Header-dən gələn) tuturuq
  const query = searchParams.get("query") || "";

  // 2. Abunəçiləri API-dan çəkirik
  const { data: subscribers = [], isLoading } = useQuery<Subscriber[]>({
    queryKey: ["admin-subscribers"],
    queryFn: () => api.get("/subscribers").then((res) => res?.data.content || res?.data),
  });

  // 3. Silmə əməliyyatı
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/subscribers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscribers"] });
      toast.info("Subscriber removed");
    }
  });

  // 4. MƏNTİQ: Həm Header axtarışı, həm də Domen filtri eyni anda tətbiq olunur
  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch = sub.email.toLowerCase().includes(query.toLowerCase());
    
    if (filterDomain === "ALL") return matchesSearch;
    if (filterDomain === "GMAIL") return matchesSearch && sub.email.includes("@gmail.com");
    if (filterDomain === "OUTLOOK") return matchesSearch && (sub.email.includes("@outlook.com") || sub.email.includes("@hotmail.com"));
    if (filterDomain === "OTHER") return matchesSearch && !sub.email.includes("@gmail.com") && !sub.email.includes("@outlook.com") && !sub.email.includes("@hotmail.com");
    
    return matchesSearch;
  });

if (isLoading) return <div className="py-20 text-center animate-pulse font-bold">LOADING...</div>;

  return (
    <div className="space-y-8 font-[Playfair]">
      {/* BAŞLIQ HİSSƏSİ */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter">Mailing List</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[2px] mt-1">
            {filteredSubscribers.length} verified subscribers
          </p>
        </div>

        {/* DOMEN FİLTRI (Axtarış Header-ə getdiyi üçün bura sadələşdi) */}
        <div className="relative min-w-[180px]">
          <select 
            value={filterDomain}
            onChange={(e) => setFilterDomain(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-xl py-2.5 pl-4 pr-10 text-[10px] font-bold uppercase tracking-widest shadow-sm outline-none cursor-pointer appearance-none hover:border-black transition-all"
          >
            <option value="ALL">All Providers</option>
            <option value="GMAIL">Gmail</option>
            <option value="OUTLOOK">Outlook / Hotmail</option>
            <option value="OTHER">Others</option>
          </select>
          <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* ABUNƏÇİ KARTLARI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubscribers.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-400 italic bg-white rounded-[2rem] border border-dashed border-gray-100">
            {query ? `No matching emails for "${query}"` : "The mailing list is currently empty."}
          </div>
        ) : (
          filteredSubscribers.map((sub) => (
            <div 
              key={sub.id} 
              className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm hover:shadow-xl hover:scale-[1.02] hover:border-black transition-all duration-500 group flex items-center justify-between"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-black group-hover:text-[#81d8d0] transition-colors shadow-inner">
                  <FiMail size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate tracking-tight">{sub.email}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <FiUserCheck size={10} className="text-teal-500" />
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Active Subscriber</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => window.confirm("Unsubscribe this email?") && deleteMutation.mutate(sub.id)}
                className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Remove"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminSubscribers;