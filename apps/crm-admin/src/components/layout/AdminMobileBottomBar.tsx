import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChartBarIcon,
  BanknotesIcon,
  ArchiveBoxIcon,
  Squares2X2Icon,
  FunnelIcon,
  PlusIcon,
  QueueListIcon,
  FolderIcon,
  SparklesIcon,
  SwatchIcon,
  TagIcon,
  ViewColumnsIcon,
  PhotoIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ChartPieIcon,
  ShoppingCartIcon,
  ChatBubbleBottomCenterTextIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  cn,
} from "@my-project/ui";
import usePermission from "@hooks/usePermission";
import { useMobileActionState } from "@app/layouts/MobileActionContext";

export function AdminMobileBottomBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const { actions, filterConfig } = useMobileActionState();

  const isDashboard = location.pathname === "/admin/dashboard";
  const isOrders = location.pathname.startsWith("/admin/orders");
  const isProducts = location.pathname.startsWith("/admin/product");
  const isOtherModuleActive = !isDashboard && !isOrders && !isProducts;

  // Primary action from page context (if registered)
  const primaryAction = useMemo(
    () => actions.find((a) => a.isPrimary) || actions[0] || null,
    [actions]
  );
  const PrimaryActionIcon = primaryAction?.icon;

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Categorized navigation groups inside Dropdown
  const dropdownGroups = useMemo(
    () => [
      {
        title: "Bán hàng & Khách hàng",
        items: [
          {
            label: "Giỏ hàng bỏ rơi",
            path: "/admin/abandoned-carts",
            icon: ShoppingCartIcon,
            visible: true,
          },
          {
            label: "Đánh giá sản phẩm",
            path: "/admin/reviews",
            icon: ChatBubbleBottomCenterTextIcon,
            visible: true,
          },
          {
            label: "Phân cụm RFM (AI)",
            path: "/admin/customers/rfm-segments",
            icon: ArrowTrendingUpIcon,
            visible: true,
          },
          {
            label: "Tiếp thị tự động",
            path: "/admin/automation/triggers",
            icon: BoltIcon,
            visible: true,
          },
        ],
      },
      {
        title: "Tiếp thị & Khuyến mãi",
        items: [
          {
            label: "Khuyến mãi & Giảm giá",
            path: "/admin/promotion",
            icon: TagIcon,
            visible: hasPermission("Permissions.Promotions.View"),
          },
          {
            label: "Bộ sưu tập",
            path: "/admin/collection",
            icon: ViewColumnsIcon,
            visible: hasPermission("Permissions.Promotions.View"),
          },
          {
            label: "Banner Slides",
            path: "/admin/hero-slides",
            icon: PhotoIcon,
            visible: hasPermission("Permissions.Promotions.View"),
          },
        ],
      },
      {
        title: "Kho & Danh mục",
        items: [
          {
            label: "Biến thể SKU",
            path: "/admin/skus",
            icon: QueueListIcon,
            visible: hasPermission("Permissions.Products.View"),
          },
          {
            label: "Danh mục",
            path: "/admin/category",
            icon: FolderIcon,
            visible: hasPermission("Permissions.Products.View"),
          },
          {
            label: "Thương hiệu",
            path: "/admin/brand",
            icon: SparklesIcon,
            visible: hasPermission("Permissions.Products.View"),
          },
          {
            label: "Thuộc tính",
            path: "/admin/attribute",
            icon: SwatchIcon,
            visible: hasPermission("Permissions.Products.View"),
          },
        ],
      },
      {
        title: "Báo cáo & Quản trị",
        items: [
          {
            label: "Báo cáo CRM",
            path: "/admin/reports",
            icon: ChartPieIcon,
            visible: true,
          },
          {
            label: "Quản lý Người dùng",
            path: "/admin/users",
            icon: UserGroupIcon,
            visible: hasPermission("Permissions.Users.View"),
          },
          {
            label: "Bảo mật & Vai trò",
            path: "/admin/security",
            icon: ShieldCheckIcon,
            visible: hasPermission("Permissions.Roles.View"),
          },
        ],
      },
    ],
    [hasPermission]
  );

  return (
    <>
      {/* ── Contextual Action Capsule (Tự động hiển thị nổi phía trên dock khi trang có action/filter) ── */}
      {(primaryAction || filterConfig?.onOpenFilter) && (
        <div className="fixed bottom-[4.75rem] inset-x-0 z-40 md:hidden flex justify-center pointer-events-none px-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="pointer-events-auto flex items-center gap-1.5 shadow-elevation-2 rounded-xl bg-surface/95 backdrop-blur-md border border-border p-1">
            {primaryAction && (
              <button
                type="button"
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
                className="h-8 px-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all max-w-[200px] truncate cursor-pointer"
                title={primaryAction.label}
              >
                {PrimaryActionIcon ? (
                  <PrimaryActionIcon className="w-3.5 h-3.5 stroke-[2] shrink-0" />
                ) : (
                  <PlusIcon className="w-3.5 h-3.5 stroke-[2] shrink-0" />
                )}
                <span className="truncate">{primaryAction.label}</span>
              </button>
            )}

            {filterConfig?.onOpenFilter && (
              <button
                type="button"
                onClick={filterConfig.onOpenFilter}
                className="h-8 px-2.5 rounded-lg bg-card border border-border text-xs font-medium text-foreground flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                title="Mở bộ lọc dữ liệu"
              >
                <FunnelIcon className="w-3.5 h-3.5 text-primary stroke-[1.5]" />
                <span>{filterConfig.label || "Bộ lọc"}</span>
                {(filterConfig.activeCount ?? 0) > 0 && (
                  <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                    {filterConfig.activeCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Hướng 1: Clean Executive 4-Tab Bottom Dock ── */}
      <nav
        aria-label="Thanh điều hướng di động"
        className="fixed bottom-3 inset-x-3 z-40 md:hidden flex justify-center pointer-events-none pb-[env(safe-area-inset-bottom)] select-none font-sans"
      >
        <div className="pointer-events-auto h-14 max-w-md w-full rounded-2xl bg-surface/90 backdrop-blur-xl border border-border shadow-elevation-3 px-2 flex items-center justify-around transition-all duration-200">
          {/* Tab 1: Tổng quan */}
          <button
            type="button"
            onClick={() => handleNavigate("/admin/dashboard")}
            className={cn(
              "flex-1 h-11 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer relative",
              isDashboard ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ChartBarIcon className="w-5 h-5 stroke-[1.5]" />
            <span className="text-[10px] tracking-tight leading-none mt-1">Tổng quan</span>
            {isDashboard && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
            )}
          </button>

          {/* Tab 2: Đơn hàng */}
          <button
            type="button"
            onClick={() => handleNavigate("/admin/orders")}
            className={cn(
              "flex-1 h-11 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer relative",
              isOrders ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BanknotesIcon className="w-5 h-5 stroke-[1.5]" />
            <span className="text-[10px] tracking-tight leading-none mt-1">Đơn hàng</span>
            {isOrders && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
            )}
          </button>

          {/* Tab 3: Sản phẩm */}
          <button
            type="button"
            onClick={() => handleNavigate("/admin/product")}
            className={cn(
              "flex-1 h-11 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer relative",
              isProducts ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ArchiveBoxIcon className="w-5 h-5 stroke-[1.5]" />
            <span className="text-[10px] tracking-tight leading-none mt-1">Sản phẩm</span>
            {isProducts && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
            )}
          </button>

          {/* Tab 4: Phân hệ (Dropdown Menu) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex-1 h-11 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer relative focus:outline-none",
                  isOtherModuleActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                )}
                title="Tất cả phân hệ CRM"
                aria-label="Tất cả phân hệ CRM"
              >
                <Squares2X2Icon className="w-5 h-5 stroke-[1.5]" />
                <span className="text-[10px] tracking-tight leading-none mt-1">Phân hệ ▾</span>
                {isOtherModuleActive && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="top"
              align="end"
              sideOffset={12}
              className="w-60 max-h-[68dvh] overflow-y-auto rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-elevation-4 p-2 custom-scrollbar space-y-2.5 font-sans z-50"
            >
              {dropdownGroups.map((group) => {
                const visibleItems = group.items.filter((item) => item.visible);
                if (visibleItems.length === 0) return null;

                return (
                  <div key={group.title} className="space-y-1">
                    <div className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.title}
                    </div>
                    {visibleItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname.startsWith(item.path);

                      return (
                        <DropdownMenuItem
                          key={item.path}
                          onClick={() => handleNavigate(item.path)}
                          className={cn(
                            "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary font-semibold"
                              : "hover:bg-surface-hover text-foreground"
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-4 h-4 shrink-0 stroke-[1.5]",
                              isActive ? "text-primary" : "text-muted-foreground"
                            )}
                          />
                          <span className="truncate">{item.label}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </div>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </>
  );
}

export default AdminMobileBottomBar;
