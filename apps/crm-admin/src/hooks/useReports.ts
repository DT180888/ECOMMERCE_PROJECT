import { useQuery } from "@tanstack/react-query";
import {
  getTopCustomersReport,
  getSalesByCategoryReport,
  getSalesByBrandReport,
  getPromotionRoiReport,
  type CustomerReportParams,
  type CategorySalesReportParams,
  type BaseReportParams,
} from "@my-project/api";

export const reportKeys = {
  all: ["admin", "reports"] as const,
  customers: (p?: CustomerReportParams) => ["admin", "reports", "customers", p] as const,
  categorySales: (p?: CategorySalesReportParams) => ["admin", "reports", "category-sales", p] as const,
  brandSales: (p?: BaseReportParams) => ["admin", "reports", "brand-sales", p] as const,
  promotionsRoi: (p?: BaseReportParams) => ["admin", "reports", "promotions-roi", p] as const,
};

export function useTopCustomersReport(params?: CustomerReportParams) {
  return useQuery({
    queryKey: reportKeys.customers(params),
    queryFn: () => getTopCustomersReport(params),
    placeholderData: (prev) => prev,
    staleTime: 2 * 60 * 1000,
  });
}

export function useSalesByCategoryReport(params?: CategorySalesReportParams) {
  return useQuery({
    queryKey: reportKeys.categorySales(params),
    queryFn: () => getSalesByCategoryReport(params),
    placeholderData: (prev) => prev,
    staleTime: 2 * 60 * 1000,
  });
}

export function useSalesByBrandReport(params?: BaseReportParams) {
  return useQuery({
    queryKey: reportKeys.brandSales(params),
    queryFn: () => getSalesByBrandReport(params),
    placeholderData: (prev) => prev,
    staleTime: 2 * 60 * 1000,
  });
}

export function usePromotionRoiReport(params?: BaseReportParams) {
  return useQuery({
    queryKey: reportKeys.promotionsRoi(params),
    queryFn: () => getPromotionRoiReport(params),
    placeholderData: (prev) => prev,
    staleTime: 2 * 60 * 1000,
  });
}

