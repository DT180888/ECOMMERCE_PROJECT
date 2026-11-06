import {
  RectangleGroupIcon,
  ViewColumnsIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  ChevronDownIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import {
  ThemeToggle,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  cn,
} from "@my-project/ui";
import { useAuthUser } from "@hooks/useAuth";
import { clientSideLogout } from "@my-project/shared-utils";
import { useLayoutMode } from "@app/layouts/LayoutContext";

interface SystemIslandProps {
  variant?: "pill" | "floating" | "inline";
  className?: string;
  isFrameless?: boolean;
}

/**
 * SystemIsland Component
 * Fluent Blue Design System Specification
 * - Control heights: 34px standard
 * - Geometry: 6px radius for buttons, rounded-full for Profile Pill
 * - Elevation: Level 1 for base capsule, Level 3 for dropdown menu
 */
export function SystemIsland({
  className,
}: SystemIslandProps) {
  const { data: me } = useAuthUser();
  const { layoutMode, toggleLayoutMode } = useLayoutMode();

  const handleLogout = () => {
    clientSideLogout();
  };

  const userEmail = me?.email || "admin@ecommerce.com";
  const userName = me?.email ? me.email.split("@")[0] : "Admin User";
  const avatarInitials = userName.substring(0, 2).toUpperCase();

  const isTopbarMode = layoutMode === "topbar";
  const LayoutIcon = isTopbarMode ? ViewColumnsIcon : RectangleGroupIcon;
  const layoutToggleTitle = isTopbarMode
    ? "Chuyển sang Bố cục Cột (Sidebar)"
    : "Chuyển sang Bố cục Hàng (Topbar)";
  const layoutToggleLabel = isTopbarMode
    ? "Bố cục Cột (Sidebar)"
    : "Bố cục Hàng (Topbar)";

  return (
    <aside
      aria-label="Cụm điều khiển hệ thống"
      className={cn("flex items-center gap-2 shrink-0 select-none font-sans", className)}
    >
      {/* ── Action Buttons Cluster (34px standard control height) ── */}
      <div className="flex items-center gap-1.5">
        {/* Toggle layout mode */}
        <button
          type="button"
          onClick={toggleLayoutMode}
          className="h-[34px] w-[34px] rounded-md border border-border bg-card shadow-sm hover:border-primary/50 hover:bg-surface-hover text-muted-foreground hover:text-foreground flex items-center justify-center transition-all cursor-pointer"
          title={layoutToggleTitle}
          aria-label={layoutToggleTitle}
        >
          <LayoutIcon className="w-4 h-4 stroke-[1.5]" />
        </button>

        {/* Theme Toggle Button */}
        <div
          title="Chế độ giao diện (Sáng / Tối)"
          className="h-[34px] w-[34px] rounded-md border border-border bg-card shadow-sm hover:border-primary/50 hover:bg-surface-hover text-muted-foreground hover:text-foreground flex items-center justify-center transition-all"
        >
          <ThemeToggle className="h-full w-full p-0 flex items-center justify-center border-0 shadow-none text-muted-foreground hover:text-foreground bg-transparent hover:bg-transparent" />
        </div>
      </div>

      <div className="w-px h-5 bg-border mx-0.5 hidden sm:block" aria-hidden="true" />

      {/* ── User Profile Pill Capsule ── */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="h-[34px] pl-1.5 pr-2.5 rounded-md border border-border bg-card shadow-sm hover:border-primary/50 hover:bg-surface-hover flex items-center gap-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
            title={`${userName} (${userEmail})`}
          >
            {/* Circular Avatar with Brand Blue Background */}
            <div className="w-6 h-6 rounded-sm bg-primary text-primary-foreground font-semibold text-[11px] flex items-center justify-center shadow-sm shrink-0">
              {avatarInitials}
            </div>

            {/* User Name & Chevron */}
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-xs font-semibold text-foreground truncate max-w-[100px]">
                {userName}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium mt-0.5">
                Quản trị viên
              </span>
            </div>

            <ChevronDownIcon className="w-3 h-3 text-muted-foreground stroke-[2] shrink-0 ml-0.5" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-60 p-2 font-sans"
        >
          {/* User Info Header Card */}
          <div className="p-3 bg-background rounded-md mb-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                {avatarInitials}
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-[13px] font-semibold text-foreground truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1 text-primary font-medium">
                <ShieldCheckIcon className="w-3.5 h-3.5 stroke-[2]" />
                Super Admin
              </span>
              <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold text-[10px]">
                CRM Pro
              </span>
            </div>
          </div>

          <DropdownMenuItem
            onClick={toggleLayoutMode}
            className="flex items-center gap-2 py-2 cursor-pointer text-xs"
          >
            <LayoutIcon className="w-4 h-4 stroke-[1.5] text-muted-foreground" />
            <div className="flex flex-col">
              <span className="font-medium text-foreground">Chuyển sang {layoutToggleLabel}</span>
              <span className="text-[10px] text-muted-foreground">Thay đổi thanh điều hướng</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2 py-2 text-error hover:text-error hover:bg-error/10 cursor-pointer text-xs font-medium"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 stroke-[1.5]" />
            <span>Đăng xuất tài khoản</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  );
}

export default SystemIsland;
