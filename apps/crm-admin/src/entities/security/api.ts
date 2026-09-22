import { axiosClient } from "@my-project/shared-utils";

export const SECURITY_PATHS = {
  roles: "/api/v1/admin/security/roles",
  rolePermissions: (roleName: string) => `/api/v1/admin/security/roles/${roleName}/permissions`,
  systemPermissions: "/api/v1/admin/security/permissions",
  userPermissions: (userId: string) => `/api/v1/admin/security/users/${userId}/permissions`,
};

export async function apiGetRoles(): Promise<string[]> {
  const { data } = await axiosClient.get<string[]>(SECURITY_PATHS.roles);
  return data;
}

export async function apiCreateRole(roleName: string): Promise<void> {
  await axiosClient.post(SECURITY_PATHS.roles, { roleName });
}

export async function apiDeleteRole(roleName: string): Promise<void> {
  await axiosClient.delete(`${SECURITY_PATHS.roles}/${roleName}`);
}

export async function apiGetRolePermissions(roleName: string): Promise<string[]> {
  const { data } = await axiosClient.get<string[]>(SECURITY_PATHS.rolePermissions(roleName));
  return data;
}

export async function apiUpdateRolePermissions(roleName: string, permissions: string[]): Promise<void> {
  await axiosClient.put(SECURITY_PATHS.rolePermissions(roleName), { permissions });
}

export async function apiGetSystemPermissions(): Promise<string[]> {
  const { data } = await axiosClient.get<string[]>(SECURITY_PATHS.systemPermissions);
  return data;
}

export async function apiGetUserPermissions(userId: string): Promise<string[]> {
  const { data } = await axiosClient.get<string[]>(SECURITY_PATHS.userPermissions(userId));
  return data;
}

export async function apiUpdateUserPermissions(userId: string, permissions: string[]): Promise<void> {
  await axiosClient.put(SECURITY_PATHS.userPermissions(userId), { permissions });
}
