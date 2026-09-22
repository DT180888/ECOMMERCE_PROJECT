// packages/shared-utils/src/axiosClient.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken } from "./auth";

// @ts-ignore
const baseURL = import.meta.env.VITE_API_BASE_URL;

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
  (res) => {
    if (res.data && res.data.hasOwnProperty("succeeded")) {
      res.data = res.data.data;
    }
    return res;
  },
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean });
    const status = error.response?.status;

    if (error.response && error.response.data) {
      const apiResponse = error.response.data as any;
      if (apiResponse && typeof apiResponse === "object" && apiResponse.hasOwnProperty("succeeded") && !apiResponse.succeeded) {
        
        let detailedError = apiResponse.message;
        
        if (apiResponse.errors) {
          if (typeof apiResponse.errors === "string") {
            detailedError = apiResponse.errors;
          } else if (apiResponse.errors.message) {
            detailedError = apiResponse.errors.message;
          } else if (apiResponse.errors.error) {
            detailedError = apiResponse.errors.error;
          } else if (typeof apiResponse.errors === "object") {
            // Lấy value đầu tiên của object (thường dùng cho FluentValidation)
            const firstKey = Object.keys(apiResponse.errors)[0];
            if (firstKey) {
               const firstErr = apiResponse.errors[firstKey];
               detailedError = Array.isArray(firstErr) ? firstErr[0] : firstErr;
            }
          }
        }
        
        console.error("API Error:", detailedError);
        error.message = detailedError || error.message;
      }
    }

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
        const { data } = await refreshClient.post<any>(
          "/api/v1/Auth/refresh",
          {}
        );

        const newAccess = data.data ? data.data.access_token : data.access_token;
        if (!newAccess) throw new Error("No access token in refresh response");
        setAccessToken(newAccess);
        notifyQueue(newAccess);

        // replay request ban đầu
        (original.headers ??= {} as any);
        (original.headers as any).Authorization = `Bearer ${newAccess}`;
        return axiosClient(original);
      } catch (e) {
        console.error("Refresh Token FAILED:", e);
        setAccessToken(null);
        notifyQueue(null);
        if (typeof window !== "undefined" && window.location.pathname !== "/auth/login") {
          window.location.replace("/auth/login");
        }
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
