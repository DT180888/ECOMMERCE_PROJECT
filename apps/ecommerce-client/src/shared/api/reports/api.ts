import { axiosClient } from "@my-project/shared-utils";
import type {
  CustomerReportParams,
  CustomerReportItem,
  PagedReportResponse,
  CategorySalesReportParams,
  CategorySalesReportResponse,
  BaseReportParams,
  BrandSalesReportResponse,
  PromotionRoiReportResponse,
} from "./types";

function unwrap<T>(resData: any, fallback: T): T {
  if (resData && typeof resData === "object" && "data" in resData && resData.data !== undefined) {
    return resData.data as T;
  }
  return (resData ?? fallback) as T;
}

// 1. Lấy Báo cáo Khách hàng
export async function getTopCustomersReport(
  params?: CustomerReportParams
): Promise<PagedReportResponse<CustomerReportItem>> {
  const { data } = await axiosClient.get("/api/v1/admin/reports/customers", { params });
  return unwrap(data, { items: [], page: 1, pageSize: 20, total: 0 });
}

// 2. Lấy Báo cáo Doanh số Danh mục
export async function getSalesByCategoryReport(
  params?: CategorySalesReportParams
): Promise<CategorySalesReportResponse> {
  const { data } = await axiosClient.get("/api/v1/admin/reports/sales-by-category", { params });
  return unwrap(data, {
    items: [],
    summary: { totalRevenueMinor: 0, totalQuantitySold: 0, totalCategoriesCount: 0 },
    page: 1,
    pageSize: 20,
    total: 0,
  });
}

// 3. Lấy Báo cáo Doanh số Thương hiệu
export async function getSalesByBrandReport(
  params?: BaseReportParams
): Promise<BrandSalesReportResponse> {
  const { data } = await axiosClient.get("/api/v1/admin/reports/sales-by-brand", { params });
  return unwrap(data, {
    items: [],
    summary: { totalRevenueMinor: 0, totalQuantitySold: 0, totalBrandsCount: 0 },
    page: 1,
    pageSize: 20,
    total: 0,
  });
}

// 4. Lấy Báo cáo Hiệu quả Khuyến mãi (ROI)
export async function getPromotionRoiReport(
  params?: BaseReportParams
): Promise<PromotionRoiReportResponse> {
  const { data } = await axiosClient.get("/api/v1/admin/reports/promotions-roi", { params });
  return unwrap(data, {
    items: [],
    summary: { totalDiscountMinor: 0, totalDrivenRevenueMinor: 0, totalRedemptionsCount: 0 },
    page: 1,
    pageSize: 20,
    total: 0,
  });
}

// 5. Hàm Tải File CSV trực tiếp
export async function downloadReportCsv(
  reportType: "customers" | "sales-by-category" | "sales-by-brand" | "promotions-roi",
  params?: Record<string, any>
): Promise<void> {
  const response = await axiosClient.get(`/api/v1/admin/reports/${reportType}/export`, {
    params,
    responseType: "blob", // Nhận nhị phân file UTF-8 BOM
  });

  // Trích xuất filename từ header Content-Disposition nếu có
  const disposition = response.headers["content-disposition"] || response.headers["Content-Disposition"];
  let filename = `BaoCao_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`;
  if (disposition && disposition.includes("filename=")) {
    const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (match?.[1]) {
      filename = match[1].replace(/['"]/g, "");
    }
  }

  // Kích hoạt trình duyệt tải xuống
  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
