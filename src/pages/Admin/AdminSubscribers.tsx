import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import {
  FiTrash2,
  FiMail,
  FiUserCheck,
  FiFilter,
  FiX,
  FiCheck,
  FiLoader,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

type SubscriberProvider = "ALL" | "GMAIL" | "OUTLOOK" | "OTHER";

interface SubscriberFilters {
  search: string;
  provider: SubscriberProvider; // Artıq "any" deyil, yalnız bu 4 dəyərdən biri ola bilər
}
interface Subscriber {
  id: number;
  email: string;
}

const AdminSubscribers = () => {
  const queryClient = useQueryClient();
  const query = useOutletContext<string>();
  // MODAL VƏ FİLTR STATE-LƏRİ
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmDeleteEmail, setConfirmDeleteEmail] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const [filters, setFilters] = useState<SubscriberFilters>({
    search: "",
    provider: "ALL",
  });

  const { data: subscribers = [], isLoading } = useQuery<Subscriber[]>({
    queryKey: ["admin-subscribers"],
    queryFn: () =>
      api.get("/subscribers").then((res) => res?.data.content || res?.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/subscribers/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["admin-subscribers"] });
      const previous = queryClient.getQueryData<Subscriber[]>([
        "admin-subscribers",
      ]);
      queryClient.setQueryData<Subscriber[]>(
        ["admin-subscribers"],
        (old) => old?.filter((s) => s.id !== id) ?? [],
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["admin-subscribers"], context?.previous);
      toast.error("Could not remove subscriber.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscribers"] });
      toast.info("Subscriber removed.");
    },
  });

  // ANLIQ FİLTRLƏMƏ MƏNTİQİ
  const displayedSubscribers = subscribers.filter((sub) => {
    const q = query.toLowerCase();
    const matchesGlobal = sub.email.toLowerCase().includes(q);

    const s = filters.search.toLowerCase();
    const matchesLocal = sub.email.toLowerCase().includes(s);

    // Provayder filtri (Gmail, Outlook və s.)
    let matchesProvider = true;
    if (filters.provider === "GMAIL")
      matchesProvider = sub.email.includes("@gmail.com");
    if (filters.provider === "OUTLOOK")
      matchesProvider =
        sub.email.includes("@outlook.com") ||
        sub.email.includes("@hotmail.com");
    if (filters.provider === "OTHER")
      matchesProvider =
        !sub.email.includes("@gmail.com") &&
        !sub.email.includes("@outlook.com");

    return matchesGlobal && matchesLocal && matchesProvider;
  });

  const handleClearFilter = () => {
    setFilters({ search: "", provider: "ALL" });
    setIsFiltered(false);
    setIsFilterOpen(false);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId) {
      deleteMutation.mutate(confirmDeleteId);
      setConfirmDeleteId(null);
      setConfirmDeleteEmail("");
    }
  };

  if (isLoading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 font-[Playfair]">
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
          Syncing Subscriber List...
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
    );

  return (
    <div className="space-y-8 font-[Playfair]">
      {/* HEADER PART */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900">
            Mailing List
          </h1>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[2px] mt-1">
            {displayedSubscribers.length} active subscribers found
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
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Search Subscribers
                  </p>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="cursor-pointer"
                  >
                    <FiX size={16} className="text-gray-400 hover:text-black" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-gray-400">
                      Email Address
                    </label>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => {
                        setFilters((p) => ({ ...p, search: e.target.value }));
                        setIsFiltered(true);
                      }}
                      className="border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-black bg-gray-50/30"
                      placeholder="Search email..."
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-gray-400">
                      Email Provider
                    </label>
                    <select
                      value={filters.provider}
                      onChange={(e) => {
                        setFilters((p) => ({
                          ...p,
                          provider: e.target.value as SubscriberProvider,
                        }));
                        setIsFiltered(true);
                      }}
                      className="border border-gray-100 rounded-xl px-3 py-3 text-sm outline-none bg-transparent cursor-pointer"
                    >
                      <option value="ALL">All Providers</option>
                      <option value="GMAIL">Gmail (@gmail.com)</option>
                      <option value="OUTLOOK">Outlook / Hotmail</option>
                      <option value="OTHER">Others</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 mt-8 pt-4 border-t border-gray-50">
                  <button
                    onClick={handleClearFilter}
                    className="cursor-pointer px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="cursor-pointer flex-1 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                  >
                    Apply & Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SUBSCRIBERS LIST (CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedSubscribers.length === 0 ? (
          <div className="col-span-full bg-white py-32 text-center rounded-[2.5rem] border border-dashed border-gray-100 text-gray-300 font-black uppercase tracking-[3px] italic">
            No Subscribers Found
          </div>
        ) : (
          displayedSubscribers?.map((sub) => (
            <div
              key={sub.id}
              className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-xl hover:border-black transition-all duration-500 group flex items-center justify-between"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-[#0F172A] group-hover:text-[#81d8d0] transition-all shadow-inner group-hover:rotate-6">
                  <FiMail size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate tracking-tight">
                    {sub.email}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <FiUserCheck size={10} className="text-teal-500" />
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                      Active Member
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setConfirmDeleteId(sub.id);
                  setConfirmDeleteEmail(sub.email);
                }}
                className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl space-y-6 mx-4 text-center transform animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-500 animate-bounce">
              <FiTrash2 size={36} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tighter">
                Remove Subscriber?
              </h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                <span className="font-bold text-black">
                  {confirmDeleteEmail}
                </span>{" "}
                will no longer receive your updates.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setConfirmDeleteId(null);
                  setConfirmDeleteEmail("");
                }}
                className="cursor-pointer flex-1 py-4 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="cursor-pointer flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-200 transition-all flex items-center justify-center"
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

export default AdminSubscribers;
