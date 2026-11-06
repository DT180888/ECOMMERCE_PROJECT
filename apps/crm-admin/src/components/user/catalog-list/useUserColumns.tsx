import { useMemo } from "react";
import type { AdminTableColumn } from "@shared/ui";
import type { UserAdminRes } from "@my-project/api";
import { Button, cn } from "@my-project/ui";
import { ShieldCheckIcon, IdentificationIcon } from "@heroicons/react/24/outline";
import { AdminStatusBadge } from "@components/common/AdminStatusBadge";

interface UseUserColumnsProps {
  hasManageRoles: boolean;
  onOpenAssign: (u: { id: string; roles: string[] }) => void;
  onOpen360?: (userId: string) => void;
}

const formatDate = (iso: string) => {
  if (!iso) return "—";
  const date = new Date(iso);
  if (date.getFullYear() <= 1) return "—";
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function useUserColumns({
  hasManageRoles,
  onOpenAssign,
  onOpen360,
}: UseUserColumnsProps) {
  return useMemo<AdminTableColumn<UserAdminRes>[]>(() => {
    const cols: AdminTableColumn<UserAdminRes>[] = [
      {
        key: "avatar",
        label: "Avatar",
        width: "52px",
        minWidth: "52px",
        align: "center",
        isMedia: true,
        mediaAspect: "square",
        render: (u) => (
          <div
            onClick={() => onOpen360?.(u.id)}
            className="w-full rounded-full bg-surface border border-border/80 shrink-0 flex items-center justify-center overflow-hidden mx-auto cursor-pointer hover:border-foreground/60 transition-colors"
          >
            {u.avatarUrl ? (
              <img
                src={u.avatarUrl}
                alt={u.fullName || u.email}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-mono font-medium text-muted-foreground">
                {u.email?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "fullName",
        label: "Họ và tên",
        isMain: true,
        minWidth: "150px",
        render: (u) => (
          <span
            onClick={() => onOpen360?.(u.id)}
            className={cn(
              "font-medium text-xs truncate block max-w-[180px] cursor-pointer hover:underline",
              u.fullName ? "text-foreground" : "text-muted-foreground italic"
            )}
          >
            {u.fullName || "Chưa đặt tên"}
          </span>
        ),
      },
      {
        key: "email",
        label: "Email",
        isSub: true,
        minWidth: "180px",
        render: (u) => (
          <span className="text-xs text-muted-foreground font-mono tabular-nums">
            {u.email || <span className="text-foreground/20">—</span>}
          </span>
        ),
      },
      {
        key: "phone",
        label: "Liên hệ",
        minWidth: "120px",
        render: (u) => (
          <span className="text-xs text-muted-foreground font-mono tabular-nums">
            {u.phone || <span className="text-foreground/20">—</span>}
          </span>
        ),
      },
      {
        key: "roles",
        label: "Vai trò",
        minWidth: "120px",
        isMediaSub: true,
        render: (u) => (
          <div className="flex flex-wrap items-center justify-center gap-1">
            {u.roles.length > 0 ? (
              u.roles.map((r) => (
                <span
                  key={r}
                  className="px-1.5 py-0.5 rounded-[2px] bg-surface border border-border/70 text-foreground text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-center"
                >
                  {r}
                </span>
              ))
            ) : (
              <span className="text-[9px] sm:text-[10px] text-muted-foreground px-1.5 py-0.5 rounded-[2px] bg-surface border border-border/70 font-mono uppercase tracking-wider text-center">
                User
              </span>
            )}
          </div>
        ),
      },
      {
        key: "isLocked",
        label: "Trạng thái",
        align: "center",
        minWidth: "110px",
        isFooter: true,
        render: (u) => (
          <AdminStatusBadge variant={u.isLocked ? "error" : "success"}>
            {u.isLocked ? "Khóa" : "Hoạt động"}
          </AdminStatusBadge>
        ),
      },
      {
        key: "createdAt",
        label: "Ngày tham gia",
        align: "right",
        minWidth: "120px",
        render: (u) => (
          <span className="text-xs text-muted-foreground font-mono tabular-nums whitespace-nowrap">
            {formatDate(u.createdAt)}
          </span>
        ),
      },
    ];

    cols.push({
      key: "actions",
      label: "Hành động",
      align: "center",
      minWidth: "90px",
      sticky: "right",
      isAction: true,
      render: (u) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            size="icon-sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded-[2px]"
            title="Chân dung 360°"
            onClick={(e) => {
              e.stopPropagation();
              onOpen360?.(u.id);
            }}
          >
            <IdentificationIcon className="w-3.5 h-3.5 stroke-[1.25]" />
          </Button>

          {hasManageRoles && (
            <Button
              size="icon-sm"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded-[2px]"
              title="Phân quyền"
              onClick={(e) => {
                e.stopPropagation();
                onOpenAssign({ id: u.id, roles: u.roles });
              }}
            >
              <ShieldCheckIcon className="w-3.5 h-3.5 stroke-[1.25]" />
            </Button>
          )}
        </div>
      ),
    });

    return cols;
  }, [hasManageRoles, onOpenAssign, onOpen360]);
}

