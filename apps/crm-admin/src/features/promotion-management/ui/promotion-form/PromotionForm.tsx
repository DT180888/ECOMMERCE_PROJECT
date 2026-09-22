import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { promotionApi, CreatePromotionReq } from "@entities/promotion/api";
import { AdminPageShell } from "@shared/ui";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@my-project/ui";
import { Link } from "react-router-dom";
import { PromotionSharedForm } from "./PromotionSharedForm";

export function PromotionForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSave = async (data: CreatePromotionReq & { startsAtStr?: string; endsAtStr?: string }) => {
    setLoading(true);
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

      await promotionApi.createPromotion(payload);
      navigate("/admin/promotion");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPageShell
      title="Tạo Khuyến Mãi Mới"
      noCard={true}
      actions={
        <Link to="/admin/promotion">
          <Button variant="outline" className="h-8 px-3 text-xs font-semibold shadow-none">
            <ArrowLeftIcon className="w-3.5 h-3.5 mr-1.5" /> Trở về
          </Button>
        </Link>
      }
    >
      <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
        <PromotionSharedForm onSave={handleSave} loading={loading} submitLabel="Tạo Khuyến Mãi" />
      </div>
    </AdminPageShell>
  );
}


