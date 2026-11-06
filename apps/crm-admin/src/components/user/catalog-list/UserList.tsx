import { useState, useCallback } from "react";
import { useAdminUserList } from "@hooks/useUser";
import { UsersIcon, InboxIcon } from "@heroicons/react/24/outline";
import { AdminPageShell, AdminTable } from "@shared/ui";
import usePermission from "@hooks/usePermission";
import { RoleAssignModal } from "../user-detail/RoleAssignModal";
import { Customer360Drawer } from "@components/customer/Customer360Drawer";
import { useUserColumns } from "./useUserColumns";
import type { UserAdminRes } from "@my-project/api";

const PAGE_SIZE = 20;

export function UserList() {
  const { hasPermission } = usePermission();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; roles: string[] } | null>(null);

  const [c360DrawerOpen, setC360DrawerOpen] = useState(false);
  const [selectedC360UserId, setSelectedC360UserId] = useState<string | null>(null);

  const { data, isLoading } = useAdminUserList({ page, size: PAGE_SIZE, search });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const handleOpenAssign = useCallback((u: { id: string; roles: string[] }) => {
    setSelectedUser(u);
    setAssignModalOpen(true);
  }, []);

  const handleOpen360 = useCallback((userId: string) => {
    setSelectedC360UserId(userId);
    setC360DrawerOpen(true);
  }, []);

  const columns = useUserColumns({
    hasManageRoles: hasPermission("Permissions.Users.ManageRoles"),
    onOpenAssign: handleOpenAssign,
    onOpen360: handleOpen360,
  });

  return (
    <>
      <AdminPageShell>
        <AdminPageShell.Header
          icon={UsersIcon}
          title="Người dùng"
          badge={`${total}`}
        />
        <AdminPageShell.Body>
          <div className="flex-1 min-h-0 flex flex-col">
            <AdminTable<UserAdminRes>
              columns={columns}
              data={items}
              isLoading={isLoading}
              rowKey="id"
              enableCardView={true}
              storageKey="crm_user_view_mode"
              search={{
                query: search,
                onChange: (val: string) => {
                  setSearch(val);
                  setPage(1);
                },
                placeholder: "Tìm kiếm người dùng...",
              }}
              pagination={{
                page,
                total,
                pageSize: PAGE_SIZE,
                onPageChange: setPage,
              }}
              emptyText="Không tìm thấy người dùng"
              emptyIcon={InboxIcon}
            />
          </div>
        </AdminPageShell.Body>
      </AdminPageShell>

      {selectedUser && (
        <RoleAssignModal
          isOpen={assignModalOpen}
          onClose={() => {
            setAssignModalOpen(false);
            setSelectedUser(null);
          }}
          userId={selectedUser.id}
          currentRoles={selectedUser.roles}
        />
      )}

      <Customer360Drawer
        open={c360DrawerOpen}
        onClose={() => {
          setC360DrawerOpen(false);
          setSelectedC360UserId(null);
        }}
        userId={selectedC360UserId}
      />
    </>
  );
}

export const AdminUserList = UserList;
export default UserList;
