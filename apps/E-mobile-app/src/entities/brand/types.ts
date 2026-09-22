export type BrandId = number;

export interface Brand {
  brandId: BrandId;
  name: string;
  slug: string;
  createdAt: string; // ISO
}

export interface BrandListParams {
  keyword?: string;
  page?: number;
  size?: number;
}

export interface PageRes<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}