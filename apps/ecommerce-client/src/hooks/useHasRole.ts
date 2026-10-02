import { getAccessToken, decodeJwt, getRolesFromPayload } from "@my-project/shared-utils";
import { useAuthUser } from "./useAuth";

export default function useHasRole() {
  const { data: me } = useAuthUser();

  let roles: string[] = me?.roles ?? [];

  if (!roles.length) {
    const token = getAccessToken();
    const payload = token ? decodeJwt(token) : null;
    roles = getRolesFromPayload(payload);
  }

  const has = (role: string) => roles.includes(role);
  const hasAny = (rs: string[]) => rs.some((r) => roles.includes(r));
  const all = () => roles;

  return { has, hasAny, roles: all() };
}
