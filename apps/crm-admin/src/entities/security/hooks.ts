import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiGetRoles,
  apiCreateRole,
  apiDeleteRole,
  apiGetRolePermissions,
  apiUpdateRolePermissions,
  apiGetSystemPermissions,
  apiGetUserPermissions,
  apiUpdateUserPermissions,
} from "./api";

export const securityKeys = {
  roles: ["security", "roles"] as const,
  rolePermissions: (roleName: string) => ["security", "rolePermissions", roleName] as const,
  systemPermissions: ["security", "systemPermissions"] as const,
  userPermissions: (userId: string) => ["security", "userPermissions", userId] as const,
};

export function useRoles() {
  return useQuery({
    queryKey: securityKeys.roles,
    queryFn: apiGetRoles,
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiCreateRole,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: securityKeys.roles });
    },
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiDeleteRole,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: securityKeys.roles });
    },
  });
}

export function useRolePermissions(roleName: string, enabled = true) {
  return useQuery({
    queryKey: securityKeys.rolePermissions(roleName),
    queryFn: () => apiGetRolePermissions(roleName),
    enabled: enabled && !!roleName,
  });
}

export function useUpdateRolePermissions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roleName, permissions }: { roleName: string; permissions: string[] }) =>
      apiUpdateRolePermissions(roleName, permissions),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: securityKeys.rolePermissions(variables.roleName) });
    },
  });
}

export function useSystemPermissions() {
  return useQuery({
    queryKey: securityKeys.systemPermissions,
    queryFn: apiGetSystemPermissions,
    staleTime: Infinity, // Quyền hệ thống tĩnh ít khi thay đổi
  });
}

export function useUserPermissions(userId: string | null) {
  return useQuery({
    queryKey: securityKeys.userPermissions(userId || ""),
    queryFn: () => apiGetUserPermissions(userId!),
    enabled: !!userId,
  });
}

export function useUpdateUserPermissions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, permissions }: { userId: string; permissions: string[] }) =>
      apiUpdateUserPermissions(userId, permissions),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: securityKeys.userPermissions(variables.userId) });
    },
  });
}
