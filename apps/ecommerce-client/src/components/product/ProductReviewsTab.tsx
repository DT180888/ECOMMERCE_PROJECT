import { useState } from "react";
import { Star, MessageSquarePlus, CheckCircle2 } from "lucide-react";
import { Button, Input, TextArea, useToast, Skeleton } from "@my-project/ui";
import { useProductReviews, useCreateProductReview } from "@hooks/useReview";
import { useAuthUser } from "@hooks/useAuth";

interface ProductReviewsTabProps {
  productId: number;
}

export function ProductReviewsTab({ productId }: ProductReviewsTabProps) {
  const toast = useToast();
  const { data: authUser } = useAuthUser();
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Form state
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");

  const { data, isLoading } = useProductReviews(productId, {
    page: currentPage,
    size: 10,
    rating: selectedRatingFilter,
  });

  const createReviewMutation = useCreateProductReview(productId);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) {
      toast.error("Vui lòng đăng nhập để gửi đánh giá");
      return;
    }
    if (formRating < 1 || formRating > 5) {
      toast.error("Vui lòng chọn số sao từ 1 đến 5");
      return;
    }
    try {
      await createReviewMutation.mutateAsync({
        rating: formRating,
        title: formTitle.trim() || null,
        content: formContent.trim() || null,
      });
      toast.success("Cảm ơn bạn! Đánh giá đã được gửi và đang chờ kiểm duyệt.");
      setFormTitle("");
      setFormContent("");
      setShowReviewForm(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Không thể gửi đánh giá lúc này");
    }
  };

  const reviews = data?.items ?? [];
  const averageRating = data?.averageRating ?? 0;
  const totalReviews = data?.totalReviews ?? 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Summary & Actions Bar ── */}
      <div className="p-6 rounded-[2px] border border-border/60 bg-surface/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold font-mono text-foreground">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= Math.round(averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 font-mono">
              {totalReviews} đánh giá
            </div>
          </div>

          <div className="h-10 w-px bg-border/60 hidden sm:block" />

          {/* Rating filter pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setSelectedRatingFilter(undefined);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 text-xs rounded-[2px] transition-colors border ${
                selectedRatingFilter === undefined
                  ? "bg-foreground text-background border-foreground font-medium"
                  : "bg-surface/50 text-muted-foreground border-border/60 hover:text-foreground hover:border-foreground/40"
              }`}
            >
              Tất cả
            </button>
            {[5, 4, 3, 2, 1].map((r) => {
              const count = data?.ratingCounts?.[r] ?? 0;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setSelectedRatingFilter(r);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 text-xs rounded-[2px] transition-colors border flex items-center gap-1 ${
                    selectedRatingFilter === r
                      ? "bg-foreground text-background border-foreground font-medium"
                      : "bg-surface/50 text-muted-foreground border-border/60 hover:text-foreground hover:border-foreground/40"
                  }`}
                >
                  <span>{r}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Button
            type="button"
            variant="outline"
            className="h-9 px-4 text-xs font-medium rounded-[2px] flex items-center gap-2"
            onClick={() => setShowReviewForm((prev) => !prev)}
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>{showReviewForm ? "Đóng biểu mẫu" : "Viết đánh giá"}</span>
          </Button>
        </div>
      </div>

      {/* ── Review Submission Form ── */}
      {showReviewForm && (
        <form
          onSubmit={handleSubmitReview}
          className="p-5 rounded-[2px] border border-border bg-surface/50 space-y-4 animate-in fade-in duration-200"
        >
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Gửi đánh giá của bạn
          </h4>

          {/* Star selector */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Mức độ hài lòng:</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormRating(s)}
                  className="p-1 hover:scale-110 transition-transform focus:outline-none"
                  title={`${s} sao`}
                >
                  <Star
                    className={`w-5 h-5 ${
                      s <= formRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-medium text-foreground">
                {formRating === 5
                  ? "Tuyệt vời"
                  : formRating === 4
                  ? "Hài lòng"
                  : formRating === 3
                  ? "Bình thường"
                  : formRating === 2
                  ? "Tạm được"
                  : "Rất không hài lòng"}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Tiêu đề (không bắt buộc):</label>
            <Input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Tóm tắt nhận xét của bạn..."
              className="text-xs h-8"
              maxLength={150}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Nội dung đánh giá:</label>
            <TextArea
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Chia sẻ cảm nhận về chất lượng sản phẩm, kích thước, đóng gói..."
              rows={4}
              className="text-xs"
              maxLength={1000}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowReviewForm(false)}
              className="h-8 text-xs rounded-[2px]"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createReviewMutation.isPending}
              className="h-8 text-xs rounded-[2px] flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{createReviewMutation.isPending ? "Đang gửi..." : "Gửi đánh giá"}</span>
            </Button>
          </div>
        </form>
      )}

      {/* ── Reviews Listing ── */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-xs text-muted-foreground">
          Chưa có đánh giá nào {selectedRatingFilter ? `cho mức ${selectedRatingFilter} sao` : "cho sản phẩm này"}. Hãy là người đầu tiên đánh giá!
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {reviews.map((review) => (
            <div key={review.reviewId} className="py-5 space-y-2">
              {/* Header: User, Rating, Date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-semibold text-foreground uppercase">
                    {(review.reviewerName || "U").slice(0, 1)}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-foreground block">
                      {review.reviewerName || "Khách hàng ẩn danh"}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((st) => (
                        <Star
                          key={st}
                          className={`w-3 h-3 ${
                            st <= review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>

              {/* Title & Body */}
              {review.title && (
                <h5 className="text-xs font-semibold text-foreground pt-1">
                  {review.title}
                </h5>
              )}
              {review.content && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {review.content}
                </p>
              )}

              {/* Store Reply Component (Đặc tả Section 6) */}
              {review.replyMessage && (
                <div className="mt-3 ml-6 p-3 bg-slate-50 dark:bg-muted/40 border-l-2 border-primary-500 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-xs text-primary-600 bg-primary-50 dark:bg-primary-950/50 px-2 py-0.5 rounded">
                      Đại diện Cửa hàng
                    </span>
                    <span className="text-xs text-slate-500 dark:text-muted-foreground font-medium">
                      {review.repliedByName || "Quản trị viên"}
                    </span>
                    {review.repliedAt && (
                      <span className="text-xs text-slate-400 dark:text-muted-foreground/80">
                        • {new Date(review.repliedAt).toLocaleDateString("vi-VN")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-foreground/90 leading-relaxed">
                    {review.replyMessage}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default ProductReviewsTab;

