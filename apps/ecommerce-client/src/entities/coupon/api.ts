import { axiosClient } from "@my-project/shared-utils";

export interface MyVoucherDto {
  couponId: number;
  code: string;
  promotionId: number;
  promotionName: string;
  type: number;
  value: number;
  startsAt: string | null;
  endsAt: string | null;
}

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
