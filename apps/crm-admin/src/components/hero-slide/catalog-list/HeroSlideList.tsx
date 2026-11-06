import { useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useHeroSlides, useDeleteHeroSlide, useToggleHeroSlideStatus } from "@hooks/useHeroSlide";
import type { HeroSlideDto } from "@my-project/api";
import usePermission from "@hooks/usePermission";
import { PhotoIcon, ArchiveBoxXMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  AdminPageShell,
  AdminTable,
} from "@shared/ui";
import { useHeroSlideColumns } from "./useHeroSlideColumns";
import { Button } from "@my-project/ui";
import { Link } from "react-router-dom";

export function HeroSlideList() {
  const [sp, setSp] = useSearchParams();
  const { hasPermission } = usePermission();
  const hasEdit = hasPermission("Permissions.Products.Edit");
  const hasDelete = hasPermission("Permissions.Products.Delete");

  const page = Number(sp.get("page") ?? "1");
  const size = Number(sp.get("size") ?? "10");

  const params = useMemo(
    () => ({ page, size }),
    [page, size]
  );

  const { data, isLoading } = useHeroSlides(params);
  const delMut = useDeleteHeroSlide();
  const toggleMut = useToggleHeroSlideStatus();

  const items = Array.isArray(data) ? data : data?.items ?? [];
  const total = Array.isArray(data) ? data.length : data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / size));

  const goPage = useCallback((p: number) => {
    const next = new URLSearchParams(sp);
    next.set("page", String(p));
    next.set("size", String(size));
    setSp(next);
  }, [sp, size, setSp]);

  const handleDelete = useCallback((id: number, name: string) => {
    if (confirm(`Xóa banner "${name}"?`)) {
      delMut.mutate(id);
    }
  }, [delMut]);

  const handleToggleStatus = useCallback((id: number) => {
    toggleMut.mutate(id);
  }, [toggleMut]);

  const columns = useHeroSlideColumns({
    hasEdit,
    hasDelete,
    onDelete: handleDelete,
    onToggleStatus: handleToggleStatus,
    isDeleting: delMut.isPending,
    isToggling: toggleMut.isPending,
  });

  return (
    <AdminPageShell>
      <AdminPageShell.Header
        icon={PhotoIcon}
        title="Quản lý Banner (Hero Slides)"
        badge={`${total} banner`}
        actions={
          <div className="flex items-center gap-3">
            {hasEdit && (
              <Link to="/admin/hero-slides/new">
                <Button size="default" className="shadow-neo-sm">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Thêm banner mới
                </Button>
              </Link>
            )}
          </div>
        }
      />
      <AdminPageShell.Body>
        <AdminTable<HeroSlideDto>
          columns={columns}
          data={items}
          isLoading={isLoading}
          rowKey="id"
          enableCardView={true}
          storageKey="crm_heroslide_view_mode"
          pagination={{
            page,
            total,
            pageSize: size,
            onPageChange: goPage,
          }}
          emptyText="Không có banner nào"
          emptyIcon={ArchiveBoxXMarkIcon}
        />
      </AdminPageShell.Body>
    </AdminPageShell>
  );
}



