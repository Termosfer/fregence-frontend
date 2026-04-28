import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { toast } from "react-toastify";
import type {
  ApiError,
  Order,
  OrderFilterParams,
  OrderStatus,
  ShipOrderArgs,
} from "../types/perfume";
import type { AxiosError } from "axios";
import { useState } from "react";

export const useOrder = () => {
  const queryClient = useQueryClient();

  const { data: myOrders = [], isLoading: isMyOrdersLoading } = useQuery<
    Order[]
  >({
    queryKey: ["my-orders"],
    queryFn: () => api.get("/orders/my").then((res) => res.data),
    // VACİB OPTİMİZASİYA:
    refetchInterval: (query) => {
      // Sifarişləri yoxlayırıq: Əgər içində statusu 'PENDING' və ya 'SHIPPED' olan varsa
      const hasActiveOrder = query.state.data?.some(
        (order) => order.status === "PENDING" || order.status === "SHIPPED",
      );

      // Aktiv sifariş varsa 20 saniyədən bir yoxla, yoxdursa (hamısı delivered-dirsə) polling-i söndür (false)
      return hasActiveOrder ? 20000 : false;
    },

    // İstifadəçi pəncərədən çıxanda (məsələn YouTube-a keçəndə) sorğu atmağı dayandırır
    refetchOnWindowFocus: true,
    staleTime: 1000 * 30, // Datanı 30 saniyə təzə say
  });

  const checkoutMutation = useMutation({
    mutationFn: (checkoutData: {
      address: string;
      phoneNumber: string;
      note?: string;
    }) => api.post("/orders/checkout", null, { params: checkoutData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      toast.success("Order placed successfully!");
    },
  });

  const { data: allOrders = [], isLoading: isAllOrdersLoading } = useQuery<
    Order[]
  >({
    queryKey: ["admin-all-orders"],
    queryFn: () => api.get("/orders/admin/all").then((res) => res.data),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      api.patch(`/orders/admin/${id}/status?status=${status}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-orders"] });
      toast.success("Status updated!");
    },
  });

  const shipMutation = useMutation<void, AxiosError<ApiError>, ShipOrderArgs>({
    mutationFn: ({ id, courierName, courierPhone, estimatedTime }) =>
      api.patch(`/orders/admin/${id}/ship`, null, {
        params: {
          courierName,
          courierPhone,
          estimatedTime: `${estimatedTime}:00`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-orders"] });
      toast.success("Order is on its way!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Shipping error");
    },
  });

  // Tək sifariş silmə - OPTİMİSTİK
  const deleteOrderMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/orders/admin/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["admin-all-orders"] });
      const previous = queryClient.getQueryData<Order[]>(["admin-all-orders"]);

      // DƏRHAL sil
      queryClient.setQueryData<Order[]>(
        ["admin-all-orders"],
        (old) => old?.filter((o) => o.id !== id) ?? [],
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["admin-all-orders"], context?.previous);
      toast.error("Could not delete order.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-orders"] });
    },
  });

  // Bütün sifarişləri silmə - OPTİMİSTİK
  const deleteAllOrdersMutation = useMutation({
    mutationFn: () => api.delete("/orders/admin/all"),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["admin-all-orders"] });
      const previous = queryClient.getQueryData<Order[]>(["admin-all-orders"]);

      // DƏRHAL hamısını sil
      queryClient.setQueryData<Order[]>(["admin-all-orders"], []);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["admin-all-orders"], context?.previous);
      toast.error("Could not delete orders.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-orders"] });
      toast.success("All orders deleted.");
    },
  });

  // Filter - onSuccess-də dərhal state yenilə
  const [localFilteredOrders, setLocalFilteredOrders] = useState<Order[]>([]);

  const filterOrdersMutation = useMutation({
    mutationFn: (params: OrderFilterParams) =>
      api.get("/orders/admin/filter", { params }).then((res) => res.data),
    onSuccess: (data) => {
      setLocalFilteredOrders(data);
    },
    onError: () => toast.error("Filter failed."),
  });

  return {
    myOrders,
    allOrders,
    /* filteredOrders: filterOrdersMutation.data as Order[] | undefined, */
    isLoading: isMyOrdersLoading || isAllOrdersLoading,
    isFiltering: filterOrdersMutation.isPending,
    checkout: checkoutMutation.mutate,
    isCheckingOut: checkoutMutation.isPending,
    updateStatus: updateStatusMutation.mutate,
    shipOrder: shipMutation.mutate,
    isShipping: shipMutation.isPending,
    deleteOrder: deleteOrderMutation.mutate,
    isDeletingOrder: deleteOrderMutation.isPending,
    deleteAllOrders: deleteAllOrdersMutation.mutate,
    isDeletingAll: deleteAllOrdersMutation.isPending,
    filterOrders: filterOrdersMutation.mutate,
    filteredOrders: localFilteredOrders,
  };
};
