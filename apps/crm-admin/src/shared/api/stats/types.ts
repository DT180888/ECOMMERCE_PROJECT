export interface DateRangeParams {
  from?: string; // ISO 8601 UTC
  to?: string;   // ISO 8601 UTC
}

export interface AdminKpis {
  // BE Schema
  totalOrders: number;
  ordersGrowthPercent?: number;
  totalRevenueMinor: number;
  revenueGrowthPercent?: number;
  averageOrderValueMinor: number;
  averageOrderValueGrowthPercent?: number;
  totalCustomers: number;
  customersGrowthPercent?: number;
  pendingPaymentsCount: number;
  totalProducts: number;

  // UI Backward Compatibility Aliases
  revenue: number;
  ordersCount: number;
  customersCount: number;
  lowStockCount: number;
  revenueGrowth: number | null;
  ordersGrowth: number | null;
  customersGrowth: number | null;
}

export interface RevenueChartParams extends DateRangeParams {
  days?: number;
  interval?: "auto" | "day" | "week" | "month";
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  revenueMinor?: number;
  ordersCount?: number;
}

export interface TopSellingParams extends DateRangeParams {
  limit?: number;
}

export interface RecentOrder {
  orderId: number;
  orderNumber: string;
  email?: string | null;
  customerName?: string | null;
  totalMinor?: number | null;
  status: number;
  createdAt: string;
}

export interface TopSellingProductDto {
  skuId: number;
  productName: string;
  skuName: string | null;
  totalQuantitySold: number;
  totalRevenueMinor: number;
}

export interface LowStockAlertDto {
  skuId: number;
  productId: number;
  productName: string;
  skuCode: string;
  quantityOnHand: number;
  quantityReserved: number;
  reorderPoint: number;
}
