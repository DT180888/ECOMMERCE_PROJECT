export interface InventoryDto {
  skuId: number;
  quantityOnHand: number;
  quantityReserved: number;
  reorderPoint: number;
  updatedAt: string;
}

export interface UpdateInventoryReq {
  quantityOnHand: number;
  quantityReserved: number;
  reorderPoint: number;
}
