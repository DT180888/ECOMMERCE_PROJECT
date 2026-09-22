import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { promotionApi, PromotionDto } from "@entities/promotion/api";
import { TagIcon, ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import {
  AdminPageShell,
  AdminTable,
  AdminPagination,
} from "@shared/ui";
import { useToast } from "@my-project/ui";
import { useQuery } from "@tanstack/react-query";
import { usePromotionColumns } from "./usePromotionColumns";
import { PromotionSearchActions } from "./PromotionToolbar";

export function PromotionList() {
  const navigate = useNavigate();
  const [sp, setSp] = useSearchParams();
  const toast = useToast();

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

  const columns = usePromotionColumns({ onDelete: handleDelete });

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



  const toolbarProps = {
    search,
    setSearch,
    apply,
    onAdd: () => navigate("/admin/promotion/new"),
  };

  return (
    <AdminPageShell
      icon={TagIcon}
      title="Danh sách Khuyến mãi"
      badge={`${total} chương trình`}
      noCard
      actions={<PromotionSearchActions {...toolbarProps} />}
    >
      <div className="flex flex-col flex-1 min-h-0 bg-card shadow-none rounded-card overflow-hidden">
        <AdminTable<PromotionDto>
          columns={columns}
          data={items}
          isLoading={isLoading}
          skeletonRows={size}
          onRowClick={(row) => navigate(`/admin/promotion/${row.promotionId}`)}
          emptyIcon={ArchiveBoxXMarkIcon}
          emptyTitle="Không tìm thấy Khuyến mãi phù hợp"
          emptyDescription="Thử chỉnh lại bộ lọc tìm kiếm."
          className="border-0 shadow-none rounded-none bg-transparent flex-1"
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
      </div>
    </AdminPageShell>
  );
}

