// src/entities/order/types.ts

export type OrderId = number;
export type AddressId = number;

// ==== My orders (list) ====
export type MyOrderItem = {
  orderId: number;
  orderNumber: string;
  status: number;        // từ BE trả về (enum int)
  currency: string;
  totalMinor: number;
  createdAt: string;
  itemCount: number;
};

export type MyOrderListRes = {
  items: MyOrderItem[];
  page: number;
  size: number;
  total: number;
};

// ==== Order detail ====
export type OrderAddress = {
  addressId: number;
  label?: string | null;
  recipientName: string;
  phone?: string | null;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string;
};

export type OrderItem = {
  orderItemId: number;
  skuId: number;
  productName: string;
  skuName?: string | null;
  qty: number;
  unitPriceMinor: number;
  discountMinor: number;
  taxMinor: number;
  lineTotalMinor?: number | null; // Backend có thể trả null (nhưng ta đã fix thành 0)
  // productImage?: string | null; // Nếu bạn đã thêm ảnh vào DTO backend thì bỏ comment dòng này
};

export type OrderPayment = {
  paymentId: number;
  provider: string;
  providerRef?: string | null;
  amountMinor: number;
  status: number;      // Enum byte (0, 1, 2...)
  statusText: string;  // "Success", "Pending"...
  createdAt: string;
  paidAt?: string | null;
};

export type OrderShipment = {
  shipmentId: number;
  carrier: string;
  serviceCode?: string | null;
  trackingNumber?: string | null;
  status: number;
  statusText: string;
  createdAt: string;
  shippedAt?: string | null;
  deliveredAt?: string | null;
};

// ==== Main Order Detail Type ====
export type OrderDetail = {
  orderId: number;
  orderNumber: string;
  status: number;
  statusText: string; // "Đã thanh toán", "Mới tạo"...
  currency: string;
  
  // Tài chính
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;      // ✅ Đã khớp với Backend
  shippingMinor: number;
  totalMinor: number;
  
  notes?: string | null;
  createdAt: string;
  paidAt?: string | null;
  completedAt?: string | null;
  expiresAt?: string | null;
  
  // Relations
  shipTo?: OrderAddress | null;
  billTo?: OrderAddress | null;
  
  items: OrderItem[];
  payments: OrderPayment[];
  shipments: OrderShipment[];
};

// ==== Checkout ====
export type CheckoutReq = {
  shipToAddressId: number;
  billToAddressId: number | null;
  currency: string;
  notes?: string | null;
};

export interface CheckoutPreviewItemDto {
  skuId: number;
  productName: string;
  skuCode: string;
  quantity: number;
  unitPriceMinor: number;
  lineTotalMinor: number;
}

export interface CheckoutPreviewDto {
  items: CheckoutPreviewItemDto[];
  subtotalMinor: number;
  discountMinor: number;
  shippingMinor: number;
  taxMinor: number;
  totalMinor: number;
  shipToAddressId: number;
  billToAddressId: number;
}

