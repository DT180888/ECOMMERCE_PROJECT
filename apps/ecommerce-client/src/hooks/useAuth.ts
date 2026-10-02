import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccessToken, setAccessToken } from "@my-project/shared-utils";
import {
  apiMe,
  apiLogin,
  apiLogout,
  apiRegister,
  apiConfirmEmailAndSetPassword,
  apiForgotPassword,
  apiResetPassword,
  apiChangePassword,
  apiAssignRole,
  type LoginPayload,
  type LoginRes,
  type MeRes,
  type RegisterPayload,
  type RegisterRes,
  type ForgotPasswordRes,
  type ForgotPasswordPayload,
} from "@my-project/api";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export function useAuthUser(opts?: { enabled?: boolean }) {
  const hasToken = !!getAccessToken();
  const enabled = opts?.enabled ?? hasToken;

  return useQuery<MeRes>({
    queryKey: authKeys.me,
    queryFn: apiMe,
    retry: false,
    enabled,
    staleTime: 60_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation<LoginRes, unknown, LoginPayload>({
    mutationFn: apiLogin,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: authKeys.me });
    },
    onError: () => {
      setAccessToken(null);
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiLogout,
    onSuccess: async () => {
      await qc.removeQueries({ queryKey: authKeys.me });
    },
  });
}

export function useRegister() {
  return useMutation<RegisterRes, unknown, RegisterPayload>({
    mutationFn: apiRegister,
  });
}

export function useConfirmEmailAndSetPassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiConfirmEmailAndSetPassword,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}

export function useForgotPassword() {
  return useMutation<ForgotPasswordRes, unknown, ForgotPasswordPayload>({
    mutationFn: apiForgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: apiResetPassword,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: apiChangePassword,
  });
}

export function useAssignRole() {
  return useMutation({
    mutationFn: apiAssignRole,
  });
}
