import React, { lazy, Suspense } from "react";
import { Hero, TrustBadges, CategoryQuickNav } from "@components/home";
import { Skeleton } from "@my-project/ui";

// Tách mã (Code-splitting) cho các khối nội dung lớn bên dưới để tối ưu tốc độ tải trang đầu
const ProductGridShowcase = lazy(() => import("@components/product/ProductGridShowcase"));
const LookbookStylingSlider = lazy(() => import("@components/home/LookbookStylingSlider"));

/**
 * Khung giữ chỗ mượt mà (Skeleton Fallback) khi tải các module con
 */
const SectionFallback = () => (
  <Skeleton 
    aria-hidden="true" 
    className="w-full min-h-[40vh] border-b border-border/60 flex items-center justify-center select-none rounded-none"
  >
    <div className="w-8 h-8 rounded-none border border-muted-foreground/30 border-t-foreground animate-spin" />
  </Skeleton>
);

/**
 * HomePage Component (High-Efficiency Studio Store Architecture)
 * 
 * Thứ tự phân tầng bố cục (Layout Hierarchy):
 * 1. [Hero Campaign Drop] - Trình diễn chiến dịch thời trang 16:9 với Dual CTA khám phá.
 * 2. [Category Quick-Nav] - Cổng điều hướng trực quan 6 danh mục cốt lõi (Áo, Quần, Giày, Mũ, Phụ kiện, May đo).
 * 3. [Product Grid Showcase] - Lưới sản phẩm mới về với Tabs lọc thật và tên rút gọn 1 dòng.
 * 4. [Lookbook Styling Slider] - Đề xuất phối đồ thời trang phong cách tạp chí.
 * 5. [Trust Badges Matrix] - Cam kết giao hàng, đổi trả và an tâm thanh toán đặt ở đáy trước Footer.
 * 
 * Tuân thủ tuyệt đối:
 * - Quy tắc rãnh bất đối xứng Asymmetric Editorial Gutter (Row >= 2x Col).
 * - Quy tắc The Half-Padding Sandwich (chống nhân đôi khoảng cách).
 * - 100% Đơn font Plus Jakarta Sans và không dùng màu thuần #FFF/#000.
 */
export default function HomePage() {
  return (
    <div className="w-full bg-background flex flex-col items-center select-none">

      {/* =========================================================
          TIER 1: HERO CAMPAIGN DROP
          - Khung ảnh cinematic 16:9, video loop và dual CTA khám phá
         ========================================================= */}
      <section id="hero" aria-label="Chiến dịch thời trang chính" className="w-full relative overflow-hidden">
        <Hero />
      </section>

      {/* =========================================================
          TIER 2: VISUAL CATEGORY QUICK-NAV PORTAL
          - Cổng danh mục thời trang nhanh đặt ngay dưới Hero phục vụ Fast Purchase
         ========================================================= */}
      <section id="categories" aria-label="Khám phá nhanh danh mục" className="w-full">
        <CategoryQuickNav />
      </section>

      {/* =========================================================
          SUSPENSE LAZY LOADING CHO CÁC KHỐI SẢN PHẨM & LOOKBOOK
         ========================================================= */}
      <Suspense fallback={<SectionFallback />}>
        
        {/* TIER 3: IMMEDIATE MERCHANDISING GRID (Sản Phẩm Mới Về) */}
        <section id="featured-products" aria-label="Sản phẩm mới về" className="w-full">
          <ProductGridShowcase limit={12} />
        </section>

        {/* TIER 4: LOOKBOOK STYLING CAPSULE (Đề Xuất Phối Đồ) */}
        <section id="lookbook" aria-label="Gợi ý phối đồ" className="w-full">
          <LookbookStylingSlider />
        </section>

        {/* TIER 5: TRUST MATRIX (Cam Kết Dịch Vụ Khách Hàng)
            - Tái định vị về đáy trang ngay phía trên Footer để khép lại hành trình mua sắm */}
        <section id="trust-guarantees" aria-label="Cam kết dịch vụ" className="w-full">
          <TrustBadges />
        </section>

      </Suspense>

    </div>
  );
}
