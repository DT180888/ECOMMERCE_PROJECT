import { useMemo } from "react";
import { Link } from "react-router-dom";
import { OrderStatusBadge } from "@my-project/ui";
import { EyeIcon } from "@heroicons/react/24/outline";
import { AdminTableColumn } from "@shared/ui/table";

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

export function useOrderColumns(): AdminTableColumn<any>[] {
  return useMemo(
    () => [
      {
        key: "orderNumber",
        label: "Mã đơn",
        minWidth: "130px",
        isSub: true,
        render: (o: any) => (
          <Link
            to={`/admin/orders/${o.orderId}`}
            className="font-mono text-xs font-medium text-foreground hover:underline"
          >
            #{o.orderNumber}
          </Link>
        ),
      },
      {
        key: "customerName",
        label: "Khách hàng",
        isMain: true,
        render: (o: any) => (
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate max-w-[200px]">{o.customerName}</p>
            {o.email && (
              <p className="text-[11px] text-muted-foreground font-mono truncate">{o.email}</p>
            )}
          </div>
        ),
      },
      {
        key: "createdAt",
        label: "Ngày tạo",
        minWidth: "150px",
        isSub: true,
        render: (o: any) => (
          <span className="text-xs text-muted-foreground font-mono tabular-nums whitespace-nowrap">
            {formatDateTime(o.createdAt)}
          </span>
        ),
      },
      {
        key: "totalMinor",
        label: "Tổng tiền",
        align: "right",
        minWidth: "130px",
        isFooter: true,
        render: (o: any) => (
          <span className="font-mono text-xs font-medium tabular-nums text-foreground whitespace-nowrap">
            {formatVND(o.totalMinor)}
          </span>
        ),
      },
      {
        key: "status",
        label: "Trạng thái",
        align: "center",
        minWidth: "180px",
        isFooter: true,
        render: (o: any) => <OrderStatusBadge status={o.status} />,
      },
      {
        key: "actions",
        label: "Thao tác",
        align: "center",
        minWidth: "80px",
        sticky: "right",
        isAction: true,
        render: (o: any) => (
          <div className="flex items-center justify-center">
            <Link
              to={`/admin/orders/${o.orderId}`}
              title="Xem chi tiết"
              className="flex items-center justify-center h-7 w-7 rounded-[2px] text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
            >
              <EyeIcon className="h-4 w-4 stroke-[1.25]" />
            </Link>
          </div>
        ),
      },
    ],
    []
  );
}

export default useOrderColumns;

