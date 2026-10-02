import { useRef } from "react";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { apiCheckoutFromCart, apiGetMyOrders, apiGetOrderDetail, getCheckoutPreview } from "@my-project/api";
import type { CheckoutReq, MyOrderListRes, OrderDetail, OrderId, CheckoutPreviewDto } from "@my-project/api";

export const orderKeys = {
  root: ["orders"] as const,
  list: (filters?: any) => [...orderKeys.root, "list", ...(filters ? [filters] : [])] as const,
  detail: (id: OrderId) => [...orderKeys.root, "detail", id] as const,
  preview: (params: { shipId: number | null; billId: number | null; couponCode?: string | null }) => 
    [...orderKeys.root, "preview", params] as const,
};

export function useCheckoutOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckoutReq) => apiCheckoutFromCart(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.list() });
      qc.invalidateQueries({ queryKey: ["cart"] }); 
    },
  });
}

export function useMyOrders(params?: { page?: number; size?: number }) {
  const page = params?.page ?? 1;
  const size = params?.size ?? 10;

  return useQuery<MyOrderListRes>({
    queryKey: orderKeys.list({ page, size }),
    queryFn: () => apiGetMyOrders({ page, size }),
    placeholderData: keepPreviousData,
  });
}

export function useOrderDetail(id?: OrderId, opts?: { enabled?: boolean }) {
  return useQuery<OrderDetail>({
    queryKey: orderKeys.detail(id!),
    queryFn: () => apiGetOrderDetail(id!),
    enabled: opts?.enabled ?? !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCheckoutPreview(params: {
  shipToAddressId: number | null;
  billToAddressId: number | null;
  couponCode?: string | null;
}) {
  const enabled = !!params.shipToAddressId;

  return useQuery<CheckoutPreviewDto>({
    queryKey: orderKeys.preview({ 
      shipId: params.shipToAddressId, 
      billId: params.billToAddressId,
      couponCode: params.couponCode 
    }),
    queryFn: () =>
      getCheckoutPreview({
        shipToAddressId: params.shipToAddressId!,
        billToAddressId: params.billToAddressId,
        couponCode: params.couponCode,
      }),
    enabled,
    staleTime: 0, 
  });
}

export function useOrderPaymentPolling(orderId?: OrderId, enabled: boolean = false) {
  const startTimeRef = useRef<number>(Date.now());
  return useQuery<OrderDetail>({
    queryKey: orderKeys.detail(orderId!),
    queryFn: () => apiGetOrderDetail(orderId!),
    enabled: !!orderId && enabled,
    staleTime: 0,
    refetchIntervalInBackground: false,
    refetchInterval: (query) => {
      const order = query.state.data;
      if (order?.status === 2 || (order?.status as any) === 'Paid' || order?.status === 3) {
        return false;
      }
      const elapsedTime = Date.now() - startTimeRef.current;
      if (elapsedTime > 15 * 60 * 1000) {
        return false;
      }
      return elapsedTime < 2 * 60 * 1000 ? 2500 : 5000;
    },
  });
}
