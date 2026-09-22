import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { apiCheckoutFromCart, apiGetMyOrders, apiGetOrderDetail, getCheckoutPreview } from "./api";
import type { CheckoutReq, MyOrderListRes, OrderDetail, OrderId, CheckoutPreviewDto } from "./types";

// --- 1. Centralized Query Keys ---
export const orderKeys = {
  root: ["orders"] as const,
  list: (filters?: any) => [...orderKeys.root, "list", ...(filters ? [filters] : [])] as const,
  detail: (id: OrderId) => [...orderKeys.root, "detail", id] as const,
  preview: (params: { shipId: number | null; billId: number | null; couponCode?: string | null }) => 
    [...orderKeys.root, "preview", params] as const,
};

// --- 2. Mutations ---

export function useCheckoutOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckoutReq) => apiCheckoutFromCart(payload),
    onSuccess: () => {
      // 1. LÃ m má»›i danh sÃ¡ch Ä‘Æ¡n hÃ ng
      qc.invalidateQueries({ queryKey: orderKeys.list() });
      
      // 2. LÃ m má»›i giá» hÃ ng (QUAN TRá»ŒNG: Äá»ƒ sá»‘ lÆ°á»£ng trÃªn icon giá» hÃ ng vá» 0)
      // Giáº£ Ä‘á»‹nh báº¡n cÃ³ key nÃ y. Náº¿u khÃ´ng, hÃ£y import tá»« entity/cart
      qc.invalidateQueries({ queryKey: ["cart"] }); 
    },
  });
}

// --- 3. Queries ---

export function useMyOrders(params?: { page?: number; size?: number }) {
  const page = params?.page ?? 1;
  const size = params?.size ?? 10;

  return useQuery<MyOrderListRes>({
    // Truyá»n params vÃ o key Ä‘á»ƒ cache riÃªng tá»«ng trang
    queryKey: orderKeys.list({ page, size }),
    queryFn: () => apiGetMyOrders({ page, size }),
    placeholderData: keepPreviousData, // Giá»¯ dá»¯ liá»‡u cÅ© khi chuyá»ƒn trang Ä‘á»ƒ khÃ´ng bá»‹ giáº­t
  });
}

export function useOrderDetail(id?: OrderId, opts?: { enabled?: boolean }) {
  return useQuery<OrderDetail>({
    queryKey: orderKeys.detail(id!),
    queryFn: () => apiGetOrderDetail(id!),
    enabled: opts?.enabled ?? !!id, // Chá»‰ fetch khi cÃ³ ID
    staleTime: 1000 * 60 * 5, // Cache chi tiáº¿t 5 phÃºt (Ã­t thay Ä‘á»•i)
  });
}

export function useCheckoutPreview(params: {
  shipToAddressId: number | null;
  billToAddressId: number | null;
  couponCode?: string | null;
}) {
  // Chỉ fetch khi đã chọn địa chỉ giao hàng
  const enabled = !!params.shipToAddressId;

  return useQuery<CheckoutPreviewDto>({
    // Sử dụng key tập trung
    queryKey: orderKeys.preview({ 
      shipId: params.shipToAddressId, 
      billId: params.billToAddressId,
      couponCode: params.couponCode 
    }),
    queryFn: () =>
      getCheckoutPreview({
        shipToAddressId: params.shipToAddressId!, // Non-null assertion an toàn vì enabled = true
        billToAddressId: params.billToAddressId,
        couponCode: params.couponCode,
      }),
    enabled,
    // KhÃ´ng cache preview quÃ¡ lÃ¢u vÃ¬ tá»“n kho/giÃ¡ cÃ³ thá»ƒ Ä‘á»•i
    staleTime: 0, 
  });
}
