import { axiosClient, setAccessToken, clientSideLogout } from "@my-project/shared-utils";

// ===== Types khớp BE =====
export type LoginPayload = { email: string; password: string; remember?: boolean };
export type LoginRes = { access_token: string; token_type: string; expires_in: number };

export type RegisterPayload = { email: string }; 
export type RegisterRes = { message: string }; 

export type ConfirmEmailAndSetPasswordPayload = { userId: string; token: string; newPassword: string };

export type ForgotPasswordPayload = { email: string };
export type ForgotPasswordRes = { message: string };

export type ResetPasswordPayload = { userId: string; token: string; newPassword: string };

export type ChangePasswordPayload = { currentPassword: string; newPassword: string };

export type MeRes = { id: string; email: string; roles: string[]; permissions: string[] };

export type AssignRolePayload = { userId?: string; email?: string; role: string };

export const AUTH_PATHS = {
  me: "/api/v1/auth/me",
  login: "/api/v1/auth/login",
  logout: "/api/v1/auth/logout",
  register: "/api/v1/auth/register",
  confirmSetPwd: "/api/v1/auth/confirm-email-set-password",
  forgot: "/api/v1/auth/forgot-password",
  reset: "/api/v1/auth/reset-password",
  changePwd: "/api/v1/auth/change-password",
  assignRole: "/api/v1/auth/assign-role",
};

// ===== API calls =====
export async function apiMe(): Promise<MeRes> {
  const { data } = await axiosClient.get<MeRes>(AUTH_PATHS.me);
  return data;
}

export async function apiLogin(payload: LoginPayload): Promise<LoginRes> {
  const { data } = await axiosClient.post<LoginRes>(AUTH_PATHS.login, payload);
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
  if (payload.userId) {
    await axiosClient.post(`/api/v1/admin/users/${payload.userId}/roles`, { role: payload.role });
  } else {
    await axiosClient.post(AUTH_PATHS.assignRole, payload);
  }
}

