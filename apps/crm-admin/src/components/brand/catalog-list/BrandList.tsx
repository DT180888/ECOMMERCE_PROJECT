import { useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useBrandList, useDeleteBrand } from "@hooks/useBrand";
import type { BrandListParams, Brand, BrandId } from "@my-project/api";
import usePermission from "@hooks/usePermission";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import { AdminPageShell, AdminTable } from "@shared/ui";
import { useDrawerSearchParams } from "@hooks/useDrawerSearchParams";
import { useBrandColumns } from "./useBrandColumns";
import { BrandDrawerForm } from "../brand-form/BrandDrawerForm";

export function BrandList() {
  const [sp, setSp] = useSearchParams();
  const [q, setQ] = useState(sp.get("keyword") ?? "");
  const { hasPermission } = usePermission();
  const hasEdit = hasPermission("Permissions.Products.Edit");
  const hasDelete = hasPermission("Permissions.Products.Delete");

  const {
    isOpen: isDrawerOpen,
    editingId,
    openCreate,
    openEdit,
    closeDrawer,
  } = useDrawerSearchParams();

  const page = Number(sp.get("page") ?? "1");
  const size = Number(sp.get("size") ?? "10");

  const params: BrandListParams = useMemo(
    () => ({ keyword: sp.get("keyword") ?? undefined, page, size }),
    [sp, page, size]
  );

  const { data, isLoading } = useBrandList(params);
  const delMut = useDeleteBrand();

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const applySearch = useCallback(() => {
    const next = new URLSearchParams(sp);
    if (q) next.set("keyword", q);
    else next.delete("keyword");
    next.set("page", "1");
    setSp(next);
  }, [q, sp, setSp]);

  const goPage = useCallback((p: number) => {
    const next = new URLSearchParams(sp);
    next.set("page", String(p));
    next.set("size", String(size));
    setSp(next);
  }, [sp, size, setSp]);

  const handlePageSizeChange = useCallback((newSize: number) => {
    const next = new URLSearchParams(sp);
    next.set("page", "1");
    next.set("size", String(newSize));
    setSp(next);
  }, [sp, setSp]);

  const handleDelete = useCallback((id: number, name: string) => {
    if (confirm(`Xóa thương hiệu "${name}"?`)) {
      delMut.mutate(id);
    }
  }, [delMut]);

  const columns = useBrandColumns({
    hasEdit,
    hasDelete,
    onEdit: openEdit,
    onDelete: handleDelete,
    isDeleting: delMut.isPending,
  });

  return (
    <AdminPageShell>
      <AdminPageShell.Header
        title="Quản lý Thương hiệu"
        badge={`${total} thương hiệu`}
        createAction={{
          onClick: openCreate,
          label: "Thêm mới",
          canCreate: hasEdit,
        }}
      />
      <AdminPageShell.Body>
        <AdminTable<Brand>
          columns={columns}
          data={items}
          isLoading={isLoading}
          rowKey="brandId"
          activeRowKey={editingId}
          search={{
            query: q,
            onChange: setQ,
            onSubmit: applySearch,
            placeholder: "Tìm kiếm thương hiệu...",
          }}
          pagination={{
            page,
            total,
            pageSize: size,
            onPageChange: goPage,
            onPageSizeChange: handlePageSizeChange,
          }}
          emptyText="Không tìm thấy thương hiệu"
          emptyIcon={ArchiveBoxXMarkIcon}
        />
      </AdminPageShell.Body>
      <AdminPageShell.Inspector>
        <BrandDrawerForm
          open={isDrawerOpen}
          brandId={typeof editingId === "number" ? (editingId as BrandId) : null}
          onClose={closeDrawer}
        />
      </AdminPageShell.Inspector>
    </AdminPageShell>
  );
}
