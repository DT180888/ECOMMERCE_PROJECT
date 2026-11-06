import { axiosClient } from "@my-project/shared-utils";
import type { UserProfile, UpdateProfilePayload, UserAdminRes, UserListParams, AssignRoleReq, PageListResponse } from "./types";

const BASE_URL = "/api/v1/me";

export const userApi = {
  getMyProfile: async (): Promise<UserProfile> => {
    const res = await axiosClient.get<UserProfile>(`${BASE_URL}/profile`);
    return res.data;
  },

  updateMyProfile: async (data: UpdateProfilePayload): Promise<void> => {
    await axiosClient.put(`${BASE_URL}/profile`, data);
  },
};

export const adminUserApi = {
  list: (params: UserListParams) => {
    return axiosClient
      .get<PageListResponse<UserAdminRes>>("/api/v1/admin/users", { params })
      .then((r) => r.data);
  },

  assignRole: (userId: string, role: string) => {
    const payload: AssignRoleReq = { role };
    return axiosClient.post(`/api/v1/admin/users/${userId}/roles`, payload);
  },
};
