import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { promotionApi, type CreatePromotionReq } from "@my-project/api";
import { useToast } from "@my-project/ui";

export const promotionKeys = {
  all: ["promotions"] as const,
  list: (page: number, size: number, search?: string) =>
    [...promotionKeys.all, "list", page, size, search] as const,
  detail: (id?: number) => [...promotionKeys.all, "detail", id] as const,
};

export function usePromotions(page = 1, size = 10, search?: string) {
  return useQuery({
    queryKey: promotionKeys.list(page, size, search),
    queryFn: () => promotionApi.getPromotions(page, size, search),
  });
}

export function usePromotionDetail(id?: number) {
  return useQuery({
    queryKey: promotionKeys.detail(id),
    queryFn: () => promotionApi.getPromotionById(id!),
    enabled: !!id,
  });
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (payload: CreatePromotionReq) => promotionApi.createPromotion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promotionKeys.all });
      toast.success("Tạo khuyến mãi thành công");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Lỗi khi tạo khuyến mãi");
    },
  });
}

export function useUpdatePromotion() {
  const queryClient = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreatePromotionReq }) =>
      promotionApi.updatePromotion(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promotionKeys.all });
      toast.success("Cập nhật khuyến mãi thành công");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Lỗi khi cập nhật khuyến mãi");
    },
  });
}
