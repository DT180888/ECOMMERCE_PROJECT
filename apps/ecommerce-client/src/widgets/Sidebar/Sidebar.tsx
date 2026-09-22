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
} from "@heroicons/react/24/outline";
import { ThemeToggle } from "@my-project/ui";
import { useAuthUser } from "@entities/auth/hooks";
import { clientSideLogout } from "@my-project/shared-utils";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { data: me } = useAuthUser();

  const handleLogout = () => {
    clientSideLogout();
    onClose?.();
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    [
      "flex items-center justify-between rounded-button px-3 py-2 text-sm font-medium transition-all duration-200 ease-out border border-transparent",
      isActive
        ? "bg-surface text-foreground shadow-neo-sm border-foreground/15 font-semibold"
        : "text-muted hover:text-foreground hover:border-foreground/15 hover:bg-surface-hover hover:shadow-neo-sm hover:-translate-y-[0.5px]",
    ].join(" ");

  const userEmail = me?.email || "admin@ecommerce.com";
  const userName = me?.email ? me.email.split("@")[0] : "Admin User";
  const avatarInitials = userName.substring(0, 2).toUpperCase();

  return (
    <div className="w-64 h-full flex flex-col admin-surface bg-card p-4 md:p-6 select-none overflow-hidden">
      {/* ── Header / Logo ── */}
      <div className="flex items-center gap-3 px-2 py-3 mb-5 border-b border-border/10">
        <div className="w-7 h-7 bg-primary rounded-button flex items-center justify-center shadow-neo-sm">
          <SparklesIcon className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="font-display font-bold text-sm tracking-tight text-foreground leading-none">
            E-Commerce
          </span>
          <span className="text-[10px] text-muted font-mono mt-0.5 tracking-wider uppercase">
            CRM Admin
          </span>
        </div>
      </div>

      {/* ── User Profile Box ── */}
      <div className="flex items-center gap-3 mb-6 p-2.5 rounded-card bg-surface/50 border border-foreground/5">
        <div className="w-9 h-9 rounded-full bg-surface shadow-neo-sm border border-foreground/5 flex items-center justify-center text-xs font-bold text-foreground shrink-0">
          {avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-foreground truncate">
            {userName}
          </h4>
          <p className="text-[10px] text-muted truncate">
            {userEmail}
          </p>
        </div>
      </div>

      {/* ── Navigation Menu ── */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-6">
        {/* Section: Management */}
        <div className="space-y-1.5">
          <h5 className="text-[10px] uppercase tracking-widest text-muted font-bold px-3 mb-2">
            Management
          </h5>
          <ul className="space-y-1">
            <li>
              <NavLink to="/admin/dashboard" end className={navItemClass} onClick={onClose}>
                <div className="flex items-center gap-2.5">
                  <ChartBarIcon className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Tổng quan</span>
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/product" className={navItemClass} onClick={onClose}>
                <div className="flex items-center gap-2.5">
                  <ArchiveBoxIcon className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Sản phẩm</span>
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/catalog-settings" className={navItemClass} onClick={onClose}>
                <div className="flex items-center gap-2.5">
                  <AdjustmentsHorizontalIcon className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Thiết lập Catalog</span>
                </div>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Section: Status */}
        <div className="space-y-1.5">
          <h5 className="text-[10px] uppercase tracking-widest text-muted font-bold px-3 mb-2">
            Status
          </h5>
          <ul className="space-y-1">
            <li>
              <NavLink to="/admin/orders" className={navItemClass} onClick={onClose}>
                <div className="flex items-center gap-2.5">
                  <BanknotesIcon className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Đơn hàng</span>
                </div>
                <span className="text-[9px] font-bold bg-[#E1F3FE] dark:bg-[#1F6C9F]/20 text-[#1F6C9F] dark:text-[#E1F3FE] px-1.5 py-0.5 rounded-full border border-[#1F6C9F]/10">
                  3
                </span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Section: History & Access */}
        <div className="space-y-1.5">
          <h5 className="text-[10px] uppercase tracking-widest text-muted font-bold px-3 mb-2">
            History & Access
          </h5>
          <ul className="space-y-1">
            <li>
              <NavLink to="/admin/ListUsers" className={navItemClass} onClick={onClose}>
                <div className="flex items-center gap-2.5">
                  <UserGroupIcon className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Người dùng</span>
                </div>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      {/* ── Footer Actions ── */}
      <div className="pt-4 mt-auto border-t border-foreground/[0.09] dark:border-white/[0.05] space-y-3 ">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs text-muted font-medium">Chế độ tối</span>
          <ThemeToggle />
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 rounded-button px-3 py-2 text-sm font-medium text-muted hover:text-error hover:bg-error/5 hover:border-error/10 border border-foreground/10 bg-foreground/5 transition-all duration-200"
        >
          <ArrowRightOnRectangleIcon className="w-3 h-3 md:w-4 md:h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
