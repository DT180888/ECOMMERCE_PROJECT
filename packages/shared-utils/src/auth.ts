// packages/shared-utils/src/auth.ts

export type JwtPayload = Record<string, unknown> & { exp?: number; iat?: number };

const TOKEN_KEY = "access_token";

export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const val = c.substring(nameEQ.length, c.length);
      if (val && val !== "null" && val !== "undefined" && val.trim().length > 0) {
        return val;
      }
    }
  }
  return null;
};

export const setCookie = (name: string, value: string | null, days = 7) => {
  if (typeof document === "undefined") return;
  if (value && value.trim().length > 0) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value}${expires}; path=/; SameSite=Lax`;
  } else {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const cookieToken = getCookie(TOKEN_KEY);
  const localToken = localStorage.getItem(TOKEN_KEY);
  
  if (cookieToken) {
    if (localToken !== cookieToken) {
      localStorage.setItem(TOKEN_KEY, cookieToken);
    }
    return cookieToken;
  } else {
    if (localToken) {
      localStorage.removeItem(TOKEN_KEY);
    }
    return null;
  }
};

export const setAccessToken = (t: string | null) => {
  if (typeof window === "undefined") return;
  if (t && t.trim().length > 0) {
    localStorage.setItem(TOKEN_KEY, t);
    setCookie(TOKEN_KEY, t);
  } else {
    localStorage.removeItem(TOKEN_KEY);
    setCookie(TOKEN_KEY, null);
  }
};

export function clientSideLogout() {
  if (typeof window === "undefined") return;
  setAccessToken(null);
  if (window.location.pathname !== "/auth/login") {
    window.location.replace("/auth/login");
  }
}

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

export function isTokenExpired(token: string): boolean {
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

/** Lấy permissions từ JWT payload (quét nhiều dạng đặt tên key) */
export function getPermissionsFromPayload(p?: JwtPayload | null): string[] {
  if (!p) return [];
  const keys = ["permission", "permissions", "Permission", "Permissions"];
  for (const key of keys) {
    const v = p[key];
    if (v) {
      if (Array.isArray(v)) return v.map(String);
      return [String(v)];
    }
  }
  return [];
}

