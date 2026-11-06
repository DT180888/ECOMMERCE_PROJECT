import { useState, useEffect } from "react";
import { useAdminOrders } from "@hooks/useOrder";
import {
  ShoppingBagIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { AdminPageShell, AdminTable } from "@shared/ui";
import { ORDER_TAB_ITEMS } from "@my-project/shared-utils";
import { useOrderColumns } from "./useOrderColumns";

const PAGE_SIZE = 15;

export function OrderList() {
  const [page, setPage]               = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab]     = useState("all");

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput);
      if (searchInput !== debouncedSearch) setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput, debouncedSearch]);

  const currentStatus = ORDER_TAB_ITEMS.find((t) => t.value === activeTab)?.status;

  const { data, isLoading } = useAdminOrders({
    page,
    size: PAGE_SIZE,
    status: currentStatus === undefined ? null : currentStatus,
    search: debouncedSearch || undefined,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1);
  };

  const columns = useOrderColumns();

  return (
    <div className="flex flex-col h-full w-full">
      <AdminPageShell>
        <AdminPageShell.Header
          icon={ShoppingBagIcon}
          title="Đơn hàng"
          badge={`${total}`}
        />
        <AdminPageShell.Body>
          <div className="flex-1 min-h-0 flex flex-col">
            <AdminTable<any>
              columns={columns}
              data={items}
              isLoading={isLoading}
              rowKey="orderId"
              enableCardView={true}
              storageKey="crm_order_view_mode"
              search={{
                query: searchInput,
                onChange: setSearchInput,
                placeholder: "Mã đơn, khách hàng...",
              }}
              tabs={{
                value: activeTab,
                onChange: handleTabChange,
                items: ORDER_TAB_ITEMS.map((tab) => ({
                  value: tab.value,
                  label: tab.label,
                  class: tab.borderClass
                })),
              }}
              pagination={{
                page,
                total,
                pageSize: PAGE_SIZE,
                onPageChange: setPage,
              }}
              emptyText="Không có đơn hàng nào"
              emptyIcon={InboxIcon}
            />
          </div>
        </AdminPageShell.Body>
      </AdminPageShell>
    </div>
  );
}

export const AdminOrderList = OrderList;
export default OrderList;

