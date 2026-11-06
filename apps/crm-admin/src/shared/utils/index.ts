export function formatVND(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return "0 ₫";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Format ngày giờ (DateTime)
 * Ví dụ: "2023-11-25T10:30:00Z" -> "25/11/2023 10:30"
 */
export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return "--";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Format ngày (Date only)
 * Ví dụ: "25/11/2023"
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "--";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Format số lượng (có dấu chấm phân cách hàng nghìn)
 * Ví dụ: 12345 -> "12.345"
 */
export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("vi-VN").format(num);
}

export enum OrderStatus {
  Pending = 0,
  AwaitingPayment = 1,
  Paid = 2,
  Processing = 3,
  Shipped = 4,
  Completed = 5,
  Cancelled = 6,
  Refunded = 7,
}

export type OrderStatusVariant = "warning" | "success" | "info" | "error" | "neutral";

export interface OrderStatusConfig {
  label: string;
  icon: string;
  colorClass: string;
  borderClass: string;
  textClass: string;
  variant: OrderStatusVariant;
}

export const ORDER_STATUS_CONFIGS: Record<OrderStatus, OrderStatusConfig> = {
  [OrderStatus.Pending]: {
    label: "Chờ xác nhận",
    icon: "⏳",
    colorClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30",
    borderClass: " border-amber-500/30 hover:border-amber-500/60  data-[state=active]:!border-amber-500 data-[state=active]:text-amber-700 dark:data-[state=active]:text-amber-300",
    textClass: "text-amber-700 dark:text-amber-300",
    variant: "warning",
  },
  [OrderStatus.AwaitingPayment]: {
    label: "Chờ thanh toán",
    icon: "💳",
    colorClass: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-500/30",
    borderClass: " border-orange-500/30 hover:border-orange-500/60 data-[state=active]:!border-orange-500 data-[state=active]:text-orange-700 dark:data-[state=active]:text-orange-300",
    textClass: "text-orange-700 dark:text-orange-300",
    variant: "warning",
  },
  [OrderStatus.Paid]: {
    label: "Đã thanh toán",
    icon: "✅",
    colorClass: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30",
    borderClass: " border-teal-500/30 hover:border-teal-500/60 data-[state=active]:!border-teal-500 data-[state=active]:text-teal-700 dark:data-[state=active]:text-teal-300",
    textClass: "text-teal-700 dark:text-teal-300",
    variant: "success",
  },
  [OrderStatus.Processing]: {
    label: "Đang xử lý",
    icon: "⚙️",
    colorClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30",
    borderClass: " border-blue-500/30 hover:border-blue-500/60 data-[state=active]:!border-blue-500 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300",
    textClass: "text-blue-700 dark:text-blue-300",
    variant: "info",
  },
  [OrderStatus.Shipped]: {
    label: "Đang giao hàng",
    icon: "🚚",
    colorClass: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30",
    borderClass: " border-indigo-500/30 hover:border-indigo-500/60 data-[state=active]:!border-indigo-500 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-300",
    textClass: "text-indigo-700 dark:text-indigo-300",
    variant: "info",
  },
  [OrderStatus.Completed]: {
    label: "Đã hoàn thành",
    icon: "🎉",
    colorClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30",
    borderClass: " border-emerald-500/30 hover:border-emerald-500/60 data-[state=active]:!border-emerald-500 data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-300",
    textClass: "text-emerald-700 dark:text-emerald-300",
    variant: "success",
  },
  [OrderStatus.Cancelled]: {
    label: "Đã hủy",
    icon: "🚫",
    colorClass: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30",
    borderClass: " border-rose-500/30 hover:border-rose-500/60 data-[state=active]:!border-rose-500 data-[state=active]:text-rose-700 dark:data-[state=active]:text-rose-300",
    textClass: "text-rose-700 dark:text-rose-300",
    variant: "error",
  },
  [OrderStatus.Refunded]: {
    label: "Đã hoàn tiền",
    icon: "💵",
    colorClass: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/30",
    borderClass: " border-slate-500/30 hover:border-slate-500/60 data-[state=active]:!border-slate-500 data-[state=active]:text-slate-700 dark:data-[state=active]:text-slate-300",
    textClass: "text-slate-700 dark:text-slate-300",
    variant: "neutral",
  },
};

export const DEFAULT_ORDER_STATUS_CONFIG: OrderStatusConfig = {
  label: "Không xác định",
  icon: "❓",
  colorClass: "bg-muted text-muted-foreground border border-border",
  borderClass: " border-border hover:border-muted-foreground data-[state=active]:!border-foreground data-[state=active]:text-foreground",
  textClass: "text-muted-foreground dark:text-muted",
  variant: "neutral",
};

export function getOrderStatusConfig(status: number): OrderStatusConfig {
  return ORDER_STATUS_CONFIGS[status as OrderStatus] || DEFAULT_ORDER_STATUS_CONFIG;
}

