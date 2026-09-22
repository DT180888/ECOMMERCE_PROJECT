import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUserApi } from "./api";
import { UserListParams } from "./types";

export const adminUserKeys = {
  all: ["admin-users"] as const,
  list: (params: UserListParams) => [...adminUserKeys.all, "list", params] as const,
};

// Hook láº¥y danh sÃ¡ch User
export function useAdminUserList(params: UserListParams) {
  return useQuery({
    queryKey: adminUserKeys.list(params),
    queryFn: () => adminUserApi.list(params),
    placeholderData: keepPreviousData,
  });
}

// Hook gÃ¡n quyá»n (Mutation)
export function useAssignRole() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: string }) => 
            adminUserApi.assignRole(userId, role),
        onSuccess: () => {
            // Sau khi gÃ¡n thÃ nh cÃ´ng, lÃ m má»›i danh sÃ¡ch user Ä‘á»ƒ cáº­p nháº­t Role má»›i
            qc.invalidateQueries({ queryKey: adminUserKeys.all });
        }
    });
}
