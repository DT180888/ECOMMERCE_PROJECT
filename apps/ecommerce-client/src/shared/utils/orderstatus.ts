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