export interface OrderTabItem {
  value: string;
  label: string;
  status?: OrderStatus;
  borderClass?: string;
  textClass?: string;
  colorClass?: string;
  icon?: string;
}

export const ORDER_TAB_ITEMS: OrderTabItem[] = [
  {
    value: "all",
    label: "Tất cả",
    status: undefined,
    borderClass: " border-border/60 hover:border-border data-[state=active]:!border-foreground data-[state=active]:text-foreground",
    textClass: "text-foreground",
    colorClass: "bg-muted text-muted-foreground border border-border",
    icon: "📋",
  },
  {
    value: "pending",
    label: "Mới tạo",
    status: OrderStatus.Pending,
    borderClass: ORDER_STATUS_CONFIGS[OrderStatus.Pending].borderClass,
    textClass: ORDER_STATUS_CONFIGS[OrderStatus.Pending].textClass,
    colorClass: ORDER_STATUS_CONFIGS[OrderStatus.Pending].colorClass,
    icon: ORDER_STATUS_CONFIGS[OrderStatus.Pending].icon,
  },
  {
    value: "awaitingpayment",
    label: ORDER_STATUS_CONFIGS[OrderStatus.AwaitingPayment].label,
    status: OrderStatus.AwaitingPayment,
    borderClass: ORDER_STATUS_CONFIGS[OrderStatus.AwaitingPayment].borderClass,
    textClass: ORDER_STATUS_CONFIGS[OrderStatus.AwaitingPayment].textClass,
    colorClass: ORDER_STATUS_CONFIGS[OrderStatus.AwaitingPayment].colorClass,
    icon: ORDER_STATUS_CONFIGS[OrderStatus.AwaitingPayment].icon,
  },
  {
    value: "paid",
    label: ORDER_STATUS_CONFIGS[OrderStatus.Paid].label,
    status: OrderStatus.Paid,
    borderClass: ORDER_STATUS_CONFIGS[OrderStatus.Paid].borderClass,
    textClass: ORDER_STATUS_CONFIGS[OrderStatus.Paid].textClass,
    colorClass: ORDER_STATUS_CONFIGS[OrderStatus.Paid].colorClass,
    icon: ORDER_STATUS_CONFIGS[OrderStatus.Paid].icon,
  },
  {
    value: "processing",
    label: ORDER_STATUS_CONFIGS[OrderStatus.Processing].label,
    status: OrderStatus.Processing,
    borderClass: ORDER_STATUS_CONFIGS[OrderStatus.Processing].borderClass,
    textClass: ORDER_STATUS_CONFIGS[OrderStatus.Processing].textClass,
    colorClass: ORDER_STATUS_CONFIGS[OrderStatus.Processing].colorClass,
    icon: ORDER_STATUS_CONFIGS[OrderStatus.Processing].icon,
  },
  {
    value: "shipped",
    label: "Vận chuyển",
    status: OrderStatus.Shipped,
    borderClass: ORDER_STATUS_CONFIGS[OrderStatus.Shipped].borderClass,
    textClass: ORDER_STATUS_CONFIGS[OrderStatus.Shipped].textClass,
    colorClass: ORDER_STATUS_CONFIGS[OrderStatus.Shipped].colorClass,
    icon: ORDER_STATUS_CONFIGS[OrderStatus.Shipped].icon,
  },
  {
    value: "completed",
    label: ORDER_STATUS_CONFIGS[OrderStatus.Completed].label,
    status: OrderStatus.Completed,
    borderClass: ORDER_STATUS_CONFIGS[OrderStatus.Completed].borderClass,
    textClass: ORDER_STATUS_CONFIGS[OrderStatus.Completed].textClass,
    colorClass: ORDER_STATUS_CONFIGS[OrderStatus.Completed].colorClass,
    icon: ORDER_STATUS_CONFIGS[OrderStatus.Completed].icon,
  },
  {
    value: "cancelled",
    label: "Đã huỷ",
    status: OrderStatus.Cancelled,
    borderClass: ORDER_STATUS_CONFIGS[OrderStatus.Cancelled].borderClass,
    textClass: ORDER_STATUS_CONFIGS[OrderStatus.Cancelled].textClass,
    colorClass: ORDER_STATUS_CONFIGS[OrderStatus.Cancelled].colorClass,
    icon: ORDER_STATUS_CONFIGS[OrderStatus.Cancelled].icon,
  },
  {
    value: "refunded",
    label: "Hoàn tiền",
    status: OrderStatus.Refunded,
    borderClass: ORDER_STATUS_CONFIGS[OrderStatus.Refunded].borderClass,
    textClass: ORDER_STATUS_CONFIGS[OrderStatus.Refunded].textClass,
    colorClass: ORDER_STATUS_CONFIGS[OrderStatus.Refunded].colorClass,
    icon: ORDER_STATUS_CONFIGS[OrderStatus.Refunded].icon,
  },
];

export * from "./auth";
export * from "./axiosClient";
export * from "./url";
export * from "./utils";
