import React from "react";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { formatVND } from "@my-project/shared-utils";

interface OrderSummaryCardProps {
  subtotalMinor: number;
  shippingMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalMinor: number;
  currency?: string;
}

export function OrderSummaryCard({
  subtotalMinor,
  shippingMinor,
  discountMinor,
  taxMinor,
  totalMinor,
  currency = "VND",
}: OrderSummaryCardProps) {
  return (
    <section className="space-y-3 select-none">
      {/* ── Section Header (Pure Typography & Spacing) ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BanknotesIcon className="w-3.5 h-3.5 stroke-[1.25] text-muted-foreground" aria-hidden="true" />
          <h3 className="font-medium text-foreground text-xs uppercase tracking-[0.16em]">
            Tổng giá trị đơn hàng
          </h3>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          {currency}
        </span>
      </div>

      {/* ── Summary Line Items ── */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center text-muted-foreground">
          <span>Tạm tính hàng hóa</span>
          <span className="font-mono tabular-nums text-foreground text-right">{formatVND(subtotalMinor)}</span>
        </div>

        <div className="flex justify-between items-center text-muted-foreground">
          <span>Phí vận chuyển</span>
          <span className="font-mono tabular-nums text-foreground text-right">{formatVND(shippingMinor)}</span>
        </div>

        {discountMinor > 0 && (
          <div className="flex justify-between items-center text-error font-medium">
            <span>Chiết khấu / Giảm giá</span>
            <span className="font-mono tabular-nums text-right">-{formatVND(discountMinor)}</span>
          </div>
        )}

        {taxMinor > 0 && (
          <div className="flex justify-between items-center text-muted-foreground">
            <span>Thuế VAT</span>
            <span className="font-mono tabular-nums text-foreground text-right">{formatVND(taxMinor)}</span>
          </div>
        )}

        {/* ── Grand Total (Separated by Spacing, No Hairline) ── */}
        <div className="pt-3 mt-1 flex justify-between items-baseline">
          <div className="flex flex-col">
            <span className="text-foreground font-semibold text-xs uppercase tracking-wide">
              Tổng thanh toán
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              (Đã bao gồm thuế & phí)
            </span>
          </div>
          <span className="text-lg font-mono font-semibold tabular-nums text-foreground tracking-tight">
            {formatVND(totalMinor)}
          </span>
        </div>
      </div>
    </section>
  );
}
