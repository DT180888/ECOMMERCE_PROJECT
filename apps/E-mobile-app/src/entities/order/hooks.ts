import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { apiCheckoutFromCart, apiGetMyOrders, apiGetOrderDetail, getCheckoutPreview } from "./api";
import type { CheckoutReq, MyOrderListRes, OrderDetail, OrderId, CheckoutPreviewDto } from "./types";

// --- 1. Centralized Query Keys ---
export const orderKeys = {
  root: ["orders"] as const,
  list: (filters?: any) => [...orderKeys.root, "list", ...(filters ? [filters] : [])] as const,
  detail: (id: OrderId) => [...orderKeys.root, "detail", id] as const,
  preview: (params: { shipId: number | null; billId: number | null }) => 
    [...orderKeys.root, "preview", params] as const,
};

// --- 2. Mutations ---

export function useCheckoutOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckoutReq) => apiCheckoutFromCart(payload),
    onSuccess: () => {
      // 1. Làm mới danh sách đơn hàng
      qc.invalidateQueries({ queryKey: orderKeys.list() });
      
      // 2. Làm mới giỏ hàng (QUAN TRỌNG: Để số lượng trên icon giỏ hàng về 0)
      // Giả định bạn có key này. Nếu không, hãy import từ entity/cart
      qc.invalidateQueries({ queryKey: ["cart"] }); 
    },
  });
}

// --- 3. Queries ---

export function useMyOrders(params?: { page?: number; size?: number }) {
  const page = params?.page ?? 1;
  const size = params?.size ?? 10;

  return useQuery<MyOrderListRes>({
    // Truyền params vào key để cache riêng từng trang
    queryKey: orderKeys.list({ page, size }),
    queryFn: () => apiGetMyOrders({ page, size }),
    placeholderData: keepPreviousData, // Giữ dữ liệu cũ khi chuyển trang để không bị giật
  });
}

export function useOrderDetail(id?: OrderId, opts?: { enabled?: boolean }) {
  return useQuery<OrderDetail>({
    queryKey: orderKeys.detail(id!),
    queryFn: () => apiGetOrderDetail(id!),
    enabled: opts?.enabled ?? !!id, // Chỉ fetch khi có ID
    staleTime: 1000 * 60 * 5, // Cache chi tiết 5 phút (ít thay đổi)
  });
}

export function useCheckoutPreview(params: {
  shipToAddressId: number | null;
  billToAddressId: number | null;
}) {
  // Chỉ fetch khi đã chọn địa chỉ giao hàng
  const enabled = !!params.shipToAddressId;

  return useQuery<CheckoutPreviewDto>({
    // Sử dụng key tập trung
    queryKey: orderKeys.preview({ 
      shipId: params.shipToAddressId, 
      billId: params.billToAddressId 
    }),
    queryFn: () =>
      getCheckoutPreview({
        shipToAddressId: params.shipToAddressId!, // Non-null assertion an toàn vì enabled = true
        billToAddressId: params.billToAddressId,
      }),
    enabled,
    // Không cache preview quá lâu vì tồn kho/giá có thể đổi
    staleTime: 0, 
  });
}