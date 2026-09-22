// src/shared/ui/Tabs.tsx
import * as React from "react";
import { cn } from "./utils";

type Orientation = "horizontal" | "vertical";

type TabsContextValue = {
  value: string;
  setValue: (v: string) => void;
  orientation: Orientation;
};
const TabsCtx = React.createContext<TabsContextValue | null>(null);

type TabsProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  orientation?: Orientation;
  className?: string;
  children: React.ReactNode;
};

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  className,
  children,
}: TabsProps) {
  const isControlled = value !== undefined;
  const [inner, setInner] = React.useState(defaultValue ?? "");
  const cur = isControlled ? (value as string) : inner;

  const setValue = React.useCallback(
    (v: string) => {
      if (!isControlled) setInner(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange]
  );

  const ctx = React.useMemo(
    () => ({ value: cur, setValue, orientation }),
    [cur, setValue, orientation]
  );

  return (
    <TabsCtx.Provider value={ctx}>
      <div
        className={cn(
          orientation === "vertical" && "flex flex-col md:flex-row gap-4",
          className
        )}
      >
        {children}
      </div>
    </TabsCtx.Provider>
  );
}

export const TabsList = React.memo(function TabsList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(TabsCtx);
  const orientation = ctx?.orientation ?? "horizontal";

  const listRef = React.useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = React.useState(false);
  const [showRightFade, setShowRightFade] = React.useState(false);

  const checkScrollLimits = React.useCallback(() => {
    const el = listRef.current;
    if (!el || orientation !== "horizontal") return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftFade(scrollLeft > 2);
    setShowRightFade(scrollWidth - clientWidth - scrollLeft > 2);
  }, [orientation]);

  // Scroll active tab into view when active tab changes
  React.useEffect(() => {
    if (orientation !== "horizontal" || !listRef.current) return;
    const list = listRef.current;
    const activeEl = list.querySelector<HTMLElement>('[data-state="active"]');
    if (activeEl) {
      const elOffsetLeft = activeEl.offsetLeft;
      const elWidth = activeEl.offsetWidth;
      const listWidth = list.clientWidth;
      
      list.scrollTo({
        left: elOffsetLeft - (listWidth / 2) + (elWidth / 2),
        behavior: "smooth"
      });
    }
  }, [ctx?.value, orientation]);

  // Check scroll limits on mount, resize, and children updates
  React.useEffect(() => {
    if (orientation !== "horizontal" || !listRef.current) return;
    const el = listRef.current;

    checkScrollLimits();

    const observer = new ResizeObserver(() => {
      checkScrollLimits();
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [checkScrollLimits, orientation, children]);

  const content = (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      onScroll={checkScrollLimits}
      className={cn(
        // Base
        "rounded-button bg-muted/10 border-0 h-fit items-center p-0.5 gap-0.5 shadow-none",
        // Horizontal: scroll ngang mượt trên mobile
        orientation === "horizontal" && [
          "flex flex-row",
          "w-full md:w-auto md:inline-flex",
          "overflow-x-auto",
          "flex-nowrap",
          "tabs-list-scrollable",
          "custom-scrollbar",
        ],
        // Vertical: cột dọc trên desktop, cuộn ngang trên mobile
        orientation === "vertical" && [
          "flex flex-row overflow-x-auto tabs-list-scrollable w-full",
          "md:inline-flex md:flex-col md:overflow-x-visible md:w-auto md:min-w-[160px] md:shrink-0 md:self-start",
        ],
        className
      )}
      style={{
        touchAction: "pan-x",
        overscrollBehaviorX: "contain",
      }}
    >
      {children}
    </div>
  );

  if (orientation !== "horizontal") {
    return content;
  }

  return (
    <div className={cn("relative flex items-center overflow-hidden rounded-button", className?.includes("w-full") ? "w-full" : "w-full md:w-auto")}>
      {/* Left Fade Overlay */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10 transition-opacity duration-200",
          showLeftFade ? "opacity-100" : "opacity-0"
        )}
      />
      {content}
      {/* Right Fade Overlay */}
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10 transition-opacity duration-200",
          showRightFade ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
});

export const TabsTrigger = React.memo(function TabsTrigger({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(TabsCtx);
  if (!ctx) throw new Error("TabsTrigger must be used within <Tabs>.");
  const active = ctx.value === value;
  const isVertical = ctx.orientation === "vertical";

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => ctx.setValue(value)}
      data-state={active ? "active" : "inactive"}
      className={cn(
        // Base
        "flex flex-row items-center m-0.5 px-3 py-1.5 text-xs font-semibold rounded-inner",
        "transition-all duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        "whitespace-nowrap shrink-0",
        // Horizontal: center
        !isVertical && "justify-center",
        // Vertical: center on mobile, start + full width on desktop
        isVertical && "justify-center w-auto md:justify-start md:w-full",
        // State
        active
          ? "bg-foreground/20 border border-foreground/40 text-foreground shadow-neo"
          : "bg-transparent text-foreground shadow-none hover:bg-foreground/[0.02] hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
});

export const TabsContent = React.memo(function TabsContent({
  value,
  className,
  children,
  keepMounted = false,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
  keepMounted?: boolean;
}) {
  const ctx = React.useContext(TabsCtx);
  if (!ctx) throw new Error("TabsContent must be used within <Tabs>.");
  const active = ctx.value === value;

  if (!active && !keepMounted) return null;

  return (
    <div
      role="tabpanel"
      data-state={active ? "active" : "inactive"}
      hidden={!active}
      className={cn(
        "focus-visible:outline-none",
        // Vertical: chiếm phần còn lại
        ctx.orientation === "vertical" && "flex-1 min-w-0",
        className
      )}
    >
      {children}
    </div>
  );
});
