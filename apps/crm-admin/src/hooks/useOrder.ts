import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { 
  apiCheckoutFromCart, 
  apiGetMyOrders, 
  apiGetOrderDetail, 
  getCheckoutPreview,
  apiGetAdminOrders,
  apiGetAdminOrderDetail,
  apiUpdateAdminOrderStatus
} from "@my-project/api";
import type { 
  CheckoutReq, 
  MyOrderListRes, 
  OrderDetail, 
  OrderId, 
  CheckoutPreviewDto,
  AdminOrderListRes
} from "@my-project/api";

export const orderKeys = {
  root: ["orders"] as const,
  list: (filters?: any) => [...orderKeys.root, "list", ...(filters ? [filters] : [])] as const,
  detail: (id: OrderId) => [...orderKeys.root, "detail", id] as const,
  preview: (params: { shipId: number | null; billId: number | null }) => 
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

export function useAdminOrders(params?: { page?: number; size?: number; status?: number | null; search?: string }) {
  const page = params?.page ?? 1;
  const size = params?.size ?? 10;

  return useQuery<AdminOrderListRes>({
    queryKey: orderKeys.list(params),
    queryFn: () => apiGetAdminOrders({ 
      page, 
      size, 
      status: params?.status, 
      keyword: params?.search 
    }),
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

export function useAdminOrderDetail(id?: OrderId, opts?: { enabled?: boolean }) {
  return useQuery<OrderDetail>({
    queryKey: orderKeys.detail(id!),
    queryFn: () => apiGetAdminOrderDetail(id!),
    enabled: opts?.enabled ?? !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateAdminOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status, note }: { orderId: number; status: number; note?: string }) => {
      await apiUpdateAdminOrderStatus(orderId, { status, note });
      return { orderId, status };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.root });
    },
  });
}

export function useUpdateShipmentTracking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { orderId: number; carrier: string; trackingNumber: string }) => {
      return payload;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.root });
    },
  });
}

export function useCheckoutPreview(params: {
  shipToAddressId: number | null;
  billToAddressId: number | null;
}) {
  const enabled = !!params.shipToAddressId;

  return useQuery<CheckoutPreviewDto>({
    queryKey: orderKeys.preview({ 
      shipId: params.shipToAddressId, 
      billId: params.billToAddressId 
    }),
    queryFn: () =>
      getCheckoutPreview({
        shipToAddressId: params.shipToAddressId!,
        billToAddressId: params.billToAddressId,
      }),
    enabled,
    staleTime: 0, 
  });
}
