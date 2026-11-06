import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listAdminReviews,
  setReviewApproval,
  deleteAdminReview,
  replyAdminReview,
  type ListAdminReviewsParams,
} from "@my-project/api";

export const reviewKeys = {
  all: ["admin", "reviews"] as const,
  list: (params?: ListAdminReviewsParams) => ["admin", "reviews", "list", params] as const,
};

export function useAdminReviews(params?: ListAdminReviewsParams) {
  return useQuery({
    queryKey: reviewKeys.list(params),
    queryFn: () => listAdminReviews(params),
    placeholderData: (prev) => prev,
    staleTime: 60 * 1000,
  });
}

export function useSetReviewApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, isApproved }: { reviewId: number; isApproved: boolean }) =>
      setReviewApproval(reviewId, isApproved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
}

export function useDeleteAdminReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: number) => deleteAdminReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
}

export function useReplyAdminReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, message }: { reviewId: number; message: string }) =>
      replyAdminReview(reviewId, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
}

