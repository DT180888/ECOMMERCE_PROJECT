import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAdminOrders } from "@entities/order/admin";
import type { AdminOrderListItem } from "@entities/order/admin";
import { Button, Input, Tabs, TabsList, TabsTrigger, FilterDropdown } from "@my-project/ui";
import type { FilterDropdownOption } from "@my-project/ui";
import OrderStatusBadge from "@entities/order/ui/OrderStatusBadge";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  ShoppingBagIcon,
  InboxIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { AdminPageShell, AdminTable, AdminPagination, type AdminTableColumn } from "@shared/ui";
import { cn } from "@shared/lib/utils";

// --- Helpers ---
const formatVND = (minor: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(minor ?? 0);

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

// --- Tab config ---
const TAB_ITEMS = [
  { value: "all",             label: "Tất cả",         status: undefined },
  { value: "pending",         label: "Mới tạo",        status: 0 },
  { value: "awaitingpayment", label: "Chờ thanh toán", status: 1 },
  { value: "paid",            label: "Đã thanh toán",  status: 2 },
  { value: "processing",      label: "Đang xử lý",     status: 3 },
  { value: "shipped",         label: "Vận chuyển",     status: 4 },
  { value: "completed",       label: "Hoàn thành",     status: 5 },
  { value: "cancelled",       label: "Đã huỷ",         status: 6 },
  { value: "refunded",        label: "Hoàn tiền",      status: 7 },
];

const STATUS_HOVER_TEXT_COLORS: Record<string, string> = {
  all:             "hover:text-surface",
  pending:         "hover:text-amber-500",
  awaitingpayment: "hover:text-orange-500",
  paid:            "hover:text-teal-500",
  processing:      "hover:text-blue-500",
  shipped:         "hover:text-purple-500",
  completed:       "hover:text-emerald-500",
  cancelled:       "hover:text-red-500",
  refunded:        "hover:text-gray-500",
};

const STATUS_TEXT_COLORS: Record<string, string> = {
  all:             "text-foreground",
  pending:         "text-amber-500",
  awaitingpayment: "text-orange-500",
  paid:            "text-teal-500",
  processing:      "text-blue-500",
  shipped:         "text-purple-500",
  completed:       "text-emerald-500",
  cancelled:       "text-red-500",
  refunded:        "text-gray-500",
};

const STATUS_BG_COLORS: Record<string, string> = {
  all:             "bg-muted/30 border border-muted",
  pending:         "bg-amber-500/30 border border-amber-500",
  awaitingpayment: "bg-orange-500/30 border border-orange-500",
  paid:            "bg-teal-500/30 border border-teal-500",
  processing:      "bg-blue-500/30 border border-blue-500",
  shipped:         "bg-purple-500/30 border border-purple-500",
  completed:       "bg-emerald-500/30 border border-emerald-500",
  cancelled:       "bg-red-500/30 border border-red-500",
  refunded:        "bg-gray-500/30 border border-gray-500",
};

const PAGE_SIZE = 15;

export function AdminOrderList() {
  const [page, setPage]               = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab]     = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput);
      if (searchInput !== debouncedSearch) setPage(1);
    }, 500);
    return () => clearTimeout(t);
  });

  const currentStatus = TAB_ITEMS.find((t) => t.value === activeTab)?.status;

  const filterOptions: FilterDropdownOption[] = TAB_ITEMS.map((tab) => ({
    value: tab.value,
    label: tab.label,
    activeColorClass: STATUS_TEXT_COLORS[tab.value],
    activeBgClass:    STATUS_BG_COLORS[tab.value],
    activeHoverTextClass:  STATUS_HOVER_TEXT_COLORS[tab.value]
  }));

  const { data, isLoading } = useAdminOrders({
    page,
    size: PAGE_SIZE,
    status: currentStatus === undefined ? null : currentStatus,
    search: debouncedSearch || undefined,
  });

  const items      = data?.items ?? [];
  const total      = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleTabChange = (value: string) => { setActiveTab(value); setPage(1); };

  const columns: AdminTableColumn<AdminOrderListItem>[] = [
    {
      key: "orderNumber",
      label: "Mã đơn",
      minWidth: "140px",
      render: (o) => (
        <Link
          to={`/admin/orders/${o.orderId}`}
          className="font-mono text-xs font-semibold text-accent hover:underline"
        >
          #{o.orderNumber}
        </Link>
      ),
    },
    {
      key: "customerName",
      label: "Khách hàng",
      isMain: true,
      render: (o) => (
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate max-w-[200px]">{o.customerName}</p>
          {o.email && (
            <p className="text-xs text-muted-foreground font-mono truncate">{o.email}</p>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      minWidth: "160px",
      render: (o) => (
        <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
          {formatDateTime(o.createdAt)}
        </span>
      ),
    },
    {
      key: "totalMinor",
      label: "Tổng tiền",
      align: "right",
      minWidth: "130px",
      render: (o) => (
        <span className="font-semibold text-emerald-500 whitespace-nowrap tabular-nums">
          {formatVND(o.totalMinor)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      align: "center",
      minWidth: "130px",
      render: (o) => <OrderStatusBadge status={o.status} />,
    },
    {
      key: "actions",
      label: "Chi tiết",
      align: "center",
      minWidth: "80px",
      sticky: "right",
      render: (o) => (
        <div className="flex items-center justify-center">
          <Link
            to={`/admin/orders/${o.orderId}`}
            title="Xem chi tiết"
            className="flex items-center p-0 justify-center h-4 w-4 rounded-button text-muted-foreground hover:text-foreground hover:bg-background transition-all duration-300"
          >
            <EyeIcon className="h-4 w-4" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col h-full w-full">
      <AdminPageShell
        icon={ShoppingBagIcon}
        title="Quản lý đơn hàng"
        badge={`${total} đơn`}
        noCard={true}
        actions={
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative group flex-1 sm:w-64">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Tìm tên khách, mã đơn, email..."
                className="pl-9 w-full"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            {/* Mobile Dropdown */}
            <div className="block sm:hidden w-[140px] shrink-0">
              <FilterDropdown
                options={filterOptions}
                value={activeTab}
                onSelect={handleTabChange}
              />
            </div>
            {/* Desktop Toggle Button */}
            <Button
              variant="default"
              size="default"
              onClick={() => setShowFilters(!showFilters)}
              className={`hidden sm:flex items-center hover:bg-accent/30 hover:text-accent justify-center shrink-0 shadow-neo-sm ${
                showFilters || activeTab !== "all" ? " border border-accent/30 bg-accent/20 text-accent " : "bg-accent text-background"
              }`}
              title="Lọc trạng thái"
            >
              <FunnelIcon className="w-4 h-4" />
              <span className="text-xs">Lọc đơn hàng</span>
            </Button>
          </div>
        }
        filterBar={
          <div 
            className={`hidden sm:grid overflow-hidden transition-all duration-300 ease-in-out w-full ${
              showFilters ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0 min-w-0 px-2 w-full">
              <div className="bg-card rounded-br-card rounded-bl-card border border-foreground/10 border-t-0 w-full overflow-hidden">
                {/* Tab bar (Desktop) */}
                <div className="w-full px-1 py-1">
                  <TabsList className="h-10 flex items-center bg-transparent p-0 gap-1.5 w-full">
                    {TAB_ITEMS.map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={cn(
                          "px-3 py-1.5 text-xs font-semibold transition-all duration-300 rounded-full data-[state=active]:shadow-none",
                          activeTab === tab.value
                            ? STATUS_BG_COLORS[tab.value]
                            : cn("text-muted-foreground border border-transparent hover:bg-black/5 dark:hover:bg-white/5", STATUS_HOVER_TEXT_COLORS[tab.value])
                        )}
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>
            </div>
          </div>
        }
      >
        {/* Table */}
        <div className="flex-1 min-h-0">
          <AdminTable<AdminOrderListItem>
            columns={columns}
            data={items}
            isLoading={isLoading}
            skeletonRows={PAGE_SIZE}
            emptyIcon={InboxIcon}
            emptyTitle="Không có đơn hàng nào"
            emptyDescription="Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm"
            footer={
              <AdminPagination
                page={page}
                totalPages={totalPages}
                total={total}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            }
          />
        </div>
      </AdminPageShell>
    </Tabs>
  );
}
