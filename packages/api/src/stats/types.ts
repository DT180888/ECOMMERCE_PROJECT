export interface AdminKpis {
  revenue: number;
  ordersCount: number;
  customersCount: number;
  lowStockCount: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
}

export interface RecentOrder {
  orderId: number;
  orderNumber: string;
  customerName: string;
  totalMinor: number;
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
