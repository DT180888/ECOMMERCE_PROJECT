import { cn } from "@my-project/ui";

export interface ActiveAdminUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  currentActivity?: string;
  isCurrentUser?: boolean;
}

/**
 * Temporary mock active admin sessions while Backend is developing presence/socket service.
 */
const MOCK_ACTIVE_ADMINS: ActiveAdminUser[] = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@ecommerce.com",
    initials: "AU",
    role: "Super Admin",
    currentActivity: "Đang xem Tổng quan",
    isCurrentUser: true,
  },
  {
    id: "admin-2",
    name: "Minh Quân",
    email: "quan.nguyen@ecommerce.com",
    initials: "MQ",
    role: "Kho vận",
    currentActivity: "Kiểm kê SKU",
  },
  {
    id: "admin-3",
    name: "Khánh Vy",
    email: "vy.tran@ecommerce.com",
    initials: "KV",
    role: "Đơn hàng",
    currentActivity: "Xử lý đơn #1084",
  },
  {
    id: "admin-4",
    name: "Hoàng Long",
    email: "long.le@ecommerce.com",
    initials: "HL",
    role: "Marketing",
    currentActivity: "Tạo banner",
  },
];

interface SidebarActiveAdminsProps {
  isCollapsed: boolean;
}

export function SidebarActiveAdmins({ isCollapsed }: SidebarActiveAdminsProps) {
  if (isCollapsed) {
    return (
      /* ── Collapsed Compact Vertical Presence (w-11) ── */
      <div
        aria-label="Quản trị viên trực tuyến"
        className="bg-transparent flex flex-col items-center py-1 gap-1 select-none max-h-24 overflow-y-auto custom-scrollbar"
      >
        <span
          className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse my-0.5 shrink-0"
          title={`Trực tuyến: ${MOCK_ACTIVE_ADMINS.length} quản trị viên`}
        />
        {MOCK_ACTIVE_ADMINS.map((u) => (
          <div
            key={u.id}
            className="relative group cursor-default shrink-0"
            title={`${u.name} • ${u.role} (${u.currentActivity || "Online"})`}
          >
            <div className="w-5 h-5 rounded-[2px] bg-foreground/[0.08] text-foreground border border-border/60 flex items-center justify-center text-[8px] font-mono font-medium">
              {u.initials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-surface" />
          </div>
        ))}
      </div>
    );
  }

  return (
    /* ── Expanded Inline Presence Stream (w-44) ── */
    <div
      aria-label="Quản trị viên trực tuyến"
      className="bg-transparent flex flex-col select-none py-1"
    >
      {/* Group Header */}
      <div className="px-2 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground/80 font-medium truncate font-mono">
            Trực tuyến ({MOCK_ACTIVE_ADMINS.length})
          </span>
        </div>
        <span className="text-[8px] uppercase font-mono text-muted-foreground/60 tracking-wider">
          LIVE
        </span>
      </div>

      {/* Inline Member List */}
      <div className="px-1 space-y-0.5 max-h-36 overflow-y-auto custom-scrollbar">
        {MOCK_ACTIVE_ADMINS.map((u) => (
          <div
            key={u.id}
            className="flex items-center gap-2 px-1.5 py-1 rounded-[2px] hover:bg-foreground/[0.04] transition-colors group cursor-default"
            title={`${u.name} (${u.email}) • ${u.role} - ${u.currentActivity || "Online"}`}
          >
            <div className="relative shrink-0">
              <div className="w-5 h-5 rounded-[2px] bg-foreground/[0.08] text-foreground border border-border/60 flex items-center justify-center text-[8px] font-mono font-medium">
                {u.initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-surface" />
            </div>

            <div className="flex flex-col min-w-0 flex-1 leading-tight">
              <span className="text-[11px] font-medium text-foreground truncate font-sans">
                {u.name}
                {u.isCurrentUser && (
                  <span className="text-[8px] text-muted-foreground/70 font-mono ml-1">
                    (Bạn)
                  </span>
                )}
              </span>
              <span className="text-[9px] text-muted-foreground truncate font-mono">
                {u.currentActivity || u.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
