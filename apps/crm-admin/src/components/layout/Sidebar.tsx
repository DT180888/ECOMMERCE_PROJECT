import React from "react";
import { NavLink } from "react-router-dom";
import {
  BanknotesIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
  ChartBarSquareIcon,
  UserGroupIcon,
  SparklesIcon,
  QueueListIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  TagIcon,
  PhotoIcon,
  FolderIcon,
  SwatchIcon,
  ViewColumnsIcon,
  ShoppingCartIcon,
  ChatBubbleBottomCenterTextIcon,
  ChartPieIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@my-project/ui";
import usePermission from "@hooks/usePermission";
import { useLayoutMode } from "@app/layouts/LayoutContext";

interface NavItemConfig {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  permissionsAny?: string[];
  end?: boolean;
}

interface NavSectionConfig {
  id: string;
  heading?: string;
  items: NavItemConfig[];
  permission?: string;
  permissionsAny?: string[];
}

/**
 * Sidebar Component
 * Linear Modern Editorial Design System Specification
 * - Clean Navigation Panel: w-60 (expanded) <-> w-16 (collapsed)
 * - Hairline Precision: 1px single-edge right border, 4px radius, WCAG AAA contrast
 * - Active State: Subtle primary tint with solid indicator
 */
export default function Sidebar() {
  const { hasPermission, hasAnyPermission } = usePermission();
  const { isSidebarCollapsed: isCollapsed, toggleSidebarCollapse } = useLayoutMode();

  const sections: NavSectionConfig[] = [
    {
      id: "overview",
      heading: "Tổng quan",
      items: [
        {
          to: "/admin/dashboard",
          label: "Tổng quan",
          icon: ChartBarIcon,
          permission: "Permissions.Dashboard.View",
          end: true,
        },
        {
          to: "/admin/reports",
          label: "Báo cáo & Phân tích",
          icon: ChartBarSquareIcon,
          permissionsAny: ["Permissions.Reports.View", "Permissions.Dashboard.View"],
        },
      ],
    },
    {
      id: "business",
      heading: "Kinh doanh",
      permissionsAny: [
        "Permissions.Orders.View",
        "Permissions.Promotions.View",
        "Permissions.Users.View",
        "Permissions.Products.View",
      ],
      items: [
        {
          to: "/admin/orders",
          label: "Đơn hàng",
          icon: BanknotesIcon,
          permission: "Permissions.Orders.View",
        },
        {
          to: "/admin/abandoned-carts",
          label: "Giỏ hàng bỏ quên",
          icon: ShoppingCartIcon,
          permission: "Permissions.Orders.View",
        },
        {
          to: "/admin/reviews",
          label: "Đánh giá",
          icon: ChatBubbleBottomCenterTextIcon,
          permission: "Permissions.Products.View",
        },
        {
          to: "/admin/customers/rfm-segments",
          label: "Phân cụm RFM",
          icon: ChartPieIcon,
          permission: "Permissions.Users.View",
        },
        {
          to: "/admin/automation/triggers",
          label: "Tự động hóa",
          icon: BoltIcon,
          permission: "Permissions.Users.View",
        },
        {
          to: "/admin/promotion",
          label: "Khuyến mãi",
          icon: TagIcon,
          permission: "Permissions.Promotions.View",
        },
        {
          to: "/admin/collection",
          label: "Bộ sưu tập",
          icon: ViewColumnsIcon,
          permission: "Permissions.Promotions.View",
        },
        {
          to: "/admin/hero-slides",
          label: "Banner Slides",
          icon: PhotoIcon,
          permission: "Permissions.Promotions.View",
        },
      ],
    },
    {
      id: "catalog",
      heading: "Sản phẩm & Danh mục",
      permission: "Permissions.Products.View",
      items: [
        {
          to: "/admin/product",
          label: "Sản phẩm",
          icon: ArchiveBoxIcon,
          permission: "Permissions.Products.View",
        },
        {
          to: "/admin/skus",
          label: "Quản lý SKU",
          icon: QueueListIcon,
          permission: "Permissions.Products.View",
        },
        {
          to: "/admin/category",
          label: "Danh mục",
          icon: FolderIcon,
          permission: "Permissions.Products.View",
        },
        {
          to: "/admin/brand",
          label: "Thương hiệu",
          icon: TagIcon,
          permission: "Permissions.Products.View",
        },
        {
          to: "/admin/attribute",
          label: "Thuộc tính",
          icon: SwatchIcon,
          permission: "Permissions.Products.View",
        },
      ],
    },
    {
      id: "system",
      heading: "Hệ thống",
      permissionsAny: ["Permissions.Users.View", "Permissions.Roles.View"],
      items: [
        {
          to: "/admin/users",
          label: "Người dùng",
          icon: UserGroupIcon,
          permission: "Permissions.Users.View",
        },
        {
          to: "/admin/security",
          label: "Bảo mật",
          icon: ShieldCheckIcon,
          permission: "Permissions.Roles.View",
        },
      ],
    },
  ];

  const checkPerm = (item: { permission?: string; permissionsAny?: string[] }) => {
    if (item.permission && !hasPermission(item.permission)) return false;
    if (item.permissionsAny && !hasAnyPermission(item.permissionsAny)) return false;
    return true;
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center text-[13px] font-sans transition-all duration-150 group relative rounded-sm select-none",
      isCollapsed
        ? "justify-center h-7 w-7 mx-auto"
        : "justify-start h-7 px-3 py-1.5",
      isActive
        ? "bg-primary/10 text-primary font-medium"
        : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
    );

  return (
    <div
      className={cn(
        "h-full flex flex-col select-none relative group/sidebar transition-all duration-200 ease-out bg-surface",
        isCollapsed ? "w-16" : "w-52"
      )}
    >
      {/* ── Brand Logo Header (h-14 / 56px baseline) ── */}
      <div className="h-14 flex items-center px-3.5 shrink-0 select-none border-b border-border">
        <NavLink
          to="/admin/dashboard"
          className={cn(
            "flex items-center gap-2.5 min-w-0 cursor-pointer w-full",
            isCollapsed && "justify-center"
          )}
          title="Về bảng điều khiển"
        >
          <div className="w-8 h-8 rounded-sm bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-none">
            <SparklesIcon className="w-4 h-4 stroke-[1.75]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <span className="font-sans font-bold text-sm tracking-tight text-foreground leading-none truncate">
                Studio CRM
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1 truncate">
                Admin Workspace
              </span>
            </div>
          )}
        </NavLink>
      </div>

      {/* ── Navigation Menu ── */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        <nav className="flex flex-col h-full overflow-y-auto overflow-x-hidden p-3 custom-scrollbar space-y-3">
          {sections
            .filter((section) => checkPerm(section))
            .map((section, sIdx) => {
              const visibleItems = section.items.filter((item) => checkPerm(item));
              if (visibleItems.length === 0) return null;

              return (
                <div key={section.id}>
                  {sIdx > 0 && (
                    <div
                      className={cn(
                        "bg-border my-2",
                        isCollapsed ? "w-6 h-px mx-auto" : "h-px mx-2"
                      )}
                    />
                  )}

                  {!isCollapsed && section.heading && (
                    <h5 className="text-[11px] font-semibold text-muted-foreground/80 mb-1.5 px-3 font-sans">
                      {section.heading}
                    </h5>
                  )}

                  <ul className="space-y-1">
                    {visibleItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            end={item.end}
                            className={navItemClass}
                            title={isCollapsed ? item.label : undefined}
                          >
                            {({ isActive }) => (
                              <>
                                <Icon
                                  className={cn(
                                    "w-4 h-4 stroke-[1.5] shrink-0",
                                    !isCollapsed && "mr-2.5",
                                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                  )}
                                />
                                {!isCollapsed && (
                                  <span className="truncate flex-1">{item.label}</span>
                                )}
                                {isActive && !isCollapsed && (
                                  <span
                                    className="w-1.5 h-1.5 bg-primary rounded-full shrink-0 ml-1.5"
                                  />
                                )}
                              </>
                            )}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
        </nav>

        {/* ── Sidebar Footer: Collapse Toggle ── */}
        <div className="p-3 shrink-0 border-t border-border flex flex-col gap-1">
          <button
            type="button"
            onClick={toggleSidebarCollapse}
            className={cn(
              "h-[34px] text-xs font-sans font-medium rounded-sm text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors flex items-center justify-center gap-2 w-full cursor-pointer",
              isCollapsed && "px-0"
            )}
            title={isCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            aria-label={isCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
          >
            <ChevronLeftIcon
              className={cn(
                "w-4 h-4 stroke-[1.5] transition-transform duration-200",
                isCollapsed && "rotate-180"
              )}
            />
            {!isCollapsed && <span>Thu gọn</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
