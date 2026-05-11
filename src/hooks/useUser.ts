import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import type { ApiError, UserProfile } from "../types/perfume";

export const useUser = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  const { data: user, isLoading: isUserLoading } = useQuery<UserProfile>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return res.data;
    },
    enabled: !!token, // Ancaq token varsa işləsin
  });

  const updateProfileMutation = useMutation<void, AxiosError<ApiError>, { name: string; email: string }>({
    mutationFn: (data) => api.put("/users/me", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Profile updated!");
    },
  });

  const changePasswordMutation = useMutation<void, AxiosError<ApiError>, { oldPassword: string; newPassword: string }>({
    mutationFn: (data) => api.patch("/users/me/password", data),
    onSuccess: () => toast.success("Password updated!"),
    onError: (error) => toast.error(error.response?.data?.message || "Failed to change password"),
  });

  return {
    user,
    isLoading: isUserLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,
  };
};