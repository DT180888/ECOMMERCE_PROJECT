import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiGetCart,
  apiAddCartItem,
  apiUpdateCartItem,
  apiRemoveCartItem,
  apiClearCart,
  apiMergeCart,
} from "./api";
import type { AddToCartReq, UpdateCartItemReq, Cart, MergeCartReq } from "./types";
import { useAuthUser } from "@entities/auth/hooks";

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
    // có thể thêm optimistic update nếu muốn
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
  // 1. Kiểm tra xem user đã đăng nhập chưa
  const { data: user } = useAuthUser();
  const isLoggedIn = !!user;

  // 2. Gọi hook lấy giỏ hàng (Chỉ chạy khi đã login)
  const { data: cart } = useCart({ enabled: isLoggedIn });

  // 3. Tính toán: Cộng dồn field 'quantity' của từng item
  // Nếu cart chưa load hoặc không có item, trả về 0
  const count = cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;

  return count;
}

export function useMergeCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: MergeCartReq) => apiMergeCart(payload),
    onSuccess: () => {
      // Sau khi merge xong, bắt buộc phải invalidate để fetch lại giỏ hàng mới nhất từ server
      // Lúc này giỏ hàng server đã có thêm các item từ local
      qc.invalidateQueries({ queryKey: cartKeys.root });
    },
  });
}
