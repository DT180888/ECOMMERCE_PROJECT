import { axiosClient } from "@shared/api/axiosClient";
import type {
  ProductId, SkuId, SkuRes, CreateSkuReq, UpdateSkuReq, Sku
} from "./types";

const base = (productId: ProductId) => `/api/v1/products/${productId}/skus`;

export async function apiListSkus(productId: ProductId): Promise<Sku[]> {
  const { data } = await axiosClient.get<SkuRes[]>(base(productId));
  return data;
}

export async function apiGetSku(productId: ProductId, skuId: SkuId): Promise<Sku> {
  const { data } = await axiosClient.get<SkuRes>(`${base(productId)}/${skuId}`);
  return data;
}

export async function apiCreateSku(productId: ProductId, payload: CreateSkuReq): Promise<{ skuId: number }> {
  const { data } = await axiosClient.post(`${base(productId)}`, payload);
  return data as { skuId: number };
}

export async function apiUpdateSku(productId: ProductId, skuId: SkuId, payload: UpdateSkuReq): Promise<void> {
  await axiosClient.put(`${base(productId)}/${skuId}`, payload);
}

export async function apiDeleteSku(productId: ProductId, skuId: SkuId, hard = false): Promise<void> {
  await axiosClient.delete(`${base(productId)}/${skuId}`, { params: { hard } });
}