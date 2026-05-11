import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { toast } from "react-toastify";
import type {
  AddToCartArgs,
  CartItem,
  CartMutationContext,
  CartResponse,
  Perfume,
  WishlistItemDTO,
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
  const cartTotal = responseData?.totalAmount || 0;
  const cartCount = cartItems.length; // Sətir sayını (növ) göstərmək üçün

  // 2. Artırıb-azaltma / Əlavə etmə (VARIANT ID İLƏ)
  const addToCartMutation = useMutation<
    void,
    Error,
    AddToCartArgs,
    CartMutationContext
  >({
    mutationKey: ["cart-update"],
    // DÜZƏLİŞ: URL-də perfumeId yerinə variantId göndəririk
    mutationFn: ({ variantId, quantity }) =>
      api.post(`/cart/add?variantId=${variantId}&quantity=${quantity}`),

    onMutate: async ({ variantId, quantity, perfume, variant }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<CartResponse>(["cart"]);

      queryClient.setQueryData<CartResponse>(["cart"], (old) => {
        if (!old) return { items: [], totalAmount: 0 };

        // DÜZƏLİŞ: Axtarışı variantId üzərindən edirik
        const existingItem = old.items?.find((i) => i.variantId === variantId);
        let newItems: CartItem[];

        if (existingItem) {
          newItems = old.items?.map((item) => {
            if (item.variantId === variantId) {
              const newQty = item.quantity + quantity;
              
              const effectivePrice = (item.discountPrice && item.discountPrice > 0) 
                                     ? item.discountPrice 
                                     : item.price;

              return {
                ...item,
                quantity: newQty,
                subTotal: newQty * effectivePrice,
              };
            }
            return item;
          });
        } else {
          // Yeni məhsul üçün qiymət hesablama
          // Əgər 'variant' obyekti göndərilibsə ordan götür, yoxdursa perfume-dan
          const price = variant?.price || perfume?.price || 0;
          const discountPrice = variant?.discountPrice || perfume?.discountPrice || 0;
          const effectivePrice = (discountPrice > 0) ? discountPrice : price;

          const newItem: CartItem = {
            cartItemId: Math.random(), 
            perfumeId: perfume?.id || 0,
            variantId: variantId, // Yeni sahə
            perfumeName: perfume?.name || "Loading...",
            brand: perfume?.brand || "...",
            ml: variant?.ml || 0, // Yeni sahə
            price: price,
            discountPrice: discountPrice,
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

  // 3. Silmək Mutasiyası (cartItemId ilə - dəyişməz qalır)
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

  // Ana səhifədəki "Quick Add" düyməsi üçün (Default variantı əlavə edir)
 // useCart.ts daxilində handleAddToCart funksiyasını belə yenilə:

const handleAddToCart = (product: Perfume | WishlistItemDTO) => { // 'any' yazırıq ki, fərqli strukturları qəbul etsin
  if (!token) return toast.error("Please log in first!");

  // 1. Variant ID-ni tapmaq üçün 3 mənbəyə baxırıq:
  // a) Obyektin özündə birbaşa 'variantId' varmı? (Wishlist-dən gələndə belə olur)
  // b) 'variants' massivi varmı? (Ana səhifədən gələndə belə olur)
  // c) Heç biri yoxdursa 'id' sahəsini variantId kimi yoxla (Bəzi hallarda lazım olur)
  
  const vId = ("variantId" in product) 
             ? product.variantId 
             : product.variants?.find((v) => v.ml === product.defaultMl)?.id || 
               product.variants?.[0]?.id;

  if (!vId) {
    console.error("Variant ID tapılmadı:", product);
    return toast.error("Product information is incomplete.");
  }

  const alreadyInCart = cartItems.some((item) => item.variantId === vId);

  if (alreadyInCart) {
    return toast.info("This item is already in your cart.");
  }

  // Tapılan vId ilə əlavə edirik
  addToCartMutation.mutate({
    variantId: vId,
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