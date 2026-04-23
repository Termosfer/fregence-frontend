import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { toast } from "react-toastify";
import type { AddToCartArgs, CartItem, CartMutationContext, CartResponse, Perfume } from "../types/perfume";

export const useCart = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  // 1. Səbəti gətir
  const { data: responseData, isLoading } = useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get("/cart");
      return res.data;
    },
    enabled: !!token,
    // BU SƏTİRLƏRİ ƏLAVƏ EDİN:
    staleTime: 0, // Datanı hər zaman köhnə say ki, invalidated olan kimi dərhal fetch etsin
    refetchOnMount: true, // Komponent hər görünəndə (modal açılanda) yoxlasın
  });

  const cartItems = responseData?.items || [];
  const cartTotal = cartItems.reduce((sum, item) => sum + item.subTotal, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // 2. Artırıb-azaltma / Əlavə etmə
  const addToCartMutation = useMutation<void, Error, AddToCartArgs, CartMutationContext>({
    mutationKey: ["cart-update"],
    mutationFn: ({ perfumeId, quantity }) => 
      api.post(`/cart/add?perfumeId=${perfumeId}&quantity=${quantity}`),

    onMutate: async ({ perfumeId, quantity, perfume }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<CartResponse>(["cart"]);

      queryClient.setQueryData<CartResponse>(["cart"], (old) => {
        if (!old) return { items: [], totalAmount: 0 };

        const existingItem = old.items?.find((i) => i.perfumeId === perfumeId);
        let newItems: CartItem[];

        if (existingItem) {
          newItems = old.items.map((item) =>
            item.perfumeId === perfumeId
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  subTotal: (item.quantity + quantity) * item.price,
                }
              : item,
          );
        } else {
          const newItem: CartItem = {
            cartItemId: Math.random(), 
            perfumeId: perfumeId,
            perfumeName: perfume?.name || "Loading...",
            brand: perfume?.brand || "...",
            price: perfume?.price || 0,
            quantity: quantity,
            subTotal: (perfume?.price || 0) * quantity,
            imageUrl: perfume?.imageUrl, 
          };
          newItems = [...(old.items || []), newItem];
        }

        const newTotal = newItems.reduce((sum, i) => sum + i.subTotal, 0);
        return { ...old, items: newItems, totalAmount: newTotal };
      });

      return { previousCart };
    },

    onSuccess: (_data, variables) => {
      // Mutasiya uğurlu olan kimi dərhal cache-i ləğv et və təzələ
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      if (variables.isNew) {
        toast.success("Məhsul səbətə əlavə edildi!");
      }
    },

    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      toast.error("Xəta baş verdi, yenidən yoxlayın.");
    },

    onSettled: () => {
      // Bütün mutasiyalar bitibsə mütləq serverlə sinxronlaş
      if (queryClient.isMutating({ mutationKey: ["cart-update"] }) === 0) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
  });

  // 3. Silmək Mutasiyası
  const removeFromCartMutation = useMutation<void, Error, number, CartMutationContext>({
    mutationKey: ["cart-remove"],
    mutationFn: (cartItemId: number) => api.delete(`/cart/remove/${cartItemId}`),

    onMutate: async (cartItemId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<CartResponse>(["cart"]);

      queryClient.setQueryData<CartResponse>(["cart"], (old) => {
        if (!old) return old;
        const filteredItems = old.items.filter(item => item.cartItemId !== cartItemId);
        const newTotal = filteredItems.reduce((sum, i) => sum + i.subTotal, 0);
        return { ...old, items: filteredItems, totalAmount: newTotal };
      });

      return { previousCart };
    },
    onSuccess: () => {
      toast.info("Məhsul səbətdən silindi");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleAddToCart = (product: Perfume) => {
    if (!token) return toast.error("Zəhmət olmasa əvvəlcə giriş edin");
    
    const alreadyInCart = cartItems.some(item => item.perfumeId === product.id);
    if (alreadyInCart) {
      return toast.info("Bu məhsul artıq səbətinizdədir.");
    }

    addToCartMutation.mutate({
      perfumeId: product.id,
      quantity: 1,
      perfume: product,
      isNew: true 
    });
  };

  return {
    cartItems,
    cartCount,
    cartTotal,
    isLoading,
    isUpdating: addToCartMutation.isPending,
    updatingVariables: addToCartMutation.variables,
    isRemoving: removeFromCartMutation.isPending,
    removingVariables: removeFromCartMutation.variables,
    addToCart: handleAddToCart,
    updateQuantity: addToCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
  };
};