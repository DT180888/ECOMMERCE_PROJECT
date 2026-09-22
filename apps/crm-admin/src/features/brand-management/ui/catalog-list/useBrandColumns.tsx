import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@my-project/ui";
import { Guard, type AdminTableColumn } from "@shared/ui";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Brand } from "@entities/brand/types";

interface UseBrandColumnsProps {
  hasEdit: boolean;
  hasDelete: boolean;
  onDelete: (id: number, name: string) => void;
  isDeleting: boolean;
}

export function useBrandColumns({
  hasEdit,
  hasDelete,
  onDelete,
  isDeleting,
}: UseBrandColumnsProps) {
  return useMemo<AdminTableColumn<Brand>[]>(() => {
    const cols: AdminTableColumn<Brand>[] = [
      {
        key: "brandId",
        label: "ID",
        align: "center",
        minWidth: "64px",
        render: (b) => (
          <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground/60 transition-colors">
            #{b.brandId}
          </span>
        ),
      },
      {
        key: "name",
        label: "Tên thương hiệu",
        isMain: true,
        render: (b) => (
          <span className="font-medium text-foreground group-hover:text-accent transition-colors">
            {b.name}
          </span>
        ),
      },
      {
        key: "slug",
        label: "Slug (Đường dẫn)",
        render: (b) => (
          <code className="text-accent/70 font-mono text-xs truncate block max-w-[200px]">
            {b.slug}
          </code>
        ),
      },
      {
        key: "createdAt",
        label: "Ngày tạo",
        align: "right",
        render: (b) => (
          <span className="text-muted-foreground text-xs font-mono">
            {new Date(b.createdAt).toLocaleDateString("vi-VN")}
          </span>
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
              <Link to={`/admin/brand/${b.brandId}`}>
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
                onClick={() => onDelete(b.brandId, b.name)}
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
  }, [hasEdit, hasDelete, onDelete, isDeleting]);
}
