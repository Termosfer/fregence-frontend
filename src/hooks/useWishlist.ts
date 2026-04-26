import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { toast } from "react-toastify";
import type { Perfume, WishlistMutationContext } from "../types/perfume";

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  /* const token = useAuth(); */
  // 1. Wishlist-i çəkirik
  const { data: wishlist = [], isLoading } = useQuery<Perfume[]>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await api.get("/wishlist");
      return res.data;
    },
    enabled: !!token,
  });

  // 2. Sayı çəkirik
  const { data: wishlistCount = 0 } = useQuery<number>({
    queryKey: ["wishlistCount"],
    queryFn: async () => {
      const res = await api.get("/wishlist/count");
      return res.data;
    },
    enabled: !!token,
  });

  // 3. Əlavə etmək üçün Mutation (Optimistic)
  const addMutation = useMutation<
    void,
    Error,
    Perfume,
    WishlistMutationContext
  >({
    mutationFn: (product: Perfume) => api.post(`/wishlist/add/${product.id}`),
    onMutate: async (newProduct: Perfume) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      await queryClient.cancelQueries({ queryKey: ["wishlistCount"] });

      const previousWishlist = queryClient.getQueryData<Perfume[]>([
        "wishlist",
      ]);
      const previousCount = queryClient.getQueryData<number>(["wishlistCount"]);

      // Cache-i anında yeniləyirik
      queryClient.setQueryData<Perfume[]>(["wishlist"], (old) => [
        ...(old || []),
        newProduct,
      ]);
      queryClient.setQueryData<number>(
        ["wishlistCount"],
        (old) => (old || 0) + 1,
      );

      return { previousWishlist, previousCount };
    },
    onSuccess: () => {
      toast.success("Item added to wishlist!");
    },
    onError: (_err, _newProduct, context) => {
      queryClient.setQueryData(["wishlist"], context?.previousWishlist);
      queryClient.setQueryData(["wishlistCount"], context?.previousCount);
      toast.error("An error occurred while adding to wishlist.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlistCount"] });
    },
  });

  // 4. Silmək üçün Mutation (Optimistic)
  const removeMutation = useMutation<
    void,
    Error,
    number,
    WishlistMutationContext
  >({
    mutationFn: (perfumeId: number) =>
      api.delete(`/wishlist/remove/${perfumeId}`),
    onMutate: async (perfumeId: number) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      await queryClient.cancelQueries({ queryKey: ["wishlistCount"] });

      const previousWishlist = queryClient.getQueryData<Perfume[]>([
        "wishlist",
      ]);
      const previousCount = queryClient.getQueryData<number>(["wishlistCount"]);

      // Cache-dən anında silirik
      queryClient.setQueryData<Perfume[]>(["wishlist"], (old) =>
        old?.filter((item: Perfume) => item.id !== perfumeId),
      );
      queryClient.setQueryData<number>(["wishlistCount"], (old) =>
        Math.max(0, (old || 0) - 1),
      );

      return { previousWishlist, previousCount };
    },
    onSuccess: () => {
      toast.info("Item removed from wishlist");
    },
    onError: (_err, _perfumeId, context) => {
      queryClient.setQueryData(["wishlist"], context?.previousWishlist);
      queryClient.setQueryData(["wishlistCount"], context?.previousCount);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["wishlistCount"] });
    },
  });

  const isInWishlist = (id: number) => wishlist.some((item) => item.id === id);

  // Əlavə etmə funksiyası (Artıq product obyektini qəbul edir)
  const addToWishlist = (product: Perfume) => {
    if (!token) {
      toast.error("Please log in first!");
      return;
    }
    if (isInWishlist(product.id)) {
      toast.info("This item is already in your wishlist.");
      return;
    }
    addMutation.mutate(product);
  };

  return {
    wishlist,
    wishlistCount,
    isLoading,
    addToWishlist,
    removeFromWishlist: removeMutation.mutate,
    isInWishlist,
  };
};
