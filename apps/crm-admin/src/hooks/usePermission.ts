import { useCallback } from "react";
import { useAuthUser } from "./useAuth";
import { getAccessToken, decodeJwt, getPermissionsFromPayload, getRolesFromPayload } from "@my-project/shared-utils";

export default function usePermission() {
  const { data: me } = useAuthUser();

  let permissions: string[] = me?.permissions ?? [];
  let roles: string[] = me?.roles ?? [];

  if (!permissions.length && !roles.length) {
    const token = getAccessToken();
    const payload = token ? decodeJwt(token) : null;
    permissions = getPermissionsFromPayload(payload);
    roles = getRolesFromPayload(payload);
  }

  const hasPermission = useCallback((permissionCode: string) => {
    if (roles.includes("Admin")) return true;
    return permissions.includes(permissionCode);
  }, [roles, permissions]);

  const hasAnyPermission = useCallback((codes: string[]) => {
    if (roles.includes("Admin")) return true;
    return codes.some((code) => permissions.includes(code));
  }, [roles, permissions]);

  const getDefaultAdminRoute = useCallback(() => {
    if (hasPermission("Permissions.Dashboard.View")) return "/admin/dashboard";
    if (hasPermission("Permissions.Products.View")) return "/admin/product";
    if (hasAnyPermission(["Permissions.Products.View", "Permissions.Promotions.View"])) return "/admin/catalog-settings";
    if (hasPermission("Permissions.Orders.View")) return "/admin/orders";
    if (hasPermission("Permissions.Users.View")) return "/admin/listUsers";
    if (hasPermission("Permissions.Roles.View")) return "/admin/security";
    return "/auth/login"; 
  }, [hasPermission, hasAnyPermission]);

  return { hasPermission, hasAnyPermission, permissions, getDefaultAdminRoute };
}
