// src/entities/shipment/admin.ts
import {axiosClient} from "@shared/api/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateShipmentTrackingReq {
  trackingNumber: string;
}

export const adminShipmentApi = {
  updateTracking(id: number, trackingNumber: string) {
    return axiosClient
      .patch<void>(`/api/v1/admin/shipments/${id}/tracking`, {
        trackingNumber,
      })
      .then((r) => r.data);
  },
};

export function useUpdateShipmentTracking() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: { shipmentId: number; trackingNumber: string }) =>
      adminShipmentApi.updateTracking(
        payload.shipmentId,
        payload.trackingNumber
      ),
    onSuccess: (_data, vars) => {
      // Invalidate mọi order detail có shipment này
      qc.invalidateQueries({ queryKey: ["admin-order-detail"] });
      // Tuỳ bạn có key cụ thể ["admin-order-detail", orderId] thì dùng thêm:
      // qc.invalidateQueries({ queryKey: ["admin-order-detail", someOrderId] });
    },
  });
}
