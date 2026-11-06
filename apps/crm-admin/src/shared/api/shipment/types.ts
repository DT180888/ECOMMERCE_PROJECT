export const ShipmentStatus = {
  Pending: 0,
  Shipped: 1,
  InTransit: 2,
  Delivered: 3,
  Failed: 4,
} as const;

export type ShipmentStatus = typeof ShipmentStatus[keyof typeof ShipmentStatus];

export interface UpdateShipmentTrackingReq {
  carrier: string;
  trackingNumber: string;
  status: number | ShipmentStatus;
}
