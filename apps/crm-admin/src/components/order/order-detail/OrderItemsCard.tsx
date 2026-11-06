import React from "react";
import { CubeIcon } from "@heroicons/react/24/outline";
import { formatVND } from "@my-project/shared-utils";

interface OrderItemProps {
  orderItemId?: number;
  skuId: number;
  productName: string;
  skuName?: string | null;
  qty: number;
  unitPriceMinor: number;
  lineTotalMinor?: number | null;
}

interface OrderItemsCardProps {
  items: OrderItemProps[];
}

export function OrderItemsCard({ items }: OrderItemsCardProps) {
  const totalQty = items.reduce((sum, it) => sum + (it.qty || 0), 0);

  return (
    <section className="space-y-3">
      {/* ── Section Header (Pure Typography & Spacing) ── */}
      <div className="flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <CubeIcon className="w-3.5 h-3.5 stroke-[1.25] text-muted-foreground" aria-hidden="true" />
          <h3 className="font-medium text-foreground text-xs uppercase tracking-[0.16em]">
            Danh sách sản phẩm
          </h3>
        </div>
        <span className="text-[10px] font-mono tabular-nums uppercase text-muted-foreground">
          {items.length} mặt hàng / {totalQty} chiếc
        </span>
      </div>

      {/* ── Full-Bleed Table Flat on Canvas ── */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[540px] text-left border-collapse text-xs">
          <thead>
            <tr className="bg-surface/50 h-9 select-none">
              <th scope="col" className="px-3 py-2 font-medium tracking-[0.16em] uppercase text-muted-foreground text-[10.5px]">
                Sản phẩm / Biến thể
              </th>
              <th scope="col" className="px-3 py-2 text-center font-medium tracking-[0.16em] uppercase text-muted-foreground text-[10.5px] w-24">
                Số lượng
              </th>
              <th scope="col" className="px-3 py-2 text-right font-medium tracking-[0.16em] uppercase text-muted-foreground text-[10.5px] w-32">
                Đơn giá
              </th>
              <th scope="col" className="px-3 py-2 text-right font-medium tracking-[0.16em] uppercase text-muted-foreground text-[10.5px] w-36">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr
                key={it.orderItemId ?? it.skuId ?? idx}
                className="even:bg-surface/20 odd:bg-transparent hover:bg-surface-hover/30 transition-colors duration-150 h-12"
              >
                {/* Product & Variant Dossier */}
                <td className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[2px] bg-surface flex items-center justify-center text-muted-foreground shrink-0">
                      <CubeIcon className="w-4 h-4 stroke-[1.25] opacity-50" />
                    </div>
                    <div className="min-w-0 flex flex-col justify-center">
                      <span className="font-medium text-foreground text-xs leading-snug truncate" title={it.productName}>
                        {it.productName}
                      </span>
                      {it.skuName && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] text-muted-foreground font-mono">
                            SKU: {it.skuName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Quantity */}
                <td className="px-3 py-2 text-center font-mono tabular-nums text-xs text-foreground font-medium">
                  {it.qty}
                </td>

                {/* Unit Price */}
                <td className="px-3 py-2 text-right font-mono tabular-nums text-xs text-muted-foreground">
                  {formatVND(it.unitPriceMinor)}
                </td>

                {/* Line Total */}
                <td className="px-3 py-2 text-right font-mono tabular-nums text-xs font-semibold text-foreground">
                  {formatVND(it.lineTotalMinor || it.unitPriceMinor * it.qty || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
