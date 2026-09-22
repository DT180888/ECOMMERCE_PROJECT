import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@my-project/ui";
import { Guard, type AdminTableColumn } from "@shared/ui";
import { PencilSquareIcon, TrashIcon, CheckIcon, MinusIcon } from "@heroicons/react/24/outline";
import type { Attribute } from "@entities/attribute/types";

interface UseAttributeColumnsProps {
  hasEdit: boolean;
  hasDelete: boolean;
  onDelete: (a: Attribute) => void;
  isDeleting: boolean;
}

export function useAttributeColumns({ hasEdit, hasDelete, onDelete, isDeleting }: UseAttributeColumnsProps) {
  return useMemo<AdminTableColumn<Attribute>[]>(() => {
    const cols: AdminTableColumn<Attribute>[] = [
      {
        key: "attributeId",
        label: "ID",
        align: "center",
        minWidth: "64px",
        render: (a) => (
          <span className="font-mono text-xs text-muted-foreground">
            #{a.attributeId}
          </span>
        ),
      },
      {
        key: "name",
        label: "Tên thuộc tính",
        isMain: true,
        render: (a) => (
          <span className="font-medium text-foreground group-hover:text-accent transition-colors">
            {a.name}
          </span>
        ),
      },
      {
        key: "slug",
        label: "Mã Slug",
        render: (a) => (
          <code className="text-accent/70 font-mono text-xs truncate block max-w-[160px]">
            {a.slug}
          </code>
        ),
      },
      {
        key: "dataType",
        label: "Kiểu dữ liệu",
        render: (a) => (
          <span className="text-muted-foreground text-[10px] uppercase bg-foreground/8 px-2 py-1 rounded border border-foreground/5 font-bold tracking-wider">
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
            <span className="text-muted-foreground text-xs">{a.unit}</span>
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
            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto">
              <CheckIcon className="w-3.5 h-3.5" />
            </div>
          ) : (
            <MinusIcon className="w-3 h-3 md:w-4 md:h-4 text-foreground/20 mx-auto" />
          ),
      },
      {
        key: "isVariant",
        label: "Biến thể",
        align: "center",
        minWidth: "72px",
        render: (a) =>
          a.isVariant ? (
            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/10 text-purple-400 mx-auto">
              <CheckIcon className="w-3.5 h-3.5" />
            </div>
          ) : (
            <MinusIcon className="w-3 h-3 md:w-4 md:h-4 text-foreground/20 mx-auto" />
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
        render: (a) => (
          <>
            <Guard permission="Permissions.Products.Edit">
              <Link to={`/admin/attribute/${a.attributeId}`}>
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
                onClick={() => onDelete(a)}
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
