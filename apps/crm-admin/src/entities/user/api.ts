import { axiosClient } from "@my-project/shared-utils";
import { UpdateProfilePayload, UserProfile } from "./types";

// Endpoint base dá»±a trÃªn Controller cá»§a báº¡n
const BASE_URL = "/api/v1/users/me";

export const userApi = {
  getMyProfile: async (): Promise<UserProfile> => {
    const res = await axiosClient.get<UserProfile>(`${BASE_URL}/profile`);
    return res.data;
  },

  updateMyProfile: async (data: UpdateProfilePayload): Promise<void> => {
    await axiosClient.put(`${BASE_URL}/profile`, data);
  },
};
