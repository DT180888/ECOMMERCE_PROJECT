import { useState, useCallback } from "react";
import { useAttributeList, useDeleteAttribute } from "@hooks/useAttribute";
import type { AttributeListQuery, Attribute, AttributeId } from "@my-project/api";
import usePermission from "@hooks/usePermission";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import { AdminPageShell, AdminTable } from "@shared/ui";
import { useDrawerSearchParams } from "@hooks/useDrawerSearchParams";
import { useAttributeColumns } from "./useAttributeColumns";
import { AttributeDrawerForm } from "../attribute-form/AttributeDrawerForm";

export function AttributeList() {
  const [q, setQ] = useState<AttributeListQuery>({ keyword: "", page: 1, size: 10 });
  const [keywordInput, setKeywordInput] = useState(q.keyword ?? "");
  const { hasPermission } = usePermission();
  const hasEdit = hasPermission("Permissions.Products.Edit");
  const hasDelete = hasPermission("Permissions.Products.Delete");
  const { data, isLoading } = useAttributeList(q);
  const del = useDeleteAttribute();

  const {
    isOpen: isDrawerOpen,
    editingId,
    openCreate,
    openEdit,
    closeDrawer,
  } = useDrawerSearchParams();

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const applyKeyword = useCallback(() => {
    setQ((old: AttributeListQuery) => ({ ...old, keyword: keywordInput, page: 1 }));
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
    onEdit: (id) => openEdit(id),
    onDelete: handleDelete,
    isDeleting: del.isPending,
  });

  return (
    <AdminPageShell>
      <AdminPageShell.Header
        title="Thuộc tính sản phẩm"
        badge={`${total} thuộc tính`}
        createAction={{
          onClick: openCreate,
          label: "Thêm mới",
          canCreate: hasEdit,
        }}
      />
      <AdminPageShell.Body>
        <AdminTable<Attribute>
          columns={columns}
          data={items}
          isLoading={isLoading}
          rowKey="attributeId"
          activeRowKey={editingId}
          search={{
            query: keywordInput,
            onChange: setKeywordInput,
            onSubmit: applyKeyword,
            placeholder: "Tìm kiếm thuộc tính...",
          }}
          pagination={{
            page: q.page ?? 1,
            total,
            pageSize: q.size,
            onPageChange: (p) => setQ((old: AttributeListQuery) => ({ ...old, page: p })),
            onPageSizeChange: (s) => setQ((old: AttributeListQuery) => ({ ...old, size: s, page: 1 })),
          }}
          emptyText="Không tìm thấy thuộc tính nào"
          emptyIcon={ArchiveBoxXMarkIcon}
        />
      </AdminPageShell.Body>
      <AdminPageShell.Inspector>
        <AttributeDrawerForm
          open={isDrawerOpen}
          attributeId={typeof editingId === "number" ? (editingId as AttributeId) : null}
          onClose={closeDrawer}
        />
      </AdminPageShell.Inspector>
    </AdminPageShell>
  );
}
