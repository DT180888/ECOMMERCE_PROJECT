import React from "react";

export function AdminPageFallback() {
  return (
    <div
      className="flex-1 flex flex-col min-w-0 w-full animate-pulse select-none"
      aria-busy="true"
      aria-label="Đang tải dữ liệu trang..."
    >
      {/* Skeleton Header Strip (h-11 baseline) */}
      <div className="min-h-11 h-11 border-b border-border/60 bg-background px-3.5 md:px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 rounded-[2px] bg-foreground/10" />
          <div className="w-28 h-3.5 rounded-[2px] bg-foreground/10" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-36 h-8 rounded-[2px] bg-foreground/5 hidden sm:block" />
          <div className="w-20 h-8 rounded-[2px] bg-foreground/10" />
        </div>
      </div>

      {/* Skeleton Body Canvas */}
      <div className="flex-1 p-3.5 md:p-4 space-y-3">
        <div className="w-full h-8 rounded-[2px] bg-foreground/5" />
        <div className="w-full h-28 rounded-[2px] bg-foreground/[0.03]" />
        <div className="w-full h-48 rounded-[2px] bg-foreground/[0.03]" />
      </div>
    </div>
  );
}

export default AdminPageFallback;

