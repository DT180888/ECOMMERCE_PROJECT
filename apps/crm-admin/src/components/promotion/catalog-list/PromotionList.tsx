import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { promotionApi, ActivePromotionDto as PromotionDto } from "@my-project/api";
import { TagIcon, ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import {
  AdminPageShell,
  AdminTable,
} from "@shared/ui";
import { useToast } from "@my-project/ui";
import { useQuery } from "@tanstack/react-query";
import { useDrawerSearchParams } from "@hooks/useDrawerSearchParams";
import { usePromotionColumns } from "./usePromotionColumns";
import { PromotionDrawerForm } from "../promotion-form/PromotionDrawerForm";

export function PromotionList() {
  const [sp, setSp] = useSearchParams();
  const toast = useToast();

  const {
    isOpen: isDrawerOpen,
    editingId,
    openCreate,
    openEdit,
    closeDrawer,
  } = useDrawerSearchParams();

  const [search, setSearch] = useState(sp.get("search") ?? "");
  const page = Number(sp.get("page") ?? "1");
  const size = Number(sp.get("size") ?? "10");

  const queryKey = ["admin_promotions", page, size, sp.get("search") ?? ""];

  const { data, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: () => promotionApi.getPromotions(page, size, sp.get("search") ?? ""),
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / size));

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá khuyến mãi này?")) return;
    try {
      await promotionApi.deletePromotion(id);
      toast.success("Đã xoá khuyến mãi thành công");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Lỗi khi xoá khuyến mãi");
    }
  };

  const columns = usePromotionColumns({
    onDelete: handleDelete,
    onEdit: (id) => openEdit(id),
  });

  const apply = () => {
    const next = new URLSearchParams(sp);
    if (search) {
      next.set("search", search);
    } else {
      next.delete("search");
    }
    next.set("page", "1");
    setSp(next);
  };

  const goPage = (p: number) => {
    const next = new URLSearchParams(sp);
    next.set("page", String(p));
    next.set("size", String(size));
    setSp(next);
  };

  const handlePageSizeChange = (newSize: number) => {
    const next = new URLSearchParams(sp);
    next.set("page", "1");
    next.set("size", String(newSize));
    setSp(next);
  };

  return (
    <AdminPageShell>
      <AdminPageShell.Header
        icon={TagIcon}
        title="Danh sách Khuyến mãi"
        badge={`${total} chương trình`}
        createAction={{
          onClick: openCreate,
          label: "Thêm khuyến mãi",
        }}
      />
      <AdminPageShell.Body>
        <AdminTable<PromotionDto>
          columns={columns}
          data={items}
          isLoading={isLoading}
          rowKey="promotionId"
          activeRowKey={editingId}
          enableCardView={true}
          storageKey="crm_promotion_view_mode"
          search={{
            query: search,
            onChange: setSearch,
            onSubmit: apply,
            placeholder: "Tìm kiếm chương trình khuyến mãi...",
          }}
          onRowClick={(row) => openEdit(row.promotionId)}
          pagination={{
            page,
            total,
            pageSize: size,
            onPageChange: goPage,
            onPageSizeChange: handlePageSizeChange,
          }}
          emptyText="Không tìm thấy Khuyến mãi phù hợp"
          emptyIcon={ArchiveBoxXMarkIcon}
          className="border-0 shadow-none rounded-none bg-transparent flex-1"
        />
      </AdminPageShell.Body>
      <AdminPageShell.Inspector>
        <PromotionDrawerForm
          open={isDrawerOpen}
          promotionId={editingId ? Number(editingId) : null}
          onClose={closeDrawer}
        />
      </AdminPageShell.Inspector>
    </AdminPageShell>
  );
}
