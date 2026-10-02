import { axiosClient } from "@my-project/shared-utils";
import type { ActivePromotionDto, CreatePromotionReq } from "./types";

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
  getPromotions: async (page = 1, size = 10, search?: string) => {
    const { data } = await axiosClient.get<any>("/api/v1/promotions", {
      params: { page, size, search },
    });
    return data;
  },

  getPromotionById: async (id: number) => {
    const { data } = await axiosClient.get<ActivePromotionDto>(`/api/v1/promotions/${id}`);
    return data;
  },

  createPromotion: async (payload: CreatePromotionReq) => {
    const { data } = await axiosClient.post<ActivePromotionDto>("/api/v1/promotions", payload);
    return data;
  },

  updatePromotion: async (id: number, payload: CreatePromotionReq) => {
    const { data } = await axiosClient.put<ActivePromotionDto>(`/api/v1/promotions/${id}`, payload);
    return data;
  },

  deletePromotion: async (id: number) => {
    await axiosClient.delete(`/api/v1/promotions/${id}`);
  },
};
