import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  apiListAttributes,
  apiGetAttributeById,
  apiCreateAttribute,
  apiUpdateAttribute,
  apiDeleteAttribute,
} from "@my-project/api";

import type {
  Attribute, AttributeId, AttributeListQuery, AttributeListRes,
  CreateAttributeReq, UpdateAttributeReq, Option, AttributeDataTypeBE
} from "@my-project/api";

export const DATA_TYPE_OPTIONS: Option[] = [
  { value: "Text", label: "Chữ (Text)" },
  { value: "Number", label: "Số (Number)" },
  { value: "Bool", label: "Logic (Boolean)" },
  { value: "Date", label: "Ngày (Date)" },
  { value: "Select", label: "Chọn một (Select)" },
  { value: "Multiselect", label: "Chọn nhiều (Multiselect)" }
];

export function toBEDataType(key: string): AttributeDataTypeBE {
  switch (key) {
    case "Text": return 0;
    case "Number": return 1;
    case "Bool": return 2;
    case "Date": return 3;
    case "Select": return 4;
    case "Multiselect": return 5;
    default: return 0;
  }
}

export function fromBEDataType(beVal: number): "Text" | "Number" | "Bool" | "Date" | "Select" | "Multiselect" {
  switch (beVal) {
    case 0: return "Text";
    case 1: return "Number";
    case 2: return "Bool";
    case 3: return "Date";
    case 4: return "Select";
    case 5: return "Multiselect";
    default: return "Text";
  }
}

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
