import { useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useHeroSlides, useDeleteHeroSlide, useToggleHeroSlideStatus } from "@entities/hero-slide/hooks";
import type { HeroSlideDto } from "@entities/hero-slide/types";
import usePermission from "@shared/hooks/usePermission";
import { PhotoIcon, ArchiveBoxXMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  AdminPageShell,
  AdminTable,
  AdminPagination,
} from "@shared/ui";
import { useHeroSlideColumns } from "./useHeroSlideColumns";
import { Button } from "@my-project/ui";
import { Link } from "react-router-dom";

export function HeroSlideList({ isNested = false }: { isNested?: boolean }) {
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

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
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
    <AdminPageShell
      icon={PhotoIcon}
      title="Quản lý Banner (Hero Slides)"
      badge={`${total} banner`}
      isNested={isNested}
      actions={
        <div className="flex items-center gap-3">
          {hasEdit && (
            <Link to="/admin/hero-slides/new">
              <Button size="sm" className="shadow-neo-sm">
                <PlusIcon className="w-4 h-4 mr-2" />
                Thêm banner mới
              </Button>
            </Link>
          )}
        </div>
      }
    >
      <AdminTable<HeroSlideDto>
        columns={columns}
        data={items}
        isLoading={isLoading}
        skeletonRows={size}
        emptyIcon={ArchiveBoxXMarkIcon}
        emptyTitle="Không có banner nào"
        emptyDescription="Thêm banner đầu tiên để hiển thị lên trang chủ."
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

