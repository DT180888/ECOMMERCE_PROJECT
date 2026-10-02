import React from "react";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

/**
 * Interface cho từng mục cam kết dịch vụ khách hàng
 */
interface TrustBadgeItem {
  icon: typeof Truck;
  title: string;
  description: string;
}

/**
 * 4 trụ cột cam kết tin cậy cốt lõi của thương hiệu thời trang Minimalism
 */
const trustItems: TrustBadgeItem[] = [
  {
    icon: Truck,
    title: "Giao Hàng Toàn Quốc",
    description: "Miễn phí cho đơn từ 1.000.000₫",
  },
  {
    icon: RotateCcw,
    title: "Đổi Trả 14 Ngày",
    description: "Hỗ trợ đổi tận nơi nhanh chóng",
  },
  {
    icon: ShieldCheck,
    title: "Thanh Toán Bảo Mật",
    description: "VietQR, Thẻ Quốc Tế & COD",
  },
  {
    icon: Headphones,
    title: "Tư Vấn Phong Cách",
    description: "Chăm sóc khách hàng 24/7",
  },
];

/**
 * TrustBadges Component (Khối Cam Kết Tin Cậy & Bảo Trợ Dịch Vụ)
 * 
 * Vị trí kiến trúc: Đặt ở chân trang (ngay trước Footer) để khép lại hành trình duyệt sản phẩm
 * bằng sự an tâm về vận chuyển, đổi trả và thanh toán.
 * 
 * Quy tắc thiết kế:
 * - Đường kẻ tóc hairline 1px `border-border/60`.
 * - Tách ô bằng `lg:divide-x divide-border/60`.
 * - Nền `bg-surface/30` nhẹ nhàng, phẳng 100%.
 */
export default function TrustBadges() {
  return (
    <section 
      aria-label="Cam kết chất lượng và dịch vụ"
      className="w-full border-b border-border/60 bg-surface/30 py-8 sm:py-10"
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 sm:gap-x-6 lg:gap-0 lg:divide-x divide-border/60">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="flex items-center justify-start lg:justify-center gap-3 px-1 sm:px-4 lg:px-6 group cursor-default select-none"
              >
                {/* Khung icon hairline vi mô */}
                <div className="w-8 h-8 rounded-[2px] border border-border/60 bg-background/50 flex items-center justify-center shrink-0 group-hover:border-foreground/40 group-hover:bg-background transition-all duration-300">
                  <Icon className="w-4 h-4 text-foreground/80 stroke-[1.25] shrink-0 group-hover:text-foreground transition-colors duration-200" />
                </div>

                {/* Tiêu đề & mô tả cam kết */}
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-display font-medium tracking-wide text-foreground uppercase truncate">
                    {item.title}
                  </span>
                  <span className="text-[11px] font-display text-muted-foreground truncate mt-0.5">
                    {item.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
