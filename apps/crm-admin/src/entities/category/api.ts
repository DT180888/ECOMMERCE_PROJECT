// src/entities/category/api.ts
import {axiosClient} from "@my-project/shared-utils";
import type {
  Category,
  CategoryListParams,
  PageRes,
  CategoryNode,
  BreadcrumbRes,
  CategoryId,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CreateCategoryRes,
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

export async function getCategoryTree(): Promise<CategoryNode[]> {
  const { data } = await axiosClient.get<CategoryNode[]>(`${BASE_URL}/tree`);
  return data;
}

export async function getCategoryBreadcrumb(id: CategoryId): Promise<BreadcrumbRes> {
  const { data } = await axiosClient.get<BreadcrumbRes>(`${BASE_URL}/${id}/breadcrumb`);
  return data;
}

// ---- CRUD / Move ----
export async function createCategory(
  payload: CreateCategoryPayload
): Promise<CreateCategoryRes> {
  const { data } = await axiosClient.post<CreateCategoryRes>(BASE_URL, payload);
  return data;
}

export async function updateCategory(
  id: CategoryId,
  payload: UpdateCategoryPayload
): Promise<void> {
  await axiosClient.put<void>(`${BASE_URL}/${id}`, payload);
}

export async function deleteCategory(id: CategoryId): Promise<void> {
  await axiosClient.delete<void>(`${BASE_URL}/${id}`);
}

export async function moveCategory(id: CategoryId, newParentId?: number | null): Promise<void> {
  await axiosClient.post<void>(`${BASE_URL}/${id}/move`, { newParentId });
}

export async function toggleCategoryFeatured(
  id: CategoryId,
  isFeatured: boolean
): Promise<void> {
  // Backend yÃªu cáº§u payload { isFeatured: boolean }
  await axiosClient.patch<void>(`${BASE_URL}/${id}/featured`, { isFeatured });
}

export async function listFeaturedCategories(): Promise<Category[]> {
    // Giáº£ Ä‘á»‹nh báº¡n Ä‘Ã£ táº¡o Endpoint GET /api/v1/categories/featured á»Ÿ BE
    const { data } = await axiosClient.get<Category[]>(`${BASE_URL}/featured`); 
    return data;
}
