import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthUser } from "@entities/auth/hooks";
import { 
  apiGetCart, 
  apiAddCartItem, 
  apiUpdateCartItem, 
  apiRemoveCartItem, 
  apiClearCart, 
  apiMergeCart 
} from "./api";
import type { AddToCartReq, UpdateCartItemReq, Cart, MergeCartReq } from "./types";

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
    // cÃ³ thá»ƒ thÃªm optimistic update náº¿u muá»‘n
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
  // 1. Kiá»ƒm tra xem user Ä‘Ã£ Ä‘Äƒng nháº­p chÆ°a
  const { data: user } = useAuthUser();
  const isLoggedIn = !!user;

  // 2. Gá»i hook láº¥y giá» hÃ ng (Chá»‰ cháº¡y khi Ä‘Ã£ login)
  const { data: cart } = useCart({ enabled: isLoggedIn });

  // 3. TÃ­nh toÃ¡n: Cá»™ng dá»“n field 'quantity' cá»§a tá»«ng item
  // Náº¿u cart chÆ°a load hoáº·c khÃ´ng cÃ³ item, tráº£ vá» 0
  const count = cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;

  return count;
}

export function useMergeCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: MergeCartReq) => apiMergeCart(payload),
    onSuccess: () => {
      // Sau khi merge xong, báº¯t buá»™c pháº£i invalidate Ä‘á»ƒ fetch láº¡i giá» hÃ ng má»›i nháº¥t tá»« server
      // LÃºc nÃ y giá» hÃ ng server Ä‘Ã£ cÃ³ thÃªm cÃ¡c item tá»« local
      qc.invalidateQueries({ queryKey: cartKeys.root });
    },
  });
}


