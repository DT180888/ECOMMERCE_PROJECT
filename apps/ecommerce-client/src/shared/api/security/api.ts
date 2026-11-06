import { axiosClient } from "@my-project/shared-utils";

const BASE_URL = "/api/v1/admin/security";

export async function apiGetRoles(): Promise<string[]> {
  const { data } = await axiosClient.get<string[]>(`${BASE_URL}/roles`);
  return data;
}

export async function apiCreateRole(roleName: string): Promise<void> {
  await axiosClient.post(`${BASE_URL}/roles`, { roleName });
}

export async function apiDeleteRole(roleName: string): Promise<void> {
  await axiosClient.delete(`${BASE_URL}/roles/${roleName}`);
}

export async function apiGetRolePermissions(roleName: string): Promise<string[]> {
  const { data } = await axiosClient.get<string[]>(`${BASE_URL}/roles/${roleName}/permissions`);
  return data;
}

export async function apiUpdateRolePermissions(roleName: string, permissions: string[]): Promise<void> {
  await axiosClient.put(`${BASE_URL}/roles/${roleName}/permissions`, { permissions });
}

export async function apiGetSystemPermissions(): Promise<string[]> {
  const { data } = await axiosClient.get<string[]>(`${BASE_URL}/permissions`);
  return data;
}

export async function apiGetUserPermissions(userId: string): Promise<string[]> {
  const { data } = await axiosClient.get<string[]>(`${BASE_URL}/users/${userId}/permissions`);
  return data;
}

export async function apiUpdateUserPermissions(userId: string, permissions: string[]): Promise<void> {
  await axiosClient.put(`${BASE_URL}/users/${userId}/permissions`, { permissions });
}
