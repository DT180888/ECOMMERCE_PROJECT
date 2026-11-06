import { useMemo } from "react";
import type { AdminTableColumn } from "@shared/ui";
import type { AdminSkuItem } from "@my-project/api";
import { buildImgSrc } from "@my-project/shared-utils";
import { AdminStatusBadge } from "@components/common/AdminStatusBadge";

const formatVND = (minor: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(minor ?? 0);

export function useSkuColumns() {
  return useMemo<AdminTableColumn<AdminSkuItem>[]>(() => {
    return [
      {
        key: "imageUrl",
        label: "Ảnh",
        isMedia: true,
        mediaAspect: "square",
        minWidth: "48px",
        render: (item) => (
          <div className="w-8 h-8 rounded-[2px] bg-surface border border-border flex items-center justify-center overflow-hidden shrink-0">
            {item.imageUrl ? (
              <img
                src={buildImgSrc(item.imageUrl)}
                alt={item.skuCode}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground text-[9px] font-mono">No Img</span>
            )}
          </div>
        ),
      },
      {
        key: "skuCode",
        label: "Mã SKU",
        isMain: true,
        minWidth: "150px",
        render: (item) => (
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-xs font-medium text-foreground truncate">
              {item.skuCode}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono tabular-nums truncate max-w-[180px]">
              ID: #{item.skuId}
            </span>
          </div>
        ),
      },
      {
        key: "productName",
        label: "Sản phẩm",
        isSub: true,
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
        isFooter: true,
        render: (item) => (
          <span className="font-mono text-xs font-medium tabular-nums text-foreground">
            {formatVND(item.priceMinor)}
          </span>
        ),
      },
      {
        key: "stock",
        label: "Tồn kho",
        minWidth: "180px",
        render: (item) => (
          <div className="flex flex-col gap-1 text-xs">
            <span className="text-foreground">
              Tổng: <span className="font-mono tabular-nums font-medium">{item.quantityOnHand}</span>
            </span>
            <span className="text-[10px] text-muted-foreground">
              Giữ: <span className="font-mono tabular-nums font-medium">{item.quantityReserved}</span> | Khả dụng:{" "}
              <span className="font-mono tabular-nums font-medium text-success">{item.available}</span>
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
          <AdminStatusBadge variant={item.isActive ? "success" : "neutral"}>
            {item.isActive ? "Hoạt động" : "Vô hiệu"}
          </AdminStatusBadge>
        ),
      },
    ];
  }, []);
}
export default useSkuColumns;
