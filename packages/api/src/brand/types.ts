export type BrandId = number;

export interface Brand {
  brandId: BrandId;
  name: string;
  slug: string;
  createdAt: string;
}

export interface BrandListParams {
  keyword?: string;
  page?: number;
  size?: number;
}
