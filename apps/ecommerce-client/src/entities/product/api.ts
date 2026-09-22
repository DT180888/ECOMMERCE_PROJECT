// src/entities/product/api.ts
import { axiosClient } from "@my-project/shared-utils";
import type {
  PageRes,
  ProductCard,
  ProductListParams,
  ProductDetail,
  Id,
  FilterAttributeDto,
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



export async function getFilterableAttributes(): Promise<{ attributes: FilterAttributeDto[] }> {
  const { data } = await axiosClient.get<{ attributes: FilterAttributeDto[] }>(`${BASE_URL}/filters`);
  return data;
}
