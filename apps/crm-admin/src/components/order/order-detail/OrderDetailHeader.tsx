import React from "react";
import { Link } from "react-router-dom";
import { Button, OrderStatusBadge } from "@my-project/ui";
import Select from "react-select";
import { reactSelectDarkStyles } from "@my-project/ui";
import { ArrowLeftIcon, UserIcon, CheckIcon } from "@heroicons/react/24/outline";
import { OrderStatus, getOrderStatusConfig } from "@my-project/shared-utils";

const STATUS_OPTIONS = Object.values(OrderStatus)
  .filter((v) => typeof v === "number")
  .map((statusVal) => {
    const config = getOrderStatusConfig(statusVal as number);
    return { value: statusVal as number, label: config.label, icon: config.icon };
  });

const FormatOptionLabel = ({ label, icon }: { label: string; icon: string }) => (
  <div className="flex items-center gap-2 font-medium text-sm text-muted-foreground">
    <span>{icon}</span>
    <span>{label}</span>
  </div>
);

interface Props {
  order: any;
  nextStatus: number | null;
  onNextStatusChange: (val: number | null) => void;
  onChangeStatus: () => void;
  isUpdating: boolean;
}

export function OrderDetailHeader({ order, nextStatus, onNextStatusChange, onChangeStatus, isUpdating }: Props) {
  const formatDateTime = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—";

  const selectedNextStatusOption = STATUS_OPTIONS.find((o) => o.value === nextStatus);

  return (
    <div className="sticky top-0 z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center bg-card/95 backdrop-blur-md p-4 rounded-[2px] border border-border/60 shrink-0 gap-4">
      <div className="flex items-center gap-4">
        <Link to="/admin/orders">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-surface rounded-[2px] h-8 w-8 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
              Đơn hàng #{order.orderNumber}
            </h1>
            <span className="px-2 py-0.5 rounded-[2px] text-[11px] font-mono bg-surface border border-border/60 text-muted-foreground">
              {formatDateTime(order.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <UserIcon className="w-3.5 h-3.5" />
            <span className="text-foreground/80 font-medium">{order.shipTo?.recipientName || "Khách vãng lai"}</span>
            <span className="text-border/60">•</span>
            <span className="font-mono">{order.currency}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto bg-surface/50 border border-border/60 p-1 rounded-[2px]">
        <div className="flex items-center gap-2 px-3 border-r border-border/60 pr-4">
          <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">Hiện tại</span>
          <OrderStatusBadge status={order.status} className="text-xs" />
        </div>
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          <div className="flex-1 min-w-[200px]">
            <Select
              options={STATUS_OPTIONS}
              value={selectedNextStatusOption}
              onChange={(val) => onNextStatusChange(val?.value ?? null)}
              formatOptionLabel={(opt) => <FormatOptionLabel label={opt.label} icon={opt.icon} />}
              styles={reactSelectDarkStyles}
              menuPortalTarget={document.body}
              placeholder="Đổi trạng thái..."
              isDisabled={isUpdating}
            />
          </div>
          <Button
            onClick={onChangeStatus}
            disabled={isUpdating || nextStatus === order.status || nextStatus === null}
            variant="default"
            className="h-8 px-3 whitespace-nowrap rounded-[2px] font-medium text-xs"
          >
            {isUpdating ? "Đang lưu..." : <><CheckIcon className="w-3.5 h-3.5 mr-1" /> Cập nhật</>}
          </Button>
        </div>
      </div>
    </div>
  );
}

