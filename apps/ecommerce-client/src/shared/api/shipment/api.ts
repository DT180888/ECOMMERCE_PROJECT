import { axiosClient } from "@my-project/shared-utils";
import type { UpdateShipmentTrackingReq } from "./types";

const BASE_URL = "/api/v1/admin/shipments";

export async function updateShipmentTracking(
  shipmentId: number,
  payload: UpdateShipmentTrackingReq
): Promise<void> {
  await axiosClient.patch(`${BASE_URL}/${shipmentId}/tracking`, payload);
}
