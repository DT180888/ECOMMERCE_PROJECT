import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listAbandonedCarts,
  sendAbandonedCartRecovery,
  type ListAbandonedCartsParams,
  type SendCartRecoveryReq,
} from "@my-project/api";

export const abandonedCartKeys = {
  all: ["admin", "abandoned-carts"] as const,
  list: (params?: ListAbandonedCartsParams) => ["admin", "abandoned-carts", "list", params] as const,
};

export function useAbandonedCarts(params?: ListAbandonedCartsParams) {
  return useQuery({
    queryKey: abandonedCartKeys.list(params),
    queryFn: () => listAbandonedCarts(params),
    placeholderData: (prev) => prev,
    staleTime: 60 * 1000,
  });
}

export function useSendCartRecovery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cartId, payload }: { cartId: number; payload: SendCartRecoveryReq }) =>
      sendAbandonedCartRecovery(cartId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: abandonedCartKeys.all });
    },
  });
}

