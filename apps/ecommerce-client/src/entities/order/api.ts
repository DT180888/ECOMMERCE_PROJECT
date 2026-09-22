import { axiosClient } from "@my-project/shared-utils";
import type { 
  CheckoutReq, 
  MyOrderListRes, 
  OrderDetail, 
  OrderId, 
  CheckoutPreviewDto 
} from "./types";

// --- API Client (DÃ nh cho User/Customer) ---

/**
 * Táº¡o Ä‘Æ¡n hÃ ng tá»« giá» hÃ ng (Checkout)
 * Method: POST
 * Endpoint: /api/v1/orders (REST chuáº©n thay vÃ¬ /orders/checkout)
 */
export async function apiCheckoutFromCart(payload: CheckoutReq): Promise<{ orderId: number }> {
  // Backend thÆ°á»ng tráº£ vá» CreatedAtAction hoáº·c object chá»©a ID
  const { data } = await axiosClient.post<{ orderId: number }>("/api/v1/orders/checkout", payload);
  return data;
}

/*
 * Method: GET
 * Endpoint: /api/v1/orders/me (Hoáº·c /api/v1/orders náº¿u cÃ³ Auth filter)
 */
export async function apiGetMyOrders(params: { page?: number; size?: number } = {}): Promise<MyOrderListRes> {
  const { page = 1, size = 10 } = params;
  const { data } = await axiosClient.get<MyOrderListRes>("/api/v1/orders/me", {
    params: { page, size },
  });
  return data;
}

/**
 * Láº¥y chi tiáº¿t Ä‘Æ¡n hÃ ng (User View)
 * Method: GET
 * Endpoint: /api/v1/orders/{id}
 */
export async function apiGetOrderDetail(id: OrderId): Promise<OrderDetail> {
  const { data } = await axiosClient.get<OrderDetail>(`/api/v1/orders/${id}`);
  return data;
}

/**
 * Xem trÆ°á»›c Ä‘Æ¡n hÃ ng (TÃ­nh toÃ¡n thuáº¿ phÃ­ trÆ°á»›c khi Ä‘áº·t)
 * Method: GET
 * Endpoint: /api/v1/checkout/preview
 */
export async function getCheckoutPreview(params: {
  shipToAddressId: number;
  billToAddressId?: number | null;
  couponCode?: string | null;
}): Promise<CheckoutPreviewDto> {
  const { data } = await axiosClient.get<CheckoutPreviewDto>("/api/v1/checkout/preview", {
    params: {
      shipToAddressId: params.shipToAddressId,
      // Gá»­i undefined náº¿u null Ä‘á»ƒ axios tá»± Ä‘á»™ng loáº¡i bá»  param khá» i URL query
      billToAddressId: params.billToAddressId || undefined,
      couponCode: params.couponCode || undefined,
    },
  });
  return data;
}
