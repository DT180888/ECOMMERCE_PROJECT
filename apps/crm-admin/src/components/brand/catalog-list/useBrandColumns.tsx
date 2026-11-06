import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@my-project/ui";
import { Guard, type AdminTableColumn } from "@shared/ui";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Brand } from "@my-project/api";

interface UseBrandColumnsProps {
  hasEdit: boolean;
  hasDelete: boolean;
  onEdit?: (id: number) => void;
  onDelete: (id: number, name: string) => void;
  isDeleting: boolean;
}

export function useBrandColumns({
  hasEdit,
  hasDelete,
  onEdit,
  onDelete,
  isDeleting,
}: UseBrandColumnsProps) {
  return useMemo<AdminTableColumn<Brand>[]>(() => {
    const cols: AdminTableColumn<Brand>[] = [
      {
        key: "brandId",
        label: "ID",
        align: "center",
        minWidth: "60px",
        render: (b) => (
          <span className="font-mono tabular-nums text-xs text-muted-foreground">
            #{b.brandId}
          </span>
        ),
      },
      {
        key: "name",
        label: "Tên thương hiệu",
        isMain: true,
        render: (b) => (
          <span className="font-medium text-foreground text-xs">
            {b.name}
          </span>
        ),
      },
      {
        key: "slug",
        label: "Đường dẫn",
        render: (b) => (
          <code className="text-muted-foreground font-mono text-xs truncate block max-w-[200px]">
            {b.slug}
          </code>
        ),
      },
      {
        key: "createdAt",
        label: "Ngày tạo",
        align: "right",
        minWidth: "120px",
        isSub: true,
        render: (b) => (
          <span className="text-muted-foreground text-xs font-mono tabular-nums whitespace-nowrap">
            {new Date(b.createdAt).toLocaleDateString("vi-VN")}
          </span>
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
              {onEdit ? (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-info hover:text-info hover:bg-info/10"
                  title="Chỉnh sửa"
                  onClick={() => onEdit(b.brandId)}
                >
                  <PencilSquareIcon className="w-3.5 h-3.5 stroke-[1.25]" />
                </Button>
              ) : (
                <Link to={`/admin/brand/${b.brandId}`}>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-info hover:text-info hover:bg-info/10"
                    title="Chỉnh sửa"
                  >
                    <PencilSquareIcon className="w-3.5 h-3.5 stroke-[1.25]" />
                  </Button>
                </Link>
              )}
            </Guard>

            <Guard permission="Permissions.Products.Delete">
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-error hover:text-error hover:bg-error/10"
                title="Xóa"
                onClick={() => onDelete(b.brandId, b.name)}
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
export default useBrandColumns;
