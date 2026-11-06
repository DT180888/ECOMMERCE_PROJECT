import type { ReactNode, ElementType } from "react";

export interface AdminDataViewTabItem {
  value?: string;
  key?: string;
  label: string;
  badge?: number | string;
  count?: number | string;
  icon?: ElementType | ReactNode;
  disabled?: boolean;
  class?: string;
}

export interface AdminDataViewTabsConfig {
  value: string;
  onValueChange?: (val: string) => void;
  onChange?: (val: string) => void;
  items: AdminDataViewTabItem[];
  variant?: "segmented" | "subtle" | "line";
  className?: string;
}

export interface AdminTableColumn<T> {
  key: string;
  label: ReactNode;
  render?: (item: T, index: number) => ReactNode;
  accessor?: keyof T;
  align?: "left" | "center" | "right";
  minWidth?: string;
  width?: string;
  sortable?: boolean;
  sticky?: "left" | "right";
  isMain?: boolean;
  isAction?: boolean;

  /** Marks this column as media/image for card layout */
  isMedia?: boolean;
  /** Marks this column to be rendered directly underneath the media (e.g. role badges under avatar) */
  isMediaSub?: boolean;
  /** Aspect ratio for media thumbnail */
  mediaAspect?: "square" | "video" | "wide" | "portrait";
  /** Explicit image URL getter */
  getMediaSrc?: (item: T) => string | undefined;
  /** Marks this column as secondary meta/subtitle */
  isSub?: boolean;
  /** Marks this column to be rendered in card footer (e.g. price) */
  isFooter?: boolean;
}

export type SortDirection = "asc" | "desc" | null;

export interface AdminTableSortState {
  key: string | null;
  direction: SortDirection;
}

export interface AdminTablePaginationProps {
  page: number;
  total: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
}

export interface AdminTableSelectionState<K extends string | number = number> {
  selected: Set<K>;
  onSelect: (id: K, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  getRowKey: (item: unknown) => K;
}

export interface AdminCardHelpers<T> {
  isSelected: boolean;
  onToggleSelect: () => void;
  isActive: boolean;
  rowKey: string | number;
  item: T;
  index: number;
}

export interface AdminDataViewProps<T> {
  /** Column definitions */
  columns: AdminTableColumn<T>[];
  /** Data array */
  data: T[];
  /** Loading state */
  isLoading?: boolean;
  /** Row identifier key (property key string or resolver function) */
  rowKey?: keyof T | ((item: T) => string | number);
  /** Built-in pagination config */
  pagination?: AdminTablePaginationProps;
  /** Checkbox selection state */
  selection?: AdminTableSelectionState<any>;
  /** Sorting state & callback */
  sort?: AdminTableSortState;
  onSortChange?: (state: AdminTableSortState) => void;
  /** Active row key */
  activeRowKey?: string | number | null;
  /** Custom predicate for active item */
  isRowActive?: (item: T, index: number) => boolean;
  /** Empty state customization */
  emptyText?: string;
  emptyIcon?: ElementType;
  /** Row/card click callback */
  onRowClick?: (item: T, index: number) => void;
  /** Additional styling */
  className?: string;
  tableClassName?: string;

  /** Enable desktop switching between Table and Horizontal Card views */
  enableCardView?: boolean;
  /** Default view mode (default: 'table' or 'card') */
  defaultViewMode?: "table" | "card" | "grid";
  /** Controlled view mode */
  viewMode?: "table" | "card" | "grid";
  /** View mode change callback */
  onViewModeChange?: (mode: "table" | "card") => void;
  /** Key to remember view mode in localStorage */
  storageKey?: string;
  /** Custom grid class for cards */
  gridClassName?: string;
  /** Hide view switcher toolbar */
  hideViewSwitcher?: boolean;

  /** Optional custom card renderer (if needed) */
  renderCard?: (item: T, helpers: AdminCardHelpers<T>) => ReactNode;

  // Table-Integrated Workstation Toolbar
  /** Custom table toolbar slot */
  toolbar?: ReactNode;
  /** Quick search configuration inside table toolbar */
  search?: {
    query?: string;
    onChange?: (val: string) => void;
    onSubmit?: () => void;
    placeholder?: string;
  };
  /** Dedicated tabs/filter slot inside table toolbar (JSX element or config object) */
  tabs?: ReactNode | AdminDataViewTabsConfig;
  /** Quick filter elements (DatePicker, Selects) inside table toolbar */
  filterBar?: ReactNode;
  /** Deep / Collapsible faceted filter panel */
  expandedFilter?: ReactNode;
  /** Custom right-side actions in table toolbar */
  actions?: ReactNode;

  // Legacy fallbacks
  skeletonRows?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  footer?: ReactNode;
  bulkActions?: ReactNode;
}

export type AdminTableProps<T> = AdminDataViewProps<T>;
