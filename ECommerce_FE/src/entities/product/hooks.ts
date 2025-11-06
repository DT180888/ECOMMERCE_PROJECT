// src/entities/product/hooks.ts
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  upsertProductImages,
  upsertProductAttributes,
} from "./api";
import type {
  Id,
  PageRes,
  ProductCard,
  ProductDetail,
  ProductListParams,
  CreateProductReq,
  UpdateProductReq,
  UpsertImagesReq,
  UpsertProductAttributesReq,
} from "./types";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  UseQueryOptions,
  keepPreviousData, // ✅ v5 helper
} from "@tanstack/react-query";

// =====================
// Query Keys
// =====================
export const productKeys = {
  all: ["products"] as const,
  list: (params?: ProductListParams) => ["products", "list", params] as const,
  detail: (id: Id) => ["products", "detail", id] as const,
};

// =====================
// Queries
// =====================
type ProductListKey = ReturnType<typeof productKeys.list>;
type ProductDetailKey = ReturnType<typeof productKeys.detail>;

export function useProductList<TData = PageRes<ProductCard>>(
  params?: ProductListParams,
  options?: Partial<
    UseQueryOptions<PageRes<ProductCard>, unknown, TData, ProductListKey>
  >
) {
  return useQuery<PageRes<ProductCard>, unknown, TData, ProductListKey>({
    queryKey: productKeys.list(params),
    queryFn: () => listProducts(params),
    staleTime: 30 * 1000,
    // ⬇️ v5: thay keepPreviousData bằng placeholderData: keepPreviousData
    placeholderData: keepPreviousData,
    ...(options as any),
  });
}

export function useProductDetail<TData = ProductDetail>(
  id: Id | undefined,
  options?: Partial<
    UseQueryOptions<ProductDetail, unknown, TData, ProductDetailKey>
  >
) {
  return useQuery<ProductDetail, unknown, TData, ProductDetailKey>({
    queryKey: productKeys.detail((id ?? 0) as Id),
    queryFn: () => getProductById(id as Id),
    enabled: !!id,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
    ...(options as any),
  });
}

// =====================
// Mutations
// =====================
export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductReq) => createProduct(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Id; payload: UpdateProductReq }) =>
      updateProduct(id, payload),
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: productKeys.detail(id) });

      const prev = qc.getQueryData<ProductDetail>(productKeys.detail(id));

      if (prev) {
        const next: ProductDetail = {
          ...prev,
          name: payload.name,
          slug: payload.slug,
          description: payload.description,
          status: payload.status,
          brandId: payload.brandId ?? null,
        };
        qc.setQueryData(productKeys.detail(id), next);
      }

      return { prev };
    },
    onError: (_e, { id }, ctx) => {
      if (ctx?.prev) qc.setQueryData(productKeys.detail(id), ctx.prev);
    },
    onSettled: (_d, _e, { id }) => {
      qc.invalidateQueries({ queryKey: productKeys.detail(id) });
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: Id) => deleteProduct(id),
    onSuccess: (_data, id) => {
      qc.removeQueries({ queryKey: productKeys.detail(id) });
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useUpsertProductImages() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Id; payload: UpsertImagesReq }) =>
      upsertProductImages(id, payload),
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: productKeys.detail(id) });
      const prev = qc.getQueryData<ProductDetail>(productKeys.detail(id));

      if (prev) {
        const next: ProductDetail = {
          ...prev,
          images: payload.images.map((i, idx) => ({
            imageId: prev.images[idx]?.imageId ?? -1 * (idx + 1),
            url: i.url,
            isPrimary: i.isPrimary ?? (idx === 0),
            sortOrder: i.sortOrder ?? idx + 1,
          })),
        };
        qc.setQueryData(productKeys.detail(id), next);
      }

      return { prev };
    },
    onError: (_e, { id }, ctx) => {
      if (ctx?.prev) qc.setQueryData(productKeys.detail(id), ctx.prev);
    },
    onSettled: (_d, _e, { id }) => {
      qc.invalidateQueries({ queryKey: productKeys.detail(id) });
      qc.invalidateQueries({ queryKey: productKeys.list(undefined) });
    },
  });
}

export function useUpsertProductAttributes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: Id;
      payload: UpsertProductAttributesReq;
    }) => upsertProductAttributes(id, payload),
    onMutate: async ({ id, payload }) => {
      await qc.cancelQueries({ queryKey: productKeys.detail(id) });
      const prev = qc.getQueryData<ProductDetail>(productKeys.detail(id));

      if (prev) {
        const next: ProductDetail = {
          ...prev,
          attributes: payload.attributes.map((a) => ({
            attributeId: a.attributeId,
            valueText: a.valueText ?? null,
            valueNumber: a.valueNumber ?? null,
            valueBool: a.valueBool ?? null,
          })),
        };
        qc.setQueryData(productKeys.detail(id), next);
      }

      return { prev };
    },
    onError: (_e, { id }, ctx) => {
      if (ctx?.prev) qc.setQueryData(productKeys.detail(id), ctx.prev);
    },
    onSettled: (_d, _e, { id }) => {
      qc.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
  });
}

// =====================
// Prefetch helpers
// =====================
export async function prefetchProductDetail(qc: QueryClient, id: Id) {
  await qc.prefetchQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
  });
}

export async function prefetchProductList(
  qc: QueryClient,
  params?: ProductListParams
) {
  await qc.prefetchQuery({
    queryKey: productKeys.list(params),
    queryFn: () => listProducts(params),
  });
}
