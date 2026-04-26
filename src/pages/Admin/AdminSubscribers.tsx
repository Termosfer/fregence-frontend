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
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmDeleteEmail, setConfirmDeleteEmail] = useState<string>("");

  const query = searchParams.get("query") || "";

  const { data: subscribers = [], isLoading } = useQuery<Subscriber[]>({
    queryKey: ["admin-subscribers"],
    queryFn: () => api.get("/subscribers").then((res) => res?.data.content || res?.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/subscribers/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["admin-subscribers"] });
      const previous = queryClient.getQueryData<Subscriber[]>(["admin-subscribers"]);
      queryClient.setQueryData<Subscriber[]>(["admin-subscribers"], (old) =>
        old?.filter((s) => s.id !== id) ?? []
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

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch = sub.email.toLowerCase().includes(query.toLowerCase());
    if (filterDomain === "ALL") return matchesSearch;
    if (filterDomain === "GMAIL") return matchesSearch && sub.email.includes("@gmail.com");
    if (filterDomain === "OUTLOOK") return matchesSearch && (sub.email.includes("@outlook.com") || sub.email.includes("@hotmail.com"));
    if (filterDomain === "OTHER") return matchesSearch && !sub.email.includes("@gmail.com") && !sub.email.includes("@outlook.com") && !sub.email.includes("@hotmail.com");
    return matchesSearch;
  });

  const handleDeleteClick = (sub: Subscriber) => {
    setConfirmDeleteId(sub.id);
    setConfirmDeleteEmail(sub.email);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId) {
      deleteMutation.mutate(confirmDeleteId);
      setConfirmDeleteId(null);
      setConfirmDeleteEmail("");
    }
  };

  if (isLoading)
    return <div className="py-20 text-center animate-pulse font-bold">LOADING...</div>;

  return (
    <div className="space-y-8 font-[Playfair]">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter">Mailing List</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[2px] mt-1">
            {filteredSubscribers.length} verified subscribers
          </p>
        </div>
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

      {/* CARDS */}
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
                onClick={() => handleDeleteClick(sub)}
                className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* DELETE MODAL */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl space-y-4 mx-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-2">
              <FiTrash2 size={20} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Remove subscriber?</h3>
            <p className="text-sm text-gray-500">
              <span className="font-bold text-gray-800">{confirmDeleteEmail}</span> will be removed from the mailing list.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setConfirmDeleteId(null); setConfirmDeleteEmail(""); }}
                className="cursor-pointer flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="cursor-pointer flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscribers;