import { axiosClient, setAccessToken, clientSideLogout } from "@my-project/shared-utils";

// ===== Types khớp BE =====
export type LoginPayload = { email: string; password: string; remember?: boolean };
export type LoginRes = { access_token: string; token_type: string; expires_in: number };

export type RegisterPayload = { email: string }; 
// UPDATE: Response đăng ký chỉ còn message
export type RegisterRes = { message: string }; 

export type ConfirmEmailAndSetPasswordPayload = { userId: string; token: string; newPassword: string };

export type ForgotPasswordPayload = { email: string };
// UPDATE: Response quên mật khẩu chỉ còn message
export type ForgotPasswordRes = { message: string };

export type ResetPasswordPayload = { userId: string; token: string; newPassword: string };

export type ChangePasswordPayload = { currentPassword: string; newPassword: string };

export type MeRes = { id: string; email: string; roles: string[]; permissions: string[] };

export type AssignRolePayload = { email: string; role: string };

export const AUTH_PATHS = {
  me: "/api/v1/Auth/me",
  login: "/api/v1/Auth/login",
  logout: "/api/v1/Auth/logout",
  register: "/api/v1/Auth/register",
  confirmSetPwd: "/api/v1/Auth/confirm-email-set-password",
  forgot: "/api/v1/Auth/forgot-password",
  reset: "/api/v1/Auth/reset-password",
  changePwd: "/api/v1/Auth/change-password",
  assignRole: "/api/v1/Auth/assign-role",
};

// ===== API calls =====
export async function apiMe(): Promise<MeRes> {
  const { data } = await axiosClient.get<MeRes>(AUTH_PATHS.me);
  return data;
}

export async function apiLogin(payload: LoginPayload): Promise<LoginRes> {
  const { data } = await axiosClient.post<LoginRes>(AUTH_PATHS.login, payload);
  // Lưu access token ngắn hạn
  setAccessToken(data.access_token);
  return data;
}

export async function apiLogout(): Promise<void> {
  try {
    await axiosClient.post(AUTH_PATHS.logout, {});
  } finally {
    clientSideLogout();
  }
}

// UPDATE: Sửa kiểu trả về thành RegisterRes (chỉ có message)
export async function apiRegister(payload: RegisterPayload): Promise<RegisterRes> {
  const { data } = await axiosClient.post<RegisterRes>(AUTH_PATHS.register, payload);
  return data;
}

export async function apiConfirmEmailAndSetPassword(
  payload: ConfirmEmailAndSetPasswordPayload
): Promise<LoginRes> {
  const { data } = await axiosClient.post<LoginRes>(AUTH_PATHS.confirmSetPwd, payload);
  setAccessToken(data.access_token);
  return data;
}

// UPDATE: Sửa kiểu trả về thành ForgotPasswordRes (chỉ có message)
export async function apiForgotPassword(payload: ForgotPasswordPayload): Promise<ForgotPasswordRes> {
  const { data } = await axiosClient.post<ForgotPasswordRes>(AUTH_PATHS.forgot, payload);
  return data;
}

export async function apiResetPassword(payload: ResetPasswordPayload): Promise<void> {
  await axiosClient.post(AUTH_PATHS.reset, payload);
}

export async function apiChangePassword(payload: ChangePasswordPayload): Promise<void> {
  await axiosClient.post(AUTH_PATHS.changePwd, payload);
}

export async function apiAssignRole(payload: AssignRolePayload): Promise<void> {
  await axiosClient.post(AUTH_PATHS.assignRole, payload);
}