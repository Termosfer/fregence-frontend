import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { toast } from "react-toastify";
import type { ApiError, Order, OrderStatus, ShipOrderArgs } from "../types/perfume";
import type { AxiosError } from "axios";

export const useOrder = () => {
  const queryClient = useQueryClient();

  // --- USER ENDPOINTS ---

  // 1. İstifadəçinin öz sifarişləri (GET /api/orders/my)
  const { data: myOrders = [], isLoading: isMyOrdersLoading } = useQuery<Order[]>({
    queryKey: ["my-orders"],
    queryFn: () => api.get("/orders/my").then((res) => res.data),
  });

  // 2. Sifarişi tamamlamaq (POST /api/orders/checkout)
  const checkoutMutation = useMutation({
    mutationFn: (checkoutData: { address: string; phoneNumber: string; note?: string }) =>
      api.post("/orders/checkout", null, { params: checkoutData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] }); // Səbəti təmizlə
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      toast.success("Order placed successfully!");
    },
  });

  // --- ADMIN ENDPOINTS ---

  // 3. Bütün sifarişlər (GET /api/orders/admin/all)
  const { data: allOrders = [], isLoading: isAllOrdersLoading } = useQuery<Order[]>({
    queryKey: ["admin-all-orders"],
    queryFn: () => api.get("/orders/admin/all").then((res) => res.data),
  });

  // 4. Statusu dəyişmək (PATCH /api/orders/admin/{id}/status)
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      api.patch(`/orders/admin/${id}/status?status=${status}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-orders"] });
      toast.success("Status updated!");
    },
  });

  // 5. Sifarişi yola salmaq (PATCH /api/orders/admin/{id}/ship)
// useOrder.ts daxilində shipMutation hissəsi:

const shipMutation = useMutation<void, AxiosError<ApiError>, ShipOrderArgs>({
  mutationFn: ({ 
    id, 
    courierName, 
    courierPhone, 
    estimatedTime 
  }: { 
    id: number; 
    courierName: string; 
    courierPhone: string; 
    estimatedTime: string; 
  }) =>
    api.patch(`/orders/admin/${id}/ship`, null, {
      params: { 
        courierName, 
        courierPhone, 
        estimatedTime: `${estimatedTime}:00` // Backend LocalDateTime gözləyirsə saniyəni əlavə edirik
      }
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["admin-all-orders"] });
    toast.success("Order is on its way!");
  },
  onError: (error) => {
    toast.error(error.response?.data?.message || "Shipping error");
  }
});

  return {
    myOrders,
    allOrders,
    isLoading: isMyOrdersLoading || isAllOrdersLoading,
    checkout: checkoutMutation.mutate,
    isCheckingOut: checkoutMutation.isPending,
    updateStatus: updateStatusMutation.mutate,
    shipOrder: shipMutation.mutate,
    isShipping: shipMutation.isPending 
  };
};