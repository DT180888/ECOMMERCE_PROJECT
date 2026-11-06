import React from "react";
import Select from "react-select";
import { Button, OrderStatusBadge, reactSelectDarkStyles, cn } from "@my-project/ui";
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { OrderStatus, getOrderStatusConfig } from "@my-project/shared-utils";

const STATUS_OPTIONS = Object.values(OrderStatus)
  .filter((v) => typeof v === "number")
  .map((statusVal) => {
    const config = getOrderStatusConfig(statusVal as number);
    return { value: statusVal as number, label: config.label, icon: config.icon };
  });

const FormatOptionLabel = ({ label, icon }: { label: string; icon: string }) => (
  <div className="flex items-center gap-2 font-medium text-xs text-foreground">
    <span className="text-sm">{icon}</span>
    <span>{label}</span>
  </div>
);

// Happy-path linear progression steps
const PROGRESS_STEPS = [
  { status: OrderStatus.Pending, label: "Chờ xác nhận", code: "01" },
  { status: OrderStatus.Paid, label: "Đã thanh toán", code: "02" },
  { status: OrderStatus.Processing, label: "Đang xử lý", code: "03" },
  { status: OrderStatus.Shipped, label: "Đang giao", code: "04" },
  { status: OrderStatus.Completed, label: "Hoàn tất", code: "05" },
];

interface OrderLifecycleBarProps {
  currentStatus: number;
  statusText: string;
  notes?: string | null;
  nextStatus: number | null;
  onNextStatusChange: (val: number | null) => void;
  onChangeStatus: () => void;
  isUpdating: boolean;
}

export function OrderLifecycleBar({
  currentStatus,
  statusText,
  notes,
  nextStatus,
  onNextStatusChange,
  onChangeStatus,
  isUpdating,
}: OrderLifecycleBarProps) {
  const selectedNextOption = STATUS_OPTIONS.find((o) => o.value === nextStatus);
  const isTerminalNegative = currentStatus === OrderStatus.Cancelled || currentStatus === OrderStatus.Refunded;

  // Determine current progression index
  const getCurrentStepIndex = () => {
    if (isTerminalNegative) return -1;
    if (currentStatus === OrderStatus.AwaitingPayment) return 0;
    const idx = PROGRESS_STEPS.findIndex((s) => s.status === currentStatus);
    return idx >= 0 ? idx : 0;
  };

  const activeIndex = getCurrentStepIndex();

  return (
    <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 select-none">
      {/* ── Left: Lifecycle Progression or Exception Banner ── */}
      <div className="flex-1 min-w-0">
        {isTerminalNegative ? (
          <div className="flex items-center gap-3 px-3 py-2 rounded-[2px] bg-error/10 border border-error/30 text-error">
            <ExclamationTriangleIcon className="w-4 h-4 stroke-[1.25] shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs">
              <span className="font-mono font-medium uppercase tracking-wider">
                Trạng thái ngoại lệ: {statusText}
              </span>
              {notes && (
                <span className="text-muted-foreground text-[11px] truncate">
                  • Ghi chú: {notes}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1">
            {PROGRESS_STEPS.map((step, idx) => {
              const isPast = idx < activeIndex;
              const isCurrent = idx === activeIndex;
              const isUpcoming = idx > activeIndex;

              return (
                <React.Fragment key={step.status}>
                  {idx > 0 && (
                    <div
                      className={cn(
                        "h-[1px] w-4 sm:w-8 shrink-0 transition-colors",
                        isPast ? "bg-foreground/60" : "bg-border/60"
                      )}
                    />
                  )}
                  <div
                    className={cn(
                      "flex items-center gap-1 shrink-0 px-2 py-1 rounded-[2px] transition-colors",
                      isCurrent && "bg-foreground/[0.08] text-foreground font-medium",
                      isPast && "text-foreground/80 font-normal",
                      isUpcoming && "text-muted-foreground/50 font-normal"
                    )}
                  >
                    <span
                      className={cn(
                        "w-4 h-4 rounded-[2px] flex items-center justify-center font-mono text-[9px] tabular-nums border shrink-0",
                        isCurrent
                          ? "bg-foreground/[0.12] text-foreground border-foreground font-semibold"
                          : isPast
                          ? "bg-foreground/10 text-foreground border-foreground/30"
                          : "bg-surface text-muted-foreground/60 border-border/60"
                      )}
                    >
                      {isPast ? <CheckIcon className="w-2.5 h-2.5 stroke-[2]" /> : step.code}
                    </span>
                    <span className="text-xs whitespace-nowrap">{step.label}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Right: Action Quick Updater ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground shrink-0">
            Hiện tại:
          </span>
          <OrderStatusBadge status={currentStatus} className="text-[10px]" />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-48 sm:w-52">
            <Select
              options={STATUS_OPTIONS}
              value={selectedNextOption}
              onChange={(val) => onNextStatusChange(val?.value ?? null)}
              formatOptionLabel={(opt) => <FormatOptionLabel label={opt.label} icon={opt.icon} />}
              styles={reactSelectDarkStyles}
              menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
              placeholder="Chuyển trạng thái..."
              isDisabled={isUpdating}
            />
          </div>

          <Button
            onClick={onChangeStatus}
            disabled={isUpdating || nextStatus === currentStatus || nextStatus === null}
            variant="default"
            size="default"
            className="h-8 px-3 whitespace-nowrap rounded-[2px] text-xs font-medium shrink-0 shadow-none"
          >
            {isUpdating ? (
              "Lưu..."
            ) : (
              <>
                <CheckIcon className="w-3.5 h-3.5 stroke-[1.5] mr-1" /> Cập nhật
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

