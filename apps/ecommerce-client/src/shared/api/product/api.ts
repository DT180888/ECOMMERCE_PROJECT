import { axiosClient } from "@my-project/shared-utils";
import type {
  PageRes,
  ProductCard,
  ProductListParams,
  ProductDetail,
  CreateProductReq,
  UpdateProductReq,
  CreateProductRes,
  UpsertImagesReq,
  UpsertProductAttributesReq,
  Id,
  FilterAttributeDto,
  AdminSkuItem,
  AdminSkuListParams,
  BulkPriceUpdateReq,
  BulkStockUpdateReq,
  BulkStatusUpdateReq,
  CreateProductSkuReq,
  UpdateProductSkuReq,
} from "./types";

const BASE_URL = "/api/v1/products";

const buildQuery = (params?: Record<string, any>) => {
  if (!params) return {};
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  return Object.fromEntries(entries);
};

export async function listProducts(
  params?: ProductListParams
): Promise<PageRes<ProductCard>> {
  const queryParams: Record<string, any> = {
    keyword: params?.keyword,
    brandSlug: params?.brandSlug,
    categorySlug: params?.categorySlug,
    collectionSlug: params?.collectionSlug,
    attrs: params?.attrs,
    page: params?.page,
    size: params?.size,
    minPrice: params?.minPrice ?? params?.priceMin,
    maxPrice: params?.maxPrice ?? params?.priceMax,
    sortBy: params?.sortBy ?? params?.sort,
    promotionId: params?.promotionId,
  };

  const { data } = await axiosClient.get<PageRes<ProductCard>>(BASE_URL, {
    params: buildQuery(queryParams),
  });
  return data;
}

export async function getProductById(id: Id): Promise<ProductDetail> {
  const { data } = await axiosClient.get<ProductDetail>(`${BASE_URL}/${id}`);
  return data;
}

export async function getFilterableAttributes(): Promise<{ attributes: FilterAttributeDto[] }> {
  const { data } = await axiosClient.get<{ attributes: FilterAttributeDto[] }>(`${BASE_URL}/filters`);
  return data;
}

export async function createProduct(
  payload: CreateProductReq
): Promise<CreateProductRes> {
  const { data } = await axiosClient.post<CreateProductRes>(BASE_URL, payload);
  return data;
}

export async function updateProduct(
  id: Id,
  payload: UpdateProductReq
): Promise<void> {
  const { skus, images, ...corePayload } = payload;
  await axiosClient.put<void>(`${BASE_URL}/${id}`, corePayload);

  // If images were passed in updateProduct, also sync them via dedicated endpoint so they aren't lost
  if (images && images.length > 0) {
    await upsertProductImages(id, { images });
  }
}

export async function deleteProduct(id: Id): Promise<void> {
  await axiosClient.delete<void>(`${BASE_URL}/${id}`);
}

export async function upsertProductAttributes(
  id: Id,
  payload: UpsertProductAttributesReq
): Promise<void> {
  await axiosClient.put<void>(`${BASE_URL}/${id}/attributes`, payload);
}

export async function upsertProductImages(
  id: Id,
  payload: UpsertImagesReq
): Promise<void> {
  await axiosClient.put<void>(`${BASE_URL}/${id}/images`, payload);
}

// Individual SKU CRUD
export async function createProductSku(
  productId: Id,
  payload: CreateProductSkuReq
): Promise<{ skuId: Id }> {
  const { data } = await axiosClient.post<{ skuId: Id }>(
    `/api/v1/admin/products/${productId}/skus`,
    payload
  );
  return data;
}

export async function updateProductSku(
  productId: Id,
  skuId: Id,
  payload: UpdateProductSkuReq
): Promise<void> {
  await axiosClient.put<void>(
    `/api/v1/admin/products/${productId}/skus/${skuId}`,
    payload
  );
}

export async function deleteProductSku(productId: Id, skuId: Id): Promise<void> {
  await axiosClient.delete<void>(
    `/api/v1/admin/products/${productId}/skus/${skuId}`
  );
}

export async function getProductSkuById(productId: Id, skuId: Id): Promise<any> {
  const { data } = await axiosClient.get<any>(
    `/api/v1/admin/products/${productId}/skus/${skuId}`
  );
  return data;
}

export async function listProductSkus(productId: Id): Promise<any[]> {
  const { data } = await axiosClient.get<any[]>(
    `/api/v1/admin/products/${productId}/skus`
  );
  return data;
}

// Admin SKU API & Bulk Operations
export async function listAllSkus(
  params?: AdminSkuListParams
): Promise<PageRes<AdminSkuItem>> {
  const { data } = await axiosClient.get<PageRes<AdminSkuItem>>("/api/v1/admin/skus", {
    params: buildQuery(params as any),
  });
  return data;
}

export async function bulkUpdateSkuPrice(
  payload: BulkPriceUpdateReq
): Promise<void> {
  await axiosClient.post<void>("/api/v1/admin/skus/bulk-price", payload);
}

export async function bulkUpdateSkuStock(
  payload: BulkStockUpdateReq
): Promise<void> {
  await axiosClient.post<void>("/api/v1/admin/skus/bulk-stock", payload);
}

export async function bulkUpdateSkuStatus(
  payload: BulkStatusUpdateReq
): Promise<void> {
  await axiosClient.post<void>("/api/v1/admin/skus/bulk-status", payload);
}

