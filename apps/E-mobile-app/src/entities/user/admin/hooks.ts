import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUserApi } from "./api";
import { UserListParams } from "./types";

export const adminUserKeys = {
  all: ["admin-users"] as const,
  list: (params: UserListParams) => [...adminUserKeys.all, "list", params] as const,
};

// Hook lấy danh sách User
export function useAdminUserList(params: UserListParams) {
  return useQuery({
    queryKey: adminUserKeys.list(params),
    queryFn: () => adminUserApi.list(params),
    placeholderData: keepPreviousData,
  });
}

// Hook gán quyền (Mutation)
export function useAssignRole() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: string }) => 
            adminUserApi.assignRole(userId, role),
        onSuccess: () => {
            // Sau khi gán thành công, làm mới danh sách user để cập nhật Role mới
            qc.invalidateQueries({ queryKey: adminUserKeys.all });
        }
    });
}