import { getAccessToken, decodeJwt, getRolesFromPayload } from "@my-project/shared-utils";
import { useAuthUser } from "@entities/auth/hooks";

export default function useHasRole() {
  const { data: me } = useAuthUser();

  // 1) Ưu tiên role từ server
  let roles: string[] = me?.roles ?? [];

  // 2) Fallback: khi /me chưa có/đang pending → tạm đọc từ JWT để UI bớt nhấp nháy
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
