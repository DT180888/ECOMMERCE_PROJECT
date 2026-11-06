import { useNavigate } from "react-router-dom";
import { useAuthUser, useLogout } from "@hooks/useAuth";
import {
  ThemeToggle,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Badge,
} from "@my-project/ui";
import {
  SparklesIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export function AdminMobileHeader() {
  const { data: me } = useAuthUser();
  const logoutMut = useLogout();
  const navigate = useNavigate();

  const userEmail = me?.email || "admin@ecommerce.com";
  const userName = me?.email ? me.email.split("@")[0] : "Admin";
  const avatarInitials = userName.substring(0, 2).toUpperCase();

  return (
    <header
      aria-label="Thanh điều hướng di động"
      className="md:hidden relative z-10 w-full flex items-center justify-between select-none h-14 px-4 transition-colors bg-surface border-b border-border shadow-none font-sans"
    >
      {/* ── Cụm trái: Logo nhận diện thương hiệu ── */}
      <div
        onClick={() => navigate("/admin/dashboard")}
        className="flex items-center gap-2.5 min-w-0 cursor-pointer active:opacity-80 transition-opacity"
      >
        <div className="w-7 h-7 rounded-sm bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-none">
          <SparklesIcon className="w-3.5 h-3.5 stroke-[2]" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold tracking-tight text-foreground leading-none truncate">
            Studio CRM
          </span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5 truncate">
            {userName}
          </span>
        </div>
      </div>

      {/* ── Cụm phải: Bộ chuyển theme & Avatar Profile Dropdown ── */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="h-8 w-8 rounded-sm border border-border bg-card shadow-none flex items-center justify-center">
          <ThemeToggle className="h-full w-full p-0 flex items-center justify-center border-0 shadow-none text-muted-foreground hover:text-foreground bg-transparent" />
        </div>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-8 h-8 rounded-sm bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0 active:scale-95 transition-transform cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40 shadow-none"
              title={`${userName} (${userEmail})`}
              aria-label="Tài khoản cá nhân"
            >
              {avatarInitials}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="bottom"
            align="end"
            sideOffset={8}
            className="w-64 bg-card border border-border rounded-sm shadow-md p-1.5 font-sans z-50 space-y-1"
          >
            {/* User Identity Header */}
            <div className="p-3 bg-surface/70 rounded-lg border border-border/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                {avatarInitials}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-foreground truncate">{userName}</span>
                  <Badge variant="primary" className="text-[9px] px-1.5 py-0 font-medium rounded-sm">
                    Admin
                  </Badge>
                </div>
                <span className="text-[11px] text-muted-foreground truncate">{userEmail}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <DropdownMenuItem
              onClick={() => navigate("/admin/users")}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer hover:bg-surface-hover text-foreground"
            >
              <UserIcon className="w-4 h-4 text-muted-foreground stroke-[1.5]" />
              <span>Hồ sơ người dùng</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => navigate("/admin/security")}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer hover:bg-surface-hover text-foreground"
            >
              <ShieldCheckIcon className="w-4 h-4 text-muted-foreground stroke-[1.5]" />
              <span>Bảo mật & Phân quyền</span>
            </DropdownMenuItem>

            {/* Logout */}
            <div className="pt-1 border-t border-border/80">
              <DropdownMenuItem
                onClick={() => logoutMut.mutate()}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs cursor-pointer text-error hover:bg-error/10 font-medium"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 stroke-[1.5]" />
                <span>Đăng xuất tài khoản</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default AdminMobileHeader;
