// src/entities/brand/hooks.ts
import { useQuery, UseQueryOptions, useMutation, useQueryClient ,keepPreviousData } from "@tanstack/react-query";
import { listBrands, getBrandById, createBrand, updateBrand, deleteBrand } from "./api";
import type { Brand, BrandListParams, PageRes, BrandId } from "./types";

export const brandKeys = {
  all: ["brands"] as const,
  list: (params?: BrandListParams) => ["brands", "list", params] as const,
  detail: (id: BrandId) => ["brands", "detail", id] as const,
};

type BrandListKey = ReturnType<typeof brandKeys.list>;
type BrandDetailKey = ReturnType<typeof brandKeys.detail>;

/** Danh sách brand (phân trang, keyword) */
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
    data?.items?.map((b) => ({ label: b.name, value: b.brandId })) ?? [];

  return { options, isLoading, total: data?.total ?? 0 };
}

export function useBrandDetail<TData = Brand>(
  id: BrandId | undefined,
  options?: Partial<UseQueryOptions<Brand, unknown, TData, BrandDetailKey>>
) {
  return useQuery<Brand, unknown, TData, BrandDetailKey>({
    queryKey: brandKeys.detail((id ?? 0) as BrandId),
    queryFn: () => getBrandById(id as BrandId),
    enabled: !!id,
    staleTime: 30_000,
    ...(options as any),
  });
}

export function useCreateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; slug: string }) => createBrand(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: brandKeys.all });
    },
  });
}

export function useUpdateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: BrandId; payload: { name: string; slug: string } }) =>
      updateBrand(id, payload),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: brandKeys.detail(id) });
      qc.invalidateQueries({ queryKey: brandKeys.all });
    },
  });
}

export function useDeleteBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: BrandId) => deleteBrand(id),
    onSuccess: (_d, id) => {
      qc.removeQueries({ queryKey: brandKeys.detail(id) });
      qc.invalidateQueries({ queryKey: brandKeys.all });
    },
  });
}