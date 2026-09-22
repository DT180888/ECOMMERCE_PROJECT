// src/entities/category/api.ts
import {axiosClient} from "@my-project/shared-utils";
import type {
  Category,
  CategoryListParams,
  PageRes,
  CategoryNode,
  BreadcrumbRes,
  CategoryId,
} from "./types";

const BASE_URL = "/api/v1/categories";

const buildQuery = <T extends object>(params?: T) =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );

export async function listCategories(
  params?: CategoryListParams
): Promise<PageRes<Category>> {
  const { data } = await axiosClient.get<PageRes<Category>>(BASE_URL, {
    params: buildQuery(params),
  });
  return data;
}

export async function getCategoryById(id: CategoryId): Promise<Category> {
  const { data } = await axiosClient.get<Category>(`${BASE_URL}/${id}`);
  return data;
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const { data } = await axiosClient.get<Category>(`${BASE_URL}/slug/${slug}`);
  return data;
}

export async function getCategoryTree(): Promise<CategoryNode[]> {
  const { data } = await axiosClient.get<CategoryNode[]>(`${BASE_URL}/tree`);
  return data;
}

export async function getCategoryBreadcrumb(id: CategoryId): Promise<BreadcrumbRes> {
  const { data } = await axiosClient.get<BreadcrumbRes>(`${BASE_URL}/${id}/breadcrumb`);
  return data;
}


export async function listFeaturedCategories(): Promise<Category[]> {
    // Giáº£ Ä‘á»‹nh báº¡n Ä‘Ã£ táº¡o Endpoint GET /api/v1/categories/featured á»Ÿ BE
    const { data } = await axiosClient.get<Category[]>(`${BASE_URL}/featured`); 
    return data;
}
