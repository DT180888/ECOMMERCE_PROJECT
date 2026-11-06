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

  getMyVouchers: async (): Promise<MyVoucherDto[]> => {
    const { data } = await axiosClient.get<any[]>("/api/v1/me/vouchers");
    return (data || []).map((item) => ({
      couponId: item.couponId,
      code: item.code,
      promotionId: item.promotionId,
      promotionName: item.promotion?.name ?? item.promotionName ?? "",
      type: item.promotion?.type ?? item.type ?? 0,
      value: item.promotion?.value ?? item.value ?? 0,
      startsAt: item.promotion?.startsAt ?? item.startsAt ?? null,
      endsAt: item.promotion?.endsAt ?? item.endsAt ?? null,
      isRedeemed: item.isRedeemed ?? false,
      promotion: item.promotion ?? null,
    }));
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
