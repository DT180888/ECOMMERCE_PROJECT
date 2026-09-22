import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  toggleCollectionStatus,
  updateCollectionProducts,
} from "./api";
import type {
  CollectionListParams,
  CollectionFormData,
  CollectionId,
} from "./types";
import { useToast } from "@my-project/ui";

export const collectionKeys = {
  all: ["collections"] as const,
  lists: () => [...collectionKeys.all, "list"] as const,
  list: (params: CollectionListParams) => [...collectionKeys.lists(), params] as const,
  details: () => [...collectionKeys.all, "detail"] as const,
  detail: (id: CollectionId) => [...collectionKeys.details(), id] as const,
};

export function useCollections(params?: CollectionListParams) {
  return useQuery({
    queryKey: collectionKeys.list(params || {}),
    queryFn: () => listCollections(params),
  });
}

export function useCollection(id: CollectionId) {
  return useQuery({
    queryKey: collectionKeys.detail(id),
    queryFn: () => getCollectionById(id),
    enabled: !!id,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (payload: CollectionFormData) => createCollection(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      toast.success("Tạo bộ sưu tập thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Lỗi khi tạo bộ sưu tập");
    },
  });
}

export function useUpdateCollection() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, payload }: { id: CollectionId; payload: CollectionFormData }) =>
      updateCollection(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(variables.id) });
      toast.success("Cập nhật bộ sưu tập thành công");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Lỗi khi cập nhật bộ sưu tập");
    },
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: CollectionId) => deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
      toast.success("Đã xóa bộ sưu tập");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Lỗi khi xóa bộ sưu tập");
    },
  });
}

export function useToggleCollectionStatus() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: CollectionId) => toggleCollectionStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Lỗi khi đổi trạng thái");
    },
  });
}

export function useUpdateCollectionProducts() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, productIds }: { id: CollectionId; productIds: number[] }) =>
      updateCollectionProducts(id, productIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(variables.id) });
      toast.success("Đã cập nhật sản phẩm trong bộ sưu tập");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Lỗi khi cập nhật sản phẩm");
    },
  });
}
