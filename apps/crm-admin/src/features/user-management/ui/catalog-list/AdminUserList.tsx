import { useState, useMemo } from "react";
import { useAdminUserList } from "@entities/user/admin/hooks";
import type { UserAdminRes } from "@entities/user/admin/types";
import { Button, Input } from "@my-project/ui";
import {
  MagnifyingGlassIcon,
  UsersIcon,
  InboxIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/24/outline";
import { AdminPageShell, AdminTable, AdminPagination, type AdminTableColumn } from "@shared/ui";
import usePermission from "@shared/hooks/usePermission";
import { RoleAssignModal } from "../user-detail/RoleAssignModal";

const PAGE_SIZE = 20;

const formatDate = (iso: string) => {
  if (!iso) return "—";
  const date = new Date(iso);
  if (date.getFullYear() <= 1) return "—";
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const ROLE_STYLES: Record<string, string> = {
  Admin:   "bg-red-500/10 text-red-500",
  Manager: "bg-amber-500/10 text-amber-500",
};
const roleClass = (r: string) => ROLE_STYLES[r] ?? "bg-primary/10 text-primary";


export function AdminUserList() {
  const { hasPermission } = usePermission();

  const [page, setPage]   = useState(1);
  const [search, setSearch] = useState("");

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; roles: string[] } | null>(null);

  const { data, isLoading } = useAdminUserList({ page, size: PAGE_SIZE, search });

  const items      = data?.items ?? [];
  const total      = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleOpenAssign = (u: { id: string; roles: string[] }) => {
    setSelectedUser(u);
    setAssignModalOpen(true);
  };

  const columns = useMemo<AdminTableColumn<UserAdminRes>[]>(() => {
    const cols: AdminTableColumn<UserAdminRes>[] = [
      {
        key: "info",
        label: "Thông tin",
        isMain: true,
        render: (u) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-muted shrink-0 flex items-center justify-center overflow-hidden">
              {u.avatarUrl ? (
                <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-muted-foreground">
                  {u.email?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className={`font-medium truncate max-w-[160px] ${u.fullName ? "text-foreground" : "text-muted-foreground italic"}`}>
                {u.fullName || "Chưa đặt tên"}
              </p>
              <p className="text-xs text-muted-foreground font-mono truncate max-w-[160px]">{u.email}</p>
            </div>
          </div>
        ),
      },
      {
        key: "phone",
        label: "Liên hệ",
        render: (u) => (
          <span className="text-xs text-muted-foreground font-mono">
            {u.phone || <span className="text-foreground/20">—</span>}
          </span>
        ),
      },
      {
        key: "roles",
        label: "Vai trò",
        render: (u) => (
          <div className="flex flex-wrap gap-1">
            {u.roles.length > 0 ? (
              u.roles.map((r) => (
                <span
                  key={r}
                  className={`px-2 py-0.5 rounded-inner text-[10px] font-bold uppercase tracking-wider ${roleClass(r)}`}
                >
                  {r}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-inner uppercase tracking-wider">
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
        render: (u) =>
          u.isLocked ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
              <LockClosedIcon className="w-3 h-3" /> Khoá
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium">
              <LockOpenIcon className="w-3 h-3" /> Hoạt động
            </span>
          ),
      },
      {
        key: "createdAt",
        label: "Ngày tham gia",
        align: "right",
        minWidth: "120px",
        render: (u) => (
          <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
            {formatDate(u.createdAt)}
          </span>
        ),
      },
    ];

    if (hasPermission("Permissions.Users.ManageRoles")) {
      cols.push({
        key: "actions",
        label: "Phân quyền",
        align: "center",
        minWidth: "80px",
        sticky: "right",
        render: (u) => (
          <div className="flex items-center justify-center">
            <div className="flex items-center bg-background rounded-card">
              <Button
                size="sm"
                variant="ghost"
                title="Phân quyền"
                onClick={() => handleOpenAssign({ id: u.id, roles: u.roles })}
              >
                <ShieldCheckIcon className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </div>
          </div>
        ),
      });
    }

    return cols;
  }, [hasPermission]);

  return (
    <>
      <AdminPageShell
        icon={UsersIcon}
        title="Quản lý người dùng"
        badge={`${total} tài khoản`}
        actions={
          <div className="relative group w-full sm:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm kiếm người dùng..."
              className="pl-9 pr-12 w-full"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none select-none">
              <kbd className="opacity-60 text-[9px] px-1 py-0.5">S</kbd>
            </div>
          </div>
        }
        noCard
      >
        <AdminTable<UserAdminRes>
          columns={columns}
          data={items}
          isLoading={isLoading}
          skeletonRows={PAGE_SIZE}
          emptyIcon={InboxIcon}
          emptyTitle="Không tìm thấy người dùng nào"
          emptyDescription="Thử từ khoá tìm kiếm khác"
          footer={
            <AdminPagination
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          }
        />
      </AdminPageShell>

      {assignModalOpen && selectedUser && (
        <RoleAssignModal
          userId={selectedUser.id}
          currentRoles={selectedUser.roles}
          isOpen={assignModalOpen}
          onClose={() => {
            setAssignModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </>
  );
}


