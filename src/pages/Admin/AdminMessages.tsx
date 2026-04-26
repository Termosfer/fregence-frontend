import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { FiTrash2, FiExternalLink, FiClock } from "react-icons/fi";
import { toast } from "react-toastify";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { ContactMessage } from "../../types/perfume";

const AdminMessages = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState<string>("");

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () =>
      api.get("/contact").then((res) => res?.data?.content || res?.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/contact/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["admin-messages"] });
      const previous = queryClient.getQueryData<ContactMessage[]>([
        "admin-messages",
      ]);
      queryClient.setQueryData<ContactMessage[]>(
        ["admin-messages"],
        (old) => old?.filter((m) => m.id !== id) ?? [],
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["admin-messages"], context?.previous);
      toast.error("Could not delete message.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      toast.info("Message deleted.");
    },
  });

  const filteredMessages = messages.filter(
    (msg: ContactMessage) =>
      msg.name.toLowerCase().includes(query.toLowerCase()) ||
      msg.email.toLowerCase().includes(query.toLowerCase()) ||
      msg.message.toLowerCase().includes(query.toLowerCase()),
  );

  const handleDeleteClick = (msg: ContactMessage) => {
    setConfirmDeleteId(msg.id);
    setConfirmDeleteName(msg.name);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId) {
      deleteMutation.mutate(confirmDeleteId);
      setConfirmDeleteId(null);
      setConfirmDeleteName("");
    }
  };

  if (isLoading)
    return (
      <div className="py-20 text-center animate-pulse font-bold">
        LOADING...
      </div>
    );

  return (
    <div className="space-y-6 font-[Playfair]">
      <div className="flex justify-between items-center px-2">
        <h1 className="text-2xl font-bold uppercase tracking-tighter">
          Messages
        </h1>
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
            <div
              key={msg.id}
              className="bg-white rounded-2xl p-5 border border-gray-50 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className="flex items-center gap-4 md:w-64 flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-sm shadow-lg">
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm uppercase truncate">
                    {msg.name}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold tracking-tight truncate">
                    {msg.email}
                  </p>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 italic truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:line-clamp-none transition-all">
                  "{msg.message}"
                </p>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 md:w-40 flex-shrink-0">
                <div className="flex items-center gap-1 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                  <FiClock /> {new Date().toLocaleDateString("en-GB")}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                  <Link
                    to={`mailto:${msg.email}`}
                    className="p-2.5 bg-teal-50 text-teal-600 rounded-xl hover:bg-teal-600 hover:text-white transition-all shadow-sm"
                  >
                    <FiExternalLink size={14} />
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(msg)}
                    className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm cursor-pointer"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DELETE MODAL */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl space-y-4 mx-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <FiTrash2 size={20} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Delete message?</h3>
            <p className="text-sm text-gray-500">
              Message from{" "}
              <span className="font-bold text-gray-800">
                {confirmDeleteName}
              </span>{" "}
              will be permanently deleted.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setConfirmDeleteId(null);
                  setConfirmDeleteName("");
                }}
                className="cursor-pointer flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="cursor pointer flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
