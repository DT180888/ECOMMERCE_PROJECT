import { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Checkbox } from "@my-project/ui";
import { renderActionCell } from "./ActionCell";
import type { AdminTableColumn, AdminTableSelectionState } from "./types";

export function AdminTableMobileCard<T>({
  item,
  index,
  mainCol,
  auxCols,
  actionCol,
  selection,
  onRowClick,
  hasSelection,
  isRowExpanded,
  expandedRowRender,
}: {
  item: T;
  index: number;
  mainCol: AdminTableColumn<T>;
  auxCols: AdminTableColumn<T>[];
  actionCol?: AdminTableColumn<T>;
  selection?: AdminTableSelectionState<any>;
  onRowClick?: (item: T, index: number) => void;
  hasSelection: boolean;
  isRowExpanded?: (item: T, index: number) => boolean;
  expandedRowRender?: (item: T, index: number) => ReactNode;
}) {
  const rowKey = selection?.getRowKey(item);
  const isSelected = rowKey !== undefined ? selection?.selected.has(rowKey) : false;
  const isClickable = Boolean(onRowClick);

  const mainContent = mainCol?.render
    ? mainCol.render(item, index)
    : mainCol?.accessor
    ? (item[mainCol.accessor] as ReactNode)
    : null;

  return (
    <div
      onClick={isClickable ? () => onRowClick!(item, index) : undefined}
      style={{
        animationDelay: `${index * 30}ms`,
      }}
      className={cn(
        "bg-card border-neo-bevel shadow-none hover:shadow-neo-hover hover:-translate-y-px rounded-card p-3 space-y-1.5 flex flex-col transition-all duration-200 animate-fade-in-up",
        isSelected && "bg-accent/[0.02] border-accent/20",
        isClickable && "cursor-pointer hover:bg-foreground/[0.01]"
      )}
    >
      {/* Card Header: Checkbox + Main Column */}
      <div className="flex items-center gap-3">
        {hasSelection && rowKey !== undefined && (
          <div
            className=" shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox 
              checked={isSelected}
              onChange={(e) =>
                selection?.onSelect(rowKey, e.target.checked)
              }
              aria-label={`Chọn hàng ${index + 1}`}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">{mainContent}</div>
              {/* Action */}
      {actionCol && (
        <div
          className="p-1.5 rounded-button"
          onClick={(e) => e.stopPropagation()}
        >
          {actionCol.render
            ? renderActionCell(actionCol.render(item, index), true)
            : null}
        </div>
      )}
      </div>

      {/* Auxiliary Columns: Display vertically */}
      {auxCols.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-foreground/[0.1] text-xs">
          {auxCols.map((col) => {
            const cellValue = col.accessor
              ? (item[col.accessor] as ReactNode)
              : undefined;
            const rendered = col.render
              ? col.render(item, index)
              : cellValue !== undefined
              ? (cellValue as ReactNode)
              : <span className="text-muted-foreground">—</span>;

            return (
              <div
                key={col.key}
                className="flex justify-between items-center gap-4"
              >
                <span className="text-muted-foreground font-medium whitespace-nowrap">
                  {col.label}:
                </span>
                <div className="text-foreground text-right font-medium">
                  {rendered}
                </div>
              </div>
            );
          })}
        </div>
      )}

    {/* Expanded Row Content */}
      {isRowExpanded && expandedRowRender && isRowExpanded(item, index) && (
        <div className="mt-4 pt-4 border-t border-foreground/[0.04]">
          {expandedRowRender(item, index)}
        </div>
      )}

    </div>
  );
}
