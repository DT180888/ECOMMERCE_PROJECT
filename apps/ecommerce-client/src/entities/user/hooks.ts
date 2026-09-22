// src/features/user/hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "./api";
import type { UpdateProfilePayload } from "./types";

// Key Ä‘á»ƒ cache dá»¯ liá»‡u
export const USER_KEYS = {
  profile: ["user", "profile"],
};

// Hook láº¥y thÃ´ng tin profile
export const useMyProfile = () => {
  return useQuery({
    queryKey: USER_KEYS.profile,
    queryFn: userApi.getMyProfile,
    staleTime: 1000 * 60 * 5, // Cache 5 phÃºt
    retry: 1,
  });
};

// Hook cáº­p nháº­t profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => userApi.updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.profile });
    },
  });
};

