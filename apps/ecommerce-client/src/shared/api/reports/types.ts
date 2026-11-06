// ── Tham số Query chung cho Báo cáo ──
export interface BaseReportParams {
  from?: string;          // ISO 8601 UTC
  to?: string;            // ISO 8601 UTC
  keyword?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;          // Mặc định 1
  pageSize?: number;      // Mặc định 20
}

// ── Response Phân trang chuẩn ──
export interface PagedReportResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

// ── 1. Báo cáo Khách hàng & LTV ──
export interface CustomerReportParams extends BaseReportParams {
  minSpendMinor?: number; // Lọc khách chi tiêu >= mức này
}

export interface CustomerReportItem {
  userId: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  periodSpendMinor: number;
  periodOrdersCount: number;
  averageOrderValueMinor: number;
  firstOrderDate: string;
  lastOrderDate: string;
  daysSinceLastOrder: number;
  customerTier: 'VIP Diamond' | 'VIP Gold' | 'Silver' | 'Standard' | string;
}

// ── 2. Báo cáo Doanh số Danh mục ──
export interface CategorySalesReportParams extends BaseReportParams {
  parentId?: number;
}

export interface CategorySalesItem {
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  parentId: number | null;
  totalOrdersCount: number;
  totalQuantitySold: number;
  totalRevenueMinor: number;
  contributionPercentage: number;
}

export interface CategorySalesSummary {
  totalRevenueMinor: number;
  totalQuantitySold: number;
  totalCategoriesCount: number;
}

export interface CategorySalesReportResponse extends PagedReportResponse<CategorySalesItem> {
  summary: CategorySalesSummary;
}

// ── 3. Báo cáo Doanh số Thương hiệu ──
export interface BrandSalesItem {
  brandId: number | null;
  brandName: string;
  totalOrdersCount: number;
  totalQuantitySold: number;
  totalRevenueMinor: number;
  contributionPercentage: number;
}

export interface BrandSalesSummary {
  totalRevenueMinor: number;
  totalQuantitySold: number;
  totalBrandsCount: number;
}

export interface BrandSalesReportResponse extends PagedReportResponse<BrandSalesItem> {
  summary: BrandSalesSummary;
}

// ── 4. Báo cáo ROI Khuyến mãi ──
export interface PromotionRoiItem {
  promotionId: number;
  promotionName: string;
  promotionCode: string;
  redemptionsCount: number;
  totalDiscountMinor: number;
  drivenRevenueMinor: number;
  discountRatioPercent: number;
  revenueMultiplier: number;
}

export interface PromotionRoiSummary {
  totalDiscountMinor: number;
  totalDrivenRevenueMinor: number;
  totalRedemptionsCount: number;
}

export interface PromotionRoiReportResponse extends PagedReportResponse<PromotionRoiItem> {
  summary: PromotionRoiSummary;
}

