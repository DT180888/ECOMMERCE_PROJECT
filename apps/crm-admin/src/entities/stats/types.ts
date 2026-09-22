export interface AdminKpis {
  revenue: number;       // Decimal từ BE sẽ là number trong JS
  ordersCount: number;
  customersCount: number;
  lowStockCount: number;
  revenueGrowth: number;
  ordersGrowth: number;
}

export interface RevenueChartData {
  date: string;    // Trục X: "25/11"
  revenue: number; // Trục Y: Doanh thu
}

export interface RecentOrder {
  orderId: number;
  orderNumber: string;
  customerName: string;
  totalMinor: number;
  status: number; // Enum byte từ BE (0, 1, 2...)
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