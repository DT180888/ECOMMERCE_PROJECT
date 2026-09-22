import { axiosClient } from "@my-project/shared-utils";
import type { AdminKpis, RevenueChartData, RecentOrder, TopSellingProductDto, LowStockAlertDto } from "./types";

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

export async function getTopSellingProducts(limit = 5): Promise<TopSellingProductDto[]> {
  const { data } = await axiosClient.get<TopSellingProductDto[]>("/api/v1/admin/stats/top-selling", {
    params: { limit },
  });
  return data;
}

export async function getLowStockAlerts(limit = 10): Promise<LowStockAlertDto[]> {
  const { data } = await axiosClient.get<LowStockAlertDto[]>("/api/v1/admin/stats/low-stock-alerts", {
    params: { limit },
  });
  return data;
}
