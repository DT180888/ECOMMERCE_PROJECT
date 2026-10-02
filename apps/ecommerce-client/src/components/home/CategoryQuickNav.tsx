import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

/**
 * Interface định nghĩa dữ liệu cho từng thẻ danh mục khám phá nhanh
 */
export interface QuickCategoryItem {
  id: string;
  name: string;
  subtitle: string;
  slug: string;
  itemCount: number;
  imageUrl: string;
  targetUrl: string;
}

/**
 * Dữ liệu tĩnh tinh tuyển cho 6 nhóm mặt hàng thời trang chủ lực
 * Sử dụng hình ảnh Editorial chất lượng cao, tỉ lệ 3:4 chuẩn Studio
 */
const QUICK_CATEGORIES: QuickCategoryItem[] = [
  {
    id: "cat-tops",
    name: "Áo & Sơ Mi",
    subtitle: "Tops & Shirts",
    slug: "ao",
    itemCount: 48,
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop",
    targetUrl: "/catalog?category=ao",
  },
  {
    id: "cat-bottoms",
    name: "Quần & Váy",
    subtitle: "Trousers & Skirts",
    slug: "quan",
    itemCount: 36,
    imageUrl: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=800&auto=format&fit=crop",
    targetUrl: "/catalog?category=quan",
  },
  {
    id: "cat-footwear",
    name: "Giày & Dép",
    subtitle: "Footwear & Loafers",
    slug: "giay-dep",
    itemCount: 24,
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    targetUrl: "/catalog?category=giay-dep",
  },
  {
    id: "cat-headwear",
    name: "Mũ & Nón",
    subtitle: "Hats & Caps",
    slug: "mu-non",
    itemCount: 18,
    imageUrl: "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=800&auto=format&fit=crop",
    targetUrl: "/catalog?category=mu-non",
  },
  {
    id: "cat-accessories",
    name: "Túi & Phụ Kiện",
    subtitle: "Bags & Leather Goods",
    slug: "phu-kien",
    itemCount: 29,
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
    targetUrl: "/catalog?category=phu-kien",
  },
  {
    id: "cat-tailored",
    name: "Đồ May Đo",
    subtitle: "Suits & Tailoring",
    slug: "may-do",
    itemCount: 15,
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
    targetUrl: "/catalog?category=may-do",
  },
];

/**
 * CategoryQuickNav Component
 * 
 * Mục tiêu: Cổng điều hướng danh mục trực quan (Visual Category Portal) đặt ngay dưới Hero.
 * Phục vụ người dùng mua sắm nhanh (Fast Purchase) — chỉ cần 1 cú click để vào thẳng nhóm đồ cần tìm.
 * 
 * Quy tắc thiết kế:
 * - Chuẩn tỷ lệ ảnh chân dung 3:4, phẳng 100%, góc sắc nét `rounded-none`.
 * - Viền hairline 1px `border-border/60`.
 * - Tên sản phẩm/danh mục 1 dòng kèm dấu 3 chấm nếu quá dài.
 * - Mobile: Snap scroll ngang để tránh chiếm chiều dài màn hình.
 * - Desktop: Lưới 6 cột dàn đều thanh lịch.
 */
export default function CategoryQuickNav() {
  return (
    <section 
      aria-label="Cổng khám phá danh mục thời trang nhanh"
      className="w-full py-8 sm:py-12 lg:py-16 bg-background border-b border-border/60"
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16">
        
        {/* =========================================================
            1. SECTION HEADER (Chuẩn Modern Editorial Typography)
            - Phân cấp bằng Plus Jakarta Sans với kích thước và tracking
            - Có nút xem tất cả danh mục dẫn sang trang Catalog
           ========================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4 pb-4 border-b border-border/40">
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
            2. CATEGORY TILES (Lưới 6 Cột Desktop / Snap Scroll Mobile)
            - Mobile: overflow-x-auto, snap-x snap-mandatory, thanh cuộn ẩn
            - Tablet: grid 3 cột
            - Desktop: grid 6 cột đều nhau
           ========================================================= */}
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-none snap-x snap-mandatory">
          {QUICK_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              to={category.targetUrl}
              className="group m-0 p-0 flex-shrink-0 w-[180px] sm:w-[220px] md:w-full snap-start flex flex-col focus:outline-none"
            >
              {/* Khung ảnh thẻ danh mục (Tỷ lệ 3:4, viền hairline, zero drop shadow) */}
              <div className="relative w-full aspect-[3/4] bg-surface overflow-hidden border border-border/60 group-hover:border-foreground/40 transition-colors duration-300">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Ambient Scrim mỏng ở chân ảnh để tôn rõ nhãn số lượng mẫu */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

                {/* Badge đếm số lượng mẫu (Chỉ hiển thị thanh lịch ở góc trên) */}
                <div className="absolute top-2.5 right-2.5 bg-background/85 backdrop-blur-sm border border-border/60 px-2 py-0.5 rounded-[2px] transition-transform duration-300 group-hover:-translate-y-0.5">
                  <span className="text-[9px] font-display font-medium uppercase tracking-wider text-muted-foreground tabular-nums">
                    {category.itemCount} MẪU
                  </span>
                </div>

                {/* Floating Action Arrow góc dưới (Phóng to nhẹ khi hover) */}
                <div className="absolute bottom-2.5 right-2.5 w-7 h-7 bg-foreground text-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-none">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5]" />
                </div>
              </div>

              {/* Thông tin mô tả danh mục (Đúng 1 dòng kèm truncate chống vỡ nhịp) */}
              <div className="mt-2.5 flex flex-col select-none">
                <h3 className="text-sm font-medium tracking-tight text-foreground truncate group-hover:text-muted-foreground transition-colors duration-200">
                  {category.name}
                </h3>
                <span className="text-[11px] font-display uppercase tracking-[0.1em] text-muted-foreground truncate mt-0.5">
                  {category.subtitle}
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
