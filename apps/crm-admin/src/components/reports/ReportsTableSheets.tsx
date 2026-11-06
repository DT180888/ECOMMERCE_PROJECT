import React, { useMemo } from "react";
import { AdminTable, type AdminTableColumn } from "@shared/ui";
import { formatVND } from "@my-project/shared-utils";
import { cn } from "@my-project/ui";
import type {
  CustomerReportItem,
  CategorySalesItem,
  BrandSalesItem,
  PromotionRoiItem,
} from "@my-project/api";

// ── 1. CUSTOMER TABLE ──
export interface CustomerTableProps {
  data: CustomerReportItem[];
  isLoading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onOpenCustomer360?: (userId: string) => void;
}

export function CustomerReportTable({
  data,
  isLoading,
  total,
  page,
  pageSize,
  onPageChange,
  onOpenCustomer360,
}: CustomerTableProps) {
  const columns: AdminTableColumn<CustomerReportItem>[] = useMemo(
    () => [
      {
        key: "fullName",
        label: "Khách hàng",
        render: (c) => (
          <div>
            <button
              type="button"
              onClick={() => onOpenCustomer360?.(c.userId)}
              className="font-medium text-foreground hover:underline hover:text-primary text-left"
            >
              {c.fullName || "Khách vãng lai"}
            </button>
            <p className="text-[11px] text-muted-foreground font-mono">
              {c.email || c.phone || c.userId}
            </p>
          </div>
        ),
      },
      {
        key: "periodSpendMinor",
        label: "Tổng chi tiêu",
        align: "right",
        render: (c) => (
          <span className="font-mono font-medium text-foreground tabular-nums">
            {formatVND(c.periodSpendMinor)}
          </span>
        ),
      },
      {
        key: "periodOrdersCount",
        label: "Số đơn",
        align: "right",
        render: (c) => (
          <span className="font-mono tabular-nums text-foreground">
            {c.periodOrdersCount} đơn
          </span>
        ),
      },
      {
        key: "averageOrderValueMinor",
        label: "AOV (Giá trị TB)",
        align: "right",
        render: (c) => (
          <span className="font-mono text-muted-foreground tabular-nums">
            {formatVND(c.averageOrderValueMinor)}
          </span>
        ),
      },
      {
        key: "daysSinceLastOrder",
        label: "Lần mua gần nhất",
        align: "center",
        render: (c) => (
          <span className="font-mono text-muted-foreground tabular-nums">
            {c.daysSinceLastOrder === 0 ? "Hôm nay" : `${c.daysSinceLastOrder} ngày trước`}
          </span>
        ),
      },
      {
        key: "customerTier",
        label: "Phân hạng",
        align: "center",
        render: (c) => {
          const isDiamond = c.customerTier.includes("Diamond");
          const isGold = c.customerTier.includes("Gold");
          const isSilver = c.customerTier.includes("Silver");
          const badgeClass = isDiamond
            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
            : isGold
            ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30"
            : isSilver
            ? "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/30"
            : "bg-surface text-muted-foreground border-border";
          return (
            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-medium border select-none", badgeClass)}>
              {c.customerTier}
            </span>
          );
        },
      },
    ],
    [onOpenCustomer360]
  );

  return (
    <AdminTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      rowKey="userId"
      emptyText="Không tìm thấy dữ liệu báo cáo khách hàng trong khoảng thời gian này."
      pagination={{
        page,
        total,
        pageSize,
        onPageChange,
      }}
    />
  );
}

// ── 2. CATEGORY TABLE ──
export interface CategoryTableProps {
  data: CategorySalesItem[];
  isLoading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}

