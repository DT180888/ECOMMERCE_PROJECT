import { axiosClient } from "@shared/api/axiosClient";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import type { OrderDetail } from "@entities/order/types";

// =============================================================================
// TYPES
// =============================================================================

export interface AdminOrderListItem {
  orderId: number;
  orderNumber: string;
  // ✅ Cập nhật theo BE: Dùng customerName thay vì đoán userId/userName
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

// Params object cho hook và api
export interface AdminOrderListParams {
  page: number;
  size: number;
  status?: number | null; // Cho phép null
  search?: string;        // ✅ Thêm search param
}

// =============================================================================
// API RAW
// =============================================================================

export const adminOrderApi = {
  list(params: AdminOrderListParams) {
    // Loại bỏ các params undefined/null/rỗng trước khi gửi
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

// =============================================================================
// HOOKS (REACT QUERY)
// =============================================================================

// Centralized Keys để quản lý cache tốt hơn
export const adminOrderKeys = {
  all: ["admin", "orders"] as const,
  list: (params: AdminOrderListParams) => [...adminOrderKeys.all, "list", params] as const,
  detail: (id: number) => [...adminOrderKeys.all, "detail", id] as const,
};

/**
 * Hook lấy danh sách đơn hàng cho Admin
 * Supports: Pagination, Status Filter, Text Search
 */
export function useAdminOrders(params: AdminOrderListParams) {
  return useQuery({
    queryKey: adminOrderKeys.list(params),
    queryFn: () => adminOrderApi.list(params),
    placeholderData: keepPreviousData, // Giữ UI mượt khi chuyển trang/search
  });
}

/**
 * Hook lấy chi tiết đơn hàng
 */
export function useAdminOrderDetail(id: number, opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: adminOrderKeys.detail(id),
    queryFn: () => adminOrderApi.detail(id),
    enabled: !!id && (opts?.enabled ?? true),
    staleTime: 0, // Luôn fetch mới nhất để check status vừa update
  });
}

/**
 * Hook cập nhật trạng thái đơn hàng
 */
export function useUpdateAdminOrderStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: { orderId: number; status: number; note?: string }) =>
      adminOrderApi.updateStatus(payload.orderId, payload.status, payload.note),
    
    onSuccess: (_data, vars) => {
      // 1. Invalidate chi tiết đơn hàng này
      qc.invalidateQueries({ queryKey: adminOrderKeys.detail(vars.orderId) });
      
      // 2. Invalidate toàn bộ danh sách đơn hàng (để cập nhật cột trạng thái ở list)
      // Dùng invalidateQueries với predicate hoặc key gốc để clear tất cả các trang/filter
      qc.invalidateQueries({ queryKey: ["admin", "orders", "list"] });
    },
  });
}