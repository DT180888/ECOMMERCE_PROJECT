import * as React from "react";
import { cn } from "../shared/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./DropdownMenu";
import { CaretDown, Check, CaretLeft, CaretRight } from "@phosphor-icons/react";

export type TabsOrientation = "horizontal" | "vertical";
export type TabsListMode = "auto" | "tabs" | "dropdown";
export type TabsVariant = "segmented" | "line" | "subtle";
export type TabsSize = "sm" | "md" | "lg";

type TabsContextValue = {
  value: string;
  setValue: (v: string) => void;
  orientation: TabsOrientation;
  mode?: TabsListMode;
  collapseThreshold?: number;
  collapseWidth?: number;
  variant: TabsVariant;
  size: TabsSize;
};

const TabsCtx = React.createContext<TabsContextValue | null>(null);

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  orientation?: TabsOrientation;
  mode?: TabsListMode;
  collapseThreshold?: number;
  collapseWidth?: number;
  width?: number;
  variant?: TabsVariant;
  size?: TabsSize;
  className?: string;
  children: React.ReactNode;
}

/**
 * Tabs Primitive
 * Fluent Blue Design System Specification
 * Supports 3 high-craft variants:
 * 1. "segmented" (default): Elevated dock container (p-1 bg-surface rounded-lg) with card-like active pill.
 * 2. "line": Flat underline tab strip with primary blue indicator (border-b-2 border-primary).
 * 3. "subtle": Standalone soft tint chips (bg-primary/10 text-primary).
 */
