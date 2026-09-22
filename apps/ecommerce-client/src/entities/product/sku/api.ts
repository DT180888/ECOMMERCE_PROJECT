import { axiosClient } from "@my-project/shared-utils";
import type {
  ProductId, SkuId, SkuRes, Sku
} from "./types";

const base = (productId: ProductId) => `/api/v1/products/${productId}/skus`;

export async function apiListSkus(productId: ProductId): Promise<Sku[]> {
  const { data } = await axiosClient.get<SkuRes[]>(base(productId));
  return data;
}


