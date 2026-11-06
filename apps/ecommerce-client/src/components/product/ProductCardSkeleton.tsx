import React from "react";
import { Skeleton } from "@my-project/ui";

/**
 * ProductCardSkeleton Component
 * 
 * Khung xương giữ chỗ (Skeleton Loader) cho thẻ sản phẩm Editorial:
 * - Tránh giật layout (CLS) nhờ duy trì đúng tỷ lệ 3/4 trên mobile và 9/16 trên desktop.
 * - Sử dụng token bề mặt studio mờ ấm (Skeleton bg-surface/60), triệt tiêu màu xám thô AI-slop.
 * - Đồng bộ hoàn hảo với lưới của ProductGridShowcase và ProductGrid.
 */
export default function ProductCardSkeleton() {
  return (
    <div 
      aria-hidden="true"
      className="relative w-full flex flex-col md:aspect-[9/16] border border-border/40 overflow-hidden select-none m-0"
    >
      {/* Khung ảnh chính giữ chỗ */}
      <Skeleton className="relative w-full aspect-[3/4] md:aspect-auto md:h-full overflow-hidden rounded-none" />

      {/* Thông tin mô tả giả lập ở đáy cho mobile */}
      <div className="p-3 flex flex-col gap-2 md:hidden">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
