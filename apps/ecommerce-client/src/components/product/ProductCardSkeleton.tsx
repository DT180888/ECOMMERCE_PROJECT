import React from "react";

/**
 * ProductCardSkeleton Component
 * 
 * Khung xương giữ chỗ (Skeleton Loader) cho thẻ sản phẩm Editorial:
 * - Tránh giật layout (CLS) nhờ duy trì đúng tỷ lệ 3/4 trên mobile và 9/16 trên desktop.
 * - Sử dụng hiệu ứng thở off-monochrome (bg-surface/40 animate-pulse), triệt tiêu màu xám thô AI-slop.
 * - Đồng bộ hoàn hảo với lưới 4 cột của ProductGridShowcase.
 */
export default function ProductCardSkeleton() {
  return (
    <div 
      aria-hidden="true"
      className="relative w-full flex flex-col md:aspect-[9/16] animate-pulse bg-surface/30 border border-border/40 overflow-hidden select-none m-0"
    >
      {/* Khung ảnh chính giữ chỗ */}
      <div className="relative w-full aspect-[3/4] md:aspect-auto md:h-full bg-muted/10 overflow-hidden flex items-center justify-center" />

      {/* Thông tin mô tả giả lập ở đáy cho mobile */}
      <div className="p-3 flex flex-col gap-2 md:hidden">
        <div className="h-3.5 w-3/4 bg-muted/20 rounded-[2px]" />
        <div className="h-3 w-1/3 bg-muted/20 rounded-[2px]" />
      </div>
    </div>
  );
}
