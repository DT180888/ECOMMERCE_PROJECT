// src/entities/brand/hooks.ts
import { useQuery, UseQueryOptions, keepPreviousData } from "@tanstack/react-query";
import { listBrands, getBrandBySlug } from "./api";
import type { Brand, BrandListParams, PageRes, BrandId } from "./types";

export const brandKeys = {
  all: ["brands"] as const,
  list: (params?: BrandListParams) => ["brands", "list", params] as const,
  detailBySlug: (slug: string) => ["brands", "detailBySlug", slug] as const,
};

type BrandListKey = ReturnType<typeof brandKeys.list>;
type BrandDetailBySlugKey = ReturnType<typeof brandKeys.detailBySlug>;

/** Danh sÃ¡ch brand (phÃ¢n trang, keyword) */
export function useBrandList<TData = PageRes<Brand>>(
  params?: BrandListParams,
  options?: Partial<UseQueryOptions<PageRes<Brand>, unknown, TData, BrandListKey>>
) {
  return useQuery<PageRes<Brand>, unknown, TData, BrandListKey>({
    queryKey: brandKeys.list(params),
    queryFn: () => listBrands(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
    ...(options as any),
  });
}

export function useBrandOptions(keyword = "") {
  const { data, isLoading } = useBrandList(
    { keyword, page: 1, size: 20 },
    { select: (res) => res }
  );

  const options =
    data?.items?.map((b) => ({ label: b.name, value: b.brandId, slug: b.slug })) ?? [];

  return { options, isLoading, total: data?.total ?? 0 };
}



export function useBrandBySlug<TData = Brand>(
  slug: string | undefined,
  options?: Partial<UseQueryOptions<Brand, unknown, TData, BrandDetailBySlugKey>>
) {
  return useQuery<Brand, unknown, TData, BrandDetailBySlugKey>({
    queryKey: brandKeys.detailBySlug(slug ?? ""),
    queryFn: () => getBrandBySlug(slug as string),
    enabled: !!slug,
    staleTime: 30_000,
    ...(options as any),
  });
}


