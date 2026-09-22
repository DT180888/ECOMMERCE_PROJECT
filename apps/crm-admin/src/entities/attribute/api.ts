// src/entities/attribute/api.ts
import { axiosClient } from "@my-project/shared-utils";
import type {
  Attribute,
  AttributeId,
  AttributeListQuery,
  AttributeListRes,
  CreateAttributeReq,
  UpdateAttributeReq,
} from "./types";

const BASE = "/api/v1/attributes";

// Láº¥y danh sÃ¡ch
export async function apiListAttributes(q: AttributeListQuery): Promise<AttributeListRes> {
  const { data } = await axiosClient.get<AttributeListRes>(BASE, { params: q });
  return data;
}

// Láº¥y chi tiáº¿t theo ID
export async function apiGetAttributeById(id: AttributeId): Promise<Attribute> {
  const { data } = await axiosClient.get<Attribute>(`${BASE}/${id}`);
  return data;
}

// Táº¡o má»›i attribute
export async function apiCreateAttribute(payload: CreateAttributeReq): Promise<{ attributeId: number }> {
  const { data } = await axiosClient.post(`${BASE}`, payload);
  return data as { attributeId: number };
}

// Cáº­p nháº­t attribute
export async function apiUpdateAttribute(id: AttributeId, payload: UpdateAttributeReq): Promise<void> {
  await axiosClient.put(`${BASE}/${id}`, payload);
}

// XÃ³a attribute
export async function apiDeleteAttribute(id: AttributeId): Promise<void> {
  await axiosClient.delete(`${BASE}/${id}`);
}

