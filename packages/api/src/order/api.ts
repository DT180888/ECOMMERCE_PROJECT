import { axiosClient } from "@my-project/shared-utils";
import type { 
  CheckoutReq, 
  MyOrderListRes, 
  OrderDetail, 
  OrderId, 
  CheckoutPreviewDto 
} from "./types";

export async function apiCheckoutFromCart(payload: CheckoutReq): Promise<{ orderId: number }> {
  const { data } = await axiosClient.post<{ orderId: number }>("/api/v1/orders/checkout", payload);
  return data;
}

export async function apiGetMyOrders(params: { page?: number; size?: number } = {}): Promise<MyOrderListRes> {
  const { page = 1, size = 10 } = params;
  const { data } = await axiosClient.get<MyOrderListRes>("/api/v1/orders/me", {
    params: { page, size },
  });
  return data;
}

export async function apiGetOrderDetail(id: OrderId): Promise<OrderDetail> {
  const { data } = await axiosClient.get<OrderDetail>(`/api/v1/orders/${id}`);
  return data;
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
