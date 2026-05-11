import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { toast } from "react-toastify";
import type {
  ApiError,
  Order,
  OrderFilterParams,
  OrderStatus,
  ShipOrderArgs,
  PageResponse,
} from "../types/perfume";
import type { AxiosError } from "axios";

export const useOrder = (page: number = 0, size: number = 10) => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  const isAdminPath = window.location.pathname.includes("/admin");
  // -----------------------------------------------------------
  // 1. MÜŞTƏRİ ÜÇÜN SİFARİŞLƏR (5 saniyəlik canlı yenilənmə)
  // -----------------------------------------------------------
   const { data: myOrders = [], isLoading: isMyOrdersLoading } = useQuery<Order[]>({
    queryKey: ["my-orders"],
    queryFn: () => api.get("/orders/my").then((res) => res.data),
    refetchInterval: 5000, // 5 saniyədən bir avtomatik yenilənmə (refresh-siz status dəyişimi üçün)
    enabled: !!token && !isAdminPath, // <--- ADMİN DEYİLSƏ İŞLƏSİN
  });

  // -----------------------------------------------------------
  // 2. ADMİN ÜÇÜN BÜTÜN SİFARİŞLƏR (5 saniyəlik canlı yenilənmə)
  // -----------------------------------------------------------
  const { data: ordersData, isLoading: isAllOrdersLoading } = useQuery<PageResponse<Order>>({
    queryKey: ["admin-orders", page, size],
    queryFn: () => api.get("/orders/admin/all", { params: { page, size } }).then((res) => res.data),
    refetchInterval: 5000, 
    enabled: !!token && isAdminPath, // <--- ANCAQ ADMİN PANELİNDƏ İŞLƏSİN
  });

  // -----------------------------------------------------------
  // 3. SİFARİŞ YARATMAQ (CHECKOUT)
  // -----------------------------------------------------------
  const checkoutMutation = useMutation({
    mutationFn: (checkoutData: {
      address: string;
      phoneNumber: string;
      preferredTime: string;
      note?: string;
    }) => api.post("/orders/checkout", null, { params: checkoutData }),
    onSuccess: () => {
      // Çox vacib: Həm müştəri, həm də admin kəşini dərhal silirik
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order placed successfully!");
    },
  });

  // -----------------------------------------------------------
  // 4. STATUS YENİLƏMƏ (ADMİN)
  // -----------------------------------------------------------
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      api.patch(`/orders/admin/${id}/status?status=${status}`),
    onSuccess: () => {
      // Status dəyişən kimi hər iki tərəfin siyahısını təzələyirik
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      toast.success("Status updated!");
    },
  });

  // -----------------------------------------------------------
  // 5. KURYER TƏYİNİ (SHIP)
  // -----------------------------------------------------------
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
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      toast.success("Order is being shipped!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Shipping error");
    },
  });

  // -----------------------------------------------------------
  // 6. SİFARİŞ SİLMƏ (Soft Delete)
  // -----------------------------------------------------------
  const deleteOrderMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/orders/admin/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      toast.info("Order moved to trash.");
    },
  });

  // -----------------------------------------------------------
  // 7. BÜTÜN SİFARİŞLƏRİ SİLMƏ
  // -----------------------------------------------------------
  const deleteAllOrdersMutation = useMutation({
    mutationFn: () => api.delete("/orders/admin/all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("All orders cleared.");
    },
  });

  // -----------------------------------------------------------
  // 8. FİLTİRLƏMƏ (PAGINATED)
  // -----------------------------------------------------------
  const filterOrdersMutation = useMutation({
    mutationFn: (params: OrderFilterParams) =>
      api.get("/orders/admin/filter", { 
        params: { ...params, page, size } 
      }).then((res) => res.data),
    onSuccess: (data: PageResponse<Order>) => {
      // Filtr nəticəsini birbaşa admin siyahısına tətbiq edirik
      queryClient.setQueryData(["admin-orders", page, size], data);
    },
  });

  return {
    myOrders,
    ordersData,
    allOrders: ordersData?.content || [],
    isLoading: isAdminPath ? isAllOrdersLoading : isMyOrdersLoading,
    /* isLoading: isMyOrdersLoading || isAllOrdersLoading, */
    isCheckingOut: checkoutMutation.isPending,
    isShipping: shipMutation.isPending,
    isDeletingOrder: deleteOrderMutation.isPending,
    isDeletingAll: deleteAllOrdersMutation.isPending,
    isFiltering: filterOrdersMutation.isPending,
    
    checkout: checkoutMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    shipOrder: shipMutation.mutate,
    deleteOrder: deleteOrderMutation.mutate,
    deleteAllOrders: deleteAllOrdersMutation.mutate,
    filterOrders: filterOrdersMutation.mutate,
  };
};