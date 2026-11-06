export interface PromotionSummaryDto {
  promotionId: number;
  code?: string | null;
  name: string;
  type: number;
  value: number;
  startsAt?: string | null;
  endsAt?: string | null;
}

export interface MyVoucherDto {
  couponId: number;
  code: string;
  promotionId: number;
  promotionName: string;
  type: number;
  value: number;
  startsAt: string | null;
  endsAt: string | null;
  isRedeemed?: boolean;
  promotion?: PromotionSummaryDto | null;
}

export interface CouponDto {
  couponId: number;
  code: string;
  promotionId: number;
  isRedeemed: boolean;
  redeemedBy?: string | null;
  redeemedAt?: string | null;
  ownerId?: string | null;
  promotion?: PromotionSummaryDto | null;
  /** @deprecated use isRedeemed */
  isUsed?: boolean;
  /** @deprecated use redeemedAt */
  usedAt?: string | null;
  userId?: string | null;
  createdAt?: string;
}

