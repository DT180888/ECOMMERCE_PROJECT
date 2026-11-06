import React from "react";
import { Button, Input, cn } from "@my-project/ui";
import { TruckIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

export interface ShipmentItem {
  shipmentId: number;
  carrier: string;
  statusText: string;
  serviceCode?: string | null;
  trackingNumber?: string | null;
  status: number;
}

interface OrderShipmentCardProps {
  shipments: ShipmentItem[];
  trackingDraft: Record<number, string>;
  onDraftChange: (shipmentId: number, value: string) => void;
  onSaveTracking: (shipmentId: number) => void;
  isUpdating: boolean;
}

export function OrderShipmentCard({
  shipments,
  trackingDraft,
  onDraftChange,
  onSaveTracking,
  isUpdating,
}: OrderShipmentCardProps) {
  return (
    <section className="space-y-3">
      {/* ── Section Header (Pure Typography & Spacing) ── */}
      <div className="flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <TruckIcon className="w-3.5 h-3.5 stroke-[1.25] text-muted-foreground" aria-hidden="true" />
          <h3 className="font-medium text-foreground text-xs uppercase tracking-[0.16em]">
            Thông tin vận chuyển
          </h3>
        </div>
        <span className="text-[10px] font-mono tabular-nums uppercase text-muted-foreground">
          {shipments.length} kiện hàng
        </span>
      </div>

      {/* ── Content Body ── */}
      <div>
        {shipments.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground italic font-sans select-none">
            Chưa có thông tin vận chuyển cho đơn hàng này.
          </div>
        ) : (
          <div className="space-y-3">
            {shipments.map((s) => {
              const draftValue = trackingDraft[s.shipmentId] ?? s.trackingNumber ?? "";
              const isDrafted = draftValue !== (s.trackingNumber ?? "");
              const isDelivered = s.status === 1;

              return (
                <div
                  key={s.shipmentId}
                  className="p-3 bg-surface/30 rounded-[2px] transition-colors hover:bg-surface/50 space-y-3"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    {/* Carrier & Service */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-foreground font-semibold text-xs font-mono uppercase tracking-wide">
                        {s.carrier}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Dịch vụ: {s.serviceCode || "Tiêu chuẩn"}
                      </span>
                      <span
                        className={cn(
                          "text-[9.5px] px-1.5 py-0.5 rounded-[2px] uppercase font-mono font-medium tracking-wider select-none",
                          isDelivered
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        )}
                      >
                        {s.statusText}
                      </span>
                    </div>

                    {/* Current Tracking Badge */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[10px] uppercase font-mono text-muted-foreground">
                        Mã hiện tại:
                      </span>
                      <span className="font-mono text-foreground text-xs">
                        {s.trackingNumber || "Chưa cập nhật"}
                      </span>
                    </div>
                  </div>

                  {/* Inline Tracking Updater (Separated by Spacing, No Hairline) */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] uppercase font-mono text-muted-foreground shrink-0 select-none">
                      Cập nhật mã:
                    </span>
                    <Input
                      placeholder="Nhập mã vận đơn tracking..."
                      value={draftValue}
                      onChange={(e) => onDraftChange(s.shipmentId, e.target.value)}
                      className={cn(
                        "h-8 text-xs font-mono bg-background border-border flex-1 shadow-none",
                        isDrafted && "border-foreground"
                      )}
                    />
                    <Button
                      size="default"
                      disabled={isUpdating || !isDrafted}
                      onClick={() => onSaveTracking(s.shipmentId)}
                      className="h-8 px-3 rounded-[2px] text-xs font-medium shrink-0 shadow-none"
                    >
                      {isUpdating ? (
                        "..."
                      ) : (
                        <>
                          <PaperAirplaneIcon className="w-3 h-3 stroke-[1.25] mr-1" /> Lưu mã
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
