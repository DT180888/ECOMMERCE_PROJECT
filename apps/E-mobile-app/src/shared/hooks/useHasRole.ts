import { getAccessToken } from "@shared/api/axiosClient";
import { decodeJwt, getRolesFromPayload } from "@shared/lib/jwt";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@shared/api/axiosClient";

/** /auth/me trả về { id, email, roles: string[] } */
function useAuthUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/auth/me");
      return data as { id: number; email: string; roles?: string[] };
    },
    // không spam
    retry: false,
    staleTime: 60_000,
  });
}

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
