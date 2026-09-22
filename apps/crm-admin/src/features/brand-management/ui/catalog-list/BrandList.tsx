import { useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useBrandList, useDeleteBrand } from "@entities/brand/hooks";
import type { BrandListParams, Brand } from "@entities/brand/types";
import usePermission from "@shared/hooks/usePermission";
import { TagIcon, ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import {
  AdminPageShell,
  AdminTable,
  AdminPagination,
} from "@shared/ui";
import { useBrandColumns } from "./useBrandColumns";
import { BrandToolbar } from "./BrandToolbar";

export function BrandList({ isNested = false }: { isNested?: boolean }) {
  const [sp, setSp] = useSearchParams();
  const [q, setQ] = useState(sp.get("keyword") ?? "");
  const { hasPermission } = usePermission();
  const hasEdit = hasPermission("Permissions.Products.Edit");
  const hasDelete = hasPermission("Permissions.Products.Delete");

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
  const totalPages = Math.max(1, Math.ceil(total / size));

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

  const handleDelete = useCallback((id: number, name: string) => {
    if (confirm(`Xóa thương hiệu "${name}"?`)) {
      delMut.mutate(id);
    }
  }, [delMut]);

  const columns = useBrandColumns({
    hasEdit,
    hasDelete,
    onDelete: handleDelete,
    isDeleting: delMut.isPending
  });

  return (
    <AdminPageShell
      icon={TagIcon}
      title="Thương hiệu"
      badge={`${total} thương hiệu`}
      isNested={isNested}
      actions={
        <BrandToolbar
          q={q}
          setQ={setQ}
          applySearch={applySearch}
        />
      }
    >
      <AdminTable<Brand>
        columns={columns}
        data={items}
        isLoading={isLoading}
        skeletonRows={size}
        emptyIcon={ArchiveBoxXMarkIcon}
        emptyTitle="Không tìm thấy thương hiệu"
        emptyDescription="Thêm thương hiệu đầu tiên để bắt đầu quản lý."
        footer={
          <AdminPagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={size}
            onPageChange={goPage}
          />
        }
      />
    </AdminPageShell>
  );
}
