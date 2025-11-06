// src/entities/product/types.ts

// ====== Common ======
export type Id = number;

// Nếu status là enum số hoặc string ở BE, để FE linh hoạt ta để union tạm
export type ProductStatus = number | string;

// ====== List ======
export interface ProductCard {
  productId: Id;
  name: string;
  slug: string;
  primaryImageUrl?: string | null;
  minPriceMinor: number;
  brandId?: Id | null;
}

export interface ProductListParams {
  keyword?: string;
  brandId?: Id;
  categoryId?: Id;
  status?: ProductStatus;
  priceMin?: number;
  priceMax?: number;
  page?: number; // default BE đang nhận q.Page
  size?: number; // default BE đang nhận q.Size
  sort?: string; // ví dụ: "price_asc,name_desc,createdAt_desc" (tùy BE định nghĩa)
}

export interface PageRes<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

// ====== Detail ======
export interface Sku {
  skuId: Id;
  skuCode: string;
  priceMinor: number;
  isActive: boolean;
}

export interface ProductImage {
  imageId: Id;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductAttributeValue {
  attributeId: Id;
  valueText?: string | null;
  valueNumber?: number | null;
  valueBool?: boolean | null;
}

export interface ProductDetail {
  productId: Id;
  name: string;
  slug: string;
  description?: string | null;
  status: ProductStatus;
  brandId?: Id | null;
  skus: Sku[];
  images: ProductImage[];
  categoryIds: Id[];
  attributes: ProductAttributeValue[];
}

// ====== Create / Update payloads ======
export interface ProductSkuCreate {
  skuCode: string;
  priceMinor: number;
  isActive: boolean;
}

export interface ProductSkuUpdate {
  skuId: Id;
  skuCode: string;
  priceMinor: number;
  isActive: boolean;
}

export interface ProductImageUpsert {
  url: string;
  isPrimary?: boolean;   // BE mặc định ảnh đầu là primary nếu không set
  sortOrder?: number;    // BE mặc định dựa theo vị trí nếu không set
}

export interface ProductAttributeUpsert {
  attributeId: Id;
  valueText?: string | null;
  valueNumber?: number | null;
  valueBool?: boolean | null;
}

export interface CreateProductReq {
  name: string;
  slug: string;
  description?: string | null;
  status: ProductStatus;
  brandId?: Id | null;
  skus: ProductSkuCreate[];
  images: ProductImageUpsert[];
  categoryIds: Id[];
  attributes: ProductAttributeUpsert[];
}

export interface UpdateProductReq {
  name: string;
  slug: string;
  description?: string | null;
  status: ProductStatus;
  brandId?: Id | null;
  skus: ProductSkuUpdate[];        // Update yêu cầu skuId
  images: ProductImageUpsert[];
  categoryIds: Id[];
  attributes: ProductAttributeUpsert[];
}

// ====== Upsert children endpoints ======
export interface UpsertProductAttributesReq {
  attributes: ProductAttributeUpsert[];
}

export interface UpsertImagesReq {
  images: ProductImageUpsert[];
}

// ====== Misc ======
export interface CreateProductRes {
  productId: Id;
}
