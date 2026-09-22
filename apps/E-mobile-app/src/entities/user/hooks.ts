// src/features/user/hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@entities/user/api";
import { UpdateProfilePayload } from "@entities/user/types";

// Key để cache dữ liệu
export const USER_KEYS = {
  profile: ["user", "profile"],
};

// Hook lấy thông tin profile
export const useMyProfile = () => {
  return useQuery({
    queryKey: USER_KEYS.profile,
    queryFn: userApi.getMyProfile,
    staleTime: 1000 * 60 * 5, // Cache 5 phút
    retry: 1,
  });
};

// Hook cập nhật profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => userApi.updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.profile });
    },
  });
};