import { useMemo } from "react";
import type { AdminTableColumn } from "@shared/ui";
import type { CollectionDto } from "@my-project/api";
import { Button, Switch } from "@my-project/ui";
import { PencilSquareIcon, TrashIcon, ViewColumnsIcon } from "@heroicons/react/24/outline";

interface UseCollectionColumnsProps {
  onEdit: (collection: CollectionDto) => void;
  onDelete: (id: number, name: string) => void;
  onAssignProducts: (collection: CollectionDto) => void;
  onToggleStatus: (id: number) => void;
  isTogglePending: boolean;
  isDeletePending: boolean;
}

export function useCollectionColumns({
  onEdit,
  onDelete,
  onAssignProducts,
  onToggleStatus,
  isTogglePending,
  isDeletePending,
}: UseCollectionColumnsProps) {
  return useMemo<AdminTableColumn<CollectionDto>[]>(() => {
    return [
      {
        key: "coverImageUrl",
        label: "Ảnh bìa",
        isMedia: true,
        mediaAspect: "wide",
        minWidth: "60px",
        render: (item) => (
          <div className="w-10 h-7 rounded-[2px] bg-surface border border-border/40 flex items-center justify-center overflow-hidden shrink-0">
            {item.coverImageUrl ? (
              <img
                src={item.coverImageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <ViewColumnsIcon className="w-3.5 h-3.5 text-muted-foreground stroke-[1.25]" />
            )}
          </div>
        ),
      },
      {
        key: "name",
        label: "Bộ sưu tập",
        isMain: true,
        minWidth: "200px",
        render: (item) => (
          <span className="font-medium text-xs text-foreground truncate">{item.name}</span>
        ),
      },
      {
        key: "slug",
        label: "Đường dẫn",
        minWidth: "140px",
        isSub: true,
        render: (item) => (
          <code className="text-muted-foreground font-mono text-xs truncate block">
            {item.slug}
          </code>
        ),
      },
      {
        key: "isActive",
        label: "Trạng thái",
        align: "center",
        minWidth: "100px",
        render: (item) => (
          <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Switch
              checked={item.isActive}
              onCheckedChange={() => onToggleStatus(item.id)}
              disabled={isTogglePending}
              className="data-[state=checked]:bg-foreground"
            />
          </div>
        ),
      },
      {
        key: "actions",
        label: "Thao tác",
        align: "right",
        isAction: true,
        minWidth: "140px",
        sticky: "right",
        render: (item) => (
          <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="default"
              className="h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-surface-hover text-xs font-normal rounded-[2px]"
              onClick={() => onAssignProducts(item)}
            >
              Gán SP
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-info hover:text-info hover:bg-info/10 rounded-[2px]"
              title="Chỉnh sửa"
              onClick={() => onEdit(item)}
            >
              <PencilSquareIcon className="w-3.5 h-3.5 stroke-[1.25]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-error hover:text-error hover:bg-error/10 rounded-[2px]"
              title="Xóa"
              onClick={() => onDelete(item.id, item.name)}
              disabled={isDeletePending}
            >
              <TrashIcon className="w-3.5 h-3.5 stroke-[1.25]" />
            </Button>
          </div>
        ),
      },
    ];
  }, [onEdit, onDelete, onAssignProducts, onToggleStatus, isTogglePending, isDeletePending]);
}
export default useCollectionColumns;
