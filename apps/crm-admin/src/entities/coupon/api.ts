import { axiosClient } from "@my-project/shared-utils";

export interface CouponDto {
  couponId: number;
  code: string;
  promotionId: number;
  isRedeemed: boolean;
  redeemedBy: string | null;
  redeemedAt: string | null;
  ownerId: string | null;
}

export interface PageRes<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

export const couponApi = {
  getCouponsByPromotion: async (promotionId: number, page = 1, size = 20) => {
    const { data } = await axiosClient.get<PageRes<CouponDto>>(`/api/v1/promotions/${promotionId}/coupons`, {
      params: { pageNumber: page, pageSize: size }
    });
    return data;
  },

  generateCoupons: async (promotionId: number, count: number) => {
    const { data } = await axiosClient.post<string[]>(`/api/v1/promotions/${promotionId}/coupons/generate`, null, {
      params: { count }
    });
    return data;
  }
};