export function CategoryReportTable({
  data,
  isLoading,
  total,
  page,
  pageSize,
  onPageChange,
}: CategoryTableProps) {
  const columns: AdminTableColumn<CategorySalesItem>[] = useMemo(
    () => [
      {
        key: "categoryName",
        label: "Danh mục",
        render: (cat) => (
          <div>
            <p className="font-medium text-foreground">{cat.categoryName}</p>
            <p className="text-[11px] text-muted-foreground font-mono">{cat.categorySlug}</p>
          </div>
        ),
      },
      {
        key: "totalOrdersCount",
        label: "Số đơn",
        align: "right",
        render: (cat) => (
          <span className="font-mono tabular-nums text-foreground">
            {cat.totalOrdersCount} đơn
          </span>
        ),
      },
      {
        key: "totalQuantitySold",
        label: "Số lượng bán",
        align: "right",
        render: (cat) => (
          <span className="font-mono tabular-nums text-foreground">
            {cat.totalQuantitySold.toLocaleString()} sp
          </span>
        ),
      },
      {
        key: "totalRevenueMinor",
        label: "Doanh thu",
        align: "right",
        render: (cat) => (
          <span className="font-mono font-medium text-foreground tabular-nums">
            {formatVND(cat.totalRevenueMinor)}
          </span>
        ),
      },
      {
        key: "contributionPercentage",
        label: "Tỷ trọng doanh số",
        width: "w-48",
        render: (cat) => (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden border border-border/40">
              <div
                className="h-full bg-foreground transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, cat.contributionPercentage))}%` }}
              />
            </div>
            <span className="font-mono text-[11px] text-muted-foreground w-12 text-right tabular-nums">
              {cat.contributionPercentage}%
            </span>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <AdminTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      rowKey="categoryId"
      emptyText="Không tìm thấy dữ liệu doanh số danh mục trong khoảng thời gian này."
      pagination={{
        page,
        total,
        pageSize,
        onPageChange,
      }}
    />
  );
}

// ── 3. BRAND TABLE ──
export interface BrandTableProps {
  data: BrandSalesItem[];
  isLoading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}

export function BrandReportTable({
  data,
  isLoading,
  total,
  page,
  pageSize,
  onPageChange,
}: BrandTableProps) {
  const columns: AdminTableColumn<BrandSalesItem>[] = useMemo(
    () => [
      {
        key: "brandName",
        label: "Thương hiệu",
        render: (b) => <span className="font-medium text-foreground">{b.brandName}</span>,
      },
      {
        key: "totalOrdersCount",
        label: "Số đơn",
        align: "right",
        render: (b) => (
          <span className="font-mono tabular-nums text-foreground">
            {b.totalOrdersCount} đơn
          </span>
        ),
      },
      {
        key: "totalQuantitySold",
        label: "Số lượng bán",
        align: "right",
        render: (b) => (
          <span className="font-mono tabular-nums text-foreground">
            {b.totalQuantitySold.toLocaleString()} sp
          </span>
        ),
      },
      {
        key: "totalRevenueMinor",
        label: "Doanh thu",
        align: "right",
        render: (b) => (
          <span className="font-mono font-medium text-foreground tabular-nums">
            {formatVND(b.totalRevenueMinor)}
          </span>
        ),
      },
      {
        key: "contributionPercentage",
        label: "Tỷ trọng doanh số",
        width: "w-48",
        render: (b) => (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden border border-border/40">
              <div
                className="h-full bg-foreground transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, b.contributionPercentage))}%` }}
              />
            </div>
            <span className="font-mono text-[11px] text-muted-foreground w-12 text-right tabular-nums">
              {b.contributionPercentage}%
            </span>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <AdminTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      rowKey={(b) => b.brandId ?? b.brandName}
      emptyText="Không tìm thấy dữ liệu doanh số thương hiệu trong khoảng thời gian này."
      pagination={{
        page,
        total,
        pageSize,
        onPageChange,
      }}
    />
  );
}

// ── 4. PROMOTION ROI TABLE ──
export interface PromotionRoiTableProps {
  data: PromotionRoiItem[];
  isLoading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}

export function PromotionRoiReportTable({
  data,
  isLoading,
  total,
  page,
  pageSize,
  onPageChange,
}: PromotionRoiTableProps) {
  const columns: AdminTableColumn<PromotionRoiItem>[] = useMemo(
    () => [
      {
        key: "promotionName",
        label: "Chương trình / Code",
        render: (p) => (
          <div>
            <p className="font-medium text-foreground">{p.promotionName}</p>
            <span className="font-mono text-[10px] bg-surface px-1.5 py-0.5 rounded-[2px] border border-border text-muted-foreground uppercase">
              {p.promotionCode}
            </span>
          </div>
        ),
      },
      {
        key: "redemptionsCount",
        label: "Lượt dùng",
        align: "right",
        render: (p) => (
          <span className="font-mono tabular-nums text-foreground">
            {p.redemptionsCount.toLocaleString()} lượt
          </span>
        ),
      },
      {
        key: "totalDiscountMinor",
        label: "Tổng chiết khấu",
        align: "right",
        render: (p) => (
          <span className="font-mono text-error font-medium tabular-nums">
            -{formatVND(p.totalDiscountMinor)}
          </span>
        ),
      },
      {
        key: "drivenRevenueMinor",
        label: "Doanh thu mang lại",
        align: "right",
        render: (p) => (
          <span className="font-mono text-foreground font-medium tabular-nums">
            {formatVND(p.drivenRevenueMinor)}
          </span>
        ),
      },
      {
        key: "discountRatioPercent",
        label: "Tỷ lệ chiết khấu",
        align: "center",
        render: (p) => (
          <span className="font-mono tabular-nums text-muted-foreground">
            {p.discountRatioPercent}%
          </span>
        ),
      },
      {
        key: "revenueMultiplier",
        label: "Đòn bẩy ROI",
        align: "center",
        render: (p) => (
          <span className="font-mono font-medium text-success bg-success/10 px-2 py-0.5 rounded-sm border border-success/30 tabular-nums text-xs">
            {p.revenueMultiplier}x
          </span>
        ),
      },
    ],
    []
  );

  return (
    <AdminTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      rowKey="promotionId"
      emptyText="Không tìm thấy dữ liệu hiệu quả khuyến mãi trong khoảng thời gian này."
      pagination={{
        page,
        total,
        pageSize,
        onPageChange,
      }}
    />
  );
}

