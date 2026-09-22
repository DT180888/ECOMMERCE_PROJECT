import { axiosClient } from "@shared/api/axiosClient";
import type { AdminKpis, RevenueChartData, RecentOrder } from "./types";

export async function getAdminKpis(): Promise<AdminKpis> {
  const { data } = await axiosClient.get<AdminKpis>("/api/v1/admin/stats/kpis");
  return data;
}

export async function getRevenueChart(days = 7): Promise<RevenueChartData[]> {
  const { data } = await axiosClient.get<RevenueChartData[]>("/api/v1/admin/stats/revenue-chart", {
    params: { days },
  });
  return data;
}

export async function getRecentOrders(count = 5): Promise<RecentOrder[]> {
  const { data } = await axiosClient.get<RecentOrder[]>("/api/v1/admin/stats/recent-orders", {
    params: { count },
  });
  return data;
}

