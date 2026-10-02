import React, { useState } from "react";
import { X } from "lucide-react";

interface AnnouncementBarProps {
  message?: string;
  linkText?: string;
  linkHref?: string;
}

export default function AnnouncementBar({
  message = "Miễn phí vận chuyển toàn quốc cho đơn từ 1.000.000₫ · Đổi hàng tận nơi 14 ngày",
  linkText,
  linkHref,
}: AnnouncementBarProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside
      aria-label="Thông báo vận hành"
      className="w-full bg-surface border-b border-border/60 text-foreground transition-all duration-300 select-none"
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 2xl:px-16 py-2 flex items-center justify-between gap-4">
        {/* Placeholder spacer to center text on desktop */}
        <div className="w-5 hidden sm:block shrink-0" aria-hidden="true" />

        {/* Content */}
        <div className="flex-1 text-center truncate">
          <span className="text-[10px] sm:text-[11px] font-display font-medium uppercase tracking-[0.2em] text-foreground">
            {message}
          </span>
          {linkText && linkHref && (
            <a
              href={linkHref}
              className="ml-2 text-[10px] sm:text-[11px] font-display font-semibold uppercase tracking-[0.15em] underline underline-offset-2 hover:text-muted-foreground transition-colors"
            >
              {linkText}
            </a>
          )}
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Đóng thông báo"
          className="p-1 text-muted-foreground hover:text-foreground transition-colors shrink-0 focus:outline-none"
        >
          <X className="w-3.5 h-3.5 stroke-[1.25]" />
        </button>
      </div>
    </aside>
  );
}
