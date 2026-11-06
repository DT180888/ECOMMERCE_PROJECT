import type { AddressId } from "../address/types";
export type { AddressId };

export type OrderId = number;

// My orders (list)
export type MyOrderItem = {
  orderId: number;
  orderNumber: string;
  status: number;
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

// Order detail
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
  orderItemId?: number;
  skuId: number;
  productName: string;
  skuName?: string | null;
  qty: number;
  unitPriceMinor: number;
  discountMinor: number;
  taxMinor: number;
  lineTotalMinor?: number | null;
};

export type OrderPayment = {
  paymentId: number;
  provider: string;
  providerRef?: string | null;
  amountMinor: number;
  status: number;
  statusText: string;
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

export type OrderDetail = {
  orderId: number;
  orderNumber: string;
  status: number;
  statusText: string;
  currency: string;
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  shippingMinor: number;
  totalMinor: number;
  notes?: string | null;
  email?: string | null;
  createdAt: string;
  paidAt?: string | null;
  completedAt?: string | null;
  expiresAt?: string | null;
  shipToAddress?: OrderAddress | null;
  billToAddress?: OrderAddress | null;
  /** @deprecated use shipToAddress */
  shipTo?: OrderAddress | null;
  /** @deprecated use billToAddress */
  billTo?: OrderAddress | null;
  items: OrderItem[];
  payments: OrderPayment[];
  shipments: OrderShipment[];
};

// Checkout
export type CheckoutReq = {
  shipToAddressId: number;
  billToAddressId?: number | null;
  currency?: string;
  notes?: string | null;
  couponCode?: string | null;
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
  appliedCoupon?: string | null;
}

// Admin Order Types
export interface AdminOrderDto {
  orderId: number;
  orderNumber: string;
  status: number;
  statusText?: string;
  totalMinor?: number | null;
  email?: string | null;
  userId?: string | null;
  createdAt: string;
  itemCount: number;
}

export interface AdminOrderListRes {
  items: AdminOrderDto[];
  page: number;
  size: number;
  total: number;
}

export interface AdminOrderListParams {
  status?: number | null;
  keyword?: string | null;
  page?: number;
  size?: number;
}

export interface UpdateOrderStatusReq {
  status: number;
  note?: string | null;
}

