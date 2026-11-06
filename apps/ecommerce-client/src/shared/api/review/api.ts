import { axiosClient } from "@my-project/shared-utils";
import type {
  CreateProductReviewReq,
  CreateProductReviewRes,
  ListProductReviewsParams,
  ListProductReviewsRes,
  AdminReviewDto,
  ListAdminReviewsParams,
  ListAdminReviewsRes,
} from "./types";

const buildQuery = (params?: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );

function unwrap<T>(resData: any, fallback?: T): T {
  if (resData && typeof resData === "object" && "data" in resData && resData.data !== undefined) {
    return resData.data as T;
  }
  return (resData ?? fallback) as T;
}

// --- Client / Customer Review APIs ---

export async function createProductReview(
  productId: number,
  payload: CreateProductReviewReq
): Promise<CreateProductReviewRes> {
  const { data } = await axiosClient.post<CreateProductReviewRes>(
    `/api/v1/products/${productId}/reviews`,
    payload
  );
  return unwrap(data);
}

export async function listProductReviews(
  productId: number,
  params?: ListProductReviewsParams
): Promise<ListProductReviewsRes> {
  const { data } = await axiosClient.get<ListProductReviewsRes>(
    `/api/v1/products/${productId}/reviews`,
    { params: buildQuery(params) }
  );
  return unwrap(data, {
    averageRating: 0,
    totalReviews: 0,
    ratingCounts: {},
    items: [],
    page: 1,
    size: 10,
    totalFiltered: 0,
  });
}

// --- Admin Review APIs ---

export async function listAdminReviews(
  params?: ListAdminReviewsParams
): Promise<ListAdminReviewsRes> {
  const { data } = await axiosClient.get<ListAdminReviewsRes>(
    "/api/v1/admin/reviews",
    { params: buildQuery(params) }
  );
  return unwrap(data, {
    items: [],
    page: 1,
    size: 10,
    total: 0,
  });
}

export async function setReviewApproval(
  reviewId: number,
  isApproved: boolean
): Promise<void> {
  await axiosClient.patch(`/api/v1/admin/reviews/${reviewId}/approve`, {
    isApproved,
  });
}

export async function deleteAdminReview(reviewId: number): Promise<void> {
  await axiosClient.delete(`/api/v1/admin/reviews/${reviewId}`);
}

export async function replyAdminReview(
  reviewId: number,
  message: string
): Promise<void> {
  await axiosClient.post(`/api/v1/admin/reviews/${reviewId}/reply`, {
    message,
  });
}
