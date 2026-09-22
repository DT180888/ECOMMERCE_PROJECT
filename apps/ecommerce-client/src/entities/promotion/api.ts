import { axiosClient } from "@my-project/shared-utils";

export interface ActivePromotionDto {
  promotionId: number;
  code: string | null;
  name: string;
  type: number; // 0 = Percent, 1 = Fixed Amount
  value: number;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  maxRedemptions: number | null;
  redemptionsCount: number;
  categoryIds: number[];
  productIds: number[];
}

export const promotionClientApi = {
  getActivePromotions: async () => {
    const { data } = await axiosClient.get<ActivePromotionDto[]>("/api/v1/promotions/active");
    return data;
  },
  getPromotionById: async (id: number) => {
    const { data } = await axiosClient.get<ActivePromotionDto>(`/api/v1/promotions/${id}`);
    return data;
  }
};
