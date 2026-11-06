import { axiosClient } from "@my-project/shared-utils";
import type {
  Category,
  CategoryListParams,
  CategoryNode,
  BreadcrumbRes,
  CategoryId,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CreateCategoryRes,
} from "./types";
import type { PageRes } from "../product/types";

const BASE_URL = "/api/v1/categories";

const buildQuery = <T extends object>(params?: T) =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );

const normalizeCategory = <T extends { imageUrl?: string | null; img?: string | null }>(cat: T): T => {
  const url = cat.imageUrl ?? cat.img ?? null;
  return { ...cat, imageUrl: url, img: url };
};

const normalizeCategoryTree = (node: CategoryNode): CategoryNode => {
  const normalized = normalizeCategory(node);
  return {
    ...normalized,
    children: (node.children || []).map(normalizeCategoryTree),
  };
};

export async function listCategories(
  params?: CategoryListParams
): Promise<PageRes<Category>> {
  let sort = params?.sort;
  if (!sort && params?.sortBy) {
    const dir = params.sortDirection === "desc" ? "desc" : "asc";
    if (params.sortBy === "name") sort = `name_${dir}`;
    else if (params.sortBy === "categoryId") sort = `id_${dir}`;
    else if (params.sortBy === "isFeatured") sort = "featured";
  }

  const query = buildQuery({
    keyword: params?.keyword,
    page: params?.page,
    size: params?.size,
    sort,
  });

  const { data } = await axiosClient.get<PageRes<Category>>(BASE_URL, {
    params: query,
  });

  if (data?.items) {
    data.items = data.items.map(normalizeCategory);
  }
  return data;
}

export async function getCategoryById(id: CategoryId): Promise<Category> {
  const { data } = await axiosClient.get<Category>(`${BASE_URL}/${id}`);
  return normalizeCategory(data);
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const { data } = await axiosClient.get<Category>(`${BASE_URL}/slug/${slug}`);
  return normalizeCategory(data);
}

export async function getCategoryTree(): Promise<CategoryNode[]> {
  const { data } = await axiosClient.get<CategoryNode[]>(`${BASE_URL}/tree`);
  return Array.isArray(data) ? data.map(normalizeCategoryTree) : [];
}

export async function getCategoryBreadcrumb(id: CategoryId): Promise<BreadcrumbRes> {
  const { data } = await axiosClient.get<BreadcrumbRes>(`${BASE_URL}/${id}/breadcrumb`);
  return data;
}

export async function createCategory(
  payload: CreateCategoryPayload
): Promise<CreateCategoryRes> {
  const body = {
    name: payload.name,
    slug: payload.slug,
    parentId: payload.parentId ?? null,
    isFeatured: payload.isFeatured,
    imageUrl: payload.imageUrl ?? payload.img ?? null,
  };
  const { data } = await axiosClient.post<CreateCategoryRes>(BASE_URL, body);
  return data;
}

export async function updateCategory(
  id: CategoryId,
  payload: UpdateCategoryPayload
): Promise<void> {
  const body = {
    name: payload.name,
    slug: payload.slug,
    parentId: payload.parentId ?? null,
    isFeatured: payload.isFeatured,
    imageUrl: payload.imageUrl ?? payload.img ?? null,
  };
  await axiosClient.put<void>(`${BASE_URL}/${id}`, body);
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
  await axiosClient.patch<void>(`${BASE_URL}/${id}/featured`, { isFeatured });
}

export async function listFeaturedCategories(): Promise<Category[]> {
  const { data } = await axiosClient.get<Category[]>(`${BASE_URL}/featured`); 
  return data;
}
