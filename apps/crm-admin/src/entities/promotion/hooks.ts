import { useQuery } from "@tanstack/react-query";
import { promotionApi } from "./api";

export const promotionKeys = {
  all: ["promotions"] as const,
  list: (page: number, size: number, search?: string) => [...promotionKeys.all, "list", page, size, search] as const,
};

export function usePromotions(page = 1, size = 10, search?: string) {
  return useQuery({
    queryKey: promotionKeys.list(page, size, search),
    queryFn: () => promotionApi.getPromotions(page, size, search),
  });
}
