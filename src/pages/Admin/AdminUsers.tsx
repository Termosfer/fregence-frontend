import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import {
  FiTrash2,
  FiUser,
  FiShield,
  FiCheckCircle,
  FiFilter,
  FiX,
  FiCheck,
  FiLoader,
  FiLock,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useState } from "react";
import type { PageResponse, User, ApiError } from "../../types/perfume";
import type { AxiosError } from "axios";
import { useOutletContext } from "react-router-dom";

// FİLTR ÜÇÜN DƏQİQ TİPLƏR
interface UserFilters {
  search: string;
  role: "ALL" | "ADMIN" | "USER";
  sortBy: "name" | "email" | "id";
  sortDir: "asc" | "desc";
}

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const query = useOutletContext<string>();
  // STATE-LƏR
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "ALL",
    sortBy: "id",
    sortDir: "desc",
  });

  // 1. HAZIRDA DAXİL OLAN ADMİNİ TAPIRIQ (Özünü silməmək üçün)
  const { data: currentUser } = useQuery<User>({
    queryKey: ["current-admin"],
    queryFn: () => api.get("/users/me").then((res) => res.data),
  });

  // 2. BÜTÜN İSTİFADƏÇİLƏRİ ÇƏKİRİK
  const { data: responseData, isLoading } = useQuery<
    User[] | PageResponse<User>
  >({
    queryKey: ["admin-users"],
    queryFn: () => api.get("/users/admin/all-users").then((res) => res.data),
  });

  const users: User[] = responseData
    ? Array.isArray(responseData)
      ? responseData
      : responseData.content
    : [];

  // 3. SİLMƏ MUTASİYASI
  const deleteMutation = useMutation<void, AxiosError<ApiError>, number>({
    mutationFn: (id: number) => api.delete(`/api/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.info("User has been removed");
      setConfirmDeleteId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to remove user");
    },
  });

  const displayedUsers = users
    .filter((u: User) => {
      // A) Global Axtarış
      const q = query.toLowerCase();
      const matchesGlobal =
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);

      // B) Lokal Filtr
      const s = filters.search.toLowerCase();
      const matchesLocalSearch =
        u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
      const matchesRole = filters.role === "ALL" || u.role === filters.role;

      return matchesGlobal && matchesLocalSearch && matchesRole;
    })
    .sort((a: User, b: User) => {
      const dir = filters.sortDir === "asc" ? 1 : -1;
      if (filters.sortBy === "name") return a.name.localeCompare(b.name) * dir;
      if (filters.sortBy === "email")
        return a.email.localeCompare(b.email) * dir;
      return (a.id - b.id) * dir;
    });

  const handleClearFilter = () => {
    setFilters({ search: "", role: "ALL", sortBy: "id", sortDir: "desc" });
    setIsFiltered(false);
    setIsFilterOpen(false);
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
          Syncing User Directory...
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
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900">
            User Management
          </h1>
          <p className="text-[10px] text-neutral  font-black uppercase tracking-[2px] mt-1">
            {displayedUsers.length} accounts in system
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
              isFilterOpen || isFiltered
                ? "bg-black text-white"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            <FiFilter size={14} /> Filter {isFiltered && <FiCheck />}
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-3 w-[350px] bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 p-6 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral ">
                  Filters
                </p>
                <button aria-label="fix"
                  onClick={() => setIsFilterOpen(false)}
                  className="cursor-pointer text-neutral  hover:text-black"
                >
                  <FiX size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name or email..."
                  value={filters.search}
                  onChange={(e) => {
                    setFilters((p) => ({ ...p, search: e.target.value }));
                    setIsFiltered(true);
                  }}
                  className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-black bg-gray-50/30"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={filters.role}
                    onChange={(e) => {
                      setFilters((p) => ({
                        ...p,
                        role: e.target.value as "ALL" | "ADMIN" | "USER",
                      }));
                      setIsFiltered(true);
                    }}
                    className="border border-gray-100 rounded-xl px-3 py-3 text-sm outline-none bg-transparent cursor-pointer"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="ADMIN">Admins</option>
                    <option value="USER">Users</option>
                  </select>
                  <select
                    value={filters.sortDir}
                    onChange={(e) => {
                      setFilters((p) => ({
                        ...p,
                        sortDir: e.target.value as "asc" | "desc",
                      }));
                      setIsFiltered(true);
                    }}
                    className="border border-gray-100 rounded-xl px-3 py-3 text-sm outline-none bg-transparent cursor-pointer"
                  >
                    <option value="desc">Newest</option>
                    <option value="asc">Oldest</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-8 pt-4 border-t border-gray-50">
                <button
                  onClick={handleClearFilter}
                  className="cursor-pointer px-4 py-3 text-[10px] font-black uppercase tracking-widest text-neutral  hover:text-black transition-all"
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

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b text-[10px] font-black uppercase tracking-[2px] text-neutral ">
                <th className="px-8 py-6">Member</th>
                <th className="px-6 py-6">Email</th>
                <th className="px-6 py-6">Role</th>
                <th className="px-6 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayedUsers?.map((u: User) => {
                const isMe = u.id === currentUser?.id;

                return (
                  <tr
                    key={u.id}
                    className={`group transition-all ${isMe ? "bg-teal-50/20" : "hover:bg-gray-50/40"}`}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg ${isMe ? "bg-teal-500 text-white" : "bg-[#0F172A] text-[#81d8d0]"}`}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-sm uppercase">
                            {u.name}{" "}
                            {isMe && (
                              <span className="ml-2 text-[9px] bg-teal-500 text-white px-2 py-0.5 rounded-full">
                                YOU
                              </span>
                            )}
                          </span>
                          <span className="text-[9px] text-teal-600 font-black uppercase tracking-widest flex items-center gap-1">
                            <FiCheckCircle size={10} />{" "}
                            {isMe ? "Session Active" : "Verified Account"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm text-gray-500 font-medium">
                      {u.email}
                    </td>
                    <td className="px-6 py-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${u.role === "ADMIN" ? "bg-purple-50 text-purple-700 border-purple-100" : "bg-gray-50 text-gray-600 border-gray-200"}`}
                      >
                        {u.role === "ADMIN" ? (
                          <FiShield size={10} />
                        ) : (
                          <FiUser size={10} />
                        )}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      {!isMe ? (
                        <button aria-label="trash"
                          onClick={() => {
                            setConfirmDeleteId(u.id);
                            setConfirmDeleteName(u.name);
                          }}
                          className="cursor-pointer p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      ) : (
                        <div
                          className="p-3 text-teal-500/50 flex justify-end"
                          title="You cannot delete yourself"
                        >
                          <FiLock size={18} />
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE MODAL */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[200] backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl space-y-6 mx-4 text-center transform animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-500 animate-bounce">
              <FiTrash2 size={36} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tighter">
                Remove Account?
              </h3>
              <p className="text-sm text-gray-500">
                User{" "}
                <span className="font-bold text-black">
                  {confirmDeleteName}
                </span>{" "}
                will be deleted.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="cursor-pointer flex-1 py-4 border border-gray-100 rounded-2xl text-[10px] font-black uppercase text-neutral  hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmDeleteId) deleteMutation.mutate(confirmDeleteId);
                }}
                disabled={deleteMutation.isPending}
                className=" cursor-pointer flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-red-600 shadow-lg shadow-red-200 flex items-center justify-center"
              >
                {deleteMutation.isPending ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
