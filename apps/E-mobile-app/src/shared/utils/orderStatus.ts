// src/shared/utils/orderStatus.ts

export const OrderStatus = {
  Pending: 0,
  AwaitingPayment: 1,
  Paid: 2,
  Processing: 3,
  Shipped: 4,
  Completed: 5,
  Cancelled: 6,
  Refunded: 7,
};

export const getOrderStatusConfig = (status: number) => {
  switch (status) {
    case OrderStatus.Pending:
      return {
        label: "Chờ xử lý",
        colorClass: "bg-gray-100 text-gray-800 border-gray-200", // Gray
        icon: "⏳",
      };
    case OrderStatus.AwaitingPayment:
      return {
        label: "Chờ thanh toán",
        colorClass: "bg-orange-100 text-orange-800 border-orange-200", // Orange
        icon: "💳",
      };
    case OrderStatus.Paid:
      return {
        label: "Đã thanh toán",
        colorClass: "bg-teal-100 text-teal-800 border-teal-200", // Teal
        icon: "✅",
      };
    case OrderStatus.Processing:
      return {
        label: "Đang xử lý",
        colorClass: "bg-blue-100 text-blue-800 border-blue-200", // Blue
        icon: "⚙️",
      };
    case OrderStatus.Shipped:
      return {
        label: "Đang giao hàng",
        colorClass: "bg-indigo-100 text-indigo-800 border-indigo-200", // Indigo
        icon: "🚚",
      };
    case OrderStatus.Completed:
      return {
        label: "Hoàn thành",
        colorClass: "bg-green-100 text-green-800 border-green-200", // Green
        icon: "🎉",
      };
    case OrderStatus.Cancelled:
      return {
        label: "Đã hủy",
        colorClass: "bg-red-100 text-red-800 border-red-200", // Red
        icon: "❌",
      };
    case OrderStatus.Refunded:
      return {
        label: "Đã hoàn tiền",
        colorClass: "bg-purple-100 text-purple-800 border-purple-200", // Purple
        icon: "↩️",
      };
    default:
      return {
        label: "Không xác định",
        colorClass: "bg-gray-100 text-gray-800",
        icon: "?",
      };
  }
};