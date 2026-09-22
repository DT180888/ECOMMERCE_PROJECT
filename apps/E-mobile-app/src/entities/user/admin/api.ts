import { axiosClient } from "@shared/api/axiosClient";
import { UserAdminRes, UserListParams, AssignRoleReq, PageListResponse } from "./types";

export const adminUserApi = {
  // API lấy danh sách user (có phân trang, tìm kiếm)
  list: (params: UserListParams) => {
    return axiosClient
      .get<PageListResponse<UserAdminRes>>("/api/v1/admin/users", { params })
      .then((r) => r.data);
  },

  // API gán quyền cho user
  assignRole: (userId: string, role: string) => {
    const payload: AssignRoleReq = { role };
    return axiosClient.post(`/api/v1/admin/users/${userId}/roles`, payload);
  }
};