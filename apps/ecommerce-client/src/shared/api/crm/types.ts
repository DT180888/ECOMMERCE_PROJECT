// ==========================================
// 1. CUSTOMER 360 & PROFILE TYPES
// ==========================================

export interface CustomerProfileDto {
  userId: string;
  email: string | null;
  fullName: string | null;
  phone: string | null;
  dateOfBirth: string | null; // ISO YYYY-MM-DD
  createdAt: string;
  isEmailConfirmed: boolean;
  isLocked: boolean;
}

export interface CustomerMetricsDto {
  lifetimeSpendMinor: number;
  totalOrderCount: number;
  completedOrderCount: number;
  cancelledOrderCount: number;
  aovMinor: number;
  lastOrderDate: string | null;
}

export interface CustomerTagDto {
  tagId: number;
  name: string;
  colorHex: string;
  description: string | null;
}

export interface RecentOrderDto {
  orderId: number;
  orderNumber: string;
  status: number;
  statusText: string;
  totalMinor: number;
  itemCount: number;
  createdAt: string;
}

export interface CustomerAddressDto {
  addressId: number;
  recipientName: string;
  phone: string | null;
  fullAddress: string;
  isDefault: boolean;
}

export interface CustomerVoucherDto {
  couponId: number;
  code: string;
  promotionName: string;
  discountType: number; // 0 = Percentage, 1 = FixedAmount
  discountValue: number;
  expiresAt: string | null;
}

export interface CustomerNoteDto {
  id: number;
  userId?: string;
  authorAdminId: string;
  authorName: string;
  content: string;
  category: "General" | "Complaint" | "Preference" | "VIPNote" | string;
  isPinned: boolean;
  createdAt: string;
}

export interface CustomerRfmSummaryDto {
  segmentKey: RfmSegmentKey | string;
  rScore: number;
  fScore: number;
  mScore: number;
  recencyDays: number;
  calculatedAt: string;
}

export interface Customer360Res {
  profile: CustomerProfileDto;
  metrics: CustomerMetricsDto;
  rfm?: CustomerRfmSummaryDto | null;
  tags: CustomerTagDto[];
  recentOrders: RecentOrderDto[];
  addresses: CustomerAddressDto[];
  availableVouchers: CustomerVoucherDto[];
  pinnedNotes: CustomerNoteDto[];
}

// Request Bodies cho Notes & Tags
export interface CreateCustomerNoteReq {
  content: string;
  category?: "General" | "Complaint" | "Preference" | "VIPNote" | string;
  isPinned?: boolean;
}

export interface CustomerTagManagementDto {
  id: number;
  name: string;
  colorHex: string;
  description: string | null;
  customerCount: number;
}

export interface CreateCustomerTagReq {
  name: string;
  colorHex?: string;
  description?: string;
}

export interface AssignCustomerTagsReq {
  tagIds: number[];
}

// ==========================================
// 2. ABANDONED CARTS TYPES
// ==========================================

export interface AbandonedCartItemDto {
  cartItemId: number;
  skuId: number;
  skuCode: string;
  productName: string;
  quantity: number;
  priceMinor: number;
  totalMinor: number;
}

export interface AbandonedCartDto {
  cartId: number;
  userId: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  items: AbandonedCartItemDto[];
  totalItemsCount: number;
  totalMinor: number;
  lastActivityAt: string;
  recoveryCount: number;
  lastRecoverySentAt: string | null;
  isRecovered: boolean;
}

export interface ListAbandonedCartsParams {
  page?: number;
  pageSize?: number;
  from?: string; // ISO 8601 UTC
  to?: string;   // ISO 8601 UTC
  minTotalMinor?: number;
  keyword?: string;
}

export interface ListAbandonedCartsRes {
  items: AbandonedCartDto[];
  page: number;
  pageSize: number;
  total: number;
}

export interface SendCartRecoveryReq {
  couponCode?: string;
  customNote?: string;
}

export interface SendCartRecoveryRes {
  recoveryLogId: number;
  recipientEmail: string;
  triggerType: string;
  sentAt: string;
}

// ==========================================
// 3. RFM SEGMENTATION TYPES
// ==========================================

export type RfmSegmentKey =
  | "Champions"
  | "Loyal"
  | "Potential"
  | "NewCustomers"
  | "Promising"
  | "AtRisk"
  | "Hibernating"
  | "Lost";

export interface SegmentSummaryDto {
  key: RfmSegmentKey | string;
  name: string;
  colorHex: string;
  description: string;
  customerCount: number;
  percentage: number;
  averageSpendMinor: number;
  averageOrders: number;
}

export interface SegmentUserDto {
  userId: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  rScore: number; // 1 - 5
  fScore: number; // 1 - 5
  mScore: number; // 1 - 5
  recencyDays: number;
  orderCount: number;
  totalSpendMinor: number;
  lastOrderDate: string;
}

export interface PagedSegmentUsersRes {
  items: SegmentUserDto[];
  page: number;
  pageSize: number;
  total: number;
}

// ==========================================
// 4. MARKETING AUTOMATION TRIGGERS TYPES
// ==========================================

export type AutomationEventType =
  | "Birthday"
  | "DormantCustomer"
  | "TierUpgrade"
  | "FirstOrderThankYou";

export interface AutomationTriggerDto {
  id: number;
  triggerName: string;
  eventType: AutomationEventType | string;
  channel: "Email" | "SMS" | "Zalo" | string;
  templateContent: string;
  couponCodeTemplate: string | null;
  isEnabled: boolean;
  updatedAt: string;
}

export interface CreateTriggerReq {
  triggerName: string;
  eventType: AutomationEventType | string;
  channel?: "Email" | "SMS" | "Zalo" | string;
  templateContent: string;
  couponCodeTemplate?: string;
  isEnabled?: boolean;
}

export interface UpdateTriggerReq {
  triggerName: string;
  channel: "Email" | "SMS" | "Zalo" | string;
  templateContent: string;
  couponCodeTemplate?: string;
}
