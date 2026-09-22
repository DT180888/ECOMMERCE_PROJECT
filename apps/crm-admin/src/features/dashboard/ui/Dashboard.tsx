import { RevenueChart } from "./RevenueChart";
import { StatsGrid } from "./StatsGrid";
import { RecentOrdersWidget } from "./RecentOrdersWidget";
import { TopSellingProductsWidget } from "./TopSellingProductsWidget";
import { LowStockAlertsWidget } from "./LowStockAlertsWidget";
import { ChartPieIcon } from "@heroicons/react/24/outline";
import { AdminPageShell } from "@shared/ui/AdminPageShell";

export function Dashboard() {
  return (
    <AdminPageShell
      icon={ChartPieIcon}
      title="Tổng quan"
      noCard
    >
      {/* Scrollable body */}
      <div className="flex-1 pb-5 md:pb-6 space-y-3 md:space-y-4 min-h-0">
        {/* KPI Strip */}
        <StatsGrid />

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 responsive-gap">
          <div className="lg:col-span-2 h-[420px]">
            <RevenueChart />
          </div>
          <div className="h-[420px]">
            <RecentOrdersWidget />
          </div>
        </div>

        {/* Second row: Top Selling & Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 responsive-gap">
          <div className="h-[420px]">
            <TopSellingProductsWidget />
          </div>
          <div className="h-[420px]">
            <LowStockAlertsWidget />
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}

