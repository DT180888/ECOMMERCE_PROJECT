import { axiosClient } from "@my-project/shared-utils";
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-order-detail"] });
    },
  });
}
