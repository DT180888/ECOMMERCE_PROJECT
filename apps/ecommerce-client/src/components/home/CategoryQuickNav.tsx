import React from "react";
import { Link } from "react-router-dom";
import { 
  Shirt, 
  Scissors, 
  Footprints, 
  Crown, 
  ShoppingBag, 
  Sparkles, 
  ArrowUpRight,
  LucideIcon 
} from "lucide-react";

/**
 * Interface định nghĩa dữ liệu cho từng thẻ danh mục khám phá nhanh dạng Icon Studio Tile
 */
export interface QuickCategoryItem {
  id: string;
  name: string;
  subtitle: string;
  slug: string;
  itemCount: number;
  icon: LucideIcon;
  targetUrl: string;
}

/**
 * Dữ liệu 6 nhóm mặt hàng thời trang chủ lực dạng Icon Nét Mảnh (Hairline stroke-[1.25])
 */
const QUICK_CATEGORIES: QuickCategoryItem[] = [
  {
    id: "cat-tops",
    name: "Áo & Sơ Mi",
    subtitle: "Tops & Shirts",
    slug: "ao",
    itemCount: 48,
    icon: Shirt,
    targetUrl: "/catalog?category=ao",
  },
  {
    id: "cat-bottoms",
    name: "Quần & Váy",
    subtitle: "Trousers & Skirts",
    slug: "quan",
    itemCount: 36,
    icon: Scissors,
    targetUrl: "/catalog?category=quan",
  },
  {
    id: "cat-footwear",
    name: "Giày & Dép",
    subtitle: "Footwear & Loafers",
    slug: "giay-dep",
    itemCount: 24,
    icon: Footprints,
    targetUrl: "/catalog?category=giay-dep",
  },
  {
    id: "cat-headwear",
    name: "Mũ & Nón",
    subtitle: "Hats & Caps",
    slug: "mu-non",
    itemCount: 18,
    icon: Crown,
    targetUrl: "/catalog?category=mu-non",
  },
  {
    id: "cat-accessories",
    name: "Túi & Phụ Kiện",
    subtitle: "Bags & Leather",
    slug: "phu-kien",
    itemCount: 29,
    icon: ShoppingBag,
    targetUrl: "/catalog?category=phu-kien",
  },
  {
    id: "cat-tailored",
    name: "Đồ May Đo",
    subtitle: "Suits & Tailoring",
    slug: "may-do",
    itemCount: 15,
    icon: Sparkles,
    targetUrl: "/catalog?category=may-do",
  },
];

/**
 * CategoryQuickNav Component (Studio Icon Matrix Edition)
 * 
 * Mục tiêu: Cổng điều hướng danh mục dạng Icon tối giản đặt ngay dưới Hero.
 * Tuân thủ 100% DESIGN.md:
 * - Dùng Icon Hairline `stroke-[1.25]` siêu mảnh của Lucide.
 * - Thẻ Studio Icon Tile tỷ lệ 4:3, phẳng 100%, viền 1px `border-border/60`, góc `rounded-[2px]`.
 * - Zero hardcoded hex colors, 100% semantic tokens (`bg-background`, `bg-surface`, `text-foreground`).
 * - Mobile: Snap scroll ngang với thanh cuộn ẩn.
 * - Desktop: Lưới 6 cột dàn đều thanh lịch.
 */
export default function CategoryQuickNav() {
  return (
    <section 
      aria-label="Cổng khám phá danh mục thời trang nhanh"
      className="w-full py-8 sm:py-10 lg:py-12 bg-background border-b border-border/60"
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16">
        
        {/* =========================================================
            1. SECTION HEADER (Chuẩn Modern Editorial Typography)
           ========================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4 pb-4 border-b border-border/40">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-[11px] font-display font-medium tracking-[0.25em] uppercase text-muted-foreground mb-1">
              Phân Loại Sản Phẩm / Quick Discovery
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-foreground">
              Khám Phá Theo Nhóm Hàng
            </h2>
          </div>

          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-display font-medium uppercase tracking-[0.15em] text-foreground hover:text-muted-foreground transition-colors group self-start sm:self-auto"
          >
            <span>Tất Cả Danh Mục</span>
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>

        {/* =========================================================
            2. STUDIO ICON TILES (Lưới 6 Cột Desktop / Snap Scroll Mobile)
           ========================================================= */}
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 overflow-x-auto pb-4 md:pb-0 scrollbar-none snap-x snap-mandatory">
          {QUICK_CATEGORIES.map((category) => {
            const IconComponent = category.icon;

            return (
              <Link
                key={category.id}
                to={category.targetUrl}
                className="group m-0 p-0 flex-shrink-0 w-[140px] sm:w-[170px] md:w-full snap-start flex flex-col focus:outline-none"
              >
                {/* Thẻ Studio Icon Tile (Tỷ lệ 4:3, viền hairline 1px, rounded-[2px]) */}
                <div className="relative w-full aspect-[4/3] bg-surface rounded-[2px] overflow-hidden border border-border/60 group-hover:border-foreground/40 transition-colors duration-300 flex flex-col items-center justify-center">
                  {/* Icon Hairline stroke-[1.25] siêu mảnh */}
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.25] text-foreground transition-transform duration-300 group-hover:scale-110" />

                  {/* Badge đếm số lượng mẫu (Góc trên bên phải) */}
                  <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm border border-border/60 px-1.5 py-0.5 rounded-[2px] transition-transform duration-300 group-hover:-translate-y-0.5">
                    <span className="text-[9px] font-display font-medium uppercase tracking-wider text-muted-foreground tabular-nums">
                      {category.itemCount} MẪU
                    </span>
                  </div>

                  {/* Floating Action Arrow góc dưới (Hiện lên khi hover) */}
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 shadow-none">
                    <ArrowUpRight className="w-3 h-3 stroke-[1.5]" />
                  </div>
                </div>

                {/* Thông tin danh mục (1 dòng kèm truncate) */}
                <div className="mt-2 flex flex-col select-none">
                  <h3 className="text-xs sm:text-sm font-medium tracking-tight text-foreground truncate group-hover:text-muted-foreground transition-colors duration-200">
                    {category.name}
                  </h3>
                  <span className="text-[10px] font-display uppercase tracking-[0.15em] text-muted-foreground truncate mt-0.5">
                    {category.subtitle}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
