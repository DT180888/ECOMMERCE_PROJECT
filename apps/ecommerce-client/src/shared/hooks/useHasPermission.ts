import { getAccessToken, decodeJwt, getPermissionsFromPayload } from "@my-project/shared-utils";

export default function useHasPermission() {
  const token = getAccessToken();
  const payload = token ? decodeJwt(token) : null;
  const permissions = getPermissionsFromPayload(payload);

  const has = (permission: string) => permissions.includes(permission);
  const hasAny = (perms: string[]) => perms.some((p) => permissions.includes(p));

  return { has, hasAny, permissions };
}
