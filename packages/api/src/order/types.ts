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
  orderItemId: number;
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
  createdAt: string;
  paidAt?: string | null;
  completedAt?: string | null;
  expiresAt?: string | null;
  shipTo?: OrderAddress | null;
  billTo?: OrderAddress | null;
  items: OrderItem[];
  payments: OrderPayment[];
  shipments: OrderShipment[];
};

// Checkout
export type CheckoutReq = {
  shipToAddressId: number;
  billToAddressId: number | null;
  currency: string;
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
}
