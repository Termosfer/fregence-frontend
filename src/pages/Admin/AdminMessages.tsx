import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { FiTrash2, FiExternalLink, FiClock, FiFilter, FiX, FiCheck, FiMail, FiUser, FiMessageSquare, FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";
import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import type { ContactMessage } from "../../types/perfume";

interface MessageFilters {
  search: string;
  sortBy: "id";
  sortDir: "asc" | "desc";
}

const AdminMessages = () => {
  const queryClient = useQueryClient();
  const query = useOutletContext<string>(); 
  // MODAL VƏ FİLTR STATE-LƏRİ
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const [filters, setFilters] = useState<MessageFilters>({
    search: "",
    sortBy: "id",
    sortDir: "desc", // Default olaraq ən yeni mesajlar yuxarıda
  });

  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["admin-messages"],
    queryFn: () => api.get("/contact").then((res) => res?.data?.content || res?.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/contact/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      toast.info("Message deleted.");
      setConfirmDeleteId(null);
    },
    onError: () => {
      toast.error("Could not delete message.");
    },
  });

  // ANLIQ FİLTRLƏMƏ MƏNTİQİ
 const displayedMessages = messages
  .filter((msg: ContactMessage) => {
    // Global axtarış: Ad, Email və ya Mesajın özü
    const q = query.toLowerCase();
    const matchesGlobal = 
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      msg.message.toLowerCase().includes(q);

    // Lokal axtarış
    const s = filters.search.toLowerCase();
    const matchesLocal = msg.name.toLowerCase().includes(s) || msg.message.toLowerCase().includes(s);

    return matchesGlobal && matchesLocal;
  })
  .sort((a: ContactMessage, b: ContactMessage) => {
    const dir = filters.sortDir === "asc" ? 1 : -1;
    return (a.id - b.id) * dir;
  });

  const handleClearFilter = () => {
    setFilters({ search: "", sortBy: "id", sortDir: "desc" });
    setIsFiltered(false);
    setIsFilterOpen(false);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId) {
      deleteMutation.mutate(confirmDeleteId);
    }
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
          Syncing Inbox Messages...
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
    </div>

  return (
    <div className="space-y-8 font-[Playfair]">
      {/* HEADER PART */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900">Inquiries</h1>
          <p className="text-[10px] text-neutral  font-black uppercase tracking-[2px] mt-1">
            {displayedMessages.length} total messages received
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* FİLTR DÜYMƏSİ VƏ DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                isFilterOpen || isFiltered
                  ? "bg-black text-white border-black shadow-lg"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              <FiFilter size={14} />
              Filter {isFiltered && <FiCheck className="ml-1" />}
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-3 w-[320px] md:w-[400px] bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 p-6 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral ">Filter Messages</p>
                  <button aria-label="fix" onClick={() => setIsFilterOpen(false)} className="cursor-pointer">
                    <FiX size={16} className="text-neutral  hover:text-black" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-neutral ">Search Content</label>
                    <input
                      type="text" value={filters.search}
                      onChange={(e) => { setFilters(p => ({ ...p, search: e.target.value })); setIsFiltered(true); }}
                      className="border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-black bg-gray-50/30"
                      placeholder="Name, email or keyword..."
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-neutral ">Order By</label>
                    <select
                      value={filters.sortDir}
                      onChange={(e) => { setFilters(p => ({ ...p, sortDir: e.target.value as "asc" | "desc" })); setIsFiltered(true); }}
                      className="border border-gray-100 rounded-xl px-3 py-3 text-sm outline-none bg-transparent cursor-pointer"
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 mt-8 pt-4 border-t border-gray-50">
                  <button onClick={handleClearFilter} className="cursor-pointer px-4 py-3 text-[10px] font-black uppercase tracking-widest text-neutral  hover:text-black transition-all">Reset</button>
                  <button onClick={() => setIsFilterOpen(false)} className="cursor-pointer flex-1 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Apply & Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MESSAGES LIST */}
      <div className="space-y-4">
        {displayedMessages.length === 0 ? (
          <div className="bg-white p-32 text-center rounded-[2.5rem] border border-dashed border-gray-100 text-gray-300 font-black uppercase tracking-[3px] italic">
            No Messages Match Your Search
          </div>
        ) : (
          displayedMessages?.map((msg: ContactMessage) => (
            <div
              key={msg.id}
              className="bg-white rounded-[2rem] p-6 border border-gray-50 shadow-sm hover:shadow-xl hover:border-black transition-all duration-500 group flex flex-col md:flex-row md:items-center gap-8"
            >
              {/* User Identity */}
              <div className="flex items-center gap-5 md:w-72 flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-[#81d8d0] flex items-center justify-center font-black text-lg shadow-lg group-hover:rotate-6 transition-transform">
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm uppercase truncate flex items-center gap-1">
                    <FiUser size={12} className="text-gray-300" /> {msg.name}
                  </h3>
                  <p className="text-[10px] text-neutral  font-bold tracking-widest uppercase truncate flex items-center gap-1">
                    <FiMail size={12} /> {msg.email}
                  </p>
                </div>
              </div>

              {/* Message Body */}
              <div className="flex-1 bg-gray-50/50 p-4 rounded-2xl border border-gray-50 group-hover:bg-white group-hover:border-gray-100 transition-all">
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  <FiMessageSquare className="inline-block mr-2 text-gray-300" />
                  "{msg.message}"
                </p>
              </div>

              {/* Metadata & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-8 md:w-56 flex-shrink-0">
                <div className="flex flex-col items-end gap-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    <FiClock /> {new Date().toLocaleDateString("en-GB")}
                  </div>
                  <span className="text-[8px] font-black text-teal-500 uppercase tracking-tighter">Status: Delivered</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link
                    to={`mailto:${msg.email}`}
                    className="p-3 bg-teal-50 text-teal-600 rounded-xl hover:bg-teal-600 hover:text-white transition-all shadow-sm"
                  >
                    <FiExternalLink size={16} />
                  </Link>
                  <button aria-label="trash"
                    onClick={() => { setConfirmDeleteId(msg.id); setConfirmDeleteName(msg.name); }}
                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm cursor-pointer"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DELETE MODAL */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl space-y-6 mx-4 text-center transform animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-500 animate-bounce">
              <FiTrash2 size={36} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tighter">Discard Inquiry?</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Message from <span className="font-bold text-black">{confirmDeleteName}</span> will be removed from your inbox forever.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmDeleteId(null); setConfirmDeleteName(""); }}
                className="cursor-pointer flex-1 py-4 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral  hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="cursor-pointer flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-200 transition-all flex items-center justify-center"
              >
                {deleteMutation.isPending ? <FiLoader className="animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;