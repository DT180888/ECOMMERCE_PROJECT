import { cn } from "./utils";
import { OrderStatus } from "@my-project/shared-utils";

interface OrderStatusBadgeProps {
  status: number;
  className?: string;
}

const dotColors: Record<number, string> = {
  [OrderStatus.Pending]: 'bg-amber-500',
  [OrderStatus.AwaitingPayment]: 'bg-orange-500',
  [OrderStatus.Paid]: 'bg-teal-500',
  [OrderStatus.Processing]: 'bg-blue-500',
  [OrderStatus.Shipped]: 'bg-purple-500',
  [OrderStatus.Completed]: 'bg-emerald-500',
  [OrderStatus.Cancelled]: 'bg-red-500',
  [OrderStatus.Refunded]: 'bg-gray-500',
};

const statusLabels: Record<number, string> = {
  [OrderStatus.Pending]: 'Chờ xác nhận',
  [OrderStatus.AwaitingPayment]: 'Chờ thanh toán',
  [OrderStatus.Paid]: 'Đã thanh toán',
  [OrderStatus.Processing]: 'Đang xử lý',
  [OrderStatus.Shipped]: 'Đang giao hàng',
  [OrderStatus.Completed]: 'Đã giao hàng',
  [OrderStatus.Cancelled]: 'Đã hủy',
  [OrderStatus.Refunded]: 'Đã hoàn tiền',
};

export default function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-secondary/20 text-foreground border border-foreground/5 select-none shrink-0 shadow-none',
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', dotColors[status] || 'bg-gray-500')} />
      <span>{statusLabels[status] || 'Không xác định'}</span>
    </span>
  );
}