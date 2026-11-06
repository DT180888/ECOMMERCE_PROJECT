import { axiosClient } from "@my-project/shared-utils";
import type { ActivePromotionDto, CreatePromotionReq, PromotionListRes } from "./types";

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

export const promotionApi = {
  getPromotions: async (page = 1, size = 10, search?: string): Promise<PromotionListRes> => {
    const { data } = await axiosClient.get<PromotionListRes>("/api/v1/promotions", {
      params: {
        pageNumber: page,
        pageSize: size,
        search: search && search.trim() ? search.trim() : undefined,
      },
    });
    return data;
  },

  getPromotionById: async (id: number): Promise<ActivePromotionDto> => {
    const { data } = await axiosClient.get<ActivePromotionDto>(`/api/v1/promotions/${id}`);
    return data;
  },

  createPromotion: async (payload: CreatePromotionReq): Promise<{ promotionId: number }> => {
    const { data } = await axiosClient.post<{ promotionId: number }>("/api/v1/promotions", payload);
    return data;
  },

  updatePromotion: async (id: number, payload: CreatePromotionReq): Promise<void> => {
    await axiosClient.put(`/api/v1/promotions/${id}`, payload);
  },

  deletePromotion: async (id: number): Promise<void> => {
    await axiosClient.delete(`/api/v1/promotions/${id}`);
  },
};
