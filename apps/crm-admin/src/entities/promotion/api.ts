import { axiosClient } from "@my-project/shared-utils";

export interface PromotionDto {
  promotionId: number;
  code: string | null;
  name: string;
  type: number;
  value: number;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  maxRedemptions: number | null;
  redemptionsCount: number;
  categoryIds: number[];
  productIds: number[];
  scope: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
}

export interface CreatePromotionReq {
  code?: string;
  name: string;
  type: number;
  value: number;
  startsAt?: string;
  endsAt?: string;
  isActive: boolean;
  maxRedemptions?: number;
  categoryIds?: number[];
  productIds?: number[];
  scope: number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
}

export interface UpdatePromotionReq extends CreatePromotionReq {}

export interface PageRes<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

const BASE_URL = "/api/v1/promotions";

export const promotionApi = {
  getPromotions: async (page = 1, size = 10, search?: string) => {
    const { data } = await axiosClient.get<PageRes<PromotionDto>>(BASE_URL, {
      params: { pageNumber: page, pageSize: size, search }
    });
    return data;
  },

  getPromotionById: async (id: number) => {
    const { data } = await axiosClient.get<PromotionDto>(`${BASE_URL}/${id}`);
    return data;
  },

  createPromotion: async (payload: CreatePromotionReq) => {
    const { data } = await axiosClient.post<{ promotionId: number }>(BASE_URL, payload);
    return data;
  },

  updatePromotion: async (id: number, payload: UpdatePromotionReq) => {
    await axiosClient.put(`${BASE_URL}/${id}`, payload);
  },

  deletePromotion: async (id: number) => {
    await axiosClient.delete(`${BASE_URL}/${id}`);
  }
};
