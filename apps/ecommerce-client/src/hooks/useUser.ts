import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@my-project/api";
import type { UpdateProfilePayload } from "@my-project/api";

export const USER_KEYS = {
  profile: ["user", "profile"],
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
