import { useMemo } from "react";
import type { AdminTableColumn } from "@shared/ui";
import type { ActivePromotionDto as PromotionDto } from "@my-project/api";
import { Button } from "@my-project/ui";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { AdminStatusBadge } from "@components/common/AdminStatusBadge";

interface UsePromotionColumnsProps {
  onDelete: (id: number) => void;
  onEdit?: (id: number) => void;
}

export function usePromotionColumns({ onDelete, onEdit }: UsePromotionColumnsProps) {
  const navigate = useNavigate();

  return useMemo<AdminTableColumn<PromotionDto>[]>(() => {
    return [
      {
        key: "promotionId",
        label: "ID",
        align: "center",
        minWidth: "60px",
        render: (p) => (
          <span className="font-mono tabular-nums text-xs text-muted-foreground">
            #{p.promotionId}
          </span>
        ),
      },
      {
        key: "name",
        label: "Chương trình",
        isMain: true,
        minWidth: "180px",
        render: (p) => (
          <span className="font-medium text-foreground text-xs truncate max-w-[200px]" title={p.name}>
            {p.name}
          </span>
        ),
      },
      {
        key: "code",
        label: "Mã",
        align: "center",
        minWidth: "110px",
        render: (p) => (
          <div className="flex justify-center">
            {p.code ? (
              <span className="px-2 py-0.5 rounded-[2px] bg-surface text-foreground font-mono text-xs font-medium">
                {p.code}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-[2px] bg-surface text-muted-foreground font-mono text-[11px]">
                Flash Sale
              </span>
            )}
          </div>
        ),
      },
      {
        key: "value",
        label: "Giá trị",
        align: "right",
        minWidth: "110px",
        isFooter: true,
        render: (p) => {
          const isPercentage = p.type === 0;
          return (
            <div className="flex flex-col items-end gap-1">
              <span className="font-mono text-xs font-medium tabular-nums text-foreground">
                {isPercentage ? `${p.value}%` : `${p.value.toLocaleString()} đ`}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {isPercentage ? "Phần trăm" : "Tiền mặt"}
              </span>
            </div>
          );
        },
      },
      {
        key: "isActive",
        label: "Trạng thái",
        align: "center",
        minWidth: "100px",
        render: (p) => (
          <AdminStatusBadge variant={p.isActive ? "success" : "neutral"}>
            {p.isActive ? "Hoạt động" : "Vô hiệu"}
          </AdminStatusBadge>
        ),
      },
      {
        key: "time",
        label: "Thời gian",
        minWidth: "160px",
        isSub: true,
        render: (p) => (
          <div className="flex flex-col gap-1 text-xs text-muted-foreground font-mono tabular-nums">
            <div>
              <span className="text-foreground">Từ:</span> {p.startsAt ? new Date(p.startsAt).toLocaleDateString("vi-VN") : "—"}
            </div>
            <div>
              <span className="text-foreground">Đến:</span> {p.endsAt ? new Date(p.endsAt).toLocaleDateString("vi-VN") : "—"}
            </div>
          </div>
        ),
      },
      {
        key: "redemptions",
        label: "Đã dùng",
        align: "center",
        minWidth: "90px",
        render: (p) => (
          <span className="font-mono text-xs tabular-nums">
            <span className="font-medium text-foreground">{p.redemptionsCount}</span>
            <span className="text-muted-foreground"> / {p.maxRedemptions ?? "∞"}</span>
          </span>
        ),
      },
      {
        key: "actions",
        label: "Thao tác",
        align: "right",
        minWidth: "80px",
        sticky: "right",
        isAction: true,
        render: (p) => (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-info hover:text-info hover:bg-info/10 rounded-[2px]"
              title="Chỉnh sửa khuyến mãi"
              onClick={() => (onEdit ? onEdit(p.promotionId) : navigate(`/admin/promotion/${p.promotionId}`))}
            >
              <PencilSquareIcon className="w-3.5 h-3.5 stroke-[1.25]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-error hover:text-error hover:bg-error/10 rounded-[2px]"
              title="Xóa khuyến mãi"
              onClick={() => onDelete(p.promotionId)}
            >
              <TrashIcon className="w-3.5 h-3.5 stroke-[1.25]" />
            </Button>
          </div>
        ),
      },
    ];
  }, [navigate, onDelete, onEdit]);
}
export default usePromotionColumns;
