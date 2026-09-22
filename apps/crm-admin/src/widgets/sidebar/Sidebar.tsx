import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BanknotesIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  ArrowRightOnRectangleIcon,
  QueueListIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TagIcon,
  PhotoIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import { ThemeToggle } from "@my-project/ui";
import { useAuthUser } from "@entities/auth/hooks";
import { clientSideLogout } from "@my-project/shared-utils";
import usePermission from "@shared/hooks/usePermission";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { data: me } = useAuthUser();
  const { hasPermission, hasAnyPermission } = usePermission();

  // Determine if it's mobile drawer (onClose is passed in AdminLayout for mobile)
  const isMobile = Boolean(onClose);

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (isMobile) return false;
    const saved = localStorage.getItem("crm_sidebar_collapsed");
    return saved === "true";
  });

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("crm_sidebar_collapsed", String(isCollapsed));
    }
  }, [isCollapsed, isMobile]);

  const handleLogout = () => {
    clientSideLogout();
    onClose?.();
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    [
      "flex items-center rounded-button py-2.5 text-[13px] transition-all duration-300 ease-out group relative",
      isCollapsed ? "justify-center px-0 " : "justify-start px-4 ",
      isActive
        ? "bg-accent/10 text-accent font-bold before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:bg-accent before:rounded-r-full"
        : "text-muted hover:text-foreground hover:bg-foreground/[0.04]",
    ].join(" ");

  const userEmail = me?.email || "admin@ecommerce.com";
  const userName = me?.email ? me.email.split("@")[0] : "Admin User";
  const avatarInitials = userName.substring(0, 2).toUpperCase();

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      className={[
        "h-full flex flex-col admin-surface bg-card  pb-3 md:pb-3.5 select-none overflow-hidden transition-all duration-300 ease-out shadow-none",
        isCollapsed ? "w-[64px]" : "w-64",
      ].join(" ")}
    >
      {/* ── Header / Logo ── */}
      <div className={`flex py-3 md:py-3.5 ${isCollapsed ? "flex-col gap-3" : "w-full justify-between"}`}>
        <div className={`w-full flex items-center px-3  ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-card bg-background dark:bg-white/[0.03] text-foreground shrink-0 border border-neo-bevel shadow-none mt-0.5 sm:mt-0">
              <SparklesIcon className="w-4 h-4 text-foreground" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm tracking-tight text-foreground leading-none">
                  E-Commerce
                </span>
                <span className="text-[10px] text-muted font-mono mt-0.5 tracking-wider uppercase">
                  CRM Admin
                </span>
              </div>
            )}
          </div>
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className={`shrink-0 p-1.5 rounded-button text-muted hover:text-foreground hover:bg-foreground/[0.04] transition-colors ${
                isCollapsed ? "hidden" : ""
              }`}
              title="Thu nhỏ Sidebar"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
          )}
        </div>  

        {isCollapsed && !isMobile && (
          <div className="flex justify-center">
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-button text-muted hover:text-foreground hover:bg-foreground/[0.04] transition-colors"
              title="Mở rộng Sidebar"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* ── Navigation Menu ── */}
      <nav className={"flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar " + (isCollapsed ? "px-2" : " px-3")}>
        
        {/* Section: Tổng quan */}
        <div className="">
          {!isCollapsed && (
            <h5 className="text-[10px] uppercase tracking-widest text-muted font-bold mb-2 opacity-70">
              Tổng quan
            </h5>
          )}
          {isCollapsed && <div className="h-1 border-b border-foreground/30" />}
          <ul className="space-y-1 relative py-3">
            {hasPermission("Permissions.Dashboard.View") && (
              <li>
                <NavLink to="/admin/dashboard" end className={navItemClass} onClick={onClose} title={isCollapsed ? "Tổng quan" : undefined}>
                  <ChartBarIcon className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isCollapsed ? "" : "mr-3"}`} />
                  {!isCollapsed && <span className="truncate">Tổng quan</span>}
                </NavLink>
              </li>
            )}
          </ul>
        </div>

        {/* Section: Kinh doanh & Marketing */}
        {(hasPermission("Permissions.Orders.View") || hasPermission("Permissions.Promotions.View")) && (
          <div className="mt-1">
            {!isCollapsed && (
              <h5 className="text-[10px] uppercase tracking-widest text-muted font-bold mb-2 opacity-70">
                Kinh doanh & Marketing
              </h5>
            )}
            {isCollapsed && <div className="h-1 border-b border-foreground/30" />}
            <ul className="space-y-1 relative py-3">
              {hasPermission("Permissions.Orders.View") && (
                <li>
                  <NavLink to="/admin/orders" className={navItemClass} onClick={onClose} title={isCollapsed ? "Đơn hàng" : undefined}>
                    <BanknotesIcon className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isCollapsed ? "" : "mr-3"}`} />
                    {!isCollapsed && (
                      <div className="flex items-center justify-between flex-1">
                        <span className="truncate">Đơn hàng</span>
                        <span className="text-[10px] font-bold bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">
                          3
                        </span>
                      </div>
                    )}
                    {isCollapsed && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse border border-card" />
                    )}
                  </NavLink>
                </li>
              )}
              {hasPermission("Permissions.Promotions.View") && (
                <>
                  <li>
                    <NavLink to="/admin/promotion" className={navItemClass} onClick={onClose} title={isCollapsed ? "Khuyến mãi" : undefined}>
                      <TagIcon className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isCollapsed ? "" : "mr-3"}`} />
                      {!isCollapsed && <span className="truncate">Khuyến mãi</span>}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/collection" className={navItemClass} onClick={onClose} title={isCollapsed ? "Bộ sưu tập" : undefined}>
                      <ViewColumnsIcon className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isCollapsed ? "" : "mr-3"}`} />
                      {!isCollapsed && <span className="truncate">Bộ sưu tập</span>}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin/hero-slides" className={navItemClass} onClick={onClose} title={isCollapsed ? "Banner (Hero Slides)" : undefined}>
                      <PhotoIcon className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isCollapsed ? "" : "mr-3"}`} />
                      {!isCollapsed && <span className="truncate">Banner (Hero Slides)</span>}
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}

        {/* Section: Sản phẩm & Danh mục */}
        {hasPermission("Permissions.Products.View") && (
          <div className="mt-1">
            {!isCollapsed && (
              <h5 className="text-[10px] uppercase tracking-widest text-muted font-bold mb-2 opacity-70">
                Sản phẩm & Danh mục
              </h5>
            )}
            {isCollapsed && <div className="h-1 border-b border-foreground/30" />}
            <ul className="space-y-1 relative py-3">
              <li>
                <NavLink to="/admin/product" className={navItemClass} onClick={onClose} title={isCollapsed ? "Sản phẩm" : undefined}>
                  <ArchiveBoxIcon className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isCollapsed ? "" : "mr-3"}`} />
                  {!isCollapsed && <span className="truncate">Sản phẩm</span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/skus" className={navItemClass} onClick={onClose} title={isCollapsed ? "Quản lý SKU" : undefined}>
                  <QueueListIcon className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isCollapsed ? "" : "mr-3"}`} />
                  {!isCollapsed && <span className="truncate">Quản lý SKU</span>}
                </NavLink>
              </li>
              {hasAnyPermission(["Permissions.Products.View", "Permissions.Promotions.View"]) && (
                <li>
                  <NavLink to="/admin/catalog-settings" className={navItemClass} onClick={onClose} title={isCollapsed ? "Thiết lập Catalog" : undefined}>
                    <AdjustmentsHorizontalIcon className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isCollapsed ? "" : "mr-3"}`} />
                    {!isCollapsed && <span className="truncate">Thiết lập Catalog</span>}
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Section: Quản trị hệ thống */}
        {hasAnyPermission(["Permissions.Users.View", "Permissions.Roles.View"]) && (
          <div className="mt-1">
            {!isCollapsed && (
              <h5 className="text-[10px] uppercase tracking-widest text-muted font-bold mb-2 opacity-70">
                Quản trị hệ thống
              </h5>
            )}
            {isCollapsed && <div className="h-1 border-b border-foreground/30" />}
            <ul className="space-y-1 relative py-3">
              {hasPermission("Permissions.Users.View") && (
                <li>
                  <NavLink to="/admin/listUsers" className={navItemClass} onClick={onClose} title={isCollapsed ? "Người dùng" : undefined}>
                    <UserGroupIcon className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isCollapsed ? "" : "mr-3"}`} />
                    {!isCollapsed && <span className="truncate">Người dùng</span>}
                  </NavLink>
                </li>
              )}
              {hasPermission("Permissions.Roles.View") && (
                <li>
                  <NavLink to="/admin/security" className={navItemClass} onClick={onClose} title={isCollapsed ? "Bảo mật & Vai trò" : undefined}>
                    <ShieldCheckIcon className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isCollapsed ? "" : "mr-3"}`} />
                    {!isCollapsed && <span className="truncate">Bảo mật & Vai trò</span>}
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>

      {/* ── Footer Actions ── */}
      <div className="mt-auto">
                         {/* Settings & Logout */}
        <div className={`flex ${isCollapsed ? "flex-col items-center space-y-3" : "items-center justify-between p-3"}`}>
          {!isCollapsed && <span className="text-xs text-muted font-medium ml-1">Chế độ tối</span>}
          <div title={isCollapsed ? "Chuyển chế độ tối" : undefined}>
            <ThemeToggle />
          </div>
        </div>
        <div className="pt-4 px-3  border-t border-foreground/30 ">
          {/* User Profile Footer */}
          <div className={`flex items-center gap-3 p-2 rounded-card border border-foreground/30  bg-foreground/[0.02] ${isCollapsed ? "justify-center " : ""}`}>
            <div className="p-2 rounded-full bg-background dark:bg-white/[0.03] text-foreground shrink-0 border border-neo-bevel shadow-none mt-0.5 sm:mt-0">
              {avatarInitials}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-foreground truncate">{userName}</h4>
                <p className="text-[10px] text-muted truncate">{userEmail}</p>
              </div>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className={`flex items-center text-[13px] font-medium transition-colors duration-200 w-full group ${
              isCollapsed 
                ? "justify-center p-2 rounded-button text-muted-foreground hover:text-red-500 hover:bg-red-500/10" 
                : "gap-2.5 rounded-button px-3 py-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
            }`}
            title={isCollapsed ? "Đăng xuất" : undefined}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            {!isCollapsed && <span>Đăng xuất</span>}
          </button>

        </div>
      </div>
    </div>
  );
}
