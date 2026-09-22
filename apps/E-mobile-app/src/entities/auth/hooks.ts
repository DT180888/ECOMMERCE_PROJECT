import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiChangePassword,
  apiConfirmEmailAndSetPassword,
  apiForgotPassword,
  apiLogin,
  apiLogout,
  apiMe,
  apiRegister,
  apiResetPassword,
  type ForgotPasswordPayload,
  type ForgotPasswordRes,
  type LoginPayload,
  type LoginRes,
  type MeRes,
  type RegisterPayload,
  type RegisterRes
} from "./api";
// import { setAccessToken } from "@shared/api/axiosClient"; // Không cần import lẻ nữa nếu dùng trong api.ts rồi

export const authKeys = {
  me: ["auth", "me"] as const,
};

// ⚠️ UPDATE: Loại bỏ logic check token đồng bộ
export function useAuthUser(opts?: { enabled?: boolean }) {
  return useQuery<MeRes>({
    queryKey: authKeys.me,
    queryFn: apiMe,
    retry: false,
    // Mặc định là true nếu không truyền opts. 
    // Nếu chưa login, API trả 401 -> Query Error -> App xử lý chuyển trang.
    enabled: opts?.enabled ?? true, 
    staleTime: 60_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation<LoginRes, unknown, LoginPayload>({
    mutationFn: apiLogin,
    onSuccess: async () => {
      // Sau khi login xong, invalidate để fetch lại info user
      await qc.invalidateQueries({ queryKey: authKeys.me });
    },
    // onError xử lý ở tầng UI hoặc để axios interceptor lo
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: apiLogout,
    onSuccess: async () => {
      // Logout xong thì xóa cache user
      await qc.removeQueries({ queryKey: authKeys.me });
      // Điều hướng về Login sẽ xử lý ở tầng UI (Component)
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