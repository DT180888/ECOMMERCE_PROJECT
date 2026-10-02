// Common Types
export type Id = number;
export type ProductStatus = number | string;

export interface PageRes<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

// Product Card (List)
export interface ProductCard {
  productId: Id;
  name: string;
  slug: string;
  thumbnailUrl?: string | null;
  minPriceMinor: number;
  maxPriceMinor: number;
  brandId?: Id | null;
  brandName?: string | null;
  skuCount: number;
}

export interface ProductListParams {
  keyword?: string;
  brandId?: Id;
  brandSlug?: string;
  categoryId?: Id;
  categorySlug?: string;
  collectionSlug?: string;
  status?: ProductStatus;
  priceMin?: number;
  priceMax?: number;
  attrs?: string;
  page?: number;
  size?: number;
  sort?: string;
  promotionId?: number;
}

export interface FilterAttributeDto {
  attributeId: number;
  name: string;
  slug: string;
  unit?: string | null;
  values: string[];
}

// Product Detail
export interface SkuOptionDetail {
  attributeId: Id;
  attributeName: string;
  attributeSlug: string;
  value: string;
}

export interface Sku {
  skuId: Id;
  skuCode: string;
  priceMinor: number;
  isActive: boolean;
  quantityOnHand: number;
  quantityReserved: number;
  available: number;
  imageUrl?: string | null;
  options: SkuOptionDetail[];
}

export interface ProductImage {
  imageId: Id;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
  skuCode?: string | null;
}

export interface ProductAttributeValue {
  attributeId: Id;
  attributeName: string;
  valueText?: string | null;
  valueNumber?: number | null;
  valueBool?: boolean | null;
  valueDate?: string | null;
  valueOptionId?: number | null;
  valueOptionIds?: number[] | null;
}

export interface ProductDetail {
  productId: Id;
  name: string;
  slug: string;
  description?: string | null;
  status: ProductStatus;
  brandId?: Id | null;
  brandName?: string | null;
  skus: Sku[];
  images: ProductImage[];
  categoryIds: Id[];
  collectionIds: Id[];
  attributes: ProductAttributeValue[];
}

// Create / Update Payloads
export type SkuOptionUpsert = {
  attributeId: number;
  value: string;
};

export interface ProductSkuCreate {
  skuCode: string;
  priceMinor: number;
  isActive: boolean;
  options?: SkuOptionUpsert[];
}

export interface ProductSkuUpdate {
  skuId?: Id | null;
  skuCode: string;
  priceMinor: number;
  isActive: boolean;
  options?: SkuOptionUpsert[];
}

export interface ProductImageUpsert {
  url: string;
  isPrimary?: boolean;
  sortOrder?: number;
  skuCode?: string | null;
}

export interface ProductAttributeUpsert {
  attributeId: Id;
  valueText?: string | null;
  valueNumber?: number | null;
  valueBool?: boolean | null;
  valueDate?: string | null;
  valueOptionId?: number | null;
  valueOptionIds?: number[] | null;
}

export type CreateProductReq = {
  name: string;
  slug: string;
  description?: string | null;
  status: ProductStatus;
  brandId?: number | null;
  skus: ProductSkuCreate[];
  images: ProductImageUpsert[];
  categoryIds: number[];
  collectionIds: number[];
  attributes: ProductAttributeUpsert[];
};

export interface UpdateProductReq {
  name: string;
  slug: string;
  description?: string | null;
  status: ProductStatus;
  brandId?: Id | null;
  skus: ProductSkuUpdate[];
  images: ProductImageUpsert[];
  categoryIds: Id[];
  collectionIds: Id[];
  attributes: ProductAttributeUpsert[];
}

export interface UpsertProductAttributesReq {
  attributes: ProductAttributeUpsert[];
}

export interface UpsertImagesReq {
  images: ProductImageUpsert[];
}

export interface CreateProductRes {
  productId: Id;
}

// Admin SKU & Bulk Operations
export interface AdminSkuItem {
  skuId: Id;
  skuCode: string;
  priceMinor: number;
  isActive: boolean;
  productId: Id;
  productName: string;
  quantityOnHand: number;
  quantityReserved: number;
  available: number;
  imageUrl?: string | null;
  options: SkuOptionDetail[];
}

export interface AdminSkuListParams {
  skuCode?: string;
  productName?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  isActive?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
}

export interface BulkPriceUpdateReq {
  skuIds: Id[];
  updateType: "Set" | "AdjustAmount" | "AdjustPercentage";
  value: number;
}

export interface BulkStockUpdateReq {
  skuIds: Id[];
  updateType: "Set" | "Adjust";
  quantity: number;
}

export interface BulkStatusUpdateReq {
  skuIds: Id[];
  isActive: boolean;
}
