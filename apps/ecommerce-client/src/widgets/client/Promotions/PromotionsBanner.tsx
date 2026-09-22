import { useEffect, useState } from "react";
import { promotionClientApi, ActivePromotionDto } from "@entities/promotion/api";
import { couponClientApi } from "@entities/coupon/api";
import { Ticket, Clock, Check } from "lucide-react";
import { useAuthUser } from "@entities/auth/hooks";
import { Button } from "@my-project/ui";

export default function PromotionsBanner() {
  const [promotions, setPromotions] = useState<ActivePromotionDto[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const { data: user } = useAuthUser();

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const res = await promotionClientApi.getActivePromotions();
      setPromotions(res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveVoucher = async (id: number) => {
    if (!user) {
      alert("Vui lòng đăng nhập để lưu mã!");
      return;
    }
    setLoadingIds((prev) => [...prev, id]);
    try {
      await couponClientApi.assignCouponToUser(id);
      setSavedIds((prev) => [...prev, id]);
    } catch (error: any) {
      if (error.response?.status === 400 && error.response.data?.Message?.includes("already collected")) {
        setSavedIds((prev) => [...prev, id]);
      } else {
        alert(error?.message || "Có lỗi xảy ra khi lưu mã");
      }
    } finally {
      setLoadingIds((prev) => prev.filter((item) => item !== id));
    }
  };

  if (promotions.length === 0) return null;

  return (
    <div className="w-full bg-background">
      <div className="client-page-container">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Ticket className="w-6 h-6 text-accent" />
            <h2 className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight">
              Ưu đãi đặc quyền
            </h2>
          </div>
          <span className="text-[10px] text-muted font-bold uppercase tracking-widest hidden md:inline-block">
            Số lượng có hạn
          </span>
        </div>
        
        <div className="flex overflow-x-auto gap-4 snap-x custom-scrollbar">
          {promotions.map((promo) => {
            const isSaved = savedIds.includes(promo.promotionId);
            const isLoading = loadingIds.includes(promo.promotionId);
            
            return (
              <div 
                key={promo.promotionId} 
                className="flex-shrink-0 w-80 bg-background rounded-card shadow-neo p-5 flex flex-col justify-between snap-center hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex items-center justify-center bg-accent/10 text-accent px-3 py-1.5 rounded-inner shadow-neo-inset-sm">
                      <span className="text-[10px] font-bold uppercase tracking-widest mr-1">Giảm</span>
                      <span className="text-lg font-display font-black leading-none">
                        {promo.type === 0 ? `${promo.value}%` : `${(promo.value / 1000).toLocaleString()}K`}
                      </span>
                    </div>
                    {isSaved ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-success font-bold uppercase tracking-wider">
                        <Check size={12} /> Đã lưu
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted font-bold uppercase tracking-wider">
                        Voucher
                      </span>
                    )}
                  </div>
                  
                  <h4 className="font-bold text-sm text-foreground line-clamp-2 leading-relaxed mb-3">
                    {promo.name}
                  </h4>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-muted/10 mt-auto">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted font-bold uppercase tracking-wider">
                    <Clock size={12} />
                    {promo.endsAt ? new Date(promo.endsAt).toLocaleDateString("vi-VN") : "Không thời hạn"}
                  </div>
                  <Button 
                    variant={isSaved ? "outline" : "default"}
                    size="sm"
                    className={`h-8 text-[10px] px-4 font-bold uppercase tracking-widest ${
                      isSaved 
                        ? "border-success/20 text-success hover:bg-success/5 cursor-default pointer-events-none" 
                        : "bg-accent hover:bg-accent/90 text-accent-foreground"
                    }`}
                    onClick={() => !isSaved && handleSaveVoucher(promo.promotionId)}
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : isSaved ? "Đã lưu" : "Lưu mã"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
