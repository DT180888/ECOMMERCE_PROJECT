import { useMemo } from "react";
import { Button } from "@my-project/ui";
import { Guard, type AdminTableColumn } from "@shared/ui";
import { PencilSquareIcon, TrashIcon, CheckIcon, MinusIcon } from "@heroicons/react/24/outline";
import type { Attribute } from "@my-project/api";

interface UseAttributeColumnsProps {
  hasEdit: boolean;
  hasDelete: boolean;
  onEdit?: (id: number) => void;
  onDelete: (a: Attribute) => void;
  isDeleting: boolean;
}

export function useAttributeColumns({ hasEdit, hasDelete, onEdit, onDelete, isDeleting }: UseAttributeColumnsProps) {
  return useMemo<AdminTableColumn<Attribute>[]>(() => {
    const cols: AdminTableColumn<Attribute>[] = [
      {
        key: "attributeId",
        label: "ID",
        align: "center",
        minWidth: "60px",
        render: (a) => (
          <span className="font-mono tabular-nums text-xs text-muted-foreground">
            #{a.attributeId}
          </span>
        ),
      },
      {
        key: "name",
        label: "Tên thuộc tính",
        isMain: true,
        render: (a) => (
          <span className="font-medium text-foreground text-xs">
            {a.name}
          </span>
        ),
      },
      {
        key: "slug",
        label: "Đường dẫn",
        render: (a) => (
          <code className="text-muted-foreground font-mono text-xs truncate block max-w-[160px]">
            {a.slug}
          </code>
        ),
      },
      {
        key: "dataType",
        label: "Kiểu dữ liệu",
        render: (a) => (
          <span className="text-foreground text-[10px] uppercase bg-surface px-1.5 py-0.5 rounded-[2px] font-mono tracking-wider">
            {a.dataType}
          </span>
        ),
      },
      {
        key: "unit",
        label: "Đơn vị",
        align: "center",
        render: (a) =>
          a.unit ? (
            <span className="text-muted-foreground text-xs font-mono">{a.unit}</span>
          ) : (
            <span className="text-foreground/20">—</span>
          ),
      },
      {
        key: "isFilterable",
        label: "Lọc",
        align: "center",
        minWidth: "64px",
        render: (a) =>
          a.isFilterable ? (
            <div className="inline-flex items-center justify-center w-5 h-5 rounded-[2px] bg-success/30 text-success mx-auto">
              <CheckIcon className="w-3.5 h-3.5 stroke-[1.25]" />
            </div>
          ) : (
            <MinusIcon className="w-3 h-3 text-muted-foreground/30 mx-auto" />
          ),
      },
      {
        key: "isVariant",
        label: "Biến thể",
        align: "center",
        minWidth: "72px",
        render: (a) =>
          a.isVariant ? (
            <div className="inline-flex items-center justify-center w-5 h-5 rounded-[2px] bg-info/30 text-info mx-auto">
              <CheckIcon className="w-3.5 h-3.5 stroke-[1.25]" />
            </div>
          ) : (
            <MinusIcon className="w-3 h-3 text-muted-foreground/30 mx-auto" />
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
        render: (a) => (
          <div className="flex items-center justify-center gap-1">
            <Guard permission="Permissions.Products.Edit">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onEdit?.(a.attributeId)}
                className="text-info hover:text-info hover:bg-info/20"
                title="Chỉnh sửa thuộc tính"
              >
                <PencilSquareIcon className="w-3.5 h-3.5 stroke-[1.25]" />
              </Button>
            </Guard>

            <Guard permission="Permissions.Products.Delete">
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-error hover:text-error hover:bg-error/20"
                title="Xóa thuộc tính"
                onClick={() => onDelete(a)}
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
  }, [hasEdit, hasDelete, onEdit, onDelete, isDeleting]);
}
export default useAttributeColumns;
