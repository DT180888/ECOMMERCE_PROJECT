import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listAutomationTriggers,
  createAutomationTrigger,
  updateAutomationTrigger,
  toggleAutomationTrigger,
  runAutomationTriggersNow,
  type AutomationTriggerDto,
  type CreateTriggerReq,
  type UpdateTriggerReq,
} from "@my-project/api";

export const automationKeys = {
  all: ["admin", "automation"] as const,
  triggers: () => [...automationKeys.all, "triggers"] as const,
};

export function useAutomationTriggers() {
  return useQuery<AutomationTriggerDto[]>({
    queryKey: automationKeys.triggers(),
    queryFn: listAutomationTriggers,
    staleTime: 60 * 1000,
  });
}

export function useCreateAutomationTrigger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTriggerReq) => createAutomationTrigger(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.triggers() });
    },
  });
}

export function useUpdateAutomationTrigger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTriggerReq }) =>
      updateAutomationTrigger(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.triggers() });
    },
  });
}

export function useToggleAutomationTrigger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isEnabled }: { id: number; isEnabled: boolean }) =>
      toggleAutomationTrigger(id, isEnabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.triggers() });
    },
  });
}

export function useRunAutomationTriggersNow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: runAutomationTriggersNow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.triggers() });
    },
  });
}

