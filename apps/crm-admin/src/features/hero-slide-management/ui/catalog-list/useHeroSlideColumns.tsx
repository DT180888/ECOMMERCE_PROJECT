import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button, Switch } from "@my-project/ui";
import { Guard, type AdminTableColumn } from "@shared/ui";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { HeroSlideDto } from "@entities/hero-slide/types";
import { buildImgSrc } from "@shared/lib/url";

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
        minWidth: "64px",
        render: (b) => (
          <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground/60 transition-colors">
            #{b.id}
          </span>
        ),
      },
      {
        key: "thumbnail",
        label: "Ảnh đại diện",
        minWidth: "120px",
        render: (b) => {
          const rawUrl = b.assets?.bannerDesktop?.url;
          const imgUrl = rawUrl ? buildImgSrc(rawUrl) : "https://placehold.co/100x50?text=No+Image";
          return (
            <img 
              src={imgUrl} 
              alt={b.titleText} 
              className="h-12 w-24 object-cover rounded-md shadow-neo-sm border border-border/50" 
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
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{b.brandText}</span>
            <span className="font-medium text-foreground group-hover:text-accent transition-colors">
              {b.titleText}
            </span>
          </div>
        ),
      },
      {
        key: "actionUrl",
        label: "Đường dẫn",
        render: (b) => (
          <code className="text-accent/70 font-mono text-xs truncate block max-w-[200px]" title={b.actionUrl}>
            {b.actionUrl}
          </code>
        ),
      },
      {
        key: "sortOrder",
        label: "Thứ tự",
        align: "center",
        render: (b) => (
          <span className="text-foreground font-semibold">{b.sortOrder}</span>
        )
      },
      {
        key: "isActive",
        label: "Trạng thái",
        align: "center",
        render: (b) => (
          <Switch
            checked={b.isActive}
            onCheckedChange={() => onToggleStatus(b.id)}
            disabled={isToggling || !hasEdit}
          />
        ),
      },
    ];

    if (hasEdit || hasDelete) {
      cols.push({
        key: "actions",
        label: "Thao tác",
        align: "center",
        minWidth: "100px",
        sticky: "right",
        render: (b) => (
          <>
            <Guard permission="Permissions.Products.Edit">
              <Link to={`/admin/hero-slides/${b.id}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-accent hover:bg-accent/10"
                  title="Chỉnh sửa"
                >
                  <PencilSquareIcon className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </Link>
            </Guard>

            <Guard permission="Permissions.Products.Delete">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                title="Xóa"
                onClick={() => onDelete(b.id, b.titleText)}
                disabled={isDeleting}
              >
                <TrashIcon className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </Guard>
          </>
        ),
      });
    }

    return cols;
  }, [hasEdit, hasDelete, onDelete, onToggleStatus, isDeleting, isToggling]);
}
