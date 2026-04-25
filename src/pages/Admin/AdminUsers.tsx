import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import {
  FiTrash2,
  FiUser,
  FiShield,
  FiMail,
  FiCheckCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import type { PageResponse, User } from "../../types/perfume";



const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  // 1. Bütün istifadəçiləri çəkirik
  const { data: responseData, isLoading } = useQuery<
    User[] | PageResponse<User>
  >({
    queryKey: ["admin-users"],
    queryFn: () => api.get("/users/admin/all-users").then((res) => res.data), // Backend endpointinizə uyğun tənzimləyin
  });
  const users: User[] = responseData
    ? Array.isArray(responseData)
      ? responseData
      : responseData.content // Artıq TypeScript bunun PageResponse olduğunu bilir
    : [];
  // 2. İstifadəçini silmək üçün (Məsələn, qaydaları pozanları)
  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (id: number) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.info("User has been removed");
    },
  });

  // Axtarış filtri (Həm Ad, həm də Email üzrə)
  const filteredUsers = users.filter((u) => {
  // Əgər fullName və ya email null-dursa, boş string ("") kimi qəbul et
  const name = u.name?.toLowerCase() || "";
  const email = u.email?.toLowerCase() || "";
  const searchTerm = query.toLowerCase();

  return name.includes(searchTerm) || email.includes(searchTerm);
});

  if (isLoading)
    return (
      <div className="py-20 text-center animate-pulse font-bold">
        LOADING...
      </div>
    );

  return (
    <div className="space-y-8 font-[Playfair]">
      {/* BAŞLIQ */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter text-gray-900">
            User Management
          </h1>
          <p className="text-gray-400 text-sm uppercase tracking-widest mt-1 font-medium">
            Registered members and staff
          </p>
        </div>
        <div className="bg-white px-6 py-2 rounded-full shadow-sm border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500">
          {filteredUsers.length} total users
        </div>
      </div>

      {/* İSTİFADƏÇİ CƏDVƏLİ */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase tracking-[2px] text-gray-400">
                <th className="px-8 py-5">Member</th>
                <th className="px-6 py-5">Email Address</th>
                <th className="px-6 py-5">Role</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-20 text-center text-gray-400 italic"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="group hover:bg-gray-50/40 transition-all duration-300"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-sm shadow-md">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-sm uppercase tracking-tight">
                            {u.name}
                          </span>
                          <span className="text-[9px] text-teal-600 font-bold uppercase tracking-widest flex items-center gap-1">
                            <FiCheckCircle size={10} /> Active Member
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-gray-500 text-sm italic font-medium">
                        <FiMail className="opacity-40" /> {u.email}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          u.role === "ADMIN"
                            ? "bg-purple-50 text-purple-700 border-purple-100"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        {u.role === "ADMIN" ? (
                          <FiShield size={10} />
                        ) : (
                          <FiUser size={10} />
                        )}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() =>
                          window.confirm(
                            `Permanently delete user ${u.name}?`,
                          ) && deleteMutation.mutate(u.id)
                        }
                        className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete User"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
