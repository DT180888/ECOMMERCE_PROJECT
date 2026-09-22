import { axiosClient } from "@shared/api/axiosClient";
import { UpdateProfilePayload, UserProfile } from "./types";

// Endpoint base dựa trên Controller của bạn
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