import { InboxIcon, ShieldCheckIcon, LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import { AdminTable, AdminTableColumn } from "@shared/ui/table";
import { Button } from "@my-project/ui";
import { Guard } from "@shared/ui";

type UserType = {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
  roles: string[];
  isLocked: boolean;
  createdAt: string;
};

type Props = {
  list: UserType[];
  isLoading: boolean;
  onAssignRole: (u: { id: string; roles: string[] }) => void;
  formatDate: (iso: string) => string;
  roleClass: (role: string) => string;
};

export default function UserTable({ list, isLoading, onAssignRole, formatDate, roleClass }: Props) {
  
  const columns: AdminTableColumn<UserType>[] = [
    {
      key: "info",
      label: "Thông tin",
      isMain: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-muted shrink-0 flex items-center justify-center overflow-hidden">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-muted-foreground">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className={`font-medium truncate max-w-[160px] ${user.fullName ? "text-foreground" : "text-muted-foreground italic"}`}>
              {user.fullName || "Chưa đặt tên"}
            </p>
            <p className="text-xs text-muted-foreground font-mono truncate max-w-[160px]">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      key: "contact",
      label: "Liên hệ",
      render: (user) => (
        <span className="text-xs text-muted-foreground font-mono">
          {user.phone || <span className="text-border/80">—</span>}
        </span>
      )
    },
    {
      key: "roles",
      label: "Vai trò",
      render: (user) => (
        <div className="flex flex-wrap gap-1">
          {user.roles.length > 0 ? (
            user.roles.map((r) => (
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
      )
    },
    {
      key: "status",
      label: "Trạng thái",
      align: "center",
      minWidth: "120px",
      render: (user) => (
        user.isLocked ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
            <LockClosedIcon className="w-3 h-3" /> Khoá
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium">
            <LockOpenIcon className="w-3 h-3" /> Hoạt động
          </span>
        )
      )
    },
    {
      key: "createdAt",
      label: "Ngày tham gia",
      align: "right",
      minWidth: "130px",
      render: (user) => (
        <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">
          {formatDate(user.createdAt)}
        </span>
      )
    },
    {
      key: "actions",
      label: "Phân quyền",
      isAction: true,
      align: "center",
      render: (user) => (
        <Guard permission="Permissions.Users.ManageRoles">
          <div className="flex items-center justify-center bg-background p-1 rounded-card shadow-neo-inset-sm w-fit mx-auto">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 rounded-button text-muted-foreground hover:text-primary hover:bg-background hover:shadow-neo-sm transition-all duration-300"
              title="Phân quyền"
              onClick={() => onAssignRole({ id: user.id, roles: user.roles })}
            >
              <ShieldCheckIcon className="w-4 h-4" />
            </Button>
          </div>
        </Guard>
      )
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 flex flex-col">
      <AdminTable
        columns={columns}
        data={list}
        isLoading={isLoading}
        skeletonRows={8}
        emptyIcon={InboxIcon}
        emptyTitle="Không tìm thấy người dùng nào"
        emptyDescription="Thử từ khoá tìm kiếm khác"
      />
    </div>
  );
}
