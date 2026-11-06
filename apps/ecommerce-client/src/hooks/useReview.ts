import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listProductReviews,
  createProductReview,
  type ListProductReviewsParams,
  type ListProductReviewsRes,
  type CreateProductReviewReq,
} from "@my-project/api";

export const reviewKeys = {
  all: ["reviews"] as const,
  list: (productId: number, params?: ListProductReviewsParams) =>
    [...reviewKeys.all, "product", productId, params] as const,
};

export function useProductReviews(
  productId: number | undefined,
  params?: ListProductReviewsParams
) {
  return useQuery<ListProductReviewsRes>({
    queryKey: reviewKeys.list(productId!, params),
    queryFn: () => listProductReviews(productId!, params),
    enabled: typeof productId === "number" && productId > 0,
    staleTime: 30_000,
  });
}

export function useCreateProductReview(productId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductReviewReq) =>
      createProductReview(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...reviewKeys.all, "product", productId],
      });
    },
  });
}

