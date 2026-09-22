export type JwtPayload = Record<string, any> & { exp?: number; iat?: number };

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string): boolean {
  const p = decodeJwt(token);
  if (!p?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return p.exp <= now;
}

/** Lấy roles từ nhiều chuẩn claim phổ biến (ASP.NET & OIDC) */
export function getRolesFromPayload(p?: JwtPayload | null): string[] {
  if (!p) return [];
  const roleKeys = [
    "role",
    "roles",
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
  ];
  for (const key of roleKeys) {
    const v = p[key];
    if (!v) continue;
    if (Array.isArray(v)) return v.map(String);
    return [String(v)];
  }
  return [];
}