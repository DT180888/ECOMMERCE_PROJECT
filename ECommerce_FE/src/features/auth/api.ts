import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosClient, setAccessToken, getAccessToken } from "@shared/api/axiosClient";

// ==== TYPES ====
export type LoginPayload = { email: string; password: string; remember?: boolean };
export type LoginResponse = { access_token: string; token_type: string; expires_in: number };

export type RegisterPayload = { email: string; password: string };
export type ConfirmEmailPayload = { userId: string; token: string };

export type ForgotPasswordPayload = { email: string };
export type ResetPasswordPayload = { userId: string; token: string; newPassword: string };

export type ChangePasswordPayload = { currentPassword: string; newPassword: string };

type MeResponse = { id: string; email: string; roles: string[] };

// ==== QUERIES ====
export function useMe(opts?: { enabled?: boolean }) {
  const hasToken = !!getAccessToken();
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => (await axiosClient.get<MeResponse>("/api/auth/me")).data,
    retry: false,
    enabled: opts?.enabled ?? hasToken,   // 👈 chỉ chạy khi có token
  });
}

// ==== MUTATIONS ====
export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) =>
      (await axiosClient.post<LoginResponse>("/api/auth/login", payload)).data,
    onSuccess: (res) => setAccessToken(res.access_token),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => axiosClient.post("/api/auth/logout"),
    onSettled: () => {
      setAccessToken(null);
      if (window.location.pathname !== "/auth/login") window.location.replace("/auth/login");
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) =>
      (await axiosClient.post("/api/auth/register", payload)).data as { userId: string; confirmToken: string },
  });
}

export function useConfirmEmail() {
  return useMutation({
    mutationFn: async (payload: ConfirmEmailPayload) =>
      (await axiosClient.post("/api/auth/confirm-email", payload)).data,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (payload: ForgotPasswordPayload) =>
      (await axiosClient.post("/api/auth/forgot-password", payload)).data as { userId: string; resetToken: string },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: ResetPasswordPayload) =>
      (await axiosClient.post("/api/auth/reset-password", payload)).data,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) =>
      (await axiosClient.post("/api/auth/change-password", payload)).data,
  });
}
