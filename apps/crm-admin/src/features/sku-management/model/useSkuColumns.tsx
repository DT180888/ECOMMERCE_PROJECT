import { useMemo } from "react";
import type { AdminTableColumn } from "@shared/ui";
import type { AdminSkuItem } from "@entities/product/types";
import { buildImgSrc } from "@shared/lib/url";
import { Badge } from "@my-project/ui";

const formatVND = (minor: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(minor ?? 0);

export function useSkuColumns() {
  return useMemo<AdminTableColumn<AdminSkuItem>[]>(() => {
    return [
      {
        key: "skuCode",
        label: "Mã SKU",
        isMain: true,
        minWidth: "150px",
        render: (item) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-inner bg-secondary/10 border border-border/10 flex items-center justify-center overflow-hidden shrink-0">
              {item.imageUrl ? (
                <img
                  src={buildImgSrc(item.imageUrl)}
                  alt={item.skuCode}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-muted-foreground text-[10px] font-mono">No Image</span>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-xs font-semibold text-accent truncate">
                {item.skuCode}
              </span>
              <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                ID: #{item.skuId}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: "productName",
        label: "Sản phẩm",
        minWidth: "220px",
        render: (item) => (
          <div className="flex flex-col">
            <span className="font-medium text-foreground text-xs truncate max-w-[200px]" title={item.productName}>
              {item.productName}
            </span>
            {item.options && item.options.length > 0 && (
              <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">
                {item.options.map((opt) => `${opt.attributeName}: ${opt.value}`).join(" | ")}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "priceMinor",
        label: "Giá bán",
        minWidth: "120px",
        align: "right",
        render: (item) => (
          <span className="font-semibold text-foreground text-xs font-mono tabular-nums">
            {formatVND(item.priceMinor)}
          </span>
        ),
      },
      {
        key: "stock",
        label: "Tồn kho (OnHand / Reserved / Available)",
        minWidth: "200px",
        render: (item) => (
          <div className="flex flex-col gap-0.5 text-xs">
            <span className="font-medium text-foreground">
              Tổng tồn: <span className="font-mono tabular-nums font-semibold">{item.quantityOnHand}</span>
            </span>
            <span className="text-[10px] text-muted-foreground">
              Đang giữ: <span className="font-mono tabular-nums font-semibold">{item.quantityReserved}</span> | Khả dụng: <span className="font-mono tabular-nums font-semibold text-emerald-500">{item.available}</span>
            </span>
          </div>
        ),
      },
      {
        key: "isActive",
        label: "Trạng thái",
        align: "center",
        minWidth: "100px",
        render: (item) => (
          <Badge
            variant={item.isActive ? "success" : "inset"}
            className="text-[10px] font-semibold tracking-wider uppercase"
          >
            {item.isActive ? "Hoạt động" : "Vô hiệu"}
          </Badge>
        ),
      },
    ];
  }, []);
}
