import { useState, useMemo, useEffect } from "react";
import {
  useRoles,
  useCreateRole,
  useDeleteRole,
  useSystemPermissions,
  useRolePermissions,
  useUpdateRolePermissions,
} from "@hooks/useSecurity";
import {
  Button,
  Input,
  Switch,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@my-project/ui";
import usePermission from "@hooks/usePermission";
import { AdminPageShell } from "@shared/ui";
import {
  ShieldCheckIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  KeyIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const EMPTY_ROLES: string[] = [];
const EMPTY_PERMISSIONS: string[] = [];

export function SecuritySettings() {
  const { hasPermission } = usePermission();

  const { data: roles = EMPTY_ROLES, isLoading: isLoadingRoles } = useRoles();
  const { data: systemPermissions = EMPTY_PERMISSIONS } = useSystemPermissions();
  const createRoleMutation = useCreateRole();
  const deleteRoleMutation = useDeleteRole();

  const [selectedRole, setSelectedRole] = useState<string>("");
  const [newRoleName, setNewRoleName] = useState<string>("");

  const { data: activePermissions, isLoading: isLoadingPerms } = useRolePermissions(
    selectedRole,
    !!selectedRole
  );
  const updatePermissionsMutation = useUpdateRolePermissions();

  const [localPermissions, setLocalPermissions] = useState<string[]>(EMPTY_PERMISSIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  const handleSelectRole = (role: string) => {
    setSelectedRole(role);
    setSearchQuery("");
  };

  useEffect(() => {
    if (!selectedRole) {
      setLocalPermissions(EMPTY_PERMISSIONS);
      return;
    }
    if (!isLoadingPerms && activePermissions) {
      setLocalPermissions(activePermissions);
    }
  }, [selectedRole, activePermissions, isLoadingPerms]);

  const handleTogglePermission = (perm: string, checked: boolean) => {
    if (checked) {
      setLocalPermissions([...localPermissions, perm]);
    } else {
      setLocalPermissions(localPermissions.filter((p) => p !== perm));
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    try {
      await createRoleMutation.mutateAsync(newRoleName.trim());
      setNewRoleName("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteRole = async () => {
    if (!roleToDelete) return;
    try {
      await deleteRoleMutation.mutateAsync(roleToDelete);
      if (selectedRole === roleToDelete) {
        setSelectedRole("");
        setLocalPermissions(EMPTY_PERMISSIONS);
      }
      setRoleToDelete(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    try {
      await updatePermissionsMutation.mutateAsync({
        roleName: selectedRole,
        permissions: localPermissions,
      });
      alert("Cập nhật quyền thành công!");
    } catch (e) {
      console.error(e);
      const err = e as Error;
      alert(err?.message || "Lỗi khi cập nhật quyền.");
    }
  };

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, string[]> = {};
    const filtered = systemPermissions.filter((p) =>
      p.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.forEach((p) => {
      const parts = p.split(".");
      const groupName = parts[1] || "Khác";
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(p);
    });
    return groups;
  }, [systemPermissions, searchQuery]);

  const handleToggleGroup = (groupName: string, perms: string[]) => {
    const allChecked = perms.every((p) => localPermissions.includes(p));
    if (allChecked) {
      setLocalPermissions(localPermissions.filter((p) => !perms.includes(p)));
    } else {
      const newPerms = perms.filter((p) => !localPermissions.includes(p));
      setLocalPermissions([...localPermissions, ...newPerms]);
    }
  };

  return (
    <AdminPageShell>
      <AdminPageShell.Header
        icon={ShieldCheckIcon}
        title="Bảo mật & Vai trò"
        badge="Phân quyền hệ thống"
      />
      <AdminPageShell.Body>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative flex-1 min-h-0">
          {/* Cột 1: Danh sách Vai trò (Roles) */}
          <div className="lg:col-span-1 flex flex-col h-[35vh] min-h-[250px] lg:h-full bg-card rounded-lg border border-border shadow-card p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
              <KeyIcon className="w-3.5 h-3.5 text-primary stroke-[1.5]" />
              <span>Danh sách vai trò</span>
            </h3>

            {/* Form thêm Role */}
            {hasPermission("Permissions.Roles.Create") && (
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Tên vai trò mới..."
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="h-[34px] text-xs bg-surface border-border rounded-md shadow-sm"
                />
                <Button
                  size="default"
                  onClick={handleCreateRole}
                  disabled={createRoleMutation.isPending}
                  className="shrink-0 h-[34px] px-3 rounded-md flex items-center justify-center gap-1 text-xs font-medium shadow-sm"
                >
                  {createRoleMutation.isPending ? (
                    <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <PlusIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                  )}
                  <span>Thêm</span>
                </Button>
              </div>
            )}

            {/* Danh sách các Roles */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pr-1 custom-scrollbar">
              {isLoadingRoles ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground p-3">
                  <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" /> Đang tải...
                </div>
              ) : roles.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Chưa có vai trò nào</p>
              ) : (
                roles.map((role) => (
                  <div
                    key={role}
                    onClick={() => handleSelectRole(role)}
                    className={`flex items-center justify-between px-3 h-10 rounded-md text-xs cursor-pointer transition-all ${
                      selectedRole === role
                        ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary"
                        : "bg-surface/50 text-muted-foreground hover:bg-surface hover:text-foreground"
                    }`}
                  >
                    <span className="truncate pr-2">{role}</span>
                    {role !== "Admin" && role !== "Customer" && hasPermission("Permissions.Roles.Delete") && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRoleToDelete(role);
                        }}
                        className="rounded-md text-muted-foreground hover:text-error hover:bg-error/10 border-0 shadow-none"
                        title="Xóa vai trò"
                        icon={<TrashIcon className="w-3.5 h-3.5 stroke-[1.5]" />}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cột 2 & 3: Bảng phân quyền chi tiết cho Role */}
          <div className="lg:col-span-2 flex flex-col h-[60vh] min-h-[400px] lg:h-full overflow-hidden">
            {selectedRole === "Admin" || selectedRole === "Customer" ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 md:p-10 h-full bg-card rounded-lg border border-border shadow-card">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <LockClosedIcon className="w-6 h-6 text-primary stroke-[1.5]" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Vai Trò Hệ Thống</h3>
                <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                  Vai trò <strong className="text-foreground">{selectedRole}</strong> là vai trò cốt lõi. 
                  {selectedRole === "Admin" ? " Mặc định có toàn quyền truy cập." : " Chỉ dành cho người mua hàng."}
                  <br />Cấu hình vai trò này được khóa để bảo vệ hệ thống.
                </p>
              </div>
            ) : selectedRole ? (
              <div className="flex flex-col h-full min-h-0">
                {/* Header */}
                <div className="flex items-center justify-between gap-3 shrink-0 mb-3 p-2.5 ">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircleIcon className="w-4 h-4 text-primary shrink-0 stroke-[1.5]" />
                    <span className="text-xs font-semibold text-foreground truncate">
                      Quyền hạn vai trò: <span className="text-primary">{selectedRole}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="relative w-40 sm:w-56">
                      <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none stroke-[1.5]" />
                      <Input
                        placeholder="Tìm kiếm quyền..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-[34px] pl-8 text-xs bg-card border-border rounded-md shadow-sm"
                      />
                    </div>

                    {hasPermission("Permissions.Roles.Edit") && (
                      <Button
                        size="default"
                        onClick={handleSavePermissions}
                        disabled={updatePermissionsMutation.isPending}
                        className="h-[34px] px-3.5 text-xs font-medium rounded-md shadow-sm"
                      >
                        {updatePermissionsMutation.isPending && (
                          <ArrowPathIcon className="w-3.5 h-3.5 animate-spin mr-1.5" />
                        )}
                        Lưu thiết lập
                      </Button>
                    )}
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-4 custom-scrollbar min-h-0">
                  {isLoadingPerms ? (
                    <div className="flex items-center justify-center h-32 gap-2 text-muted-foreground text-xs">
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      <span>Đang tải cấu hình quyền...</span>
                    </div>
                  ) : Object.keys(groupedPermissions).length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-muted-foreground text-xs italic">
                      Không tìm thấy quyền nào phù hợp.
                    </div>
                  ) : (
                    Object.entries(groupedPermissions).map(([groupName, perms]) => {
                      const allChecked = perms.every((p) => localPermissions.includes(p));
                      return (
                        <div key={groupName} className="flex flex-col gap-2">
                          <div className="flex items-center justify-between border-b border-border/80 pb-1.5">
                            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                              Module: {groupName}
                            </h4>
                            <Button
                              type="button"
                              variant="secondary"
                              size="xs"
                              onClick={() => handleToggleGroup(groupName, perms)}
                              className="text-[11px] font-medium h-6 px-2.5 rounded-md bg-surface text-muted-foreground hover:text-foreground shadow-none"
                            >
                              {allChecked ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {perms.map((perm) => {
                              const label = perm.replace(`Permissions.${groupName}.`, "");
                              const isChecked = localPermissions.includes(perm);
                              return (
                                <div
                                  key={perm}
                                  className={`flex items-start gap-2.5 p-3 rounded-md border transition-all select-none ${
                                    isChecked
                                      ? "bg-primary/5 border-primary/40 font-medium"
                                      : "bg-card  border-border/70 hover:bg-surface hover:border-border"
                                  }`}
                                >
                                  <Switch
                                    checked={isChecked}
                                    onCheckedChange={(checked) => handleTogglePermission(perm, checked)}
                                    className="mt-0.5 shrink-0"
                                  />
                                  <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-xs font-medium text-foreground truncate">
                                      {label}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-mono truncate mt-0.5" title={perm}>
                                      {perm}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 h-full bg-card rounded-lg border border-border shadow-card">
                <ShieldCheckIcon className="w-10 h-10 text-muted-foreground/40 mb-2 stroke-[1.25]" />
                <p className="text-xs text-muted-foreground">
                  Vui lòng chọn một vai trò từ danh sách để thiết lập quyền hạn
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Xóa Role */}
        <Dialog open={!!roleToDelete} onOpenChange={(open) => !open && setRoleToDelete(null)}>
          <DialogContent className="sm:max-w-md bg-card border border-border rounded-xl shadow-elevation-4">
            <DialogHeader>
              <DialogTitle className="text-sm font-semibold text-foreground">Xóa vai trò</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Bạn có chắc chắn muốn xóa vai trò <strong className="text-foreground">{roleToDelete}</strong> không? 
                Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setRoleToDelete(null)}
                className="h-[34px] px-3.5 text-xs font-medium rounded-md border-border"
              >
                Hủy
              </Button>
              <Button
                onClick={handleDeleteRole}
                disabled={deleteRoleMutation.isPending}
                className="h-[34px] px-3.5 text-xs font-medium rounded-md bg-error text-white hover:bg-error/90 shadow-sm"
              >
                {deleteRoleMutation.isPending ? (
                  <ArrowPathIcon className="w-3.5 h-3.5 animate-spin mr-1.5" />
                ) : (
                  <TrashIcon className="w-3.5 h-3.5 mr-1.5 stroke-[1.5]" />
                )}
                Xóa vai trò
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminPageShell.Body>
    </AdminPageShell>
  );
}

export const AdminSecurity = SecuritySettings;
export default SecuritySettings;
