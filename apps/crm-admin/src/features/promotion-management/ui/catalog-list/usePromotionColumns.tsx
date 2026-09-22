import { useMemo } from "react";
import type { AdminTableColumn } from "@shared/ui";
import type { PromotionDto } from "@entities/promotion/api";
import { Badge, Button } from "@my-project/ui";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UsePromotionColumnsProps {
  onDelete: (id: number) => void;
}

export function usePromotionColumns({ onDelete }: UsePromotionColumnsProps) {
  const navigate = useNavigate();

  return useMemo<AdminTableColumn<PromotionDto>[]>(() => {
    return [
      {
        key: "promotionId",
        label: "ID",
        align: "center",
        minWidth: "64px",
        render: (p) => (
          <span className="font-mono text-xs text-muted-foreground">
            #{p.promotionId}
          </span>
        ),
      },
      {
        key: "name",
        label: "Tên chương trình",
        isMain: true,
        minWidth: "200px",
        render: (p) => (
          <span className="font-medium text-foreground text-sm truncate max-w-[200px]" title={p.name}>
            {p.name}
          </span>
        ),
      },
      {
        key: "code",
        label: "Mã",
        align: "center",
        minWidth: "120px",
        render: (p) => (
          <div className="flex justify-center">
            {p.code ? (
              <Badge variant="primary" className="font-mono tracking-wider">{p.code}</Badge>
            ) : (
              <Badge variant="flat" className="text-muted-foreground border-border">Flash Sale</Badge>
            )}
          </div>
        ),
      },
      {
        key: "value",
        label: "Giá trị",
        align: "right",
        minWidth: "120px",
        render: (p) => {
          const isPercentage = p.type === 0;
          return (
            <div className="flex flex-col items-end gap-0.5">
              <span className="font-bold text-accent font-mono text-sm">
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
          <span
            className={`inline-flex items-center px-2 py-0.5 text-[10px] sm:text-xs font-semibold select-none rounded-inner ${
              p.isActive
                ? "bg-accent/10 text-accent"
                : "bg-secondary/20 text-muted-foreground"
            }`}
          >
            {p.isActive ? "Hoạt động" : "Vô hiệu"}
          </span>
        ),
      },
      {
        key: "time",
        label: "Thời gian",
        minWidth: "160px",
        render: (p) => (
          <div className="flex gap-2 whitespace-nowrap text-xs text-muted-foreground">
            <div><span className="font-bold">Từ:</span> {p.startsAt ? new Date(p.startsAt).toLocaleDateString("vi-VN", { hour: '2-digit', minute: '2-digit' }) : "Không giới hạn"}</div>
            <div><span className="font-bold">Đến:</span> {p.endsAt ? new Date(p.endsAt).toLocaleDateString("vi-VN", { hour: '2-digit', minute: '2-digit' }) : "Không giới hạn"}</div>
          </div>
        ),
      },
      {
        key: "redemptions",
        label: "Đã dùng",
        align: "center",
        minWidth: "100px",
        render: (p) => (
          <span className="font-mono text-sm">
            <span className="font-semibold text-foreground">{p.redemptionsCount}</span>
            <span className="text-muted-foreground"> / {p.maxRedemptions ?? "∞"}</span>
          </span>
        ),
      },
      {
        key: "actions",
        label: "Thao tác",
        align: "right",
        minWidth: "100px",
        render: (p) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-accent hover:bg-accent/10"
              onClick={() => navigate(`/admin/promotion/${p.promotionId}`)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
              onClick={() => onDelete(p.promotionId)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ];
  }, [navigate, onDelete]);
}
