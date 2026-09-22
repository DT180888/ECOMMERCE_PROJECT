import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@my-project/ui";
import { Guard, type AdminTableColumn } from "@shared/ui";
import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import type { ProductCard } from "@entities/product/types";
import { buildImgSrc } from "@shared/lib/url";

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
        minWidth: "64px",
        render: (p) => (
          <span className="font-mono text-xs text-muted-foreground">
            #{p.productId}
          </span>
        ),
      },
      {
        key: "name",
        label: "Thông tin sản phẩm",
        isMain: true,
        render: (p) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-button border border-neo-bevel overflow-hidden bg-foreground/5 shrink-0 shadow-none group-hover:border-accent/30 transition-colors">
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
                <div className="w-full h-full flex items-center justify-center text-[9px] text-muted-foreground">
                  No Img
                </div>
              )}
            </div>
            <span
              className="font-medium text-foreground text-sm group-hover:text-accent transition-colors truncate max-w-[240px]"
              title={p.name}
            >
              {p.name}
            </span>
          </div>
        ),
      },
      {
        key: "brandId",
        label: "Thương hiệu",
        minWidth: "120px",
        render: (p) => (
          <span className="inline-flex items-center px-2.5 py-1 rounded-inner text-xs font-medium bg-foreground/5 text-muted-foreground whitespace-nowrap">
            {brandName(p.brandId ?? null)}
          </span>
        ),
      },
      {
        key: "minPriceMinor",
        label: "Giá từ",
        align: "right",
        minWidth: "120px",
        render: (p) => (
          <span className="font-bold text-emerald-400 tracking-wide whitespace-nowrap font-mono text-sm">
            {formatVND(p.minPriceMinor)}
          </span>
        ),
      },
      {
        key: "slug",
        label: "Mã Slug",
        align: "center",
        render: (p) => (
          <code
            className="bg-background/60 text-accent/70 px-2 py-1 rounded text-xs block truncate max-w-[140px] mx-auto font-mono"
            title={p.slug}
          >
            {p.slug}
          </code>
        ),
      },
      {
        key: "actions",
        label: "Thao tác",
        align: "center",
        minWidth: "96px",
        sticky: "right",
        render: (p) => (
          <>
            <Link to={`/admin/product/${p.productId}/detail`}>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 md:h-8  md:w-8 p-0 text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10"
                title="Xem chi tiết"
              >
                <EyeIcon className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </Link>
            <Guard permission="Permissions.Products.Edit">
              <Link to={`/admin/product/${p.productId}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 md:h-8  md:w-8 p-0 text-muted-foreground hover:text-accent hover:bg-accent/10"
                  title="Chỉnh sửa"
                >
                  <PencilSquareIcon className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </Link>
            </Guard>
          </>
        ),
      },
    ];
  }, [brandName]);
}

