import { API_BASE } from "@shared/config/env";

/** Nối base + path an toàn, giữ nguyên nếu đã là absolute URL */
export function buildImgSrc(u?: string | null): string {
  if (!u) return "";
  const url = String(u).trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;

  const path = url.replace(/^\/+/, ""); // bỏ bớt slash đầu
  return `${API_BASE}/${path}`;
}