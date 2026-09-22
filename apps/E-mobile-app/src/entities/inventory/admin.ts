// src/entities/inventory/admin.ts
import { axiosClient } from "@shared/api/axiosClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface InventoryDto {
  skuId: number;
  quantityOnHand: number;
  quantityReserved: number;
  reorderPoint: number;
  updatedAt?: string;
}

// Request khi patch
export interface UpdateInventoryReq {
  quantityOnHand: number;
  quantityReserved: number;
  reorderPoint: number;
}

export const adminInventoryApi = {
  get(skuId: number) {
    return axiosClient
      .get<InventoryDto>(`/api/v1/admin/inventory/${skuId}`)
      .then((r) => r.data);
  },

  update(skuId: number, payload: UpdateInventoryReq) {
    return axiosClient
      .patch<void>(`/api/v1/admin/inventory/${skuId}`, payload)
      .then((r) => r.data);
  },
};

export function useAdminInventory(skuId: number, opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["admin-inventory", skuId],
    queryFn: () => adminInventoryApi.get(skuId),
    enabled: !!skuId && (opts?.enabled ?? true),
  });
}

export function useUpdateAdminInventory() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: { skuId: number } & UpdateInventoryReq) =>
      adminInventoryApi.update(payload.skuId, {
        quantityOnHand: payload.quantityOnHand,
        quantityReserved: payload.quantityReserved,
        reorderPoint: payload.reorderPoint,
      }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["admin-inventory", vars.skuId] });
    },
  });
}
