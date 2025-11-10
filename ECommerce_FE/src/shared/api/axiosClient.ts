import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

// === Access token helpers ===
const TOKEN_KEY = "access_token";
export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const setAccessToken = (t: string | null) => {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
};

// Client chính cho app
export const axiosClient = axios.create({
  baseURL,
  withCredentials: true, 
  headers: { "Content-Type": "application/json" },
});

// Client "thô" chỉ dùng để refresh, tránh vòng lặp interceptor
const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// === Gắn Authorization trước mỗi request ===
axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// === Refresh logic: single-flight + queue subscribers ===
let isRefreshing = false;
let queue: Array<(token: string | null) => void> = [];

const notifyQueue = (token: string | null) => {
  queue.forEach(cb => cb(token));
  queue = [];
};

axiosClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean });
    const status = error.response?.status;

    if (status === 401 && !original?._retry) {
      if (isRefreshing) {
        // ĐANG refresh: chờ token mới rồi retry 1 lần
        return new Promise((resolve, reject) => {
          queue.push((newToken) => {
            if (newToken) {
              (original.headers ??= {} as any);
              (original.headers as any).Authorization = `Bearer ${newToken}`;
              resolve(axiosClient(original));
            } else {
              reject(error);
            }
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await refreshClient.post<{
          access_token: string; token_type: string; expires_in: number;
        }>(
          "/Auth/refresh", // hoặc "/api/auth/refresh" tùy baseURL của bạn
          {}
        );

        const newAccess = data.access_token;
        setAccessToken(newAccess);
        notifyQueue(newAccess);

        // replay request ban đầu
        (original.headers ??= {} as any);
        (original.headers as any).Authorization = `Bearer ${newAccess}`;
        return axiosClient(original);
      } catch (e) {
        setAccessToken(null);
        notifyQueue(null);
        if (window.location.pathname !== "/auth/login") window.location.replace("/auth/login");
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


// Helper logout phía FE
export function clientSideLogout() {
  setAccessToken(null);
  if (window.location.pathname !== "/auth/login") window.location.replace("/auth/login");
}
