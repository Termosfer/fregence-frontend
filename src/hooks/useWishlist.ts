import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { toast } from "react-toastify";
import type { 
  Perfume, 
  WishlistItemDTO, 
  WishlistMutationContext 
} from "../types/perfume";

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  // 1. Wishlist-i çəkirik
  const { data: wishlist = [], isLoading } = useQuery<WishlistItemDTO[]>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await api.get<WishlistItemDTO[]>("/wishlist");
      return res.data;
    },
    enabled: !!token,
  });

  // 2. Sayı çəkirik
  const { data: wishlistCount = 0 } = useQuery<number>({
    queryKey: ["wishlistCount"],
    queryFn: async () => {
      const res = await api.get<number>("/wishlist/count");
      return res.data;
    },
    enabled: !!token,
  });

  // 3. Əlavə etmək üçün Mutation
  const addMutation = useMutation<
    void, 
    Error, 
    { variantId: number; product: Perfume }, 
    WishlistMutationContext
  >({
    mutationFn: ({ variantId }) => api.post(`/wishlist/add/${variantId}`),
    
    onMutate: async ({ variantId, product }) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      await queryClient.cancelQueries({ queryKey: ["wishlistCount"] });

      const previousWishlist = queryClient.getQueryData<WishlistItemDTO[]>(["wishlist"]);
      const previousCount = queryClient.getQueryData<number>(["wishlistCount"]);

      // Optimistic Update: Obyekti WishlistItemDTO strukturuna uyğunlaşdırırıq
      const newItem: WishlistItemDTO = {
        perfumeId: product.id,
        variantId: variantId,
        perfumeName: product.name,
        brand: product.brand,
        imageUrl: product.imageUrl,
        ml: product.defaultMl || 0,
        price: product.price,
        discountPrice: product.discountPrice || null
      };

      queryClient.setQueryData<WishlistItemDTO[]>(["wishlist"], (old) => [
        ...(old || []),
        newItem
      ]);
      queryClient.setQueryData<number>(["wishlistCount"], (old) => (old || 0) + 1);

      return { previousWishlist, previousCount };
    },
    onSuccess: () => {
      toast.success("Added to wishlist!");
    },
    onError: (_err, _variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(["wishlist"], context.previousWishlist);
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(["wishlistCount"], context.previousCount);
      }
      toast.error("An error occurred.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlistCount"] });
    },
  });

  // 4. Silmək üçün Mutation
  const removeMutation = useMutation<
    void, 
    Error, 
    number, 
    WishlistMutationContext
  >({
    mutationFn: (variantId: number) => api.delete(`/wishlist/remove/${variantId}`),
    
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      await queryClient.cancelQueries({ queryKey: ["wishlistCount"] });

      const previousWishlist = queryClient.getQueryData<WishlistItemDTO[]>(["wishlist"]);
      const previousCount = queryClient.getQueryData<number>(["wishlistCount"]);

      queryClient.setQueryData<WishlistItemDTO[]>(["wishlist"], (old) =>
        old?.filter((item) => item.variantId !== id && item.perfumeId !== id)
      );
      queryClient.setQueryData<number>(["wishlistCount"], (old) => Math.max(0, (old || 0) - 1));

      return { previousWishlist, previousCount };
    },
    onSuccess: () => {
      toast.info("Removed from wishlist");
    },
    onError: (_err, _id, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(["wishlist"], context.previousWishlist);
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(["wishlistCount"], context.previousCount);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlistCount"] });
    },
  });

  // Yoxlama: Müştərinin ana səhifədəki kartında 'ürək' rəngini təyin edir
  const isInWishlist = (perfumeId: number): boolean => {
    return wishlist.some((item) => item.perfumeId === perfumeId);
  };

  // Silmə funksiyası: perfumeId gəlsə belə siyahıdan onun variantId-sini tapır
  const removeFromWishlist = (id: number): void => {
    const item = wishlist.find((w) => w.perfumeId === id || w.variantId === id);
    const variantIdToDelete = item?.variantId || id;

    if (variantIdToDelete) {
      removeMutation.mutate(variantIdToDelete);
    } else {
      toast.error("Could not find item to remove.");
    }
  };

  // Əlavə etmə funksiyası
  const addToWishlist = (product: Perfume): void => {
    if (!token) {
      toast.error("Please log in first!");
      return;
    }
    
    if (isInWishlist(product.id)) {
      toast.info("Already in wishlist.");
      return;
    }

    // Default variant tapılır
    const defaultVariant = product.variants?.find(v => v.ml === product.defaultMl) || product.variants?.[0];

    if (defaultVariant) {
      addMutation.mutate({ variantId: defaultVariant.id, product });
    } else {
      toast.error("Product variant not found.");
    }
  };

  return {
    wishlist,
    wishlistCount,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
};