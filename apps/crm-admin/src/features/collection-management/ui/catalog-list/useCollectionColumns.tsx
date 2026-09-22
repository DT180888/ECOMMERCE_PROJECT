import { useMemo } from "react";
import type { AdminTableColumn } from "@shared/ui";
import type { CollectionDto } from "@entities/collection/types";
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
  isDeletePending
}: UseCollectionColumnsProps) {
  return useMemo<AdminTableColumn<CollectionDto>[]>(() => {
    return [
      {
        key: "name",
        label: "Tên Bộ Sưu Tập",
        isMain: true,
        minWidth: "250px",
        render: (item) => (
          <div className="flex items-center gap-3">
            {item.coverImageUrl ? (
              <img src={item.coverImageUrl} alt={item.name} className="w-10 h-10 object-cover rounded-inner bg-secondary/10 border border-border/10" />
            ) : (
              <div className="w-10 h-10 rounded-inner bg-secondary/10 border border-border/10 flex items-center justify-center">
                <ViewColumnsIcon className="w-5 h-5 text-muted-foreground opacity-50" />
              </div>
            )}
            <span className="font-medium text-foreground">{item.name}</span>
          </div>
        ),
      },
      {
        key: "slug",
        label: "Slug",
        minWidth: "150px",
        render: (item) => (
          <span className="text-muted-foreground">{item.slug}</span>
        ),
      },
      {
        key: "isActive",
        label: "Trạng Thái",
        align: "center",
        minWidth: "120px",
        render: (item) => (
          <Switch
            checked={item.isActive}
            onCheckedChange={() => onToggleStatus(item.id)}
            disabled={isTogglePending}
            className="data-[state=checked]:bg-accent bg-secondary/20"
          />
        ),
      },
      {
        key: "actions",
        label: "Thao Tác",
        align: "right",
        minWidth: "150px",
        render: (item) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-accent hover:bg-accent/10 text-xs font-semibold px-2"
              onClick={() => onAssignProducts(item)}
            >
              Gán SP
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-accent hover:bg-accent/10"
              onClick={() => onEdit(item)}
            >
              <PencilSquareIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
              onClick={() => onDelete(item.id, item.name)}
              disabled={isDeletePending}
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ];
  }, [onEdit, onDelete, onAssignProducts, onToggleStatus, isTogglePending, isDeletePending]);
}
