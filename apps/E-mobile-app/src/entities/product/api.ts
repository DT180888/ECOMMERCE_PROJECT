// src/entities/product/api.ts
import { axiosClient } from "@shared/api/axiosClient";
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
} from "./types";

const BASE_URL = "/api/v1/products";

// Build query params: bỏ undefined/ null
const buildQuery = (params?: ProductListParams) => {
  if (!params) return {};
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  return Object.fromEntries(entries);
};

// ====== API calls ======

export async function listProducts(
  params?: ProductListParams
): Promise<PageRes<ProductCard>> {
  const { data } = await axiosClient.get<PageRes<ProductCard>>(BASE_URL, {
    params: buildQuery(params),
  });
  return data;
}

export async function getProductById(id: Id): Promise<ProductDetail> {
  const { data } = await axiosClient.get<ProductDetail>(`${BASE_URL}/${id}`);
   console.log(data);
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
  await axiosClient.put<void>(`${BASE_URL}/${id}`, payload);
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