export function Tabs({
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  mode = "auto",
  collapseThreshold = 0.67,
  collapseWidth,
  width,
  variant = "segmented",
  size = "md",
  className,
  children,
}: TabsProps) {
  const isControlled = value !== undefined;
  const [inner, setInner] = React.useState(defaultValue ?? "");
  const cur = isControlled ? (value as string) : inner;
  const resolvedCollapseWidth = collapseWidth ?? width ?? 300;

  const setValue = React.useCallback(
    (v: string) => {
      if (!isControlled) setInner(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange]
  );

  const ctx = React.useMemo<TabsContextValue>(
    () => ({
      value: cur,
      setValue,
      orientation,
      mode,
      collapseThreshold,
      collapseWidth: resolvedCollapseWidth,
      variant,
      size,
    }),
    [cur, setValue, orientation, mode, collapseThreshold, resolvedCollapseWidth, variant, size]
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

export interface TabsListProps {
  className?: string;
  children: React.ReactNode;
  mode?: TabsListMode;
  collapseThreshold?: number;
  collapseWidth?: number;
  width?: number;
  variant?: TabsVariant;
  size?: TabsSize;
}

export const TabsList = React.memo(function TabsList({
  className,
  children,
  mode: propMode,
  collapseThreshold: propThreshold,
  collapseWidth: propCollapseWidth,
  width: propWidth,
  variant: propVariant,
  size: propSize,
}: TabsListProps) {
  const ctx = React.useContext(TabsCtx);
  const orientation = ctx?.orientation ?? "horizontal";
  const mode = propMode ?? ctx?.mode ?? "auto";
  const collapseThreshold = propThreshold ?? ctx?.collapseThreshold ?? 0.67;
  const collapseWidth = propCollapseWidth ?? propWidth ?? ctx?.collapseWidth ?? 200;
  const variant = propVariant ?? ctx?.variant ?? "segmented";
  const size = propSize ?? ctx?.size ?? "md";

  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);

  const [showLeftFade, setShowLeftFade] = React.useState(false);
  const [showRightFade, setShowRightFade] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(mode === "dropdown");

  // Extract option metadata from TabsTrigger children for dropdown mode
  const options = React.useMemo(() => {
    const list: Array<{
      value: string;
      label: React.ReactNode;
      icon?: React.ReactNode;
      badge?: number | string;
      disabled?: boolean;
      className?: string;
    }> = [];

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;
      const props = child.props as TabsTriggerProps;
      if (props.value !== undefined) {
        list.push({
          value: props.value,
          label: props.children,
          icon: props.icon,
          badge: props.badge,
          disabled: props.disabled,
          className: props.className,
        });
      }
    });

    return list;
  }, [children]);

  const isCollapsedRef = React.useRef(isCollapsed);
  isCollapsedRef.current = isCollapsed;

  // Responsive container observer: detects when available container width < collapseThreshold of content
  React.useEffect(() => {
    if (mode === "dropdown") {
      setIsCollapsed(true);
      return;
    }
    if (mode === "tabs" || orientation !== "horizontal") {
      setIsCollapsed(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const checkCollapse = () => {
      const c = containerRef.current;
      const m = measureRef.current;
      if (!c || !m) return;

      const parentEl = c.parentElement;
      let availableWidth = c.clientWidth;

      if (parentEl) {
        const parentWidth = parentEl.clientWidth;
        if (isCollapsedRef.current) {
          let siblingsWidth = 0;
          for (let i = 0; i < parentEl.children.length; i++) {
            const child = parentEl.children[i] as HTMLElement;
            if (child !== c && child.nodeType === 1) {
              siblingsWidth += child.offsetWidth || 0;
            }
          }
          availableWidth = Math.max(c.clientWidth, parentWidth - siblingsWidth);
        } else {
          availableWidth = Math.min(c.clientWidth, parentWidth);
        }
      }

      const contentWidth = m.scrollWidth;

      if (contentWidth > 0 && availableWidth > 0) {
        const ratio = availableWidth / contentWidth;
        setIsCollapsed(ratio < collapseThreshold || availableWidth <= collapseWidth);
      }
    };

    checkCollapse();

    const observer = new ResizeObserver(() => {
      checkCollapse();
    });

    observer.observe(container);
    if (container.parentElement) {
      observer.observe(container.parentElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [mode, collapseThreshold, orientation, children]);

  const checkScrollLimits = React.useCallback(() => {
    const el = listRef.current;
    if (!el || orientation !== "horizontal") return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftFade(scrollLeft > 2);
    setShowRightFade(scrollWidth - clientWidth - scrollLeft > 2);
  }, [orientation]);

  const scrollByDirection = React.useCallback((direction: "left" | "right") => {
    const el = listRef.current;
    if (!el) return;
    const scrollAmount = Math.max(160, Math.floor(el.clientWidth * 0.6));
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }, []);

  // Scroll active tab into view when active tab changes
  React.useEffect(() => {
    if (orientation !== "horizontal" || isCollapsed || !listRef.current) return;
    const list = listRef.current;
    const activeEl = list.querySelector<HTMLElement>('[data-state="active"]');
    if (activeEl) {
      const elOffsetLeft = activeEl.offsetLeft;
      const elWidth = activeEl.offsetWidth;
      const listWidth = list.clientWidth;

      list.scrollTo({
        left: elOffsetLeft - listWidth / 2 + elWidth / 2,
        behavior: "smooth",
      });
    }
  }, [ctx?.value, orientation, isCollapsed]);

  // Check scroll limits on mount, resize, and children updates
  React.useEffect(() => {
    if (orientation !== "horizontal" || isCollapsed || !listRef.current) return;
    const el = listRef.current;

    checkScrollLimits();

    const observer = new ResizeObserver(() => {
      checkScrollLimits();
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [checkScrollLimits, orientation, isCollapsed, children]);

  // Active option for Dropdown mode
  const activeOption = options.find((o) => o.value === ctx?.value) || options[0];

  const dropdownView = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          data-state="active"
          className={cn(
            "h-[34px] sm:h-7 min-w-[120px] px-3 inline-flex items-center justify-between gap-2 rounded-[2px] transition-colors cursor-pointer select-none font-sans",
            "bg-card text-foreground border border-border shadow-sm hover:bg-surface-hover",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
            "text-[13px] font-medium",
            activeOption?.className,
            className
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            {activeOption?.icon && <span className="inline-flex shrink-0">{activeOption.icon}</span>}
            <span className="truncate font-medium">{activeOption?.label}</span>
            {activeOption?.badge !== undefined && (
              <span className="font-mono text-[10px] tabular-nums px-1.5 h-4 min-w-[16px] rounded-sm bg-primary/10 text-primary border border-primary/20 font-semibold inline-flex items-center justify-center">
                {activeOption.badge}
              </span>
            )}
          </span>
          <CaretDown className="w-3.5 h-3.5 transition-transform duration-200 shrink-0 text-muted-foreground" weight="bold" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[180px] flex flex-col gap-0.5 p-1">
        {options.map((option) => {
          const isActive = option.value === ctx?.value;
          return (
            <DropdownMenuItem
              key={option.value}
              disabled={option.disabled}
              onClick={() => ctx?.setValue(option.value)}
              data-state={isActive ? "active" : "inactive"}
              className={cn(
                "justify-between cursor-pointer text-[13px] rounded-sm px-2.5 py-1.5 font-sans",
                isActive && "font-semibold text-primary bg-primary/10",
                option.className
              )}
            >
              <span className="flex items-center gap-2 truncate">
                {option.icon && <span className="inline-flex shrink-0">{option.icon}</span>}
                <span className="truncate">{option.label}</span>
                {option.badge !== undefined && (
                  <span className="font-mono text-[10px] tabular-nums px-1.5 h-4 min-w-[16px] rounded-sm bg-primary/10 text-primary border border-primary/20 font-semibold inline-flex items-center justify-center">
                    {option.badge}
                  </span>
                )}
              </span>
              {isActive && <Check className="w-3.5 h-3.5 text-primary stroke-[2] shrink-0 ml-2" weight="bold" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Variant-specific container styling
  const variantContainerClass = React.useMemo(() => {
    switch (variant) {
      case "segmented":
        return cn(
          " border border-border rounded-sm p-1 gap-1 shadow-sm",
          size === "sm" && "h-7 p-0.5",
          size === "md" && "h-[36px] p-1",
          size === "lg" && "h-[44px] p-1.5"
        );
      case "line":
        return cn(
          "bg-transparent gap-2 sm:gap-4 rounded-none shadow-none pb-0",
          size === "sm" && "h-7",
          size === "md" && "h-[36px]",
          size === "lg" && "h-[42px]"
        );
      case "subtle":
        return cn(
          "bg-transparent border-0 gap-1.5 rounded-none shadow-none",
          size === "sm" && "h-7",
          size === "md" && "h-[34px]",
          size === "lg" && "h-[40px]"
        );
    }
  }, [variant, size]);

  const tabsListView = (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      onScroll={checkScrollLimits}
      className={cn(
        "items-center font-sans select-none",
        variantContainerClass,
        orientation === "horizontal" && [
          "flex flex-row",
          "w-full min-w-0 max-w-full",
          "overflow-x-auto",
          "flex-nowrap",
          "tabs-list-scrollable",
          "scrollbar-none",
        ],
        orientation === "vertical" && [
          "flex flex-col w-full md:w-48 gap-1 p-1 bg-surface/50 border border-border rounded-sm",
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

  if (orientation !== "vertical" && mode === "dropdown") {
    return dropdownView;
  }

  if (orientation !== "horizontal") {
    return tabsListView;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex items-center w-full"
        // className?.includes("w-full") ? "w-full" : "w-auto max-w-full"
      )}
    >
      {/* Offscreen measurement target to track content width without affecting layout */}
      {mode === "auto" && (
        <div
          ref={measureRef}
          aria-hidden="true"
          className="invisible absolute pointer-events-none -z-50 flex flex-row flex-nowrap gap-1 p-1"
          style={{ position: "absolute", visibility: "hidden", left: -9999, top: -9999 }}
        >
          {children}
        </div>
      )}

      {isCollapsed ? (
        dropdownView
      ) : (
        <>
          {/* Left Fade Overlay & Micro Nav Button */}
          <div
            className={cn(
              "absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none z-10 transition-opacity duration-200",
              showLeftFade ? "opacity-100" : "opacity-0"
            )}
          />
          {showLeftFade && (
            <button
              type="button"
              aria-label="Cuộn sang trái"
              onClick={() => scrollByDirection("left")}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-20",
                "h-6 w-6 inline-flex items-center justify-center rounded-sm",
                "bg-card/95 hover:bg-surface-hover text-foreground",
                "border border-border shadow-sm transition-all duration-150 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              )}
            >
              <CaretLeft className="w-3.5 h-3.5" weight="bold" />
            </button>
          )}

          {tabsListView}

          {/* Right Fade Overlay & Micro Nav Button */}
          <div
            className={cn(
              "absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none z-10 transition-opacity duration-200",
              showRightFade ? "opacity-100" : "opacity-0"
            )}
          />
          {showRightFade && (
            <button
              type="button"
              aria-label="Cuộn sang phải"
              onClick={() => scrollByDirection("right")}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-20",
                "h-6 w-6 inline-flex items-center justify-center rounded-sm",
                "bg-card/95 hover:bg-surface-hover text-foreground",
                "border border-border shadow-sm transition-all duration-150 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              )}
            >
              <CaretRight className="w-3.5 h-3.5" weight="bold" />
            </button>
          )}
        </>
      )}
    </div>
  );
});

export interface TabsTriggerProps {
  value: string;
  icon?: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children: React.ReactNode;
}

export const TabsTrigger = React.memo(function TabsTrigger({
  value,
  icon,
  badge,
  disabled,
  onClick,
  className,
  children,
}: TabsTriggerProps) {
  const ctx = React.useContext(TabsCtx);
  if (!ctx) throw new Error("TabsTrigger must be used within <Tabs>.");
  const active = ctx.value === value;
  const isVertical = ctx.orientation === "vertical";
  const variant = ctx.variant ?? "segmented";
  const size = ctx.size ?? "md";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    ctx.setValue(value);
    onClick?.(e);
  };

  // Size specific styling
  const sizeClass = React.useMemo(() => {
    switch (size) {
      case "sm":
        return "h-[34px] sm:h-7 px-2.5 text-xs";
      case "md":
        return variant === "line" ? "h-[28px] px-3 text-[13px]" : "h-7 sm:h-[28px] px-3 text-[13px]";
      case "lg":
        return variant === "line" ? "h-[40px] px-4 text-sm" : "h-[34px] px-4 text-sm";
    }
  }, [size, variant]);

  // Variant specific state styling
  const variantStateClass = React.useMemo(() => {
    switch (variant) {
      case "segmented":
        return cn(
          "rounded-sm border font-medium",
          active
            ? "bg-card text-primary font-semibold border-border  "
            : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-surface/70"
        );
      case "line":
        return cn(
          "rounded-none w-fit min-w-24 !border-b-2 font-medium pb-2 ",
          active
            ? "!border-primary text-primary font-semibold"
            : "text-muted-foreground hover:text-foreground"
        );
      case "subtle":
        return cn(
          "rounded-sm border font-medium",
          active
            ? "bg-primary/10 text-primary border-primary/20 font-semibold shadow-none"
            : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-surface-hover border-transparent"
        );
    }
  }, [variant, active]);

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      disabled={disabled}
      onClick={handleClick}
      data-state={active ? "active" : "inactive"}
      className={cn(
        "transition-all duration-150 select-none font-sans",
        "inline-flex items-center gap-1.5",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
        "disabled:pointer-events-none disabled:opacity-40",
        "whitespace-nowrap shrink-0 cursor-pointer",
        sizeClass,
        variantStateClass,
        !isVertical && "justify-center",
        isVertical && "justify-center w-auto md:justify-start md:w-full",
        className
      )}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span className="inline-flex items-center gap-1.5">{children}</span>
      {badge !== undefined && badge !== null && (
        <span
          className={cn(
            "inline-flex items-center justify-center font-mono text-[10px] tabular-nums px-1.5 min-w-[18px] h-4 rounded-sm transition-colors",
            active
              ? variant === "line" || variant === "subtle"
                ? "bg-primary/15 text-primary font-semibold"
                : "bg-foreground/10 text-foreground font-semibold"
              : "bg-surface text-muted-foreground"
          )}
        >
          {badge}
        </span>
      )}
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
        ctx.orientation === "vertical" && "flex-1 min-w-0",
        className
      )}
    >
      {children}
    </div>
  );
});

// Alias exports for explicit semantic usage
export const AdaptiveTabs = Tabs;
export const AdaptiveTabsList = TabsList;
