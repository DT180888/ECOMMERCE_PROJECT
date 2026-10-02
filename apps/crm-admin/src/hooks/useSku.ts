import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { listAllSkus } from "@my-project/api";
import type { PageRes, AdminSkuItem } from "@my-project/api";

export const skuKeys = {
  all: ["skus"] as const,
  list: (params?: any) => ["skus", "list", params] as const,
};

export function useSkuList(params?: any, options?: any) {
  const normalizedParams = typeof params === "number" ? { productId: params } : params;
  return useQuery<any>({
    queryKey: skuKeys.list(normalizedParams),
    queryFn: async () => {
      const res = await listAllSkus(normalizedParams);
      return Array.isArray(res) ? res : (res as PageRes<AdminSkuItem>)?.items ?? res ?? [];
    },
    placeholderData: keepPreviousData,
    ...(typeof options === "object" ? options : {}),
  });
}

export function useCreateSku(opts?: any) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => payload,
    onSuccess: () => qc.invalidateQueries({ queryKey: skuKeys.all }),
  });
}

export function useUpdateSku(opts?: any) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => payload,
    onSuccess: () => qc.invalidateQueries({ queryKey: skuKeys.all }),
  });
}

export function useDeleteSku(opts?: any) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: any) => id,
    onSuccess: () => qc.invalidateQueries({ queryKey: skuKeys.all }),
  });
}

export function useAdminInventory(skuId?: any) {
  return useQuery<any>({
    queryKey: ["inventory", skuId],
    queryFn: async () => ({ quantityOnHand: 0, reorderPoint: 0, quantityReserved: 0 }),
  });
}

export function useUpdateAdminInventory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => payload,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inventory"] }),
  });
}
