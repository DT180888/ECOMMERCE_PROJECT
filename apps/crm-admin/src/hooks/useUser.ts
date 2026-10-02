import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, adminUserApi, type UpdateProfilePayload, type UserListParams } from "@my-project/api";

export const USER_KEYS = {
  profile: ["user", "profile"],
};

export const adminUserKeys = {
  all: ["admin-users"] as const,
  list: (params: UserListParams) => [...adminUserKeys.all, "list", params] as const,
};

export const useMyProfile = () => {
  return useQuery({
    queryKey: USER_KEYS.profile,
    queryFn: userApi.getMyProfile,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => userApi.updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.profile });
    },
  });
};

export function useAdminUserList(params: UserListParams) {
  return useQuery({
    queryKey: adminUserKeys.list(params),
    queryFn: () => adminUserApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useAssignRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) => 
      adminUserApi.assignRole(userId, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminUserKeys.all });
    }
  });
}
