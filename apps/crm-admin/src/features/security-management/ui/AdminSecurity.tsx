import { useState, useMemo, useEffect } from "react";
import {
  useRoles,
  useCreateRole,
  useDeleteRole,
  useSystemPermissions,
  useRolePermissions,
  useUpdateRolePermissions,
} from "@entities/security/hooks";
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
import usePermission from "@shared/hooks/usePermission";
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

export function AdminSecurity() {
  const { hasPermission } = usePermission();

  const { data: roles = [], isLoading: isLoadingRoles } = useRoles();
  const { data: systemPermissions = [] } = useSystemPermissions();
  const createRoleMutation = useCreateRole();
  const deleteRoleMutation = useDeleteRole();

  const [selectedRole, setSelectedRole] = useState<string>("");
  const [newRoleName, setNewRoleName] = useState<string>("");

  const { data: activePermissions = [], isLoading: isLoadingPerms } = useRolePermissions(
    selectedRole,
    !!selectedRole
  );
  const updatePermissionsMutation = useUpdateRolePermissions();

  const [localPermissions, setLocalPermissions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  const handleSelectRole = (role: string) => {
    setSelectedRole(role);
    setSearchQuery("");
  };

  // Đồng bộ quyền khi load từ API
  useEffect(() => {
    if (!isLoadingPerms) {
      setLocalPermissions(activePermissions);
    }
  }, [activePermissions, isLoadingPerms]);

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
        setLocalPermissions([]);
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

  // Gom nhóm các permissions theo module để hiển thị khoa học
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, string[]> = {};
    const filtered = systemPermissions.filter(p =>
      p.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.forEach((p) => {
      // Ví dụ: "Permissions.Products.View" -> module "Products"
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
      // Bỏ chọn tất cả trong nhóm
      setLocalPermissions(localPermissions.filter((p) => !perms.includes(p)));
    } else {
      // Chọn tất cả trong nhóm (chỉ thêm những cái chưa có)
      const newPerms = perms.filter((p) => !localPermissions.includes(p));
      setLocalPermissions([...localPermissions, ...newPerms]);
    }
  };

  return (
    <AdminPageShell
      icon={ShieldCheckIcon}
      title="Bảo mật & Vai trò"
      badge="Phân quyền hệ thống"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 relative">
        {/* Cột 1: Danh sách Vai trò (Roles) */}
        <div className="lg:col-span-1 flex flex-col admin-surface bg-card p-4 md:p-5 rounded-card shadow-neo-sm h-[35vh] min-h-[250px] lg:h-[calc(100vh-140px)] lg:sticky lg:top-[88px]">
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <KeyIcon className="w-4 h-4 text-primary" />
            <span>Danh sách vai trò</span>
          </h3>

          {/* Form thêm Role */}
          {hasPermission("Permissions.Roles.Create") && (
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Nhập tên vai trò..."
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="h-9 text-xs"
              />
              <Button
                size="sm"
                onClick={handleCreateRole}
                disabled={createRoleMutation.isPending}
                className="shrink-0 h-9 rounded-button flex items-center justify-center gap-1 shadow-neo-sm"
              >
                {createRoleMutation.isPending ? (
                  <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <PlusIcon className="w-3.5 h-3.5" />
                )}
                <span>Thêm</span>
              </Button>
            </div>
          )}

          {/* Danh sách các Roles */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {isLoadingRoles ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground p-3">
                <ArrowPathIcon className="w-4 h-4 animate-spin" /> Đang tải...
              </div>
            ) : roles.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Chưa có vai trò nào</p>
            ) : (
              roles.map((role) => (
                <div
                  key={role}
                  onClick={() => handleSelectRole(role)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-button border text-xs font-semibold cursor-pointer transition-all duration-200 ${
                    selectedRole === role
                      ? "bg-primary/10 border-primary text-primary shadow-neo-sm"
                      : "bg-surface/50 border-transparent text-muted-foreground hover:bg-surface hover:text-foreground"
                  }`}
                >
                  <span className="truncate pr-2">{role}</span>
                  {role !== "Admin" && role !== "Customer" && hasPermission("Permissions.Roles.Delete") && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRoleToDelete(role);
                      }}
                      className="p-1.5 shrink-0 rounded-inner hover:bg-destructive/10 text-muted hover:text-destructive transition-colors focus:outline-none focus:ring-2 focus:ring-destructive/30"
                      title="Xóa vai trò"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cột 2 & 3: Bảng phân quyền chi tiết cho Role */}
        <div className="lg:col-span-2 flex flex-col admin-surface bg-card p-0 rounded-card shadow-neo-sm h-[60vh] min-h-[400px] lg:h-[calc(100vh-140px)] overflow-hidden">
          {selectedRole === "Admin" || selectedRole === "Customer" ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 md:p-10 h-full bg-surface/30">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <LockClosedIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Vai Trò Hệ Thống</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Vai trò <strong className="text-primary">{selectedRole}</strong> là vai trò cốt lõi của hệ thống. 
                {selectedRole === "Admin" ? " Nó mặc định có toàn bộ quyền truy cập." : " Nó chỉ dành cho người mua hàng và không có quyền truy cập trang quản trị."}
                <br />Để đảm bảo an toàn, cấu hình của vai trò này bị khóa và không thể tùy chỉnh.
              </p>
            </div>
          ) : selectedRole ? (
            <div className="flex flex-col h-full">
              {/* Sticky Header */}
              <div className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border/15 p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                    <span>Quyền hạn: {selectedRole}</span>
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Cấu hình quyền truy cập hệ thống cho vai trò này
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <Input
                      placeholder="Tìm kiếm quyền..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9 text-xs"
                    />
                  </div>

                  {hasPermission("Permissions.Roles.Edit") && (
                    <Button
                      size="sm"
                      onClick={handleSavePermissions}
                      disabled={updatePermissionsMutation.isPending}
                      className="shadow-neo-sm h-9 shrink-0 flex items-center gap-2"
                    >
                      {updatePermissionsMutation.isPending && (
                        <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                      )}
                      Lưu thiết lập
                    </Button>
                  )}
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
                {isLoadingPerms ? (
                  <div className="flex items-center justify-center h-32 gap-3 text-muted-foreground">
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    <span className="text-xs font-medium">Đang tải cấu hình quyền...</span>
                  </div>
                ) : Object.keys(groupedPermissions).length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-muted-foreground text-xs italic">
                    Không tìm thấy quyền nào phù hợp.
                  </div>
                ) : (
                  Object.entries(groupedPermissions).map(([groupName, perms]) => {
                    const allChecked = perms.every((p) => localPermissions.includes(p));
                    return (
                      <div key={groupName} className="space-y-3">
                        <div className="flex items-center justify-between border-b border-border/10 pb-1.5">
                          <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider">
                            Module: {groupName}
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleToggleGroup(groupName, perms)}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-inner bg-surface/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            {allChecked ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {perms.map((perm) => {
                            const label = perm.replace(`Permissions.${groupName}.`, "");
                            const isChecked = localPermissions.includes(perm);
                            return (
                              <div
                                key={perm}
                                className={`flex items-start gap-3 p-3 rounded-card border transition-all duration-200 hover:shadow-neo-inset-sm select-none ${
                                  isChecked
                                    ? "bg-surface border-emerald-500/30 shadow-neo-inset-sm"
                                    : "bg-surface/30 border-transparent"
                                }`}
                              >
                                <Switch
                                  checked={isChecked}
                                  onCheckedChange={(checked) => handleTogglePermission(perm, checked)}
                                  className="mt-0.5 shrink-0"
                                />
                                <div className="flex flex-col flex-1 min-w-0">
                                  <span className="text-xs font-semibold text-foreground truncate">
                                    {label}
                                  </span>
                                  <span className="text-[9px] text-muted font-mono mt-0.5 truncate" title={perm}>
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
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 h-full">
              <ShieldCheckIcon className="w-12 h-12 text-muted/30 mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">
                Vui lòng chọn một vai trò từ danh sách để thiết lập quyền hạn
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Xóa Role */}
      <Dialog open={!!roleToDelete} onOpenChange={(open) => !open && setRoleToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa vai trò</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa vai trò <strong className="text-foreground">{roleToDelete}</strong> không? 
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setRoleToDelete(null)}
              className="h-9"
            >
              Hủy
            </Button>
            <Button
              onClick={handleDeleteRole}
              disabled={deleteRoleMutation.isPending}
              className="h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteRoleMutation.isPending ? (
                <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <TrashIcon className="w-4 h-4 mr-2" />
              )}
              Xóa vai trò
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}

