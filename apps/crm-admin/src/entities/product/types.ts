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
  brandId?: Id;
  categoryId?: Id;
  categorySlug?: string;
  collectionSlug?: string;
  status?: ProductStatus;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  size?: number;
  sort?: string; // ví dụ: "price_asc,name_desc,created_desc"
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
  imageUrl?: string | null;  // Thêm từ API
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
  collectionIds: Id[];
  attributes: ProductAttributeValue[];
}

// ====== Create / Update payloads ======

// SkuOptionUpsert của bạn vẫn ổn cho việc tạo/cập nhật, vì nó đơn giản hơn
export type SkuOptionUpsert = {
  attributeId: number;
  value: string;
  // valueId?: number | null; // có thể mở nếu BE dùng id option
};

export interface ProductSkuCreate {
  skuCode: string;
  priceMinor: number;
  isActive: boolean;
  // Khi tạo, không cần quantityOnHand, quantityReserved, available
  options?: SkuOptionUpsert[];
}

export interface ProductSkuUpdate {
  skuId?: Id | null;
  skuCode: string;
  priceMinor: number;
  isActive: boolean;
  // Khi update, không cần quantityOnHand, quantityReserved, available
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
  skus: ProductSkuUpdate[]; // Update: chỉ các SKU đã tồn tại
  images: ProductImageUpsert[];
  categoryIds: Id[];
  collectionIds: Id[];
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

// ====== Admin SKU List & Bulk Operations ======
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