import { useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  SparklesIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  cn,
} from "@my-project/ui";
import usePermission from "@hooks/usePermission";
import { useLayoutMode } from "@app/layouts/LayoutContext";
import { SystemIsland } from "./SystemIsland";
import { AdminBreadcrumb } from "./AdminBreadcrumb";

/**
 * AdminHeader Component
 * Linear Modern Editorial Design System Specification
 * - Height: h-14 (56px)
 * - Single-Edge Axis: 1px bottom border, zero shadow, backdrop blur
 * - Smart Context: Auto-hidden breadcrumb on root, visible on deep routes
 */
export function AdminHeader() {
  const { layoutMode } = useLayoutMode();
  const isTopbarMode = layoutMode === "topbar";
  const { hasPermission } = usePermission();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[placeholder*="Tìm kiếm"]'
        );
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        } else {
          navigate("/admin/product");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const navItemClass = (path: string) => {
    const isActive = location.pathname.startsWith(path);
    return cn(
      "px-3 py-1.5 text-[13px] font-sans transition-all rounded-sm flex items-center gap-1.5 cursor-pointer select-none",
      isActive
        ? "bg-primary/10 text-primary font-medium"
        : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
    );
  };

  return (
    <header
      className="hidden md:flex sticky top-0 h-14 items-center px-4 md:px-6 justify-between gap-4 w-full shrink-0 z-30 select-none font-sans bg-surface/50 backdrop-blur-md border-b border-border shadow-none"
    >
      {/* ── Left Cluster: Logo (Topbar Mode only) OR Smart Context Breadcrumb ── */}
      <div className="flex items-center gap-4 min-w-0 flex-1 md:flex-initial">
        {isTopbarMode ? (
          <>
            {/* Brand Logo in Topbar Mode */}
            <div
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center gap-2.5 cursor-pointer shrink-0 mr-2"
              title="Về bảng điều khiển"
            >
              <div className="w-8 h-8 rounded-sm bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-none">
                <SparklesIcon className="w-4 h-4 stroke-[1.75]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-sans font-bold text-sm tracking-tight text-foreground leading-none">
                  Studio CRM
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                  Admin Workspace
                </span>
              </div>
            </div>

            {/* Horizontal Nav Bar */}
            <nav className="hidden md:flex items-center gap-1">
              {/* Dashboard */}
              {hasPermission("Permissions.Dashboard.View") && (
                <NavLink to="/admin/dashboard" className={navItemClass("/admin/dashboard")}>
                  Tổng quan
                </NavLink>
              )}

              {/* Business Dropdown */}
              {(hasPermission("Permissions.Orders.View") ||
                hasPermission("Permissions.Promotions.View") ||
                hasPermission("Permissions.Crm.ViewAbandonedCarts") ||
                hasPermission("Permissions.Crm.ModerateReviews")) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className={navItemClass("/admin/orders")}>
                      <span>Kinh doanh</span>
                      <ChevronDownIcon className="w-3.5 h-3.5 opacity-70 stroke-[1.5]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-52"
                  >
                    {hasPermission("Permissions.Orders.View") && (
                      <DropdownMenuItem
                        onClick={() => navigate("/admin/orders")}
                      >
                        Đơn hàng
                      </DropdownMenuItem>
                    )}
                    {(hasPermission("Permissions.Crm.ViewAbandonedCarts") ||
                      hasPermission("Permissions.Orders.View")) && (
                      <DropdownMenuItem
                        onClick={() => navigate("/admin/abandoned-carts")}
                      >
                        Giỏ hàng bỏ quên
                      </DropdownMenuItem>
                    )}
                    {(hasPermission("Permissions.Crm.ModerateReviews") ||
                      hasPermission("Permissions.Products.View")) && (
                      <DropdownMenuItem
                        onClick={() => navigate("/admin/reviews")}
                      >
                        Đánh giá sản phẩm
                      </DropdownMenuItem>
                    )}
                    {hasPermission("Permissions.Users.View") && (
                      <DropdownMenuItem
                        onClick={() => navigate("/admin/customers/rfm-segments")}
                      >
                        Phân cụm RFM
                      </DropdownMenuItem>
                    )}
                    {hasPermission("Permissions.Users.View") && (
                      <DropdownMenuItem
                        onClick={() => navigate("/admin/automation/triggers")}
                      >
                        Tiếp thị tự động
                      </DropdownMenuItem>
                    )}
                    {hasPermission("Permissions.Promotions.View") && (
                      <>
                        <DropdownMenuItem
                          onClick={() => navigate("/admin/promotion")}
                        >
                          Khuyến mãi & Mã giảm giá
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate("/admin/collection")}
                        >
                          Bộ sưu tập
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate("/admin/hero-slides")}
                        >
                          Banner Slides
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Products Dropdown */}
              {hasPermission("Permissions.Products.View") && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className={navItemClass("/admin/product")}>
                      <span>Sản phẩm</span>
                      <ChevronDownIcon className="w-3.5 h-3.5 opacity-70 stroke-[1.5]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-52"
                  >
                    <DropdownMenuItem
                      onClick={() => navigate("/admin/product")}
                    >
                      Danh sách Sản phẩm
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/admin/skus")}
                    >
                      Quản lý biến thể SKU
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/admin/category")}
                    >
                      Danh mục sản phẩm
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/admin/brand")}
                    >
                      Thương hiệu
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/admin/attribute")}
                    >
                      Thuộc tính sản phẩm
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* System Dropdown */}
              {(hasPermission("Permissions.Users.View") || hasPermission("Permissions.Roles.View")) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className={navItemClass("/admin/user")}>
                      <span>Hệ thống</span>
                      <ChevronDownIcon className="w-3.5 h-3.5 opacity-70 stroke-[1.5]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-52"
                  >
                    {hasPermission("Permissions.Users.View") && (
                      <DropdownMenuItem
                        onClick={() => navigate("/admin/users")}
                      >
                        Người dùng & Phân quyền
                      </DropdownMenuItem>
                    )}
                    {hasPermission("Permissions.Roles.View") && (
                      <DropdownMenuItem
                        onClick={() => navigate("/admin/security")}
                      >
                        Bảo mật & Vai trò
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>
          </>
        ) : (
          <AdminBreadcrumb />
        )}
      </div>

      {/* ── Center Cluster: Global Command Palette Quick Trigger ── */}
      <div className="hidden md:flex items-center justify-center flex-1 max-w-sm lg:max-w-lg ">
        <button
          type="button"
          onClick={() => {
            const searchInput = document.querySelector<HTMLInputElement>(
              'input[placeholder*="Tìm kiếm"]'
            );
            if (searchInput) {
              searchInput.focus();
              searchInput.select();
            } else {
              navigate("/admin/product");
            }
          }}
          className="w-full h-[34px] px-3.5 rounded-sm transition-all flex items-center justify-between text-[13px] select-none group border border-border bg-card/60 shadow-none hover:bg-surface-hover hover:border-primary/50 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40"
          title="Tìm kiếm nhanh toàn hệ thống (Ctrl + K / ⌘K)"
          aria-label="Tìm kiếm nhanh toàn hệ thống"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <MagnifyingGlassIcon className="w-4 h-4 stroke-[1.75] text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            <span className="text-[13px] font-normal text-muted-foreground group-hover:text-foreground truncate font-sans">
              Tìm kiếm nhanh toàn hệ thống...
            </span>
          </div>
          <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono rounded-sm bg-surface border border-border-subtle text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* ── Right Cluster: Unified SystemIsland Capsule ── */}
      <SystemIsland />
    </header>
  );
}

export default AdminHeader;
