export interface ActivePromotionDto {
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
  scope?: string | number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
}

export interface CreatePromotionReq {
  name: string;
  type: number;
  value: number;
  code?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive?: boolean;
  maxRedemptions?: number | null;
  categoryIds?: number[];
  productIds?: number[];
  scope?: string | number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
}
