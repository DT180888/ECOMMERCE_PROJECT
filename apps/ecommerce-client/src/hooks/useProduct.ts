import { useMemo } from "react";
import {
  listProducts,
  getProductById,
  getFilterableAttributes,
} from "@my-project/api";
import type {
  Id,
  PageRes,
  ProductCard,
  ProductDetail,
  ProductListParams,
  Sku,
} from "@my-project/api";
import {
  useQuery,
  UseQueryOptions,
  keepPreviousData,
} from "@tanstack/react-query";

export type ProductId = Id;
export type SkuId = Id;

export interface VariantGroup {
  attributeId: number;
  attributeName: string;
  values: string[];
}

export const productKeys = {
  all: ["products"] as const,
  list: (params?: ProductListParams) => ["products", "list", params] as const,
  detail: (id?: Id) => ["products", "detail", id] as const,
};

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

export const skuKeys = {
  root: ["product-skus"] as const,
  list: (productId?: ProductId) => [...skuKeys.root, "list", productId] as const,
};

export function useSkuList(productId?: ProductId, opts?: { enabled?: boolean }) {
  return useQuery<Sku[]>({
    queryKey: skuKeys.list(productId),
    queryFn: () => getProductById(productId!).then((p) => p.skus || []),
    enabled: opts?.enabled ?? !!productId,
    staleTime: 30_000,
  });
}

export function useVariantGroups(skus?: Sku[]) {
  const groups = useMemo<VariantGroup[]>(() => {
    if (!skus?.length) return [];
    const map = new Map<number, { name: string; values: Set<string> }>();
    for (const s of skus) {
      for (const o of s.options || []) {
        if (!map.has(o.attributeId)) map.set(o.attributeId, { name: o.attributeName, values: new Set() });
        map.get(o.attributeId)!.values.add(o.value);
      }
    }
    return Array.from(map.entries()).map(([attributeId, { name, values }]) => ({
      attributeId,
      attributeName: name,
      values: Array.from(values),
    }));
  }, [skus]);

  return groups;
}

export function resolveSkuByPick(skus: Sku[] | undefined, pick: Record<number, string> | undefined) {
  if (!skus || !pick) return undefined;
  return skus.find((s) => {
    for (const { attributeId, value } of s.options || []) {
      const p = pick[attributeId];
      if (!p || p !== value) return false;
    }
    for (const attrId of Object.keys(pick).map(Number)) {
      if (!s.options?.some(o => o.attributeId === attrId && o.value === pick[attrId])) return false;
    }
    return true;
  });
}
