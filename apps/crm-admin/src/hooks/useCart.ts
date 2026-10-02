import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthUser } from "./useAuth";
import { 
  apiGetCart, 
  apiAddCartItem, 
  apiUpdateCartItem, 
  apiRemoveCartItem, 
  apiClearCart, 
  apiMergeCart 
} from "@my-project/api";
import type { AddToCartReq, UpdateCartItemReq, Cart, MergeCartReq } from "@my-project/api";

export const cartKeys = {
  root: ["cart"] as const,
};

export function useCart(options?: { enabled?: boolean }) {
  return useQuery<Cart>({
    queryKey: cartKeys.root,
    queryFn: apiGetCart,
    enabled: options?.enabled ?? true, 
    staleTime: 30_000,
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddToCartReq) => apiAddCartItem(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.root }),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ cartItemId, payload }: { cartItemId: number; payload: UpdateCartItemReq }) =>
      apiUpdateCartItem(cartItemId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.root }),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cartItemId: number) => apiRemoveCartItem(cartItemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.root }),
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiClearCart(),
    onSuccess: () => qc.invalidateQueries({ queryKey: cartKeys.root }),
  });
}

export function useCartCount() {
  const { data: user } = useAuthUser();
  const isLoggedIn = !!user;

  const { data: cart } = useCart({ enabled: isLoggedIn });

  const count = cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;

  return count;
}

export function useMergeCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: MergeCartReq) => apiMergeCart(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cartKeys.root });
    },
  });
}
