import { useQuery } from "@tanstack/react-query";
import { promotionClientApi } from "@my-project/api";

export const useActivePromotions = () => {
  return useQuery({
    queryKey: ["activePromotions"],
    queryFn: promotionClientApi.getActivePromotions,
  });
};

export const usePromotion = (id?: number) => {
  return useQuery({
    queryKey: ["promotion", id],
    queryFn: () => promotionClientApi.getPromotionById(id!),
    enabled: !!id,
  });
};
