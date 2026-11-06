export const getApiBaseUrl = (): string => {
  if (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE_URL) {
    return String((import.meta as any).env.VITE_API_BASE_URL).replace(/\/+$/, "");
  }
  if (typeof process !== "undefined" && process.env?.EXPO_PUBLIC_API_BASE_URL) {
    return String(process.env.EXPO_PUBLIC_API_BASE_URL).replace(/\/+$/, "");
  }
  return "";
};

export const API_BASE = getApiBaseUrl();

export const DEFAULT_PRODUCT_IMAGE_URL = "/src/images/image-default.jpg";

/** Nối base + path an toàn, giữ nguyên nếu đã là absolute URL */
export function buildImgSrc(u?: string | null, customBase?: string): string {
  if (!u) return "";
  const url = String(u).trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;

  const base = customBase ?? getApiBaseUrl();
  const path = url.replace(/^\/+/, "");
  return base ? `${base}/${path}` : `/${path}`;
}
