import { axiosClient, getOrderStatusConfig } from "@my-project/shared-utils";
import type { 
  CheckoutReq, 
  MyOrderListRes, 
  OrderDetail, 
  OrderId, 
  CheckoutPreviewDto,
  AdminOrderListParams,
  AdminOrderListRes,
  UpdateOrderStatusReq
} from "./types";

const normalizeOrderDetail = (order: any): OrderDetail => {
  if (!order) return order;
  const shipAddr = order.shipToAddress ?? order.shipTo ?? null;
  const billAddr = order.billToAddress ?? order.billTo ?? null;
  const statusCfg = getOrderStatusConfig(order.status);
  
  return {
    ...order,
    totalMinor: order.totalMinor ?? order.subtotalMinor ?? 0,
    statusText: order.statusText || statusCfg?.label || "",
    shipToAddress: shipAddr,
    billToAddress: billAddr,
    shipTo: shipAddr,
    billTo: billAddr,
    payments: (order.payments || []).map((p: any) => ({
      ...p,
      statusText: p.statusText || (p.status === 2 ? "Đã thanh toán" : "Chưa thanh toán"),
    })),
    shipments: (order.shipments || []).map((s: any) => ({
      ...s,
      statusText: s.statusText || (s.status === 4 ? "Đã giao hàng" : "Đang xử lý"),
    })),
  };
};

export async function apiCheckoutFromCart(payload: CheckoutReq): Promise<{ orderId: number }> {
  const { data } = await axiosClient.post<{ orderId: number }>("/api/v1/orders/checkout", payload);
  return data;
}

export async function apiGetMyOrders(params: { page?: number; size?: number } = {}): Promise<MyOrderListRes> {
  const { page = 1, size = 10 } = params;
  const { data } = await axiosClient.get<MyOrderListRes>("/api/v1/me/orders", {
    params: { page, size },
  });
  return data;
}

export async function apiGetOrderDetail(id: OrderId): Promise<OrderDetail> {
  const { data } = await axiosClient.get<OrderDetail>(`/api/v1/orders/${id}`);
  return normalizeOrderDetail(data);
}

export async function getCheckoutPreview(params: {
  shipToAddressId: number;
  billToAddressId?: number | null;
  couponCode?: string | null;
}): Promise<CheckoutPreviewDto> {
  const { data } = await axiosClient.get<CheckoutPreviewDto>("/api/v1/checkout/preview", {
    params: {
      shipToAddressId: params.shipToAddressId,
      billToAddressId: params.billToAddressId || undefined,
      couponCode: params.couponCode || undefined,
    },
  });
  return data;
}

// Admin Orders API
export async function apiGetAdminOrders(params?: AdminOrderListParams): Promise<AdminOrderListRes> {
  const { data } = await axiosClient.get<AdminOrderListRes>("/api/v1/admin/orders", {
    params: {
      page: params?.page ?? 1,
      size: params?.size ?? 20,
      status: params?.status !== undefined && params?.status !== null ? params.status : undefined,
      keyword: params?.keyword || undefined,
    },
  });
  return data;
}

export async function apiGetAdminOrderDetail(id: OrderId): Promise<OrderDetail> {
  const { data } = await axiosClient.get<OrderDetail>(`/api/v1/admin/orders/${id}`);
  return normalizeOrderDetail(data);
}

export async function apiUpdateAdminOrderStatus(id: OrderId, payload: UpdateOrderStatusReq): Promise<void> {
  await axiosClient.patch<void>(`/api/v1/admin/orders/${id}/status`, payload);
}

