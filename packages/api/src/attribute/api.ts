import { axiosClient } from "@my-project/shared-utils";
import type {
  Attribute,
  AttributeId,
  AttributeListQuery,
  AttributeListRes,
  CreateAttributeReq,
  UpdateAttributeReq,
} from "./types";

const BASE_URL = "/api/v1/attributes";

const buildQuery = (params?: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );

export async function apiListAttributes(query?: AttributeListQuery): Promise<AttributeListRes> {
  const { data } = await axiosClient.get<AttributeListRes>(BASE_URL, {
    params: buildQuery(query),
  });
  return data;
}

export async function apiGetAttributeById(id: AttributeId): Promise<Attribute> {
  const { data } = await axiosClient.get<Attribute>(`${BASE_URL}/${id}`);
  return data;
}

export async function apiCreateAttribute(payload: CreateAttributeReq): Promise<{ attributeId: AttributeId }> {
  const { data } = await axiosClient.post<{ attributeId: AttributeId }>(BASE_URL, payload);
  return data;
}

export async function apiUpdateAttribute(id: AttributeId, payload: UpdateAttributeReq): Promise<void> {
  await axiosClient.put<void>(`${BASE_URL}/${id}`, payload);
}

export async function apiDeleteAttribute(id: AttributeId): Promise<void> {
  await axiosClient.delete<void>(`${BASE_URL}/${id}`);
}
