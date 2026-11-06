import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RevenueChart } from "./RevenueChart";
import { StatsGrid } from "./StatsGrid";
import { RecentOrdersWidget } from "./RecentOrdersWidget";
import { TopSellingProductsWidget } from "./TopSellingProductsWidget";
import { LowStockAlertsWidget } from "./LowStockAlertsWidget";
import {
  DashboardDateFilter,
  calculateRange,
  type PresetKey,
  type DateFilterValue,
} from "./DashboardDateFilter";
import { ChartPieIcon } from "@heroicons/react/24/outline";
import { AdminPageShell } from "@shared/ui";

export function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Khởi tạo state từ URL Query Params
  const presetFromUrl = (searchParams.get("preset") as PresetKey) || "7d";
  const fromFromUrl = searchParams.get("from");
  const toFromUrl = searchParams.get("to");

  const [dateFilter, setDateFilter] = useState<DateFilterValue>(() => {
    if (fromFromUrl && toFromUrl) {
      const fromDate = new Date(fromFromUrl);
      const toDate = new Date(toFromUrl);
      const isValid = !isNaN(fromDate.getTime()) && !isNaN(toDate.getTime());
      if (isValid) {
        return {
          preset: "custom",
          from: fromFromUrl,
          to: toFromUrl,
          displayLabel: `${fromDate.toLocaleDateString("vi-VN")} - ${toDate.toLocaleDateString("vi-VN")}`,
        };
      }
    }
    const resolved = calculateRange(presetFromUrl);
    return {
      preset: presetFromUrl,
      from: resolved.from,
      to: resolved.to,
      displayLabel: resolved.label,
    };
  });

  const handleFilterChange = (newVal: DateFilterValue) => {
    setDateFilter(newVal);
    // Cập nhật URL search params
    const params = new URLSearchParams();
    if (newVal.preset === "custom") {
      if (newVal.from) params.set("from", newVal.from);
      if (newVal.to) params.set("to", newVal.to);
      params.set("preset", "custom");
    } else {
      params.set("preset", newVal.preset);
    }
    setSearchParams(params, { replace: true });
  };

  const dateParams = { from: dateFilter.from, to: dateFilter.to };

  return (
    <AdminPageShell>
      <AdminPageShell.Header
        icon={ChartPieIcon}
        title="Tổng quan"
        subtitle={`Báo cáo điều hành kinh doanh • Kỳ: ${dateFilter.displayLabel}`}
        actions={<DashboardDateFilter value={dateFilter} onChange={handleFilterChange} />}
      />

      <AdminPageShell.Body>
        {/* Zone 1: Chỉ số hiệu suất chính (KPIs Monolith) */}
        <section aria-label="Chỉ số hiệu suất chính">
          <StatsGrid dateRange={dateParams} />
        </section>

        {/* Zone 2: Adaptive Monolith Grid: Mobile 1 col / Tablet 2 cols / Desktop 12 cols (8:4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
          {/* Cột trái (Biểu đồ doanh thu & Top sản phẩm) */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-4 md:gap-6 min-w-0">
            <div className="h-[260px] sm:h-[320px] lg:h-[380px] min-h-[240px] w-full">
              <RevenueChart dateRange={dateParams} displayLabel={dateFilter.displayLabel} />
            </div>
            <div className="min-h-fit w-full">
              <TopSellingProductsWidget dateRange={dateParams} />
            </div>
          </div>

          {/* Cột phải (Vận hành theo thời gian thực: Đơn mới & Cảnh báo tồn kho) */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-4 md:gap-6 min-w-0">
            <div className="h-auto xl:h-[380px] min-h-0 xl:min-h-[320px] w-full">
              <RecentOrdersWidget />
            </div>
            <div className="min-h-fit w-full">
              <LowStockAlertsWidget />
            </div>
          </div>
        </div>
      </AdminPageShell.Body>
    </AdminPageShell>
  );
}

