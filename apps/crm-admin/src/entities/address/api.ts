// src/entities/address/api.ts
import { axiosClient } from "@my-project/shared-utils";
import type {
  AddressId,
  AddressListParams,
  AddressListRes,
  AddressUpsertReq,
} from "./types";

const base = "/api/v1/addresses";

export async function apiListAddresses(
  params: AddressListParams = {},
): Promise<AddressListRes> {
  const { page = 1, size = 10 } = params;
  const { data } = await axiosClient.get<AddressListRes>(base, {
    params: { page, size },
  });
  return data;
}

export async function apiCreateAddress(
  payload: AddressUpsertReq,
): Promise<{ addressId: number }> {
  const { data } = await axiosClient.post(base, payload);
  return data as { addressId: number };
}

export async function apiUpdateAddress(
  id: AddressId,
  payload: AddressUpsertReq,
): Promise<void> {
  await axiosClient.put(`${base}/${id}`, payload);
}

export async function apiDeleteAddress(id: AddressId): Promise<void> {
  await axiosClient.delete(`${base}/${id}`);
}

export async function apiSetDefaultAddress(id: AddressId): Promise<void> {
  await axiosClient.put(`${base}/${id}/set-default`);
}
