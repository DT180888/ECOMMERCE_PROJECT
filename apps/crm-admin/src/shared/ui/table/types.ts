import type { ReactNode, ElementType } from "react";

export interface AdminTableColumn<T> {
  key: string;
  label: ReactNode;
  render?: (item: T, index: number) => ReactNode;
  accessor?: keyof T;
  align?: "left" | "center" | "right";
  minWidth?: string;
  sortable?: boolean;
  hiddenLabel?: boolean;
  sticky?: "left" | "right";
  isMain?: boolean;
  isAction?: boolean;
}

export type SortDirection = "asc" | "desc" | null;

export interface AdminTableSortState {
  key: string | null;
  direction: SortDirection;
}

export interface AdminTableSelectionState<K extends string | number = number> {
  selected: Set<K>;
  onSelect: (id: K, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  getRowKey: (item: unknown) => K;
}

export interface AdminTableProps<T> {
  columns: AdminTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  skeletonRows?: number;
  emptyIcon?: ElementType;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  selection?: AdminTableSelectionState<any>;
  sort?: AdminTableSortState;
  onSortChange?: (state: AdminTableSortState) => void;
  onRowClick?: (item: T, index: number) => void;
  className?: string;
  tableClassName?: string;
  bulkActions?: ReactNode;
  footer?: ReactNode;
  id?: string;
  isRowExpanded?: (item: T, index: number) => boolean;
  expandedRowRender?: (item: T, index: number) => ReactNode;
  rowKey?: (item: T) => string | number;
}
