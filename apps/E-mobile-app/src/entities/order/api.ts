import { axiosClient } from "@shared/api/axiosClient";
import type { 
  CheckoutReq, 
  MyOrderListRes, 
  OrderDetail, 
  OrderId, 
  CheckoutPreviewDto 
} from "./types";

// --- API Client (Dành cho User/Customer) ---

/**
 * Tạo đơn hàng từ giỏ hàng (Checkout)
 * Method: POST
 * Endpoint: /api/v1/orders (REST chuẩn thay vì /orders/checkout)
 */
export async function apiCheckoutFromCart(payload: CheckoutReq): Promise<{ orderId: number }> {
  // Backend thường trả về CreatedAtAction hoặc object chứa ID
  const { data } = await axiosClient.post<{ orderId: number }>("/api/v1/orders/checkout", payload);
  return data;
}

/**
 * Lấy danh sách đơn hàng của tôi
 * Method: GET
 * Endpoint: /api/v1/orders/me (Hoặc /api/v1/orders nếu có Auth filter)
 */
export async function apiGetMyOrders(params: { page?: number; size?: number } = {}): Promise<MyOrderListRes> {
  const { page = 1, size = 10 } = params;
  const { data } = await axiosClient.get<MyOrderListRes>("/api/v1/orders/me", {
    params: { page, size },
  });
  return data;
}

/**
 * Lấy chi tiết đơn hàng (User View)
 * Method: GET
 * Endpoint: /api/v1/orders/{id}
 */
export async function apiGetOrderDetail(id: OrderId): Promise<OrderDetail> {
  const { data } = await axiosClient.get<OrderDetail>(`/api/v1/orders/${id}`);
  return data;
}

/**
 * Xem trước đơn hàng (Tính toán thuế phí trước khi đặt)
 * Method: GET
 * Endpoint: /api/v1/checkout/preview
 */
export async function getCheckoutPreview(params: {
  shipToAddressId: number;
  billToAddressId?: number | null;
}): Promise<CheckoutPreviewDto> {
  const { data } = await axiosClient.get<CheckoutPreviewDto>("/api/v1/checkout/preview", {
    params: {
      shipToAddressId: params.shipToAddressId,
      // Gửi undefined nếu null để axios tự động loại bỏ param khỏi URL query
      billToAddressId: params.billToAddressId || undefined,
    },
  });
  return data;
}