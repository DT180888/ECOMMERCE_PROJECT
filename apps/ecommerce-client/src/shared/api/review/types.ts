export interface CreateProductReviewReq {
  rating: number;
  title?: string | null;
  content?: string | null;
}

export interface CreateProductReviewRes {
  reviewId: number;
}

export interface ProductReviewDto {
  reviewId: number;
  userId: string;
  reviewerName: string;
  rating: number;
  title: string | null;
  content: string | null;
  createdAt: string;
  replyMessage?: string | null;
  repliedByName?: string | null;
  repliedAt?: string | null;
}

export interface ListProductReviewsParams {
  page?: number;
  size?: number;
  rating?: number;
}

export interface ListProductReviewsRes {
  averageRating: number;
  totalReviews: number;
  ratingCounts: Record<number, number>;
  items: ProductReviewDto[];
  page: number;
  size: number;
  totalFiltered: number;
}

export interface AdminReviewDto {
  reviewId: number;
  productId: number;
  productName: string;
  userId: string;
  reviewerName: string;
  rating: number;
  title: string | null;
  content: string | null;
  isApproved: boolean;
  createdAt: string;
  replyMessage?: string | null;
  repliedByName?: string | null;
  repliedAt?: string | null;
}

export interface ListAdminReviewsParams {
  productId?: number;
  rating?: number;
  isApproved?: boolean;
  keyword?: string;
  page?: number;
  size?: number;
}

export interface ReplyReviewReq {
  message: string;
}

export interface ListAdminReviewsRes {
  items: AdminReviewDto[];
  page: number;
  size: number;
  total: number;
}
