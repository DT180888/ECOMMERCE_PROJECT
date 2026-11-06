import { axiosClient } from "@my-project/shared-utils";
import type {
  AdminKpis,
  RevenueChartData,
  RecentOrder,
  TopSellingProductDto,
  LowStockAlertDto,
  DateRangeParams,
  RevenueChartParams,
  TopSellingParams,
} from "./types";

export async function getAdminKpis(params?: DateRangeParams): Promise<AdminKpis> {
  const { data } = await axiosClient.get<any>("/api/v1/admin/stats/kpis", {
    params: {
      from: params?.from,
      to: params?.to,
    },
  });

  return {
    totalOrders: data?.totalOrders ?? 0,
    ordersGrowthPercent: data?.ordersGrowthPercent ?? 0,
    totalRevenueMinor: data?.totalRevenueMinor ?? 0,
    revenueGrowthPercent: data?.revenueGrowthPercent ?? 0,
    averageOrderValueMinor: data?.averageOrderValueMinor ?? 0,
    averageOrderValueGrowthPercent: data?.averageOrderValueGrowthPercent ?? 0,
    totalCustomers: data?.totalCustomers ?? 0,
    customersGrowthPercent: data?.customersGrowthPercent ?? 0,
    pendingPaymentsCount: data?.pendingPaymentsCount ?? 0,
    totalProducts: data?.totalProducts ?? 0,
    // UI Backward Compatibility Aliases:
    revenue: data?.totalRevenueMinor ?? data?.revenue ?? 0,
    ordersCount: data?.totalOrders ?? data?.ordersCount ?? 0,
    customersCount: data?.totalCustomers ?? data?.customersCount ?? 0,
    lowStockCount: data?.lowStockCount ?? 0,
    revenueGrowth: data?.revenueGrowthPercent ?? data?.revenueGrowth ?? null,
    ordersGrowth: data?.ordersGrowthPercent ?? data?.ordersGrowth ?? null,
    customersGrowth: data?.customersGrowthPercent ?? null,
  };
}

export async function getRevenueChart(params?: RevenueChartParams | number): Promise<RevenueChartData[]> {
  const queryParams = typeof params === "number"
    ? { days: params }
    : {
        from: params?.from,
        to: params?.to,
        days: params?.days,
        interval: params?.interval ?? "auto",
      };

  const { data } = await axiosClient.get<any[]>("/api/v1/admin/stats/revenue-chart", {
    params: queryParams,
  });

  return (data || []).map((item) => ({
    date: item.date,
    revenue: item.revenueMinor ?? item.revenue ?? 0,
    revenueMinor: item.revenueMinor ?? item.revenue ?? 0,
    ordersCount: item.ordersCount ?? 0,
  }));
}

export async function getRecentOrders(count = 5): Promise<RecentOrder[]> {
  const { data } = await axiosClient.get<any[]>("/api/v1/admin/stats/recent-orders", {
    params: { limit: count },
  });
  return (data || []).map((item) => ({
    orderId: item.orderId,
    orderNumber: item.orderNumber,
    email: item.email,
    customerName: item.customerName || item.email || "Khách lẻ",
    totalMinor: item.totalMinor ?? 0,
    status: item.status,
    createdAt: item.createdAt,
  }));
}

export async function getTopSellingProducts(params?: TopSellingParams | number): Promise<TopSellingProductDto[]> {
  const queryParams = typeof params === "number"
    ? { limit: params }
    : {
        from: params?.from,
        to: params?.to,
        limit: params?.limit ?? 5,
      };

  const { data } = await axiosClient.get<TopSellingProductDto[]>("/api/v1/admin/stats/top-selling", {
    params: queryParams,
  });
  return data || [];
}

export async function getLowStockAlerts(limit = 10): Promise<LowStockAlertDto[]> {
  const { data } = await axiosClient.get<LowStockAlertDto[]>("/api/v1/admin/stats/low-stock-alerts", {
    params: { limit },
  });
  return data || [];
}
