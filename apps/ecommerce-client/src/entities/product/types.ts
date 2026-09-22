// src/entities/product/types.ts

// ====== Common ======
export type Id = number;

// Nếu BE đã chốt enum số thì sửa thành union số; tạm giữ number|string để không break UI
export type ProductStatus = number | string;

// ====== List ======
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
  brandSlug?: string;
  categorySlug?: string;
  status?: ProductStatus;
  priceMin?: number;
  priceMax?: number;
  attrs?: string;
  page?: number;
  size?: number;
  sort?: string; // ví dụ: "price_asc,name_desc,created_desc"
  collectionSlug?: string;
  promotionId?: number;
}

export interface FilterAttributeDto {
  attributeId: number;
  name: string;
  slug: string;
  unit?: string | null;
  values: string[];
}

export interface PageRes<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

// ====== Detail ======

// Định nghĩa mới cho SkuOptionRes để khớp với API GetById
export interface SkuOptionDetail {
  attributeId: Id;
  attributeName: string;
  attributeSlug: string;
  value: string;
}

// Cập nhật Sku để bao gồm thông tin chi tiết về số lượng và options
export interface Sku {
  skuId: Id;
  skuCode: string;
  priceMinor: number;
  isActive: boolean;
  quantityOnHand: number;    // Thêm từ API
  quantityReserved: number;  // Thêm từ API
  available: number;         // Thêm từ API
  options: SkuOptionDetail[]; // Thêm từ API
}

export interface ProductImage {
  imageId: Id;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
  skuCode?: string | null;
}

// Giữ nguyên ProductAttributeValue của bạn, vì nó đã bao gồm các trường có thể là null
// API GetById chỉ trả về valueText, valueNumber, valueBool, nên các trường khác sẽ là undefined/null
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
  skus: Sku[]; // Đã cập nhật Sku
  images: ProductImage[];
  categoryIds: Id[];
  attributes: ProductAttributeValue[];
}
