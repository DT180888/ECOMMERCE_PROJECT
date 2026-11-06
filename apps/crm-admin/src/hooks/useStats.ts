import { useQuery } from "@tanstack/react-query";
import {
  getAdminKpis,
  getRevenueChart,
  getRecentOrders,
  getTopSellingProducts,
  getLowStockAlerts,
  type DateRangeParams,
  type RevenueChartParams,
  type TopSellingParams,
} from "@my-project/api";

export const statsKeys = {
  kpis: (params?: DateRangeParams) => ["admin", "stats", "kpis", params] as const,
  chart: (params?: RevenueChartParams | number) => ["admin", "stats", "chart", params] as const,
  topSelling: (params?: TopSellingParams | number) => ["admin", "stats", "top-selling", params] as const,
  recentOrders: (count: number) => ["admin", "stats", "recent-orders", count] as const,
  lowStockAlerts: (limit: number) => ["admin", "stats", "low-stock-alerts", limit] as const,
};

export function useAdminKpis(params?: DateRangeParams) {
  return useQuery({
    queryKey: statsKeys.kpis(params),
    queryFn: () => getAdminKpis(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRevenueChart(params?: RevenueChartParams | number) {
  return useQuery({
    queryKey: statsKeys.chart(params),
    queryFn: () => getRevenueChart(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopSellingProducts(params?: TopSellingParams | number) {
  return useQuery({
    queryKey: statsKeys.topSelling(params),
    queryFn: () => getTopSellingProducts(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecentOrders(count = 5) {
  return useQuery({
    queryKey: statsKeys.recentOrders(count),
    queryFn: () => getRecentOrders(count),
    refetchInterval: 30_000,
  });
}

export function useLowStockAlerts(limit = 10) {
  return useQuery({
    queryKey: statsKeys.lowStockAlerts(limit),
    queryFn: () => getLowStockAlerts(limit),
    staleTime: 2 * 60 * 1000,
  });
}
