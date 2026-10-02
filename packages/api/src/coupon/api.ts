import { axiosClient } from "@my-project/shared-utils";
import type { MyVoucherDto, CouponDto } from "./types";
import type { PageRes } from "../product/types";

export const couponClientApi = {
  assignCouponToUser: async (promotionId: number) => {
    const { data } = await axiosClient.post<{ couponId: number; code: string }>(
      `/api/v1/promotions/${promotionId}/collect`
    );
    return data;
  },

  getMyVouchers: async () => {
    const { data } = await axiosClient.get<MyVoucherDto[]>("/api/v1/coupons/my-vouchers");
    return data;
  }
};

export const couponApi = {
  getCouponsByPromotion: async (promotionId: number, page = 1, size = 10): Promise<PageRes<CouponDto>> => {
    const { data } = await axiosClient.get<PageRes<CouponDto>>(`/api/v1/promotions/${promotionId}/coupons`, {
      params: { page, size },
    });
    return data;
  },

  generateCoupons: async (promotionId: number, count: number): Promise<void> => {
    await axiosClient.post(`/api/v1/promotions/${promotionId}/coupons/generate`, { count });
  },
};
