import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button, Switch } from "@my-project/ui";
import { Guard, type AdminTableColumn } from "@shared/ui";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { HeroSlideDto } from "@my-project/api";
import { buildImgSrc } from "@my-project/shared-utils";

interface UseHeroSlideColumnsProps {
  hasEdit: boolean;
  hasDelete: boolean;
  onDelete: (id: number, name: string) => void;
  onToggleStatus: (id: number) => void;
  isDeleting: boolean;
  isToggling: boolean;
}

export function useHeroSlideColumns({
  hasEdit,
  hasDelete,
  onDelete,
  onToggleStatus,
  isDeleting,
  isToggling,
}: UseHeroSlideColumnsProps) {
  return useMemo<AdminTableColumn<HeroSlideDto>[]>(() => {
    const cols: AdminTableColumn<HeroSlideDto>[] = [
      {
        key: "id",
        label: "ID",
        align: "center",
        minWidth: "60px",
        render: (b) => (
          <span className="font-mono tabular-nums text-xs text-muted-foreground">
            #{b.id}
          </span>
        ),
      },
      {
        key: "thumbnail",
        label: "Ảnh đại diện",
        minWidth: "110px",
        isMedia: true,
        mediaAspect: "wide",
        render: (b) => {
          const rawUrl = b.assets?.bannerDesktop?.url;
          const imgUrl = rawUrl ? buildImgSrc(rawUrl) : "https://placehold.co/100x50?text=No+Image";
          return (
            <img 
              src={imgUrl} 
              alt={b.titleText} 
              className="h-10 w-20 object-cover rounded-[2px] border border-border/40" 
            />
          );
        },
      },
      {
        key: "brandText",
        label: "Thương hiệu & Tiêu đề",
        isMain: true,
        render: (b) => (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{b.brandText}</span>
            <span className="font-medium text-xs text-foreground truncate max-w-[240px]">
              {b.titleText}
            </span>
          </div>
        ),
      },
      {
        key: "actionUrl",
        label: "Đường dẫn",
        isSub: true,
        render: (b) => (
          <code className="text-muted-foreground font-mono text-xs truncate block max-w-[200px]" title={b.actionUrl}>
            {b.actionUrl}
          </code>
        ),
      },
      {
        key: "sortOrder",
        label: "Thứ tự",
        align: "center",
        minWidth: "70px",
        render: (b) => (
          <span className="font-mono tabular-nums text-xs text-foreground font-medium">{b.sortOrder}</span>
        )
      },
      {
        key: "isActive",
        label: "Trạng thái",
        align: "center",
        minWidth: "90px",
        render: (b) => (
          <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Switch
              checked={b.isActive}
              onCheckedChange={() => onToggleStatus(b.id)}
              disabled={isToggling || !hasEdit}
              className="data-[state=checked]:bg-foreground"
            />
          </div>
        ),
      },
    ];

    if (hasEdit || hasDelete) {
      cols.push({
        key: "actions",
        label: "Thao tác",
        align: "right",
        minWidth: "80px",
        sticky: "right",
        isAction: true,
        render: (b) => (
          <div className="flex items-center justify-center gap-1">
            <Guard permission="Permissions.Products.Edit">
              <Link to={`/admin/hero-slides/${b.id}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-info hover:text-info hover:bg-info/10 rounded-[2px]"
                  title="Chỉnh sửa"
                >
                  <PencilSquareIcon className="w-3.5 h-3.5 stroke-[1.25]" />
                </Button>
              </Link>
            </Guard>

            <Guard permission="Permissions.Products.Delete">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-error hover:text-error hover:bg-error/10 rounded-[2px]"
                title="Xóa"
                onClick={() => onDelete(b.id, b.titleText)}
                disabled={isDeleting}
              >
                <TrashIcon className="w-3.5 h-3.5 stroke-[1.25]" />
              </Button>
            </Guard>
          </div>
        ),
      });
    }

    return cols;
  }, [hasEdit, hasDelete, onDelete, onToggleStatus, isDeleting, isToggling]);
}
export default useHeroSlideColumns;
