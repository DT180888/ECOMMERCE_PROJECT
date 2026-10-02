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

export interface CouponDto {
  couponId: number;
  code: string;
  promotionId: number;
  isUsed: boolean;
  usedAt: string | null;
  userId: string | null;
  createdAt: string;
  ownerId?: string | null;
  isRedeemed?: boolean;
  redeemedAt?: string | null;
}
