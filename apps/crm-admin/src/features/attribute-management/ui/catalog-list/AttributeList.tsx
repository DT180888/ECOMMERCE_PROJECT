import { useMemo, useState, useCallback } from "react";
import { useAttributeList, useDeleteAttribute } from "@entities/attribute/hooks";
import type { AttributeListQuery, Attribute } from "@entities/attribute/types";
import usePermission from "@shared/hooks/usePermission";
import { SwatchIcon, ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import { AdminPageShell, AdminTable, AdminPagination } from "@shared/ui";
import { useAttributeColumns } from "./useAttributeColumns";
import { AttributeToolbar } from "./AttributeToolbar";

export function AttributeList({ isNested = false }: { isNested?: boolean }) {
  const [q, setQ] = useState<AttributeListQuery>({ keyword: "", page: 1, size: 10 });
  const [keywordInput, setKeywordInput] = useState(q.keyword ?? "");
  const { hasPermission } = usePermission();
  const hasEdit = hasPermission("Permissions.Products.Edit");
  const hasDelete = hasPermission("Permissions.Products.Delete");
  const { data, isLoading } = useAttributeList(q);
  const del = useDeleteAttribute();

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = useMemo(
    () => Math.max(1, Math.ceil(total / (q.size || 10))),
    [total, q.size]
  );

  const applyKeyword = useCallback(() => {
    setQ((old) => ({ ...old, keyword: keywordInput, page: 1 }));
  }, [keywordInput]);

  const handleDelete = useCallback(
    (a: Attribute) => {
      if (confirm(`Xoá thuộc tính "${a.name}"?`)) {
        del.mutateAsync(a.attributeId);
      }
    },
    [del]
  );

  const columns = useAttributeColumns({
    hasEdit,
    hasDelete,
    onDelete: handleDelete,
    isDeleting: del.isPending,
  });

  return (
    <AdminPageShell
      icon={SwatchIcon}
      title="Thuộc tính sản phẩm"
      badge={`${total} thuộc tính`}
      isNested={isNested}
      actions={
        <AttributeToolbar
          keyword={keywordInput}
          setKeyword={setKeywordInput}
          applyKeyword={applyKeyword}
        />
      }
    >
      <AdminTable<Attribute>
        columns={columns}
        data={items}
        isLoading={isLoading}
        skeletonRows={q.size}
        emptyIcon={ArchiveBoxXMarkIcon}
        emptyTitle="Không tìm thấy thuộc tính nào"
        emptyDescription="Tạo thuộc tính để phân loại sản phẩm theo màu sắc, kích thước..."
        footer={
          <AdminPagination
            page={q.page ?? 1}
            totalPages={pages}
            total={total}
            pageSize={q.size}
            onPageChange={(p) => setQ((old) => ({ ...old, page: p }))}
          />
        }
      />
    </AdminPageShell>
  );
}
