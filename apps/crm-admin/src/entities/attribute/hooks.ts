// src/entities/attribute/hooks.ts
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  apiListAttributes,
  apiGetAttributeById,
  apiCreateAttribute,
  apiUpdateAttribute,
  apiDeleteAttribute,
} from "./api";

import type {
  Attribute, AttributeId, AttributeListQuery, AttributeListRes,
  CreateAttributeReq, UpdateAttributeReq, Option
} from "./types";
export { DATA_TYPE_OPTIONS } from "./adapter"; 

// ---- Query Keys ----
export const attributeKeys = {
  root: ["attributes"] as const,
  list: (q: AttributeListQuery) => [...attributeKeys.root, "list", q] as const,
  detail: (id?: AttributeId) => [...attributeKeys.root, "detail", id] as const,
};

// ---- LIST ----
export function useAttributeList(q: AttributeListQuery) {
  return useQuery<AttributeListRes>({
    queryKey: attributeKeys.list(q),
    queryFn: () => apiListAttributes(q),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

// ---- DETAIL ----
export function useAttributeDetail(id?: AttributeId, opts?: { enabled?: boolean }) {
  return useQuery<Attribute>({
    queryKey: attributeKeys.detail(id),
    queryFn: () => apiGetAttributeById(id!),
    enabled: opts?.enabled ?? !!id,
  });
}

// ---- CREATE ----
export function useCreateAttribute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAttributeReq) => apiCreateAttribute(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: attributeKeys.root });
    },
  });
}

// ---- UPDATE ----
export function useUpdateAttribute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: AttributeId; payload: UpdateAttributeReq }) =>
      apiUpdateAttribute(id, payload),
    onSuccess: async (_res, vars) => {
      await qc.invalidateQueries({ queryKey: attributeKeys.detail(vars.id) });
      await qc.invalidateQueries({ queryKey: attributeKeys.root });
    },
  });
}

// ---- DELETE ----
export function useDeleteAttribute() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: AttributeId) => apiDeleteAttribute(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: attributeKeys.root });
    },
  });
}

// ---- Options helper cho Select ----
export function useAttributeOptions(q: AttributeListQuery = { page: 1, size: 100 }) {
  const { data } = useAttributeList(q);
  const options: Option[] =
    data?.items.map((a) => ({ value: a.attributeId, label: `${a.name}` })) ?? [];
  return { options, total: data?.total ?? 0, raw: data?.items ?? [] };
}


