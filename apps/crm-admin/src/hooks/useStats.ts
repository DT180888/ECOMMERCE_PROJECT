import { useQuery } from "@tanstack/react-query";
import { getAdminKpis, getRevenueChart, getRecentOrders, getTopSellingProducts, getLowStockAlerts } from "@my-project/api";

export const statsKeys = {
  kpis: ["admin", "stats", "kpis"] as const,
  chart: (days: number) => ["admin", "stats", "chart", days] as const,
  recentOrders: (count: number) => ["admin", "stats", "recent-orders", count] as const,
  topSelling: (limit: number) => ["admin", "stats", "top-selling", limit] as const,
  lowStockAlerts: (limit: number) => ["admin", "stats", "low-stock-alerts", limit] as const,
};

export function useAdminKpis() {
  return useQuery({
    queryKey: statsKeys.kpis,
    queryFn: getAdminKpis,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRevenueChart(days: number = 7) {
  return useQuery({
    queryKey: statsKeys.chart(days),
    queryFn: () => getRevenueChart(days),
    staleTime: 10 * 60 * 1000,
  });
}

export function useRecentOrders(count = 5) {
  return useQuery({
    queryKey: statsKeys.recentOrders(count),
    queryFn: () => getRecentOrders(count),
    refetchInterval: 30_000, 
  });
}

export function useTopSellingProducts(limit = 5) {
  return useQuery({
    queryKey: statsKeys.topSelling(limit),
    queryFn: () => getTopSellingProducts(limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLowStockAlerts(limit = 10) {
  return useQuery({
    queryKey: statsKeys.lowStockAlerts(limit),
    queryFn: () => getLowStockAlerts(limit),
    staleTime: 2 * 60 * 1000,
  });
}
