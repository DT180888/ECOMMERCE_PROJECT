import React, { ReactNode, useId } from "react";
import { cn } from "../../lib/utils";
import { Checkbox } from "@my-project/ui";
import { AdminEmptyState } from "../AdminEmptyState";

import type { AdminTableProps, AdminTableColumn } from "./types";
import { SortIcon } from "./SortIcon";
import { SkeletonRow } from "./SkeletonRow";
import { renderActionCell } from "./ActionCell";
import { AdminTableMobileCard } from "./AdminTableMobileCard";

export function AdminTable<T>({
  columns,
  data,
  isLoading = false,
  skeletonRows = 6,
  emptyIcon,
  emptyTitle = "Không có dữ liệu",
  emptyDescription,
  emptyAction,
  selection,
  sort,
  onSortChange,
  onRowClick,
  className,
  tableClassName,
  bulkActions,
  footer,
  id: idProp,
  isRowExpanded,
  expandedRowRender,
  rowKey: rowKeyProp,
}: AdminTableProps<T>) {
  const generatedId = useId();
  const tableId = idProp ?? generatedId;

  const hasSelection = Boolean(selection);
  const selectedCount = selection?.selected.size ?? 0;
  const allSelected = data.length > 0 && selectedCount === data.length;
  const someSelected = selectedCount > 0 && !allSelected;

  const mainCol = columns.find((c) => c.isMain) || columns[0];
  const actionCol = columns.find((c) => c.key === "actions" || c.isAction);
  const auxCols = columns.filter((c) => c !== mainCol && c !== actionCol);

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

  const stickyClass = (sticky?: "left" | "right", isHeader = false) => {
    if (!sticky) return "";
    const z = isHeader ? "z-20" : "z-[1]";
    const sep =
      sticky === "right"
        ? "before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-foreground/[0.06]"
        : "after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-foreground/[0.06]";
    return cn("sticky bg-card", sticky === "right" ? "right-0" : "left-0", z, sep);
  };

  const isEmpty = !isLoading && data.length === 0;

  return (
    <div
      id={tableId}
      className={cn(
        "flex flex-col w-full h-full",
        "bg-card shadow-none rounded-card overflow-hidden",
        className
      )}
    >
      {/* ── Bulk Action Toolbar ─────────────────────────────────────────── */}
      {hasSelection && selectedCount > 0 && bulkActions && (
        <div
          role="toolbar"
          aria-label={`${selectedCount} hàng được chọn`}
          className={cn(
            "flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 sm:py-2 shrink-0 border-b border-neo-bevel bg-accent-soft/60 backdrop-blur-sm"
          )}
        >
          <span className="text-xs font-semibold text-accent tabular-nums select-none shrink-0">
            {selectedCount} đã chọn
          </span>
          <div className="hidden sm:block w-px h-4 bg-foreground/10 shrink-0" aria-hidden="true" />
          <div className="flex flex-wrap items-center gap-2">{bulkActions}</div>
        </div>
      )}

      {/* ── Table Scroll Container ──────────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex flex-col p-3 pb-0">
        <div
          className={cn(
            "flex-1 overflow-auto min-h-0 admin-table-scroll",
            tableClassName
          )}
        >
          <table
            className="w-full min-w-max text-sm text-left border-separate border-spacing-0 hidden md:table"
            aria-label={idProp ? undefined : "Bảng dữ liệu quản trị"}
            aria-busy={isLoading}
          >
            {/* ── <thead> ── */}
            <thead>
              <tr
                className={cn(
                  "sticky top-0 z-10 bg-card-muted/90 backdrop-blur-md border-b border-neo-bevel"
                )}
              >
                {/* Checkbox column */}
                {hasSelection && (
                  <th scope="col" className="px-3 py-2.5 md:px-4 md:py-3 w-10 shrink-0" aria-label="Chọn tất cả">
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

                {/* Data columns */}
                {columns.map((col) => {
                  const isActiveSort = sort?.key === col.key;
                  const isSortable = col.sortable && Boolean(onSortChange);

                  return (
                    <th
                      key={col.key}
                      scope="col"
                      style={col.minWidth ? { minWidth: col.minWidth } : undefined}
                      className={cn(
                        "px-3 py-2.5 md:px-4 md:py-3 text-[11px] font-semibold whitespace-nowrap uppercase tracking-widest text-muted-foreground",
                        alignClass(col.align),
                        isSortable && "cursor-pointer select-none hover:text-foreground transition-colors duration-200 group",
                        stickyClass(col.sticky, true)
                      )}
                      onClick={isSortable ? () => handleSort(col) : undefined}
                      aria-sort={
                        isActiveSort
                          ? sort?.direction === "asc" ? "ascending" : sort?.direction === "desc" ? "descending" : "none"
                          : undefined
                      }
                    >
                      <span className="inline-flex items-center gap-0.5">
                        {col.label}
                        {isSortable && (
                          <SortIcon direction={isActiveSort ? (sort?.direction ?? null) : null} active={isActiveSort} />
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* ── <tbody> ── */}
            <tbody className="divide-y divide-foreground/[0.04]">
              {isLoading &&
                Array.from({ length: skeletonRows }).map((_, i) => (
                  <SkeletonRow key={i} colCount={columns.length} withCheckbox={hasSelection} />
                ))}

              {isEmpty && (
                <tr>
                  <td colSpan={columns.length + (hasSelection ? 1 : 0)} className="py-0">
                    <AdminEmptyState
                      icon={emptyIcon}
                      title={emptyTitle}
                      description={emptyDescription}
                      action={emptyAction}
                    />
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isEmpty &&
                data.map((item, index) => {
                  const selectionRowKey = selection?.getRowKey(item);
                  const tableRowKey = rowKeyProp ? rowKeyProp(item) : selectionRowKey;
                  const isSelected = selectionRowKey !== undefined ? selection?.selected.has(selectionRowKey) : false;
                  const isClickable = Boolean(onRowClick);

                  return (
                    <React.Fragment key={tableRowKey !== undefined ? String(tableRowKey) : index}>
                      <tr
                        onClick={isClickable ? () => onRowClick!(item, index) : undefined}
                        aria-selected={hasSelection ? isSelected : undefined}
                        style={{ animationDelay: `${index * 30}ms` }}
                        className={cn(
                          "group transition-colors duration-150 ease-out animate-fade-in-up hover:bg-foreground/[0.03]",
                          "bg-transparent odd:bg-foreground/[0.055]",
                          isSelected && "bg-accent/[0.04] hover:bg-accent/[0.06]",
                          isClickable && "cursor-pointer"
                        )}
                      >
                        {hasSelection && selectionRowKey !== undefined && (
                          <td className="px-3 py-2.5 md:px-4 md:py-3 w-10 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={isSelected}
                              onChange={(e) => selection?.onSelect(selectionRowKey, e.target.checked)}
                              aria-label={`Chọn hàng ${index + 1}`}
                            />
                          </td>
                        )}

                        {columns.map((col) => {
                          const cellValue = col.accessor ? (item[col.accessor] as ReactNode) : undefined;
                          const renderedContent = col.render
                            ? col.render(item, index)
                            : cellValue !== undefined
                            ? (cellValue as ReactNode)
                            : <span className="text-muted-foreground">—</span>;

                          const isActionCol = col.key === "actions" || col.isAction;

                          return (
                            <td
                              key={col.key}
                              style={col.minWidth ? { minWidth: col.minWidth } : undefined}
                              className={cn(
                                "px-3 py-2.5 md:px-4 md:py-3 text-xs text-foreground",
                                alignClass(col.align),
                                isActionCol ? "w-[50px] shrink-0" : "",
                                "tabular-nums-children:tabular-nums",
                                stickyClass(col.sticky, false)
                              )}
                            >
                              {isActionCol ? renderActionCell(renderedContent, false) : renderedContent}
                            </td>
                          );
                        })}
                      </tr>
                      {isRowExpanded && expandedRowRender && isRowExpanded(item, index) && (
                        <tr className="bg-muted/10 border-t border-foreground/[0.04] dark:border-white/[0.05]">
                          <td colSpan={columns.length + (hasSelection ? 1 : 0)} className="p-0">
                            {expandedRowRender(item, index)}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>

          {/* Mobile List Card View */}
          {!isLoading && !isEmpty && (
            <div className="md:hidden flex flex-col gap-4 bg-foreground/[0.015]">
              {data.map((item, index) => {
                const selectionRowKey = selection?.getRowKey(item);
                const tableRowKey = rowKeyProp ? rowKeyProp(item) : selectionRowKey;
                return (
                  <AdminTableMobileCard
                    key={tableRowKey !== undefined ? String(tableRowKey) : index}
                    item={item}
                    index={index}
                    mainCol={mainCol}
                    auxCols={auxCols}
                    actionCol={actionCol}
                    selection={selection}
                    onRowClick={onRowClick}
                    hasSelection={hasSelection}
                    isRowExpanded={isRowExpanded}
                    expandedRowRender={expandedRowRender}
                  />
                );
              })}
            </div>
          )}

          {/* Mobile Skeleton Loader */}
          {isLoading && (
            <div className="md:hidden flex flex-col gap-4 p-4">
              {Array.from({ length: skeletonRows }).map((_, i) => (
                <div key={i} className="animate-pulse bg-card border-neo-bevel rounded-card p-3 space-y-1.5">
                  <div className="flex items-center gap-3">
                    {hasSelection && <div className="h-4 w-4 rounded-inner bg-foreground/8 shrink-0" />}
                    <div className="h-4 rounded-inner bg-foreground/8 w-2/3" />
                  </div>
                  <div className="space-y-2 pt-2 border-t border-foreground/[0.04]">
                    <div className="h-3 rounded-inner bg-foreground/8 w-1/2" />
                    <div className="h-3 rounded-inner bg-foreground/8 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile Empty State */}
          {isEmpty && (
            <div className="md:hidden">
              <AdminEmptyState
                icon={emptyIcon}
                title={emptyTitle}
                description={emptyDescription}
                action={emptyAction}
              />
            </div>
          )}
        </div>

      </div>

      {/* ── Footer (Pagination slot) ────────────────────────────────────── */}
      {footer && <div className="shrink-0">{footer}</div>}
    </div>
  );
}
