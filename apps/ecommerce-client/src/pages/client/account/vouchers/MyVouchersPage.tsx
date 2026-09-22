import { useEffect, useState } from "react";
import { couponClientApi, MyVoucherDto } from "@entities/coupon/api";
import { Ticket, Clock, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@my-project/ui";

export default function MyVouchersPage() {
  const [vouchers, setVouchers] = useState<MyVoucherDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    fetchMyVouchers();
  }, []);

  const fetchMyVouchers = async () => {
    try {
      const res = await couponClientApi.getMyVouchers();
      setVouchers(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-16 bg-muted/10 rounded-card w-64" />
        <div className="h-[400px] bg-muted/10 rounded-card" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="responsive-h2 text-foreground tracking-tight">Kho Voucher</h1>
        <p className="text-muted text-sm mt-1">Quản lý và sử dụng các mã giảm giá bạn đã thu thập được</p>
      </div>

      <section className="bg-background rounded-card p-6 md:p-8 shadow-neo-inset transition-all duration-300">
        {vouchers.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center">
            <div className="p-6 rounded-full bg-background shadow-neo-inset mb-6">
              <Ticket className="w-12 h-12 text-muted" />
            </div>
            <h3 className="text-xl font-bold text-foreground font-display">Kho voucher trống</h3>
            <p className="text-muted text-sm mt-2 mb-8 max-w-sm">Bạn chưa có mã giảm giá nào. Cùng khám phá các ưu đãi đặc quyền và lưu lại để mua sắm tiết kiệm hơn nhé!</p>
            <Button asChild className="px-8 font-bold uppercase tracking-widest text-xs">
              <Link to="/">Tìm ưu đãi ngay</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vouchers.map((v) => (
              <div 
                key={v.couponId} 
                className="bg-background rounded-card shadow-neo p-5 flex flex-col justify-between hover:shadow-neo-hover hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex items-center justify-center bg-accent/10 text-accent px-3 py-1.5 rounded-inner shadow-neo-inset-sm">
                      <span className="text-[10px] font-bold uppercase tracking-widest mr-1">Giảm</span>
                      <span className="text-lg font-display font-black leading-none">
                        {v.type === 0 ? `${v.value}%` : `${(v.value / 1000).toLocaleString()}K`}
                      </span>
                    </div>
                    {copiedId === v.couponId ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-success font-bold uppercase">
                        <Check size={12} /> Đã chép
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted font-bold uppercase">
                        <Ticket size={12} /> Voucher
                      </span>
                    )}
                  </div>
                  
                  <h4 className="font-bold text-sm text-foreground line-clamp-2 leading-relaxed mb-3">
                    {v.promotionName}
                  </h4>
                  
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-background shadow-neo-inset-sm rounded border border-foreground/5 mb-4">
                    <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Mã:</span>
                    <strong className="text-sm font-mono text-foreground tracking-widest">{v.code}</strong>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-muted/10 mt-auto">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted font-bold uppercase tracking-wider">
                    <Clock size={12} />
                    {v.endsAt ? new Date(v.endsAt).toLocaleDateString("vi-VN") : "Không thời hạn"}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-7 text-[10px] px-3 font-bold uppercase tracking-widest border-accent/20 text-accent hover:bg-accent/5"
                    onClick={() => handleCopy(v.code, v.couponId)}
                  >
                    {copiedId === v.couponId ? "Đã chép" : "Sao chép"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
