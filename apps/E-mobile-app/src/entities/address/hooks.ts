// src/entities/address/hooks.ts
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  apiListAddresses,
  apiCreateAddress,
  apiUpdateAddress,
  apiDeleteAddress,
  apiSetDefaultAddress,
} from "./api";
import type {
  AddressListRes,
  AddressListParams,
  AddressUpsertReq,
  AddressId,
} from "./types";

export const addressKeys = {
  root: ["addresses"] as const,
  list: (page?: number, size?: number) =>
    [...addressKeys.root, "list", page, size] as const,
};

export function useAddressList(params?: AddressListParams) {
  const page = params?.page ?? 1;
  const size = params?.size ?? 10;

  return useQuery<AddressListRes>({
    queryKey: addressKeys.list(page, size),
    queryFn: () => apiListAddresses({ page, size }),
   placeholderData: keepPreviousData,
  });
}

export function useCreateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddressUpsertReq) => apiCreateAddress(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: addressKeys.root });
    },
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: AddressId; payload: AddressUpsertReq }) =>
      apiUpdateAddress(args.id, args.payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: addressKeys.root });
    },
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: AddressId) => apiDeleteAddress(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: addressKeys.root });
    },
  });
}

export function useSetDefaultAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: AddressId) => apiSetDefaultAddress(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: addressKeys.root });
    },
  });
}
