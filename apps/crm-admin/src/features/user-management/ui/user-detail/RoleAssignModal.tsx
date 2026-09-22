import { useState, useEffect } from "react";
import ReactSelect from "react-select";
import { reactSelectDarkStyles } from "@my-project/ui";
import { Button } from "@my-project/ui";
import { useAssignRole } from "@entities/user/admin/hooks";
import { useToast } from "@my-project/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@my-project/ui";
import {
  useSystemPermissions,
  useUserPermissions,
  useUpdateUserPermissions,
  useRoles,
} from "@entities/security/hooks";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  userId: string | null;
  currentRoles: string[];
  isOpen: boolean;
  onClose: () => void;
};

export function RoleAssignModal({ userId, currentRoles, isOpen, onClose }: Props) {
  const [selectedRole, setSelectedRole] = useState<string>(() => currentRoles[0] || "Customer");
  const [localPermissions, setLocalPermissions] = useState<string[]>([]);

  console.log("RoleAssignModal Rendered:", { userId, currentRoles, isOpen, selectedRole });

  const assignRoleMut = useAssignRole();
  const updateUserPermissionsMut = useUpdateUserPermissions();
  const toast = useToast();
  const qc = useQueryClient();

  const { data: systemPermissions = [] } = useSystemPermissions();
  const { data: activeUserPermissions = [] } = useUserPermissions(userId);
  const { data: roles = [] } = useRoles();

  const roleOptions = roles.map((r) => ({
    value: r,
    label: r,
  }));

  // Đồng bộ quyền trực tiếp của user khi fetch xong
  useEffect(() => {
    if (activeUserPermissions.length > 0) {
      setLocalPermissions(activeUserPermissions);
    }
  }, [activeUserPermissions]);

  if (!userId) return null;

  const handleTogglePermission = (perm: string) => {
    if (localPermissions.includes(perm)) {
      setLocalPermissions(localPermissions.filter((p) => p !== perm));
    } else {
      setLocalPermissions([...localPermissions, perm]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedRole) return;

    try {
      // 1. Gán vai trò
      await assignRoleMut.mutateAsync({ userId, role: selectedRole });

      // 2. Cập nhật quyền trực tiếp
      await updateUserPermissionsMut.mutateAsync({
        userId,
        permissions: localPermissions,
      });

      // 3. Làm mới danh sách user sau khi cả 2 cập nhật xong để tránh trôi dữ liệu
      await qc.invalidateQueries({ queryKey: ["admin-users"] });

      toast.success("Cập nhật quyền và vai trò thành công!");
      onClose();
    } catch (error) {
      const err = error as any;
      const msg = err?.message || "Lỗi khi cập nhật quyền.";
      toast.error(msg);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent noClose className="max-w-xl p-6">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-bold text-foreground mb-2">
            Phân quyền người dùng
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Thiết lập vai trò chính và tùy chỉnh quyền hạn trực tiếp (Direct Permissions) cho tài khoản này.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Vai trò */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Vai trò chính</label>
            <ReactSelect
              value={(() => {
                const found = roleOptions.find((r) => r.value.toLowerCase() === selectedRole?.toLowerCase());
                console.log("ReactSelect matched option:", found, "for selectedRole:", selectedRole);
                return found || null;
              })()}
              onChange={(val) => {
                console.log("ReactSelect onChange:", val);
                setSelectedRole(val ? val.value : null);
              }}
              options={roleOptions}
              styles={reactSelectDarkStyles}
              placeholder="Chọn vai trò..."
              menuPosition="absolute"
            />
          </div>

          {/* Quyền gán đè trực tiếp */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Quyền hạn đặc biệt (Được ưu tiên cộng thêm cho user)
            </label>
            <div className="border border-border/10 bg-surface/50 rounded-card p-3 max-h-[220px] overflow-y-auto space-y-2">
              {systemPermissions.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Không có quyền nào trong hệ thống</p>
              ) : (
                systemPermissions.map((perm) => {
                  const isChecked = localPermissions.includes(perm);
                  return (
                    <label
                      key={perm}
                      className="flex items-center gap-2.5 p-1.5 rounded hover:bg-surface cursor-pointer select-none transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTogglePermission(perm)}
                        className="w-3.5 h-3.5 accent-primary rounded border-border"
                      />
                      <span className="text-xs text-foreground font-mono truncate">{perm}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={assignRoleMut.isPending || updateUserPermissionsMut.isPending}
            >
              Hủy bỏ
            </Button>
            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={assignRoleMut.isPending || updateUserPermissionsMut.isPending}
            >
              {assignRoleMut.isPending || updateUserPermissionsMut.isPending
                ? "Đang lưu..."
                : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

