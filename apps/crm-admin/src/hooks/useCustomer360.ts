import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCustomer360,
  listCustomerNotes,
  createCustomerNote,
  deleteCustomerNote,
  togglePinCustomerNote,
  listCustomerTags,
  createCustomerTag,
  assignCustomerTags,
  type CreateCustomerNoteReq,
  type CreateCustomerTagReq,
  type AssignCustomerTagsReq,
} from "@my-project/api";

export const customer360Keys = {
  all: ["admin", "customer-360"] as const,
  detail: (userId: string) => ["admin", "customer-360", userId] as const,
  notes: (userId: string) => ["admin", "customer-360", userId, "notes"] as const,
  tags: ["admin", "customer-tags"] as const,
};

export function useCustomer360(userId?: string) {
  return useQuery({
    queryKey: customer360Keys.detail(userId || ""),
    queryFn: async () => {
      const res = await getCustomer360(userId!);
      return res;
    },
    enabled: Boolean(userId),
    staleTime: 60 * 1000,
  });
}

export function useCustomerNotes(userId?: string) {
  return useQuery({
    queryKey: customer360Keys.notes(userId || ""),
    queryFn: async () => {
      const notes = await listCustomerNotes(userId!);
      return notes ?? [];
    },
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });
}

export function useCreateCustomerNote(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCustomerNoteReq) => createCustomerNote(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customer360Keys.notes(userId) });
      queryClient.invalidateQueries({ queryKey: customer360Keys.detail(userId) });
    },
  });
}

export function useDeleteCustomerNote(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteId: number) => deleteCustomerNote(userId, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customer360Keys.notes(userId) });
      queryClient.invalidateQueries({ queryKey: customer360Keys.detail(userId) });
    },
  });
}

export function useTogglePinCustomerNote(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ noteId, isPinned }: { noteId: number; isPinned: boolean }) =>
      togglePinCustomerNote(userId, noteId, isPinned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customer360Keys.notes(userId) });
      queryClient.invalidateQueries({ queryKey: customer360Keys.detail(userId) });
    },
  });
}

export function useCustomerTags(opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: customer360Keys.tags,
    queryFn: async () => {
      const tags = await listCustomerTags();
      return tags ?? [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: opts?.enabled ?? true,
  });
}

export function useCreateCustomerTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCustomerTagReq) => createCustomerTag(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customer360Keys.tags });
    },
  });
}

export function useAssignCustomerTags(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AssignCustomerTagsReq) => assignCustomerTags(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customer360Keys.detail(userId) });
    },
  });
}
