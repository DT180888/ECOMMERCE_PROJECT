// src/entities/collection/api.ts
import { axiosClient } from "@my-project/shared-utils";
import type {
  CollectionDto,
  CollectionFormData,
  CollectionListParams,
  PageRes,
  CollectionId,
} from "./types";

const BASE_URL = "/api/v1/collections";

const buildQuery = <T extends object>(params?: T) =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );

export async function listCollections(
  params?: CollectionListParams
): Promise<PageRes<CollectionDto>> {
  const { data } = await axiosClient.get<PageRes<CollectionDto>>(BASE_URL, {
    params: buildQuery(params),
  });
  return data;
}

export async function getCollectionById(id: CollectionId): Promise<CollectionDto> {
  const { data } = await axiosClient.get<CollectionDto>(`${BASE_URL}/${id}`);
  return data;
}

export async function createCollection(payload: CollectionFormData): Promise<CollectionDto> {
  const { data } = await axiosClient.post<CollectionDto>(BASE_URL, payload);
  return data;
}

export async function updateCollection(
  id: CollectionId,
  payload: CollectionFormData
): Promise<void> {
  await axiosClient.put<void>(`${BASE_URL}/${id}`, payload);
}

export async function deleteCollection(id: CollectionId): Promise<void> {
  await axiosClient.delete<void>(`${BASE_URL}/${id}`);
}

export async function toggleCollectionStatus(id: CollectionId): Promise<void> {
  await axiosClient.patch<void>(`${BASE_URL}/${id}/toggle-status`);
}

export async function updateCollectionProducts(
  id: CollectionId,
  productIds: number[]
): Promise<void> {
  await axiosClient.put<void>(`${BASE_URL}/${id}/products`, productIds);
}
