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

export interface OrderStatusConfig {
  label: string;
  icon: string;
  colorClass: string;
}

export function getOrderStatusConfig(status: number): OrderStatusConfig {
  const configs: Record<number, OrderStatusConfig> = {
    [OrderStatus.Pending]: {
      label: "Chờ xác nhận",
      icon: "⏳",
      colorClass: "bg-amber-500 text-white",
    },
    [OrderStatus.AwaitingPayment]: {
      label: "Chờ thanh toán",
      icon: "💳",
      colorClass: "bg-orange-500 text-white",
    },
    [OrderStatus.Paid]: {
      label: "Đã thanh toán",
      icon: "✅",
      colorClass: "bg-teal-500 text-white",
    },
    [OrderStatus.Processing]: {
      label: "Đang xử lý",
      icon: "⚙️",
      colorClass: "bg-blue-500 text-white",
    },
    [OrderStatus.Shipped]: {
      label: "Đang giao hàng",
      icon: "🚚",
      colorClass: "bg-purple-500 text-white",
    },
    [OrderStatus.Completed]: {
      label: "Đã giao hàng",
      icon: "🎉",
      colorClass: "bg-emerald-500 text-white",
    },
    [OrderStatus.Cancelled]: {
      label: "Đã hủy",
      icon: "🚫",
      colorClass: "bg-red-500 text-white",
    },
    [OrderStatus.Refunded]: {
      label: "Đã hoàn tiền",
      icon: "💵",
      colorClass: "bg-gray-500 text-white",
    },
  };

  return (
    configs[status] || {
      label: "Không xác định",
      icon: "❓",
      colorClass: "bg-gray-500 text-white",
    }
  );
}

export * from "./auth";
export * from "./axiosClient";

