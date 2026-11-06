import { useState, useMemo } from "react";
import { AdminPageShell } from "@shared/ui";
import {
  ChartBarSquareIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  NewspaperIcon,
  TableCellsIcon,
  ShoppingBagIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Tabs, TabsList, TabsTrigger, useToast, cn } from "@my-project/ui";
import { formatVND } from "@my-project/shared-utils";
import {
  useTopCustomersReport,
  useSalesByCategoryReport,
  useSalesByBrandReport,
  usePromotionRoiReport,
} from "@hooks/useReports";
import { downloadReportCsv } from "@my-project/api";
import {
  DashboardDateFilter,
  calculateRange,
  type DateFilterValue,
} from "@components/dashboard/DashboardDateFilter";
import {
  ReportsKpiStrip,
  MarketProductsEditorial,
  CustomersCampaignsEditorial,
  CustomerReportTable,
  CategoryReportTable,
  BrandReportTable,
  PromotionRoiReportTable,
} from "@components/reports";
import { Customer360Drawer } from "@components/customer/Customer360Drawer";

type MasterTopic = "market" | "growth";
type TableSubTab = "category" | "brand" | "customers" | "promotions";

export default function ReportsPage() {
  // ── Master Navigation ──
  const [activeTopic, setActiveTopic] = useState<MasterTopic>("market");
  const [isTableView, setIsTableView] = useState(false);
  const [tableSubTab, setTableSubTab] = useState<TableSubTab>("category");

  // ── Filters & Search ──
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [isExporting, setIsExporting] = useState(false);
  const toast = useToast();

  // ── Customer 360 Drawer State ──
  const [c360Open, setC360Open] = useState(false);
  const [selectedC360UserId, setSelectedC360UserId] = useState<string | null>(null);

  // ── Bộ lọc ngày chuẩn CRM (Giữ nguyên 100%) ──
  const [dateFilter, setDateFilter] = useState<DateFilterValue>(() => {
    const resolved = calculateRange("30d");
    return { preset: "30d", from: resolved.from, to: resolved.to, displayLabel: resolved.label };
  });

  const baseParams = {
    from: dateFilter.from,
    to: dateFilter.to,
    keyword: keyword.trim() || undefined,
    page,
    pageSize,
  };

  // Queries cho từng phân hệ
  const customersQuery = useTopCustomersReport({
    ...baseParams,
    sortBy: "totalSpend",
    sortDirection: "desc",
  });
  const categoryQuery = useSalesByCategoryReport(baseParams);
  const brandQuery = useSalesByBrandReport(baseParams);
  const promoQuery = usePromotionRoiReport(baseParams);

  // Xử lý xuất file CSV
  const handleExport = async () => {
    try {
      setIsExporting(true);
      const exportType =
        activeTopic === "market"
          ? tableSubTab === "brand"
            ? "sales-by-brand"
            : "sales-by-category"
          : tableSubTab === "promotions"
          ? "promotions-roi"
          : "customers";

      await downloadReportCsv(exportType, {
        from: dateFilter.from,
        to: dateFilter.to,
        keyword: keyword.trim() || undefined,
      });

      toast.success("Báo cáo đã được xuất thành công dưới định dạng CSV.");
    } catch (err) {
      console.error("Lỗi xuất file CSV:", err);
      toast.error("Không thể trích xuất file CSV từ máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenCustomer360 = (userId: string) => {
    setSelectedC360UserId(userId);
    setC360Open(true);
  };

  // ── KPI Big Numbers Calculation ──
  const marketKpis = useMemo(() => {
    const totalRev = categoryQuery.data?.summary?.totalRevenueMinor ?? 0;
    const totalQty = categoryQuery.data?.summary?.totalQuantitySold ?? 0;
    const catCount = categoryQuery.data?.summary?.totalCategoriesCount ?? 0;
    const brandCount = brandQuery.data?.summary?.totalBrandsCount ?? 0;

    return [
      {
        label: "Tổng doanh thu sản phẩm",
        value: formatVND(totalRev),
        sublabel: "Toàn bộ danh mục & nhãn hàng",
      },
      {
        label: "Tổng sản phẩm bán ra",
        value: `${totalQty.toLocaleString()} sp`,
        sublabel: "Số lượng xuất kho thành công",
      },
      {
        label: "Quy mô danh mục",
        value: `${catCount} danh mục`,
        sublabel: "Đang phát sinh giao dịch",
      },
      {
        label: "Thương hiệu ghi nhận",
        value: `${brandCount} nhãn hàng`,
        sublabel: "Có phát sinh đơn hàng trong kỳ",
      },
    ];
  }, [categoryQuery.data, brandQuery.data]);

  const growthKpis = useMemo(() => {
    const promoRev = promoQuery.data?.summary?.totalDrivenRevenueMinor ?? 0;
    const discount = promoQuery.data?.summary?.totalDiscountMinor ?? 0;
    const redemptions = promoQuery.data?.summary?.totalRedemptionsCount ?? 0;
    const roiMultiplier =
      discount > 0 ? `${(promoRev / discount).toFixed(1)}x` : "—";

    return [
      {
        label: "Doanh thu mang lại từ KM",
        value: formatVND(promoRev),
        sublabel: "Doanh số gắn với mã voucher",
      },
      {
        label: "Ngân sách chiết khấu",
        value: `-${formatVND(discount)}`,
        highlightColor: "text-error",
        sublabel: "Tổng tiền giảm giá cho khách",
      },
      {
        label: "Lượt kích hoạt voucher",
        value: `${redemptions.toLocaleString()} lượt`,
        sublabel: "Số lần áp dụng thành công",
      },
      {
        label: "Đòn bẩy ROI tổng thể",
        value: roiMultiplier,
        highlightColor: "text-success",
        sublabel: "Doanh thu thu về / Chiết khấu",
      },
    ];
  }, [promoQuery.data]);

  return (
    <>
      <AdminPageShell>
        {/* ── HEADERPAGE: Clean Editorial Identity Header ── */}
        <AdminPageShell.Header
          icon={ChartBarSquareIcon}
          title="Báo cáo & Phân tích CRM"
          subtitle={`Kỳ phân tích: ${dateFilter.displayLabel}`}
          actions={
            <div className="flex items-center justify-between gap-4 w-full">
              <div className="flex-1 min-w-0">
                <DashboardDateFilter
                        value={dateFilter}
                        onChange={(v) => {
                          setDateFilter(v);
                          setPage(1);
                        }}
                      />

              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleExport}
                icon={<ArrowDownTrayIcon className="w-3.5 h-3.5 stroke-[1.5]" />}
                disabled={isExporting}
                collapseTextOnSm
                className="h-[34px] shrink-0 px-3.5 gap-2 text-xs font-medium rounded-sm shadow-none"
              >
                <span>{isExporting ? "Đang xuất..." : "Xuất CSV"}</span>
              </Button>
              
              
            </div>
            
          }
        />

        {/* ── WORKSTATION TOOLBAR: Reports Navigation & Date Filter ── */}
        <AdminPageShell.Toolbar
          left={
            <Tabs
              value={activeTopic}
              onValueChange={(val) => {
                setActiveTopic(val as MasterTopic);
                setTableSubTab(val === "market" ? "category" : "customers");
                setPage(1);
              }}
              variant="line"
              size="sm"
            >
              <TabsList mode="auto" size="sm">
                <TabsTrigger
                  value="market"
                  icon={<ShoppingBagIcon className="w-3.5 h-3.5 stroke-[1.5]" />}
                >
                  Thị trường & Sản phẩm
                </TabsTrigger>
                <TabsTrigger
                  value="growth"
                  icon={<UserGroupIcon className="w-3.5 h-3.5 stroke-[1.5]" />}
                >
                  Khách hàng & Chiến dịch
                </TabsTrigger>
              </TabsList>
            </Tabs>
          }
          right={
            <div className="hidden md:flex items-center gap-2">
              <Button
                size="sm"
                variant={isTableView ? "default" : "outline"}
                onClick={() => setIsTableView((prev) => !prev)}
                icon={
                  isTableView ? (
                    <NewspaperIcon className="w-3.5 h-3.5 stroke-[1.75]" />
                  ) : (
                    <TableCellsIcon className="w-3.5 h-3.5 stroke-[1.75]" />
                  )
                }
                className="h-[34px] px-3 text-xs font-medium rounded-sm gap-1.5 shadow-none"
              >
                <span>{isTableView ? "Dạng Tạp chí" : "Dạng Bảng"}</span>
              </Button>
            </div>
          }
        />

        {/* ── EDITORIAL BODY ── */}
        <AdminPageShell.Body>
          <div className="flex flex-col gap-5 min-h-full font-sans select-none">

            {/* ── Tier 2 & 3: Main Editorial Folio or Table View ── */}
            {!isTableView ? (
              // 📰 THE EXECUTIVE FOLIO SHEET (ẤN PHẨM KHỔ LỚN THỐNG NHẤT)
              <div className="bg-card  rounded-lg shadow-none divide-y divide-border overflow-hidden">
                {/* 1. Folio Masthead: Seamless KPI Strip */}
                <ReportsKpiStrip
                  items={activeTopic === "market" ? marketKpis : growthKpis}
                />

                {/* 2. Folio Two-Column Spread */}
                {activeTopic === "market" ? (
                  <MarketProductsEditorial
                    categories={categoryQuery.data?.items ?? []}
                    brands={brandQuery.data?.items ?? []}
                    isLoadingCategory={categoryQuery.isLoading}
                    isLoadingBrand={brandQuery.isLoading}
                  />
                ) : (
                  <CustomersCampaignsEditorial
                    customers={customersQuery.data?.items ?? []}
                    promotions={promoQuery.data?.items ?? []}
                    isLoadingCustomer={customersQuery.isLoading}
                    isLoadingPromo={promoQuery.isLoading}
                    onOpenCustomer360={handleOpenCustomer360}
                  />
                )}
              </div>
            ) : (
              // 📊 DETAILED TABLE SHEET VIEW
              <div className="space-y-4">
                {/* Folio KPI Strip Overview in Table View */}
                <div className="bg-card border border-border rounded-sm shadow-none overflow-hidden">
                  <ReportsKpiStrip
                    items={activeTopic === "market" ? marketKpis : growthKpis}
                  />
                </div>
                {/* Table Sheet Sub-tabs & Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {activeTopic === "market" ? (
                      <>
                        <Button
                          size="xs"
                          variant={tableSubTab === "category" ? "primary" : "outline"}
                          onClick={() => {
                            setTableSubTab("category");
                            setPage(1);
                          }}
                          className="h-7 px-3 text-xs rounded-sm"
                        >
                          Bảng Danh mục ({categoryQuery.data?.total ?? 0})
                        </Button>
                        <Button
                          size="xs"
                          variant={tableSubTab === "brand" ? "primary" : "outline"}
                          onClick={() => {
                            setTableSubTab("brand");
                            setPage(1);
                          }}
                          className="h-7 px-3 text-xs rounded-sm"
                        >
                          Bảng Thương hiệu ({brandQuery.data?.total ?? 0})
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="xs"
                          variant={tableSubTab === "customers" ? "primary" : "outline"}
                          onClick={() => {
                            setTableSubTab("customers");
                            setPage(1);
                          }}
                          className="h-7 px-3 text-xs rounded-sm"
                        >
                          Bảng Khách hàng ({customersQuery.data?.total ?? 0})
                        </Button>
                        <Button
                          size="xs"
                          variant={tableSubTab === "promotions" ? "primary" : "outline"}
                          onClick={() => {
                            setTableSubTab("promotions");
                            setPage(1);
                          }}
                          className="h-7 px-3 text-xs rounded-sm"
                        >
                          Bảng Khuyến mãi ({promoQuery.data?.total ?? 0})
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-64">
                    <MagnifyingGlassIcon className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Tìm kiếm dòng dữ liệu..."
                      value={keyword}
                      onChange={(e) => {
                        setKeyword(e.target.value);
                        setPage(1);
                      }}
                      className="h-8 pl-8 text-xs bg-background border-border rounded-md w-full"
                    />
                  </div>
                </div>

                {/* Table Component */}
                {tableSubTab === "category" && (
                  <CategoryReportTable
                    data={categoryQuery.data?.items ?? []}
                    isLoading={categoryQuery.isLoading}
                    total={categoryQuery.data?.total ?? 0}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={setPage}
                  />
                )}

                {tableSubTab === "brand" && (
                  <BrandReportTable
                    data={brandQuery.data?.items ?? []}
                    isLoading={brandQuery.isLoading}
                    total={brandQuery.data?.total ?? 0}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={setPage}
                  />
                )}

                {tableSubTab === "customers" && (
                  <CustomerReportTable
                    data={customersQuery.data?.items ?? []}
                    isLoading={customersQuery.isLoading}
                    total={customersQuery.data?.total ?? 0}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onOpenCustomer360={handleOpenCustomer360}
                  />
                )}

                {tableSubTab === "promotions" && (
                  <PromotionRoiReportTable
                    data={promoQuery.data?.items ?? []}
                    isLoading={promoQuery.isLoading}
                    total={promoQuery.data?.total ?? 0}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={setPage}
                  />
                )}
              </div>
            )}
          </div>
        </AdminPageShell.Body>
      </AdminPageShell>

      {/* ── Customer 360 Drawer Drill-down ── */}
      <Customer360Drawer
        open={c360Open}
        onClose={() => {
          setC360Open(false);
          setSelectedC360UserId(null);
        }}
        userId={selectedC360UserId}
      />
    </>
  );
}
