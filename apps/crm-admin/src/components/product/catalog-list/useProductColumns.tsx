import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@my-project/ui";
import { Guard, type AdminTableColumn } from "@shared/ui";
import { EyeIcon, PencilSquareIcon, PhotoIcon } from "@heroicons/react/24/outline";
import type { ProductCard } from "@my-project/api";
import { buildImgSrc } from "@my-project/shared-utils";

const formatVND = (minor: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    minor ?? 0
  );

interface UseProductColumnsProps {
  brandName: (bid?: number | null) => string;
}

export function useProductColumns({ brandName }: UseProductColumnsProps) {
  return useMemo<AdminTableColumn<ProductCard>[]>(() => {
    return [
      {
        key: "productId",
        label: "ID",
        align: "center",
        minWidth: "60px",
        render: (p) => (
          <span className="font-mono tabular-nums text-xs text-muted-foreground">
            #{p.productId}
          </span>
        ),
      },
      {
        key: "thumbnailUrl",
        label: "Ảnh",
        isMedia: true,
        mediaAspect: "portrait",
        minWidth: "50px",
        render: (p) => (
          <div className=" rounded-md border border-border/60 overflow-hidden bg-muted/40 shrink-0 flex items-center justify-center">
            {p.thumbnailUrl ? (
              <img
                src={buildImgSrc(p.thumbnailUrl)}
                alt={p.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <PhotoIcon className="w-4 h-4 text-muted-foreground/60" />
            )}
          </div>
        ),
      },
      {
        key: "name",
        label: "Tên sản phẩm",
        isMain: true,
        minWidth: "200px",
        render: (p) => (
          <span
            className="font-medium text-foreground text-xs truncate max-w-[240px] block"
            title={p.name}
          >
            {p.name}
          </span>
        ),
      },
      {
        key: "brandId",
        label: "Thương hiệu",
        isSub: true,
        minWidth: "120px",
        render: (p) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-mono text-card bg-foreground border border-border whitespace-nowrap">
            {brandName(p.brandId ?? null)}
          </span>
        ),
      },
      {
        key: "minPriceMinor",
        label: "Giá từ",
        isFooter: true,
        align: "right",
        minWidth: "120px",
        render: (p) => (
          <span className="font-mono text-xs font-semibold tabular-nums text-foreground whitespace-nowrap">
            {formatVND(p.minPriceMinor)}
          </span>
        ),
      },
      {
        key: "slug",
        label: "Đường dẫn",
        align: "left",
        minWidth: "130px",
        render: (p) => (
          <code
            className="text-muted-foreground text-xs block truncate max-w-[140px] font-mono"
            title={p.slug}
          >
            {p.slug}
          </code>
        ),
      },
      {
        key: "actions",
        label: "Thao tác",
        align: "right",
        minWidth: "80px",
        sticky: "right",
        isAction: true,
        render: (p) => (
          <div className="flex items-center justify-center gap-1">
            <Link to={`/admin/product/${p.productId}/detail`}>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-surface rounded-[2px] border border-border/40"
                title="Xem chi tiết"
              >
                <EyeIcon className="w-3.5 h-3.5 stroke-[1.5]" />
              </Button>
            </Link>
            <Guard permission="Permissions.Products.Edit">
              <Link to={`/admin/product/${p.productId}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-accent hover:text-accent hover:bg-accent/10 rounded-[2px] border border-accent/20"
                  title="Chỉnh sửa"
                >
                  <PencilSquareIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                </Button>
              </Link>
            </Guard>
          </div>
        ),
      },
    ];
  }, [brandName]);
}
export default useProductColumns;
