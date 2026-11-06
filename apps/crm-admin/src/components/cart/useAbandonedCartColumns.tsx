import { useMemo } from "react";
import { Badge, Button } from "@my-project/ui";
import { AdminTableColumn } from "@shared/ui/table";
import { formatVND } from "@my-project/shared-utils";
import {
  CheckCircleIcon,
  ClockIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import type { AbandonedCartDto } from "@my-project/api";

export interface UseAbandonedCartColumnsProps {
  onSelectCart: (cart: AbandonedCartDto) => void;
}

export function useAbandonedCartColumns({
  onSelectCart,
}: UseAbandonedCartColumnsProps): AdminTableColumn<AbandonedCartDto>[] {
  return useMemo(
    () => [
      {
        key: "customer",
        label: "Khách hàng",
        isMain: true,
        render: (cart) => (
          <div>
            <p className="font-medium text-foreground">{cart.customerName || "Khách hàng"}</p>
            <p className="text-xs text-muted-foreground font-mono">
              {cart.customerEmail || cart.customerPhone || cart.userId}
            </p>
          </div>
        ),
      },
      {
        key: "items",
        label: "Mặt hàng trong giỏ",
        render: (cart) => (
          <div className="flex flex-col gap-0.5 max-w-[280px]">
            <span className="font-mono text-xs font-medium text-foreground">
              {cart.totalItemsCount} sản phẩm:
            </span>
            <div className="text-xs text-muted-foreground truncate">
              {cart.items.map((it) => `${it.productName} (x${it.quantity})`).join(", ")}
            </div>
          </div>
        ),
      },
      {
        key: "total",
        label: "Tổng tiền treo",
        align: "right",
        render: (cart) => (
          <span className="font-mono font-semibold text-error tabular-nums">
            {formatVND(cart.totalMinor)}
          </span>
        ),
      },
      {
        key: "abandonedAt",
        label: "Thời gian bỏ quên",
        align: "center",
        render: (cart) => {
          const d = new Date(cart.lastActivityAt);
          return (
            <div className="flex flex-col items-center text-xs">
              <span className="text-foreground font-medium">
                {d.toLocaleDateString("vi-VN")}
              </span>
              <span className="text-muted-foreground text-[11px] font-mono">
                {d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          );
        },
      },
      {
        key: "status",
        label: "Trạng thái cứu giỏ",
        align: "center",
        render: (cart) => (
          <div className="flex flex-col items-center gap-1">
            {cart.isRecovered ? (
              <Badge variant="success" className="text-[11px] gap-1 font-medium rounded-sm">
                <CheckCircleIcon className="w-3.5 h-3.5 stroke-[2]" />
                <span>Đã phục hồi</span>
              </Badge>
            ) : cart.recoveryCount > 0 ? (
              <Badge variant="warning" className="text-[11px] gap-1 font-medium rounded-sm">
                <ClockIcon className="w-3.5 h-3.5 stroke-[2]" />
                <span>Đã gửi {cart.recoveryCount} lần</span>
              </Badge>
            ) : (
              <Badge variant="flat" className="text-[11px] text-muted-foreground font-medium rounded-sm border border-border">
                Chưa nhắc nhở
              </Badge>
            )}
          </div>
        ),
      },
      {
        key: "actions",
        label: "Thao tác",
        align: "center",
        sticky: "right",
        isAction: true,
        render: (cart) => (
          <div className="flex items-center justify-center gap-1.5">
            {cart.isRecovered ? (
              <span className="text-xs text-muted-foreground italic">Hoàn tất</span>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSelectCart(cart)}
                className="h-7 px-2.5 text-xs rounded-md gap-1 font-medium"
              >
                <PaperAirplaneIcon className="w-3.5 h-3.5 stroke-[1.75]" />
                <span>Cứu giỏ</span>
              </Button>
            )}
          </div>
        ),
      },
    ],
    [onSelectCart]
  );
}

export default useAbandonedCartColumns;

