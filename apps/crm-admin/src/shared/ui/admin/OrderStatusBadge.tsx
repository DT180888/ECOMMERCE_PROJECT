import { cn } from "../shared/utils";
import { getOrderStatusConfig } from "@my-project/shared-utils";

export interface OrderStatusBadgeProps {
  status: number;
  className?: string;
}

export default function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = getOrderStatusConfig(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-xs font-sans font-medium border select-none shrink-0 shadow-none transition-colors",
        config.colorClass,
        className
      )}
    >
      <span>{config.label}</span>
    </span>
  );
}
