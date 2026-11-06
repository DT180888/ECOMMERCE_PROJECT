import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { promotionApi, CreatePromotionReq } from "@my-project/api";
import { AdminPageShell } from "@shared/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent, Button, useToast } from "@my-project/ui";
import { ArrowLeftIcon, Cog6ToothIcon, TicketIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { PromotionSharedForm } from "../promotion-form/PromotionSharedForm";
import { CouponsManager } from "./CouponsManager";

export function PromotionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "config";
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<(CreatePromotionReq & { startsAtStr?: string; endsAtStr?: string }) | undefined>(undefined);
  const [promotionName, setPromotionName] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPromotion();
    }
  }, [id]);

  const fetchPromotion = async () => {
    try {
      const res = await promotionApi.getPromotionById(Number(id));
      setPromotionName(res.name);
      setInitialData({
        name: res.name,
        code: res.code ?? "",
        type: res.type,
        value: res.value,
        isActive: res.isActive,
        maxRedemptions: res.maxRedemptions ?? undefined,
        scope: res.scope ?? 0,
        minOrderAmount: res.minOrderAmount ?? null,
        maxDiscountAmount: res.maxDiscountAmount ?? null,
        categoryIds: res.categoryIds ?? [],
        productIds: res.productIds ?? [],
        startsAtStr: res.startsAt ? new Date(res.startsAt).toISOString().slice(0, 16) : undefined,
        endsAtStr: res.endsAt ? new Date(res.endsAt).toISOString().slice(0, 16) : undefined,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleTabChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", value);
      return next;
    }, { replace: true });
  };

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

      await promotionApi.updatePromotion(Number(id), payload);
      toast.success("Cập nhật khuyến mãi thành công");
      setIsEditing(false);
      fetchPromotion();
    } catch (error: any) {
      toast.error(error?.message || "Lỗi khi cập nhật khuyến mãi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="flex flex-col h-full w-full">
      <AdminPageShell>
        <AdminPageShell.Header
          title={promotionName || "Chi tiết Khuyến mãi"}
          badge={`ID: #${id}`}
          actions={
            <div className="flex items-center gap-2 sm:gap-4 flex-nowrap overflow-hidden w-auto">
              <div className="flex-1 overflow-x-auto custom-scrollbar flex items-center">
                <TabsList className="h-8">
                  <TabsTrigger value="config">
                    <Cog6ToothIcon className="w-3.5 h-3.5 inline-block" /> <span className="hidden sm:inline-block">Cấu hình</span>
                  </TabsTrigger>
                  
                  <TabsTrigger value="coupons">
                    <TicketIcon className="w-3.5 h-3.5 inline-block" /> <span className="hidden sm:inline-block">Mã giảm giá</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                {currentTab === "config" && !isEditing && (
                  <Button 
                    className="h-9 px-3 text-xs font-semibold shadow-none rounded-button hover:bg-primary/90 border-transparent"
                    onClick={() => setIsEditing(true)}
                  >
                    <PencilSquareIcon className="w-4 h-4 mr-1.5" /> Chỉnh sửa
                  </Button>
                )}
                <Link to="/admin/promotion">
                  <Button variant="outline" className="h-9 px-2 sm:px-3 text-xs font-semibold shadow-none rounded-button">
                    <ArrowLeftIcon className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          }
        />
        <AdminPageShell.Body>
          <div className="flex-1 overflow-y-auto xl:overflow-hidden overflow-x-hidden relative w-full custom-scrollbar" >
            <TabsContent value="config" keepMounted className="lg:h-full m-0 p-0 outline-none ring-0 data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:zoom-in-95 duration-200">
              {initialData ? (
                <PromotionSharedForm initialData={initialData} onSave={handleSave} loading={loading} submitLabel="Lưu Thay Đổi" readOnly={!isEditing} />
              ) : (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="coupons" keepMounted className="lg:h-full m-0 p-0 outline-none ring-0 data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:zoom-in-95 duration-200">
              <CouponsManager promotionId={Number(id)} />
            </TabsContent>
          </div>
        </AdminPageShell.Body>
      </AdminPageShell>
    </Tabs>
  );
}



