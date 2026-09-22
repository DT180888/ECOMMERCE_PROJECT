import { axiosClient } from "@my-project/shared-utils";
import { UserAdminRes, UserListParams, AssignRoleReq, PageListResponse } from "./types";

export const adminUserApi = {
  // API láº¥y danh sÃ¡ch user (cÃ³ phÃ¢n trang, tÃ¬m kiáº¿m)
  list: (params: UserListParams) => {
    return axiosClient
      .get<PageListResponse<UserAdminRes>>("/api/v1/admin/users", { params })
      .then((r) => r.data);
  },

  // API gÃ¡n quyá»n cho user
  assignRole: (userId: string, role: string) => {
    const payload: AssignRoleReq = { role };
    return axiosClient.post(`/api/v1/admin/users/${userId}/roles`, payload);
  }
};
