// src/entities/attribute/api.ts
import { axiosClient } from "@shared/api/axiosClient";
import type {
  Attribute,
  AttributeId,
  AttributeListQuery,
  AttributeListRes,
  CreateAttributeReq,
  UpdateAttributeReq,
} from "./types";

const BASE = "/api/v1/attributes";

// Lấy danh sách
export async function apiListAttributes(q: AttributeListQuery): Promise<AttributeListRes> {
  const { data } = await axiosClient.get<AttributeListRes>(BASE, { params: q });
  return data;
}

// Lấy chi tiết theo ID
export async function apiGetAttributeById(id: AttributeId): Promise<Attribute> {
  const { data } = await axiosClient.get<Attribute>(`${BASE}/${id}`);
  return data;
}

// Tạo mới attribute
export async function apiCreateAttribute(payload: CreateAttributeReq): Promise<{ attributeId: number }> {
  const { data } = await axiosClient.post(`${BASE}`, payload);
  return data as { attributeId: number };
}

// Cập nhật attribute
export async function apiUpdateAttribute(id: AttributeId, payload: UpdateAttributeReq): Promise<void> {
  await axiosClient.put(`${BASE}/${id}`, payload);
}

// Xóa attribute
export async function apiDeleteAttribute(id: AttributeId): Promise<void> {
  await axiosClient.delete(`${BASE}/${id}`);
}
