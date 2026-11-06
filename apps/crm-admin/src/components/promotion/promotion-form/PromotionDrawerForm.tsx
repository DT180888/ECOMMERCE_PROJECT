import { useMemo } from "react";
import { usePromotionDetail, useCreatePromotion, useUpdatePromotion } from "@hooks/usePromotion";
import type { CreatePromotionReq } from "@my-project/api";
import { SplitPaneInspector } from "@components/common/SplitPaneInspector";
import { Button } from "@my-project/ui";
import { PromotionSharedForm } from "./PromotionSharedForm";

interface PromotionDrawerFormProps {
  open: boolean;
  promotionId: number | null;
  onClose: () => void;
}

export function PromotionDrawerForm({ open, promotionId, onClose }: PromotionDrawerFormProps) {
  const isCreate = promotionId === null;
  const { data: detailData, isLoading } = usePromotionDetail(promotionId ?? undefined);

  const createMut = useCreatePromotion();
  const updateMut = useUpdatePromotion();

  const initialData = useMemo(() => {
    if (!detailData || isCreate) return undefined;
    return {
      name: detailData.name,
      code: detailData.code ?? "",
      type: detailData.type,
      value: detailData.value,
      isActive: detailData.isActive,
      scope: detailData.scope,
      minOrderAmount: detailData.minOrderAmount,
      maxDiscountAmount: detailData.maxDiscountAmount,
      maxRedemptions: detailData.maxRedemptions,
      categoryIds: detailData.categoryIds ?? [],
      productIds: detailData.productIds ?? [],
      startsAtStr: detailData.startsAt ? new Date(detailData.startsAt).toISOString().slice(0, 16) : "",
      endsAtStr: detailData.endsAt ? new Date(detailData.endsAt).toISOString().slice(0, 16) : "",
    };
  }, [detailData, isCreate]);

  const handleSave = async (data: CreatePromotionReq & { startsAtStr?: string; endsAtStr?: string }) => {
    try {
      const payload: CreatePromotionReq = {
        name: data.name,
        code: data.code?.trim() || undefined,
        type: data.type,
        value: data.value,
        isActive: data.isActive,
        scope: data.scope,
        minOrderAmount: data.minOrderAmount,
        maxDiscountAmount: data.maxDiscountAmount,
        maxRedemptions: data.maxRedemptions,
        startsAt: data.startsAtStr ? new Date(data.startsAtStr).toISOString() : undefined,
        endsAt: data.endsAtStr ? new Date(data.endsAtStr).toISOString() : undefined,
        categoryIds: data.scope === 1 ? data.categoryIds : [],
        productIds: data.scope === 2 ? data.productIds : [],
      };

      if (isCreate) {
        await createMut.mutateAsync(payload);
      } else {
        await updateMut.mutateAsync({ id: promotionId!, payload });
      }
      onClose();
    } catch (err) {
      console.error("Lỗi lưu khuyến mãi:", err);
    }
  };

  const isSaving = createMut.isPending || updateMut.isPending;

  return (
    <SplitPaneInspector
      open={open}
      onClose={onClose}
      title={isCreate ? "Tạo Khuyến Mãi Mới" : `Chỉnh Sửa Khuyến Mãi #${promotionId}`}
      description={isCreate ? "Cấu hình ưu đãi và phạm vi áp dụng" : "Cập nhật thông số chương trình"}
      widthClass="w-[520px] xl:w-[600px]"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            type="button"
            variant="ghost"
            size="default"
            onClick={onClose}
            disabled={isSaving}
            fullWidthOnSm
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form="promotion-drawer-form"
            variant="default"
            size="default"
            isLoading={isSaving}
            loadingText="Đang lưu..."
            fullWidthOnSm
          >
            {isCreate ? "Tạo Khuyến Mãi" : "Lưu Thay Đổi"}
          </Button>
        </div>
      }
    >
      {!isCreate && isLoading ? (
        <div className="py-12 text-center text-xs text-muted-foreground animate-pulse font-mono">
          Đang tải dữ liệu chương trình khuyến mãi...
        </div>
      ) : (
        <PromotionSharedForm
          formId="promotion-drawer-form"
          isDrawer
          initialData={initialData}
          onSave={handleSave}
          loading={isSaving}
          submitLabel={isCreate ? "Tạo Khuyến Mãi" : "Lưu Thay Đổi"}
        />
      )}
    </SplitPaneInspector>
  );
}
