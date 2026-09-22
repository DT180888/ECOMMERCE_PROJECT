import { axiosClient } from "@my-project/shared-utils";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import type { OrderDetail } from "./types";

export interface AdminOrderListItem {
  orderId: number;
  orderNumber: string;
  customerName: string; 
  email?: string | null;
  status: number;
  currency: string;
  totalMinor: number;
  createdAt: string;
}

export interface AdminOrderListRes {
  page: number;
  size: number;
  total: number;
  items: AdminOrderListItem[];
}

export interface AdminOrderListParams {
  page: number;
  size: number;
  status?: number | null;
  search?: string;
}

export const adminOrderApi = {
  list(params: AdminOrderListParams) {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null && v !== "")
    );

    return axiosClient
      .get<AdminOrderListRes>("/api/v1/admin/orders", {
        params: cleanParams,
      })
      .then((r) => r.data);
  },

  detail(id: number) {
    return axiosClient
      .get<OrderDetail>(`/api/v1/admin/orders/${id}`)
      .then((r) => r.data);
  },

  updateStatus(id: number, status: number, note?: string) {
    return axiosClient
      .patch<void>(`/api/v1/admin/orders/${id}/status`, { status, note })
      .then((r) => r.data);
  },
};

export const adminOrderKeys = {
  all: ["admin", "orders"] as const,
  list: (params: AdminOrderListParams) => [...adminOrderKeys.all, "list", params] as const,
  detail: (id: number) => [...adminOrderKeys.all, "detail", id] as const,
};

export function useAdminOrders(params: AdminOrderListParams) {
  return useQuery({
    queryKey: adminOrderKeys.list(params),
    queryFn: () => adminOrderApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useAdminOrderDetail(id: number, opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: adminOrderKeys.detail(id),
    queryFn: () => adminOrderApi.detail(id),
    enabled: !!id && (opts?.enabled ?? true),
    staleTime: 0,
  });
}

export function useUpdateAdminOrderStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: { orderId: number; status: number; note?: string }) =>
      adminOrderApi.updateStatus(payload.orderId, payload.status, payload.note),
    
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: adminOrderKeys.detail(vars.orderId) });
      qc.invalidateQueries({ queryKey: ["admin", "orders", "list"] });
    },
  });
}
