import { axiosClient } from "@my-project/shared-utils";
import type { InventoryDto, UpdateInventoryReq } from "./types";

const BASE_URL = "/api/v1/admin/inventory";

export async function getInventoryBySku(skuId: number): Promise<InventoryDto> {
  const { data } = await axiosClient.get<InventoryDto>(`${BASE_URL}/${skuId}`);
  return data;
}

export async function updateInventoryBySku(
  skuId: number,
  payload: UpdateInventoryReq
): Promise<void> {
  await axiosClient.patch(`${BASE_URL}/${skuId}`, payload);
}
