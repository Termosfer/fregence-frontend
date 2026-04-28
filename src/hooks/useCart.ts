import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { toast } from "react-toastify";
import type {
  AddToCartArgs,
  CartItem,
  CartMutationContext,
  CartResponse,
  Perfume,
} from "../types/perfume";

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
    staleTime: 0, 
    refetchOnMount: true, 
  });

  const cartItems = responseData?.items || [];
  const cartTotal = cartItems.reduce((sum, item) => sum + item.subTotal, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // 2. Artırıb-azaltma / Əlavə etmə
  const addToCartMutation = useMutation<
    void,
    Error,
    AddToCartArgs,
    CartMutationContext
  >({
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
          newItems = old.items?.map((item) => {
            if (item.perfumeId === perfumeId) {
              const newQty = item.quantity + quantity;
              
              // VACİB: Endirimli qiymət varsa onu götür, yoxdursa normal qiyməti
              const effectivePrice = (item.discountPrice && item.discountPrice > 0) 
                                     ? item.discountPrice 
                                     : item.price;

              return {
                ...item,
                quantity: newQty,
                subTotal: newQty * effectivePrice, // Qiymət sıçrayışının qarşısını alan sətir
              };
            }
            return item;
          });
        } else {
          // Yeni məhsul əlavə ediləndə endirimli qiyməti müəyyən edirik
          const effectivePrice = (perfume?.discountPrice && perfume.discountPrice > 0) 
                                 ? perfume.discountPrice 
                                 : (perfume?.price || 0);

          const newItem: CartItem = {
            cartItemId: Math.random(), // Keçici ID
            perfumeId: perfumeId,
            perfumeName: perfume?.name || "Loading...",
            brand: perfume?.brand || "...",
            price: perfume?.price || 0,
            discountPrice: perfume?.discountPrice || 0, // DTO-dan gələn endirimi saxla
            quantity: quantity,
            subTotal: effectivePrice * quantity,
            imageUrl: perfume?.imageUrl || "",
          };
          newItems = [...(old.items || []), newItem];
        }

        const newTotal = newItems.reduce((sum, i) => sum + i.subTotal, 0);
        return { ...old, items: newItems, totalAmount: newTotal };
      });

      return { previousCart };
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      if (variables.isNew) {
        toast.success("Item added to cart!");
      }
    },

    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      toast.error("Something went wrong. Please try again.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // 3. Silmək Mutasiyası
  const removeFromCartMutation = useMutation<
    void,
    Error,
    number,
    CartMutationContext
  >({
    mutationKey: ["cart-remove"],
    mutationFn: (cartItemId: number) =>
      api.delete(`/cart/remove/${cartItemId}`),

    onMutate: async (cartItemId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<CartResponse>(["cart"]);

      queryClient.setQueryData<CartResponse>(["cart"], (old) => {
        if (!old) return old;
        const filteredItems = old.items.filter(
          (item) => item.cartItemId !== cartItemId,
        );
        const newTotal = filteredItems.reduce((sum, i) => sum + i.subTotal, 0);
        return { ...old, items: filteredItems, totalAmount: newTotal };
      });

      return { previousCart };
    },
    onSuccess: () => {
      toast.info("Item removed from cart.");
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
    if (!token) return toast.error("Please log in first!");

    const alreadyInCart = cartItems.some(
      (item) => item.perfumeId === product.id,
    );
    if (alreadyInCart) {
      return toast.info("This item is already in your cart.");
    }

    addToCartMutation.mutate({
      perfumeId: product.id,
      quantity: 1,
      perfume: product,
      isNew: true,
    });
  };

  const clearCart = () => {
    queryClient.setQueryData<CartResponse>(["cart"], {
      items: [],
      totalAmount: 0,
    });
    queryClient.invalidateQueries({ queryKey: ["cart"] });
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
    clearCart,
  };
};