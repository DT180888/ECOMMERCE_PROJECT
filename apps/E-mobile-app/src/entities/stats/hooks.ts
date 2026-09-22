import { useQuery } from "@tanstack/react-query";
import { getAdminKpis, getRevenueChart, getRecentOrders } from "./api";
export const statsKeys = {
  kpis: ["admin", "stats", "kpis"] as const,
  chart: (days: number) => ["admin", "stats", "chart", days] as const, // Key động theo số ngày
  recentOrders: (count: number) => ["admin", "stats", "recent-orders", count] as const,
};

export function useAdminKpis() {
  return useQuery({
    queryKey: statsKeys.kpis,
    queryFn: getAdminKpis,
    staleTime: 5 * 60 * 1000, // Cache 5 phút vì KPI không thay đổi quá nhanh
  });
}

export function useRevenueChart(days: number = 7) {
  return useQuery({
    queryKey: statsKeys.chart(days),
    queryFn: () => getRevenueChart(days),
    staleTime: 10 * 60 * 1000, // Cache 10 phút
  });
}

export function useRecentOrders(count = 5) {
  return useQuery({
    queryKey: statsKeys.recentOrders(count),
    queryFn: () => getRecentOrders(count),
    // Polling: Tự động làm mới mỗi 30 giây để Admin thấy đơn mới nhất ngay
    refetchInterval: 30_000, 
  });
}