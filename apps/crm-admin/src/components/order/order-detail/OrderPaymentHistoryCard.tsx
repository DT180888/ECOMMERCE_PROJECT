import React from "react";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { formatVND } from "@my-project/shared-utils";
import { cn } from "@my-project/ui";
import type { OrderPayment } from "@my-project/api";

const formatDateTime = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

interface OrderPaymentHistoryCardProps {
  payments: OrderPayment[];
}

export function OrderPaymentHistoryCard({ payments }: OrderPaymentHistoryCardProps) {
  return (
    <section className="space-y-3">
      {/* ── Section Header (Pure Typography & Spacing) ── */}
      <div className="flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <CreditCardIcon className="w-3.5 h-3.5 stroke-[1.25] text-muted-foreground" aria-hidden="true" />
          <h3 className="font-medium text-foreground text-xs uppercase tracking-[0.16em]">
            Lịch sử thanh toán
          </h3>
        </div>
        <span className="text-[10px] font-mono tabular-nums uppercase text-muted-foreground">
          {payments.length} giao dịch
        </span>
      </div>

      {/* ── Payment Records ── */}
      <div>
        {payments.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground text-xs italic">
            Chưa có thông tin thanh toán.
          </div>
        ) : (
          <div className="space-y-2">
            {payments.map((p) => {
              const isPaid = p.status === 2;

              return (
                <div
                  key={p.paymentId}
                  className="bg-surface/30 p-3 rounded-[2px] transition-colors hover:bg-surface/50 space-y-1"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-foreground font-mono uppercase tracking-wide">
                      {p.provider}
                    </span>
                    <span className="font-mono font-semibold text-foreground tabular-nums">
                      {formatVND(p.amountMinor)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10.5px]">
                    <span className="text-muted-foreground font-mono">
                      {formatDateTime(p.paidAt || p.createdAt)}
                    </span>
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded-[2px] uppercase font-mono font-medium tracking-wider text-[9px] select-none",
                        isPaid
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      )}
                    >
                      {p.statusText}
                    </span>
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
