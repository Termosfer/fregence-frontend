import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { FiTrash2, FiExternalLink, FiClock } from "react-icons/fi";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom"; // URL-i oxumaq üçün
import type { ContactMessage } from "../../types/perfume";

const AdminMessages = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || ""; // Header-dəki yazını bura bağladıq

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => api.get("/contact").then((res) => res?.data?.content || res?.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/contact/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      toast.info("Message deleted");
    }
  });

  // Header-dən gələn query-yə görə filtr
  const filteredMessages = messages.filter((msg: ContactMessage) => 
    msg.name.toLowerCase().includes(query.toLowerCase()) || 
    msg.email.toLowerCase().includes(query.toLowerCase()) ||
    msg.message.toLowerCase().includes(query.toLowerCase())
  );

  if (isLoading) return <div className="py-20 text-center animate-pulse font-bold">LOADING...</div>;

  return (
    <div className="space-y-6 font-[Playfair]">
      <div className="flex justify-between items-center px-2">
        <h1 className="text-2xl font-bold uppercase tracking-tighter">Messages</h1>
        <span className="text-[10px] font-black bg-white border px-3 py-1 rounded-full uppercase tracking-widest text-gray-400">
          {filteredMessages.length} inquiries
        </span>
      </div>

      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-[2rem] border border-dashed border-gray-200 text-gray-400 italic">
            {query ? `No results found for "${query}"` : "No messages found."}
          </div>
        ) : (
          filteredMessages.map((msg: ContactMessage) => (
            <div key={msg.id} className="bg-white rounded-2xl p-5 border border-gray-50 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group flex flex-col md:flex-row md:items-center gap-6">
              {/* Kart məzmunu eyni qalır... */}
              <div className="flex items-center gap-4 md:w-64 flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-sm shadow-lg">{msg.name.charAt(0).toUpperCase()}</div>
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm uppercase truncate">{msg.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold tracking-tight truncate">{msg.email}</p>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 italic truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:line-clamp-none transition-all">"{msg.message}"</p>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6 md:w-40 flex-shrink-0">
                <div className="flex items-center gap-1 text-[9px] font-black text-gray-300 uppercase tracking-widest"><FiClock /> {new Date().toLocaleDateString('en-GB')}</div>
                 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                  <a 
                    href={`mailto:${msg.email}`} 
                    className="p-2.5 bg-teal-50 text-teal-600 rounded-xl hover:bg-teal-600 hover:text-white transition-all shadow-sm"
                    title="Reply"
                  >
                    <FiExternalLink size={14} />
                  </a>
                  <button 
                    onClick={() => window.confirm("Permanently delete?") && deleteMutation.mutate(msg.id)}
                    className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm cursor-pointer"
                    title="Delete"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminMessages;




