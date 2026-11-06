import React, { ReactNode } from "react";
import { cn, Checkbox, Button, Input, Tabs, TabsList, TabsTrigger } from "@my-project/ui";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { AdminEmptyState } from "../AdminEmptyState";
import { AdminPagination } from "../AdminPagination";

import type {
  AdminDataViewProps,
  AdminDataViewTabsConfig,
  AdminTableColumn,
  AdminCardHelpers,
} from "./types";
import { SortIcon } from "./SortIcon";
import { SkeletonRow } from "./SkeletonRow";
import { SkeletonCard } from "./SkeletonCard";
import { ViewSwitcher } from "./ViewSwitcher";
import { AdminHorizontalCard } from "./AdminHorizontalCard";

export function AdminDataView<T>({
  columns,
  data,
  isLoading = false,
  rowKey,
  pagination,
  selection,
  sort,
  onSortChange,
  activeRowKey,
  isRowActive,
  emptyText,
  emptyIcon,
  onRowClick,
  className,
  tableClassName,

  // Card view configuration
  enableCardView = false,
  storageKey,
  defaultViewMode,
  viewMode: controlledViewMode,
  onViewModeChange,
  gridClassName,
  hideViewSwitcher = false,
  renderCard,

  // Table-Integrated Workstation Toolbar props
  toolbar,
  search,
  tabs,
  filterBar,
  expandedFilter,
  actions,

  // Optional legacy props
  skeletonRows,
  emptyTitle,
  emptyDescription,
  footer,
  bulkActions,
}: AdminDataViewProps<T>) {
  // Normalize viewMode ("card" or "grid" treated identically)
  const normalizeMode = (m?: string): "table" | "card" =>
    m === "card" || m === "grid" ? "card" : "table";

  const [internalViewMode, setInternalViewMode] = React.useState<"table" | "card">(() => {
    if (controlledViewMode) return normalizeMode(controlledViewMode);
    if (typeof window !== "undefined" && storageKey) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) return normalizeMode(saved);
      } catch {
        // ignore storage error
      }
    }
    if (defaultViewMode) return normalizeMode(defaultViewMode);
    return "table";
  });

  // Track mobile screen (< md / 768px) to enforce horizontal cards on mobile across all pages
  const [isMobileScreen, setIsMobileScreen] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activeViewMode = controlledViewMode ? normalizeMode(controlledViewMode) : internalViewMode;

  const handleViewModeChange = (mode: "table" | "grid") => {
    const targetMode = normalizeMode(mode);
    setInternalViewMode(targetMode);
    if (storageKey && typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, targetMode);
      } catch {
        // ignore
      }
    }
    onViewModeChange?.(targetMode);
  };

  // Auto-calculated pagination parameters
  const pageSize = pagination?.pageSize ?? skeletonRows ?? 10;
  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.total / pageSize))
    : 0;

  const displayEmptyTitle = emptyText ?? emptyTitle ?? "Không có dữ liệu";

  // Auto rowKey resolver
  const resolveRowKey = (item: T, index: number): string | number => {
    if (typeof rowKey === "function") return rowKey(item);
    if (typeof rowKey === "string" || typeof rowKey === "number") {
      const val = (item as any)[rowKey];
      if (val !== undefined) return val;
    }
    const selectionKey = selection?.getRowKey(item);
    if (selectionKey !== undefined) return selectionKey;
    return (
      (item as any)?.id ??
      (item as any)?.productId ??
      (item as any)?.brandId ??
      (item as any)?.attributeId ??
      (item as any)?.orderId ??
      (item as any)?.userId ??
      index
    );
  };

  const hasSelection = Boolean(selection);
  const selectedCount = selection?.selected.size ?? 0;
  const allSelected = data.length > 0 && selectedCount === data.length;
  const someSelected = selectedCount > 0 && !allSelected;

  const thPadding = "px-4 py-3 h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground";
  const tdPadding = "px-4 py-3 text-[13px] font-sans";

  const handleSort = (col: AdminTableColumn<T>) => {
    if (!col.sortable || !onSortChange) return;
    if (sort?.key === col.key) {
      onSortChange({
        key: col.key,
        direction:
          sort.direction === "asc"
            ? "desc"
            : sort.direction === "desc"
            ? null
            : "asc",
      });
    } else {
      onSortChange({ key: col.key, direction: "asc" });
    }
  };

  const alignClass = (align?: "left" | "center" | "right") =>
    align === "center"
      ? "text-center"
      : align === "right"
      ? "text-right"
      : "text-left";

  const getColumnSticky = (col: AdminTableColumn<T>): "left" | "right" | undefined => {
    if (col.sticky !== undefined) return col.sticky;
    const isAction = col.key === "actions" || col.isAction;
    if (isAction) return "right";
    return undefined;
  };

  const tableScrollRef = React.useRef<HTMLDivElement>(null);
  const [showRightStickyFade, setShowRightStickyFade] = React.useState(false);

  const checkTableScroll = React.useCallback(() => {
    const el = tableScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const canScrollRight = scrollWidth - clientWidth - scrollLeft > 2;
    setShowRightStickyFade(canScrollRight);
  }, []);

  const isEmpty = !isLoading && data.length === 0;
  const isCardView = Boolean(
    isMobileScreen || ((enableCardView || renderCard) && activeViewMode === "card")
  );

  const hasSwitcher = Boolean(!isMobileScreen && (enableCardView || renderCard) && !hideViewSwitcher);

  React.useEffect(() => {
    const el = tableScrollRef.current;
    if (!el || isCardView) return;

    checkTableScroll();

    const observer = new ResizeObserver(() => {
      checkTableScroll();
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [checkTableScroll, isCardView, data.length]);

  const stickyClass = (
    sticky?: "left" | "right",
    isHeader = false,
    isRowActive = false,
    isRowSelected = false,
    isEven = true
  ) => {
    if (!sticky) return "";
    const z = isHeader ? "z-20" : "z-[2]";
    return cn(
      "sticky",
      isHeader
        ? "bg-surface border-l border-border"
        : isRowActive
        ? "bg-primary/10"
        : isRowSelected
        ? "bg-primary/5"
        : isEven
        ? "bg-card border-l border-border transition-colors duration-150"
        : "bg-surface/50 border-l border-border transition-colors duration-150",
      sticky === "right" && [
        "right-0",
        "before:content-[''] before:absolute before:top-0 before:bottom-0 before:-left-5 before:w-5 before:pointer-events-none before:transition-opacity before:duration-200",
        "before:bg-gradient-to-l before:from-black/[0.08] dark:before:from-black/40 before:to-transparent",
        showRightStickyFade ? "before:opacity-100" : "before:opacity-0"
      ],
      sticky === "left" && "left-0",
      z
    );
  };

  const hasSearch = search?.onChange !== undefined;

  // Render tabs seamlessly whether passed as ReactNode or AdminDataViewTabsConfig object
  const renderedTabs = React.useMemo(() => {
    if (!tabs) return null;
    if (React.isValidElement(tabs)) return tabs;
    if (typeof tabs === "object" && "items" in tabs && Array.isArray((tabs as any).items)) {
      const config = tabs as AdminDataViewTabsConfig;
      const handleChange = config.onValueChange || config.onChange || (() => {});
      return (
        
        <div className="w-full min-w-0">
        <Tabs
          value={config.value}
          onValueChange={handleChange}
          variant={config.variant ?? "line"}
          size="sm"
          className={config.className}
        >
          <TabsList mode="auto" size="sm">
            {config.items.map((item) => {
              const itemVal = item.value ?? item.key ?? item.label;
              const IconComp =
                typeof item.icon === "function" ? (
                  <item.icon className="w-3.5 h-3.5 stroke-[1.5]" />
                ) : (
                  item.icon
                );
              return (
                <TabsTrigger
                  key={itemVal}
                  value={itemVal}
                  badge={item.badge ?? item.count}
                  icon={IconComp}
                  disabled={item.disabled}
                  className={cn("transition-colors", (item as any).className, (item as any).class)}
                >
                  {item.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
        </div>
        
      );
    }
    return tabs as ReactNode;
  }, [tabs]);

  const hasLeftCluster = Boolean(renderedTabs || filterBar);
  const hasRightCluster = Boolean(hasSearch || actions || hasSwitcher);
  const hasTableToolbar = Boolean(toolbar || hasLeftCluster || hasRightCluster || expandedFilter);

  return (
    <div
      className={cn(
        "h-auto md:h-full flex flex-col w-full p-0 min-h-0 gap-3 md:overflow-hidden",
        className
      )}
    >
      {/* ── Table-Integrated Workstation Toolbar (Data-Docked Flat Axis) ── */}
      {hasTableToolbar && (
        <div className="w-full shrink-0 flex flex-col gap-2.5">
          {toolbar ? (
            toolbar
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 w-full">
              {/* Left Cluster: Tabs & Quick Filters */}
              {hasLeftCluster ? (
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="flex-1 min-w-0">
                    {renderedTabs}
                  </div>
                  {filterBar && (
                    <div className="shrink-0">
                      {filterBar}
                    </div>
                  )}
                </div>
              ) : null}

              {/* Right Cluster: Quick Search (or left-anchored if no filters exist) + Actions + ViewSwitcher */}
              {hasRightCluster ? (
                <div
                  className={cn(
                    "flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap",
                    hasLeftCluster ? "justify-start sm:justify-end" : "justify-between w-full"
                  )}
                >
                  {hasSearch && (
                    <div className="relative w-full sm:w-60 min-w-[180px]">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none stroke-[1.75]" />
                      <Input
                        value={search.query ?? ""}
                        onChange={(e) => search.onChange!(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && search.onSubmit?.()}
                        placeholder={search.placeholder ?? "Tìm kiếm trong bảng..."}
                        className="pl-9 h-[34px] text-base sm:text-[13px] border-border bg-card/60 rounded-sm w-full focus:ring-1 focus:ring-primary shadow-none placeholder:text-muted-foreground/70"
                      />
                    </div>
                  )}

                  {actions}

                  {hasSwitcher && (
                    <div className="hidden sm:block shrink-0">
                      <ViewSwitcher
                        viewMode={activeViewMode === "card" ? "grid" : "table"}
                        onViewModeChange={handleViewModeChange}
                      />
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* ── Optional Faceted / Collapsible Deep Filter Panel ── */}
          {expandedFilter && (
            <div className="w-full shrink-0 animate-in fade-in duration-150">
              {expandedFilter}
            </div>
          )}
        </div>
      )}

      <div className="block md:hidden">
        <AdminPagination
          page={pagination?.page ?? 1}
          totalPages={totalPages}
          total={pagination?.total ?? data.length}
          pageSize={pageSize}
          pageSizeOptions={pagination?.pageSizeOptions}
          onPageChange={pagination?.onPageChange ?? (() => {})}
          onPageSizeChange={pagination?.onPageSizeChange}
          viewSwitcher={
            hasSwitcher ? (
              <ViewSwitcher
                viewMode={activeViewMode === "card" ? "grid" : "table"}
                onViewModeChange={handleViewModeChange}
              />
            ) : undefined
          }
          className={pagination?.className}
        />
      </div>

      {/* ── Content View Area ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-0 md:overflow-hidden">
        {isCardView ? (
          /* ── Desktop & Tablet Horizontal Card Grid View ── */
          <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
            {isLoading ? (
              <SkeletonCard
                count={pageSize}
                hasMedia={columns.some(
                  (c) => c.isMedia || c.key === "image" || c.key === "avatar" || c.key === "thumbnail"
                )}
                className={gridClassName}
              />
            ) : isEmpty ? (
              <AdminEmptyState
                icon={emptyIcon}
                title={displayEmptyTitle}
                description={emptyDescription}
              />
            ) : (
              <div
                className={cn(
                  "grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-3 md:gap-3.5",
                  gridClassName
                )}
              >
                {data.map((item, index) => {
                  const key = resolveRowKey(item, index);
                  const isSelected = selection
                    ? selection.selected.has(key as any)
                    : false;
                  const isActive = isRowActive
                    ? isRowActive(item, index)
                    : activeRowKey === key;

                  if (renderCard) {
                    const helpers: AdminCardHelpers<T> = {
                      isSelected,
                      onToggleSelect: () => selection?.onSelect(key as any, !isSelected),
                      isActive,
                      rowKey: key,
                      item,
                      index,
                    };
                    return <div key={key}>{renderCard(item, helpers)}</div>;
                  }

                  return (
                    <AdminHorizontalCard
                      key={key}
                      item={item}
                      index={index}
                      columns={columns}
                      hasSelection={hasSelection}
                      isSelected={isSelected}
                      isActive={isActive}
                      isDesktop={!isMobileScreen}
                      onSelect={(checked) => selection?.onSelect(key as any, checked)}
                      onClick={() => onRowClick?.(item, index)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ── Standard Table View (Linear Modern Hairline Container) ───────────────── */
          <div
            ref={tableScrollRef}
            onScroll={checkTableScroll}
            className={cn(
              "flex-1 overflow-x-auto md:overflow-auto custom-scrollbar rounded-sm shadow-none min-h-0",
              tableClassName
            )}
          >
            <table
              className="w-full min-w-full text-[13px] text-left font-sans"
              aria-busy={isLoading}
            >
              <thead>
                <tr className="sticky top-0 z-10 bg-surface h-10 border-b border-border shadow-none">
                  {hasSelection && (
                    <th scope="col" className={cn(thPadding, "w-10 shrink-0")} aria-label="Chọn tất cả">
                      <Checkbox
                        checked={allSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = someSelected;
                        }}
                        onChange={(e) => selection?.onSelectAll(e.target.checked)}
                        aria-label="Chọn tất cả hàng"
                      />
                    </th>
                  )}

                  {columns.map((col) => {
                    const isActiveSort = sort?.key === col.key;
                    const isSortable = col.sortable && Boolean(onSortChange);
                    const colSticky = getColumnSticky(col);

                    return (
                      <th
                        key={col.key}
                        scope="col"
                        style={{ minWidth: col.minWidth, width: col.width }}
                        className={cn(
                          thPadding,
                          "whitespace-nowrap select-none",
                          alignClass(col.align),
                          col.isMain && "w-full",
                          isSortable && "cursor-pointer hover:text-foreground transition-colors duration-150 group",
                          stickyClass(colSticky, true)
                        )}
                        onClick={isSortable ? () => handleSort(col) : undefined}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {col.label}
                          {isSortable && (
                            <SortIcon
                              active={Boolean(isActiveSort)}
                              direction={isActiveSort ? sort?.direction ?? null : null}
                            />
                          )}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                    <SkeletonRow
                      key={i}
                      colCount={columns.length}
                      withCheckbox={hasSelection}
                    />
                  ))
                ) : (
                  data.map((item, index) => {
                    const key = resolveRowKey(item, index);
                    const isSelected = selection
                      ? selection.selected.has(key as any)
                      : false;
                    const isActive = isRowActive
                      ? isRowActive(item, index)
                      : activeRowKey === key;
                    const isEven = index % 2 === 0;

                    return (
                      <tr
                        key={key}
                        tabIndex={0}
                        onClick={() => onRowClick?.(item, index)}
                        className={cn(
                          "group h-12 transition-colors duration-150 select-none border-b border-border",
                          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-inset",
                          onRowClick && "cursor-pointer",
                          isActive
                            ? "bg-primary/10 font-medium"
                            : isSelected
                            ? "bg-primary/5"
                            : "hover:bg-surface-hover/80" 
                        )}
                      >
                        {hasSelection && (
                          <td
                            className={cn(tdPadding, "w-10 shrink-0 border-b border-border-subtle")}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Checkbox
                              checked={isSelected}
                              onChange={(e) =>
                                selection?.onSelect(key as any, e.target.checked)
                              }
                              aria-label={`Chọn hàng ${index + 1}`}
                            />
                          </td>
                        )}

                        {columns.map((col) => {
                          const colSticky = getColumnSticky(col);
                          return (
                            <td
                              key={col.key}
                              style={{ minWidth: col.minWidth, width: col.width }}
                              className={cn(
                                tdPadding,
                                alignClass(col.align),
                                "text-foreground",
                                stickyClass(colSticky, false, isActive, isSelected, isEven)
                              )}
                            >
                              {col.render
                                ? col.render(item, index)
                                : col.accessor
                                ? String((item as any)[col.accessor] ?? "")
                                : null}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Empty State */}
            {isEmpty && (
              <AdminEmptyState
                icon={emptyIcon}
                title={displayEmptyTitle}
                description={emptyDescription}
              />
            )}
          </div>
        )}
      </div>

      {/* ── Built-in Pagination / Control Footer ── */}
      {Boolean(pagination || footer || hasSwitcher) && (
        <div className="sticky bottom-0 z-20 shrink-0">
          {footer ?? (
            <AdminPagination
              page={pagination?.page ?? 1}
              totalPages={totalPages}
              total={pagination?.total ?? data.length}
              pageSize={pageSize}
              pageSizeOptions={pagination?.pageSizeOptions}
              onPageChange={pagination?.onPageChange ?? (() => {})}
              onPageSizeChange={pagination?.onPageSizeChange}
              viewSwitcher={
                hasSwitcher ? (
                  <ViewSwitcher
                    viewMode={activeViewMode === "card" ? "grid" : "table"}
                    onViewModeChange={handleViewModeChange}
                  />
                ) : undefined
              }
              className={pagination?.className}
            />
          )}
        </div>
      )}

      {/* ── Floating Bulk Action Dock ─────────────────────────────────── */}
      {hasSelection && selectedCount > 0 && (
        <aside
          role="toolbar"
          aria-label={`${selectedCount} hàng được chọn`}
          className={cn(
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-40",
            "flex items-center gap-3 px-4 py-2.5",
            "bg-card border border-border rounded-sm shadow-md font-sans"
          )}
        >
          <div className="flex items-center gap-2 select-none">
            <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-xs font-semibold tabular-nums bg-primary text-primary-foreground rounded-full">
              {selectedCount}
            </span>
            <span className="text-[13px] font-medium text-foreground">
              đã chọn
            </span>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => selection?.onSelectAll(false)}
            >
              Bỏ chọn
            </Button>
          </div>
          {bulkActions && (
            <>
              <div className="w-px h-4 bg-border shrink-0" aria-hidden="true" />
              <div className="flex items-center gap-2">{bulkActions}</div>
            </>
          )}
        </aside>
      )}
    </div>
  );
}
