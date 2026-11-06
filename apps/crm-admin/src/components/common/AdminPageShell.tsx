import React, { type ReactNode, type ElementType } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button, cn } from "@my-project/ui";
import { AdminBreadcrumb } from "../layout/AdminBreadcrumb";

/* ── AdminPageHeader ──────────────────────────────────────────────────────── */

export interface AdminPageHeaderCreateAction {
  onClick?: () => void;
  label?: string;
  canCreate?: boolean;
}

export interface AdminPageHeaderProps {
  icon?: ElementType;
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  breadcrumb?: ReactNode;
  hideBreadcrumb?: boolean;
  createAction?: AdminPageHeaderCreateAction;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * AdminPageHeader
 * Pure Editorial Minimalist Identity & Wayfinding Horizon:
 * - Breadcrumb navigation on deep routes
 * - Page Title (18px-20px SemiBold) + Icon + Counter Badge + Subtitle
 * - Page-Level Primary Actions (e.g. "+ Thêm mới", Export, Back button)
 * - Zero filter/search bloat: Search, Tabs and Filters are 100% encapsulated inside AdminDataView.
 */
export function AdminPageHeader({
  icon: Icon,
  title,
  subtitle,
  badge,
  breadcrumb,
  hideBreadcrumb = false,
  createAction,
  actions,
  children,
  className,
}: AdminPageHeaderProps) {
  const hasCreate = Boolean(createAction?.onClick && (createAction.canCreate ?? true));

  return (
    <header
      className={cn(
        "shrink-0 select-none transition-colors flex flex-col gap-1.5",
        "sticky top-0 z-20 bg-background/95 backdrop-blur-md md:static md:bg-transparent md:border-b-0",
        className
      )}
    >
      {/* ── Tier 1: Over-Title Breadcrumb Strip (Smart Context) ── */}
      {!hideBreadcrumb && (
        breadcrumb ? (
          <div className="shrink-0">{breadcrumb}</div>
        ) : (
          <AdminBreadcrumb className="mb-0.5" />
        )
      )}

      {/* ── Tier 2: Pure Identity Horizon Bar (Title, Badge, Subtitle & Page Actions) ── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full">
        {/* Left Cluster: Icon Box, Title, Subtitle, Badge */}
        <div className="flex flex-1 items-center gap-2.5 sm:gap-3 min-w-0">
          {Icon && (
            <div className="w-7 h-7 rounded-sm bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 stroke-[1.75]" />
            </div>
          )}
          <div className="min-w-0 flex items-center gap-2 sm:gap-2.5 flex-wrap">
            {title && (
              <h2 className="text-base sm:text-lg font-semibold text-foreground tracking-tight truncate">
                {title}
              </h2>
            )}
            {badge && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-primary/10 text-primary border border-primary/20 shrink-0">
                {badge}
              </span>
            )}
            {/* {subtitle && (
              <p className="text-xs text-muted-foreground truncate hidden md:block">
                {subtitle}
              </p>
            )} */}
          </div>
        </div>

        {/* Right Cluster: Actions, Children & Primary Create CTA */}
        {(actions || children || hasCreate) && (
          <div className="flex items-center justify-between w-full lg:w-auto  md:justify-end gap-2 shrink-0 flex-wrap">
            {actions}
            {children}
            {hasCreate && (
              <Button
                type="button"
                size="sm"
                icon={<PlusIcon className="w-4 h-4 stroke-[2]" />}
                collapseTextOnSm
                onClick={createAction!.onClick}
                className="h-[34px] px-3.5 text-xs font-semibold rounded-sm shadow-none shrink-0"
              >
                {createAction!.label ?? "Thêm mới"}
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

/* ── AdminPageToolbar ─────────────────────────────────────────────────────── */

export interface AdminPageToolbarProps {
  /** Left slot elements (e.g. Tabs, search input, title segment) */
  left?: ReactNode;
  /** Right slot elements (e.g. Filters, action buttons, view toggles) */
  right?: ReactNode;
  /** Shorthand for tabs */
  tabs?: ReactNode;
  /** Shorthand for search */
  search?: ReactNode;
  /** Shorthand for filter controls */
  filterBar?: ReactNode;
  /** Shorthand for right-aligned actions */
  actions?: ReactNode;
  /** Custom children override */
  children?: ReactNode;
  /** Custom CSS classes */
  className?: string;
  /** Remove bottom hairline border */
  noBorder?: boolean;
}

/**
 * AdminPageToolbar
 * Standardized workstation control bar for non-table pages (Dashboard, Reports,
 * Automation, Kanban, Settings) or custom layout views.
 * 
 * Provides:
 * - Pure Editorial hairline divider (1px border-b border-border)
 * - 40px standard ergonomic height
 * - Responsive auto-stacking on mobile
 */
export function AdminPageToolbar({
  left,
  right,
  tabs,
  search,
  filterBar,
  actions,
  children,
  className,
  noBorder = false,
}: AdminPageToolbarProps) {
  if (children) {
    return (
      <div
        role="toolbar"
        aria-label="Thanh công cụ trang"
        className={cn(
          "flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-0 w-full shrink-0",
          className
        )}
      >
        {children}
      </div>
    );
  }

  const leftContent = tabs || search || left ? (
    <div className="flex flex-wrap items-center gap-2.5 min-w-0">
      {tabs}
      {search}
      {left}
    </div>
  ) : null;

  const rightContent = filterBar || actions || right ? (
    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
      {filterBar}
      {actions}
      {right}
    </div>
  ) : null;

  if (!leftContent && !rightContent) return null;

  return (
    <div
      role="toolbar"
      aria-label="Thanh công cụ trang"
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-0 w-full shrink-0",
        className
      )}
    >
      {leftContent}
      {rightContent}
    </div>
  );
}

AdminPageToolbar.displayName = "AdminPageToolbar";
(AdminPageToolbar as any).__adminShellType = "toolbar";

/* ── AdminPageBody ────────────────────────────────────────────────────────── */

export interface AdminPageBodyProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}

export function AdminPageBody({
  children,
  className,
}: AdminPageBodyProps) {
  return (
    <div
      role="region"
      aria-label="Nội dung trang"
      className={cn(
        "flex-1 flex flex-col min-w-0 w-full relative gap-4 md:gap-6 min-h-0",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ── AdminPageInspector ───────────────────────────────────────────────────── */

export interface AdminPageInspectorProps {
  children: ReactNode;
  className?: string;
}

export function AdminPageInspector({
  children,
  className,
}: AdminPageInspectorProps) {
  if (!children) return null;
  return className ? <aside className={className}>{children}</aside> : <>{children}</>;
}

/* ── AdminPageShell (Root Compound Component) ─────────────────────────────── */

export interface AdminPageShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * AdminPageShell
 * Pure compound layout container for admin pages.
 * Supports dot notation: AdminPageShell.Header, AdminPageShell.Body, AdminPageShell.Inspector
 * or named exports: AdminPageHeader, AdminPageBody, AdminPageInspector.
 */
export function AdminPageShell({ children, className }: AdminPageShellProps) {
  let headerElement: ReactNode = null;
  let toolbarElement: ReactNode = null;
  let bodyElement: ReactNode = null;
  let inspectorElement: ReactNode = null;
  const otherElements: ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      if (child) otherElements.push(child);
      return;
    }

    const childType = child.type as any;
    const isHeader =
      childType === AdminPageHeader ||
      childType === AdminPageShell.Header ||
      childType?.displayName === "AdminPageHeader" ||
      childType?.__adminShellType === "header";

    const isToolbar =
      childType === AdminPageToolbar ||
      childType === AdminPageShell.Toolbar ||
      childType?.displayName === "AdminPageToolbar" ||
      childType?.__adminShellType === "toolbar";

    const isBody =
      childType === AdminPageBody ||
      childType === AdminPageShell.Body ||
      childType?.displayName === "AdminPageBody" ||
      childType?.__adminShellType === "body";

    const isInspector =
      childType === AdminPageInspector ||
      childType === AdminPageShell.Inspector ||
      childType?.displayName === "AdminPageInspector" ||
      childType?.__adminShellType === "inspector";

    if (isHeader) {
      headerElement = child;
    } else if (isToolbar) {
      toolbarElement = child;
    } else if (isBody) {
      bodyElement = child;
    } else if (isInspector) {
      inspectorElement = child;
    } else {
      otherElements.push(child);
    }
  });

  const isCompound = Boolean(headerElement || toolbarElement || bodyElement || inspectorElement);

  return (
    <div
      className={cn(
        "flex-1 flex flex-col min-w-0 w-full min-h-full md:h-full md:min-h-0 bg-background font-sans m-0 md:overflow-visible gap-4 md:gap-6",
        className
      )}
    >
      {isCompound ? (
        <>
          {headerElement}
          {toolbarElement}
          <div className="flex-1 flex flex-col md:flex-row min-w-0 w-full relative min-h-0 items-stretch">
            {bodyElement ?? (otherElements.length > 0 ? <AdminPageBody>{otherElements}</AdminPageBody> : null)}
            {inspectorElement}
          </div>
        </>
      ) : (
        children
      )}
    </div>
  );
}

AdminPageHeader.displayName = "AdminPageHeader";
(AdminPageHeader as any).__adminShellType = "header";

AdminPageToolbar.displayName = "AdminPageToolbar";
(AdminPageToolbar as any).__adminShellType = "toolbar";

AdminPageBody.displayName = "AdminPageBody";
(AdminPageBody as any).__adminShellType = "body";

AdminPageInspector.displayName = "AdminPageInspector";
(AdminPageInspector as any).__adminShellType = "inspector";

AdminPageShell.Header = AdminPageHeader;
AdminPageShell.Toolbar = AdminPageToolbar;
AdminPageShell.Body = AdminPageBody;
AdminPageShell.Inspector = AdminPageInspector;

export default AdminPageShell;
