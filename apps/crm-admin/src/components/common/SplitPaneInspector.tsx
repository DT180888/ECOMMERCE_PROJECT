import React, { useEffect, useState, useCallback, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@my-project/ui";

export interface SplitPaneInspectorProps {
  /** Controls panel visibility */
  open: boolean;
  /** Callback to close panel and clear search params */
  onClose: () => void;
  /** Panel title */
  title: string;
  /** Optional subtitle/description */
  description?: string;
  /** Main scrollable form content */
  children: React.ReactNode;
  /** Bottom docked action buttons */
  footer?: React.ReactNode;
  /** Optional width class for backward compatibility */
  widthClass?: string;
  /** Whether the desktop drawer can be manually resized */
  resizable?: boolean;
  /** Default width in pixels (desktop) */
  defaultWidth?: number;
  /** Minimum width in pixels */
  minWidth?: number;
  /** Maximum width in pixels */
  maxWidth?: number;
  /** Key used to store custom width in localStorage */
  storageKey?: string;
}

/**
 * SplitPaneInspector
 * Studio-Grade 3-Tier Adaptive Inspector Panel:
 * 1. Large Desktop (>=1024px / lg): Inline Column 3 with native mouse drag resizing, side-by-side data comparison.
 * 2. Tablet / Small Laptop (640px - 1023px / sm -> lg): Floating Slide-Over Drawer with dim backdrop (keeps table 100% wide).
 * 3. Mobile (<640px / <sm): iOS-style Bottom Sheet with touch drag down to dismiss.
 */
export function SplitPaneInspector({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  widthClass,
  resizable = true,
  defaultWidth,
  minWidth = 360,
  maxWidth = 800,
  storageKey = "crm_drawer_width",
}: SplitPaneInspectorProps) {
  const effectiveDefaultWidth = defaultWidth ?? (() => {
    const match = widthClass?.match(/w-\[(\d+)px\]/);
    return match ? parseInt(match[1], 10) : 440;
  })();

  const [shouldRender, setShouldRender] = useState(open);
  const [isVisible, setIsVisible] = useState(false);

  // Stored width initialization
  const [drawerWidth, setDrawerWidth] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed) && parsed >= minWidth && parsed <= maxWidth) {
            return parsed;
          }
        }
      } catch {
        // fallback
      }
    }
    return effectiveDefaultWidth;
  });

  const [isDragging, setIsDragging] = useState(false);
  const currentWidthRef = useRef(drawerWidth);
  currentWidthRef.current = drawerWidth;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (open) {
      setShouldRender(true);
      const f1 = requestAnimationFrame(() => {
        const f2 = requestAnimationFrame(() => {
          setIsVisible(true);
        });
        return () => cancelAnimationFrame(f2);
      });
      return () => cancelAnimationFrame(f1);
    } else {
      setIsVisible(false);
      timer = setTimeout(() => {
        setShouldRender(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // ESC key listener to quickly close inspector
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Prevent background scroll on non-desktop screens (< 1024px) when floating drawer is active
  useEffect(() => {
    if (!open) return;
    const isCompact = typeof window !== "undefined" && window.innerWidth < 1024;
    if (isCompact) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  // ── Snap Points Constants for Mobile Bottom Sheet (Tier 1: 45vh, Tier 2: 70vh, Tier 3: 92vh) ──
  const SNAP_PEEK = 0.45;
  const SNAP_STANDARD = 0.70;
  const SNAP_FULL = 0.92;
  const SNAP_DISMISS = 0.28;

  const [mobileHeight, setMobileHeight] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return Math.round(window.innerHeight * SNAP_STANDARD);
    }
    return 560;
  });
  const [isMobileDragging, setIsMobileDragging] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const touchStartHeight = useRef<number>(mobileHeight);
  const touchStartTime = useRef<number>(0);

  // Reset mobile height to STANDARD (70%) on open
  useEffect(() => {
    if (open && typeof window !== "undefined") {
      setMobileHeight(Math.round(window.innerHeight * SNAP_STANDARD));
    }
  }, [open]);

  // Touch gesture down-swipe to dismiss / up-swipe to snap on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartHeight.current = mobileHeight;
    touchStartTime.current = Date.now();
    setIsMobileDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY.current - currentY; // kéo lên làm tăng chiều cao
    const newHeight = touchStartHeight.current + deltaY;
    const windowH = window.innerHeight;
    const minH = windowH * 0.20;
    const maxH = windowH * SNAP_FULL;

    if (newHeight > maxH) {
      setMobileHeight(maxH + (newHeight - maxH) * 0.2);
    } else if (newHeight < minH) {
      setMobileHeight(minH);
    } else {
      setMobileHeight(newHeight);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    setIsMobileDragging(false);

    const endY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - endY;
    const duration = Date.now() - touchStartTime.current;
    const velocity = deltaY / Math.max(duration, 1);
    const windowH = window.innerHeight;
    const currentRatio = mobileHeight / windowH;

    touchStartY.current = null;

    // Vuốt nhanh xuống -> đóng
    if (velocity < -0.5 || currentRatio < SNAP_DISMISS) {
      onClose();
      return;
    }

    // Vuốt nhanh lên -> mở full 92vh
    if (velocity > 0.5) {
      setMobileHeight(Math.round(windowH * SNAP_FULL));
      return;
    }

    // Tự động snap vào nấc gần nhất: 45vh, 70vh hoặc 92vh
    const tiers = [
      { ratio: SNAP_PEEK, height: Math.round(windowH * SNAP_PEEK) },
      { ratio: SNAP_STANDARD, height: Math.round(windowH * SNAP_STANDARD) },
      { ratio: SNAP_FULL, height: Math.round(windowH * SNAP_FULL) },
    ];

    let nearest = tiers[0];
    let minDiff = Math.abs(currentRatio - tiers[0].ratio);

    for (let i = 1; i < tiers.length; i++) {
      const diff = Math.abs(currentRatio - tiers[i].ratio);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = tiers[i];
      }
    }

    setMobileHeight(nearest.height);
  };

  // Mouse drag handler on mobile grabber for DevTools testing
  const handleMobileMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startH = mobileHeight;
    setIsMobileDragging(true);

    const onMouseMove = (moveEv: MouseEvent) => {
      const deltaY = startY - moveEv.clientY;
      const windowH = window.innerHeight;
      const newH = Math.min(windowH * SNAP_FULL, Math.max(windowH * 0.2, startH + deltaY));
      setMobileHeight(newH);
    };

    const onMouseUp = (upEv: MouseEvent) => {
      setIsMobileDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      const deltaY = startY - upEv.clientY;
      const windowH = window.innerHeight;
      const finalH = startH + deltaY;
      const ratio = finalH / windowH;

      if (ratio < SNAP_DISMISS) {
        onClose();
        return;
      }

      const tiers = [
        Math.round(windowH * SNAP_PEEK),
        Math.round(windowH * SNAP_STANDARD),
        Math.round(windowH * SNAP_FULL),
      ];

      let nearest = tiers[0];
      let minDiff = Math.abs(finalH - tiers[0]);
      for (const t of tiers) {
        const diff = Math.abs(finalH - t);
        if (diff < minDiff) {
          minDiff = diff;
          nearest = t;
        }
      }
      setMobileHeight(nearest);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleGrabberDoubleClick = () => {
    if (typeof window === "undefined") return;
    const windowH = window.innerHeight;
    const standardH = Math.round(windowH * SNAP_STANDARD);
    const fullH = Math.round(windowH * SNAP_FULL);

    if (Math.abs(mobileHeight - fullH) < 30) {
      setMobileHeight(standardH);
    } else {
      setMobileHeight(fullH);
    }
  };

  // Mouse drag resize handler (Smooth Delta Resizing with zero jitter on desktop >=1024px)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = currentWidthRef.current;
      setIsDragging(true);

      const onMouseMove = (moveEvent: MouseEvent) => {
        const delta = startX - moveEvent.clientX;
        const newWidth = startWidth + delta;
        const maxAllowed = Math.min(maxWidth, Math.floor(window.innerWidth * 0.65));
        if (newWidth >= minWidth && newWidth <= maxAllowed) {
          setDrawerWidth(newWidth);
          currentWidthRef.current = newWidth;
        }
      };

      const onMouseUp = () => {
        setIsDragging(false);
        try {
          localStorage.setItem(storageKey, String(currentWidthRef.current));
        } catch {
          // ignore
        }
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [minWidth, maxWidth, storageKey]
  );

  const handleDoubleClick = useCallback(() => {
    setDrawerWidth(effectiveDefaultWidth);
    try {
      localStorage.setItem(storageKey, String(effectiveDefaultWidth));
    } catch {
      // ignore
    }
  }, [effectiveDefaultWidth, storageKey]);

  if (!shouldRender) return null;

  // Shared inner panel structure across all 3 viewports
  const panelContent = (
    <div className="flex flex-col bg-surface h-full min-h-0 select-text overflow-hidden font-sans">
      {/* ── Panel Header: Tier 1 (h-12 shrink-0 px-4 flex items-center justify-between border-b border-border) ── */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="h-12 px-4 border-b border-border flex items-center justify-between shrink-0 bg-surface z-10"
      >
        <div className="flex flex-col min-w-0 pr-2 select-none">
          <h3 className="font-sans font-semibold text-sm text-foreground tracking-tight truncate">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">{description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-hover shrink-0 transition-colors cursor-pointer"
          title="Đóng bảng chi tiết (Esc)"
          aria-label="Đóng"
        >
          <XMarkIcon className="w-4 h-4 stroke-[1.75]" />
        </button>
      </div>

      {/* ── Panel Body: Tier 2 (Scrollable Form Fields) ── */}
      <div className="flex-1 overflow-y-auto min-h-0 p-3 sm:p-4 flex flex-col gap-4 custom-scrollbar">
        {children}
      </div>

      {/* ── Panel Footer: Tier 3 (Docked Actions with Safe Area Inset for iOS) ── */}
      {footer && (
        <div className="min-h-[52px] py-2.5 px-4 border-t border-border bg-surface flex items-center justify-end gap-2.5 shrink-0 pb-[max(12px,env(safe-area-inset-bottom))] sm:pb-2.5">
          {footer}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* ──────────────────────────────────────────────────────────────────────────
          1. LARGE DESKTOP (>=1024px / lg):
          Inline Column 3 Workbench with Resizable Hairline & Side-by-side comparison
         ────────────────────────────────────────────────────────────────────────── */}
      <aside
        aria-label={title}
        style={{
          width: isVisible ? `${drawerWidth}px` : "0px",
        }}
        className={cn(
          "hidden lg:flex shrink-0 min-h-0 h-full overflow-hidden relative z-20 shadow-elevation-1",
          isDragging ? "transition-none select-none" : "transition-[width] duration-200 ease-out"
        )}
      >
        {/* Resizer Handle (Left Border with Smooth Hairline & Central Grip Indicator) */}
        {isVisible && resizable && (
          <div
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            role="separator"
            aria-orientation="vertical"
            aria-label="Kéo để thay đổi kích thước"
            title="Kéo để thay đổi kích thước, nhấp đúp để đặt lại mặc định"
            className="w-4 shrink-0 h-full cursor-col-resize z-30 group flex items-center justify-center select-none bg-transparent relative"
          >
            {/* Continuous Hairline */}
            <div className="w-[1px] h-full bg-border group-hover:bg-primary group-active:bg-primary transition-colors" />

            {/* Micro Central Grip Indicator */}
            <div className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center py-2 px-0.5 rounded-full bg-card border border-border shadow-xs pointer-events-none group-hover:border-primary/50 transition-colors">
              <div className="w-0.5 h-3 rounded-full bg-muted-foreground/60 group-hover:bg-primary transition-colors" />
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0 h-full flex flex-col">
          {panelContent}
        </div>
      </aside>

      {/* ──────────────────────────────────────────────────────────────────────────
          2. TABLET / SMALL LAPTOP (640px - 1023px / sm -> lg):
          Floating Slide-Over Drawer with Dim Backdrop (Preserves 100% table width)
         ────────────────────────────────────────────────────────────────────────── */}
      {/* Tablet Backdrop */}
      {isVisible && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-xs z-40 hidden sm:block lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Tablet Slide-Over Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "hidden sm:flex lg:hidden fixed inset-y-0 right-0 z-50 w-[440px] max-w-[85vw] bg-surface border-l border-border shadow-elevation-4 flex-col overflow-hidden transition-transform duration-250 ease-out will-change-transform font-sans",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
      >
        {panelContent}
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          3. MOBILE (<640px / <sm):
          iOS-Style Bottom Sheet with Touch Down-Swipe to Dismiss
         ────────────────────────────────────────────────────────────────────────── */}
      {/* Mobile Backdrop */}
      {isVisible && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-xs z-50 sm:hidden animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Bottom Sheet (3-Tier Snap Points: 45vh / 70vh / 92vh) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          height: isVisible ? `${mobileHeight}px` : "0px",
          transform: isVisible ? "translateY(0)" : "translateY(100%)",
        }}
        className={cn(
          "sm:hidden fixed inset-x-0 bottom-0 z-50 w-full max-h-[96dvh] bg-surface border-t border-border rounded-t-2xl shadow-elevation-4 flex flex-col overflow-hidden will-change-[height,transform] font-sans",
          isMobileDragging
            ? "transition-none select-none"
            : "transition-[height,transform] duration-250 ease-out"
        )}
      >
        {/* Mobile Grabber Handle */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMobileMouseDown}
          onDoubleClick={handleGrabberDoubleClick}
          className="w-full flex flex-col items-center justify-center pt-2.5 pb-2 shrink-0 select-none cursor-grab active:cursor-grabbing bg-surface group"
          title="Kéo lên/xuống để thay đổi kích thước (45vh / 70vh / 92vh), nhấp đúp để phóng to/thu nhỏ"
        >
          <div className="w-10 h-1.5 rounded-full bg-border group-hover:bg-primary/50 group-active:bg-primary transition-colors" />
        </div>

        {panelContent}
      </div>
    </>
  );
}

export default SplitPaneInspector;
