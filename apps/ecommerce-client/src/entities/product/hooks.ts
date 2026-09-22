// src/entities/product/hooks.ts
import {
  listProducts,
  getProductById,
  getFilterableAttributes,
} from "./api";
import type {
  Id,
  PageRes,
  ProductCard,
  ProductDetail,
  ProductListParams,
} from "./types";
import {
  useQuery,
  UseQueryOptions,
  keepPreviousData,
} from "@tanstack/react-query";

// =====================
// Query Keys
// =====================
export const productKeys = {
  all: ["products"] as const,
  list: (params?: ProductListParams) => ["products", "list", params] as const,
  detail: (id?: Id) => ["products", "detail", id] as const, // cho phép undefined để tránh va chạm cache
};

// =====================
// Queries
// =====================
type ProductListKey = ReturnType<typeof productKeys.list>;
type ProductDetailKey = ReturnType<typeof productKeys.detail>;

export function useProductList<TData = PageRes<ProductCard>>(
  params?: ProductListParams,
  options?: Partial<UseQueryOptions<PageRes<ProductCard>, unknown, TData, ProductListKey>>
) {
  return useQuery<PageRes<ProductCard>, unknown, TData, ProductListKey>({
    queryKey: productKeys.list(params),
    queryFn: () => listProducts(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
    ...(options as any),
  });
}

export function useProductDetail<TData = ProductDetail>(
  id: Id | undefined,
  options?: Partial<UseQueryOptions<ProductDetail, unknown, TData, ProductDetailKey>>
) {
  return useQuery<ProductDetail, unknown, TData, ProductDetailKey>({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id as Id),
    enabled: !!id,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
    ...(options as any),
  });
}

export function useFilterableAttributes() {
  return useQuery({
    queryKey: ["products", "filters"] as const,
    queryFn: getFilterableAttributes,
    staleTime: 60_000,
  });
}


