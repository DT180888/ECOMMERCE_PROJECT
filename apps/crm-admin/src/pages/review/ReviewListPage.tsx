import { useState, useMemo } from "react";
import { AdminPageShell, AdminDataView } from "@shared/ui";
import {
  ChatBubbleBottomCenterTextIcon,
  StarIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  useToast,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  TextArea,
  cn,
} from "@my-project/ui";
import {
  useAdminReviews,
  useSetReviewApproval,
  useDeleteAdminReview,
  useReplyAdminReview,
} from "@hooks/useReviews";
import { useReviewColumns } from "@components/review";
import type { AdminReviewDto } from "@my-project/api";

const PAGE_SIZE = 15;

const STATUS_TABS = [
  { value: "ALL", label: "Tất cả" },
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "APPROVED", label: "Đã duyệt" },
] as const;
type StatusTab = (typeof STATUS_TABS)[number]["value"];

export default function ReviewListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<StatusTab>("ALL");
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);

  // Modals state
  const [replyReview, setReplyReview] = useState<AdminReviewDto | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<AdminReviewDto | null>(null);

  const approvalFilter =
    statusTab === "ALL" ? undefined : statusTab === "APPROVED";

  const { data, isLoading } = useAdminReviews({
    page,
    size: PAGE_SIZE,
    rating: ratingFilter,
    isApproved: approvalFilter,
    keyword: search.trim() || undefined,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  // Mutations
  const approvalMut = useSetReviewApproval();
  const deleteMut = useDeleteAdminReview();
  const toast = useToast();

  const handleToggleApproval = async (reviewId: number, currentStatus: boolean) => {
    try {
      await approvalMut.mutateAsync({ reviewId, isApproved: !currentStatus });
      toast.success(!currentStatus ? "Đã duyệt đánh giá" : "Đã hủy duyệt đánh giá");
    } catch {
      toast.error("Không thể thay đổi trạng thái duyệt");
    }
  };

  const columns = useReviewColumns({
    onToggleApproval: handleToggleApproval,
    onReply: setReplyReview,
    onDelete: (r) => setReviewToDelete(r),
  });

  // KPI Metrics Calculation
  const avgRating = useMemo(() => {
    if (items.length === 0) return "5.0";
    const sum = items.reduce((acc, r) => acc + r.rating, 0);
    return (sum / items.length).toFixed(1);
  }, [items]);

  const pendingCount = useMemo(
    () => items.filter((r) => !r.isApproved).length,
    [items]
  );
  const repliedCount = useMemo(
    () => items.filter((r) => Boolean(r.replyMessage)).length,
    [items]
  );
  const replyPercentage = useMemo(
    () => (items.length > 0 ? Math.round((repliedCount / items.length) * 100) : 0),
    [items, repliedCount]
  );

  const tabItems = useMemo(
    () =>
      STATUS_TABS.map((tab) => {
        let badgeCount: number | undefined;
        if (tab.value === "PENDING") {
          badgeCount = pendingCount;
        } else if (tab.value === "APPROVED") {
          badgeCount = items.filter((i) => i.isApproved).length;
        } else {
          badgeCount = total;
        }
        return {
          value: tab.value,
          key: tab.value,
          label: tab.label,
          badge: badgeCount,
        };
      }),
    [items, pendingCount, total]
  );

  return (
    <>
      <AdminPageShell>
        <AdminPageShell.Header
          icon={ChatBubbleBottomCenterTextIcon}
          title="Đánh giá sản phẩm"
          subtitle="Kiểm duyệt bình luận và phản hồi khách hàng"
          badge={`${total}`}
        />

        <AdminPageShell.Body>
          <div className="flex flex-col gap-4 min-h-full">
            {/* ── KPI Strip (Direction 1: Monolithic Integrated Ticker) ── */}
            <div className="w-full bg-card border border-border rounded-sm shadow-none overflow-hidden select-none grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="p-3.5 sm:p-4 flex flex-col justify-between gap-1 hover:bg-surface-hover/60 transition-colors">
                <span className="text-[9px] sm:text-xs text-muted-foreground sm:font-medium">
                  Điểm đánh giá TB
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-md sm:text-xl font-mono tabular-nums text-amber-500">
                    ★ {avgRating}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    / 5.0
                  </span>
                </div>
                <span className="hidden sm:block text-[10px] text-muted-foreground/70 font-sans">
                  Tính trên trang hiện tại
                </span>
              </div>

              <div className="p-3.5 sm:p-4 flex flex-col justify-between gap-1 hover:bg-surface-hover/60 transition-colors">
                <span className="text-[9px] sm:text-xs text-muted-foreground sm:font-medium">
                  Hàng đợi chờ duyệt
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span
                    className={cn(
                      "text-md sm:text-xl font-mono tabular-nums",
                      pendingCount > 0 ? "text-warning" : "text-foreground"
                    )}
                  >
                    {pendingCount}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    đánh giá
                  </span>
                </div>
                <span className="hidden sm:block text-[10px] text-muted-foreground/70 font-sans">
                  Cần kiểm duyệt nội dung
                </span>
              </div>

              <div className="p-3.5 sm:p-4 flex flex-col justify-between gap-1 hover:bg-surface-hover/60 transition-colors">
                <span className="text-[9px] sm:text-xs text-muted-foreground sm:font-medium">
                  Đã có phản hồi
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-md sm:text-xl font-mono tabular-nums text-primary">
                    {repliedCount} / {items.length}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    ({replyPercentage}%)
                  </span>
                </div>
                <span className="hidden sm:block text-[10px] text-muted-foreground/70 font-sans">
                  Tương tác chăm sóc khách hàng
                </span>
              </div>
            </div>

            {/* ── Reviews Data View (Table & Card View) ── */}
            <AdminDataView
              columns={columns}
              data={items}
              isLoading={isLoading}
              rowKey="reviewId"
              enableCardView
              storageKey="crm_reviews_view_mode"
              emptyText="Không có đánh giá nào phù hợp."
              search={{
                query: search,
                onChange: (val) => {
                  setSearch(val);
                  setPage(1);
                },
                placeholder: "Tìm theo sản phẩm, nội dung, người đánh giá...",
              }}
              tabs={{
                value: statusTab,
                onChange: (val) => {
                  setStatusTab(val as StatusTab);
                  setPage(1);
                },
                items: tabItems,
              }}
              filterBar={
                <div className="flex">
                  {/* <span className="text-xs text-muted-foreground whitespace-nowrap">
                    Số sao:
                  </span> */}
                  <Select
                    value={ratingFilter ? String(ratingFilter) : "ALL"}
                    onValueChange={(val) => {
                      setRatingFilter(val === "ALL" ? undefined : Number(val));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-[34px] w-36 bg-card text-xs font-medium rounded-sm border-border shadow-none">
                      <SelectValue placeholder="Tất cả số sao" />
                    </SelectTrigger>
                    <SelectContent className="rounded-sm border-border bg-card shadow-md">
                      <SelectItem value="ALL">Tất cả số sao</SelectItem>
                      <SelectItem value="5">5 Sao ★★★★★</SelectItem>
                      <SelectItem value="4">4 Sao ★★★★☆</SelectItem>
                      <SelectItem value="3">3 Sao ★★★☆☆</SelectItem>
                      <SelectItem value="2">2 Sao ★★☆☆☆</SelectItem>
                      <SelectItem value="1">1 Sao ★☆☆☆☆</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              }
              pagination={{
                page,
                total,
                pageSize: PAGE_SIZE,
                onPageChange: setPage,
              }}
            />
          </div>
        </AdminPageShell.Body>
      </AdminPageShell>

      {/* Reply Modal */}
      {replyReview && (
        <ReviewReplyModal
          review={replyReview}
          onClose={() => setReplyReview(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {reviewToDelete && (
        <Dialog open onOpenChange={(open) => !open && setReviewToDelete(null)}>
          <DialogContent className="max-w-md p-5 rounded-sm border border-border bg-card shadow-md">
            <DialogHeader className="pb-3 border-b border-border">
              <DialogTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <TrashIcon className="w-4 h-4 text-error stroke-[1.5]" />
                <span>Xác nhận xóa đánh giá</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Hành động này không thể hoàn tác. Đánh giá của khách hàng và phản hồi liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống.
              </DialogDescription>
            </DialogHeader>

            <div className="py-3 text-xs text-muted-foreground leading-relaxed">
              Bạn có chắc chắn muốn xóa đánh giá của{" "}
              <strong className="text-foreground">
                {reviewToDelete.reviewerName || "Khách hàng"}
              </strong>{" "}
              về sản phẩm{" "}
              <strong className="text-foreground">{reviewToDelete.productName}</strong>{" "}
              không?
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setReviewToDelete(null)}
                className="h-[34px] px-3.5 text-xs font-medium rounded-sm shadow-none"
              >
                Hủy
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={deleteMut.isPending}
                onClick={async () => {
                  try {
                    await deleteMut.mutateAsync(reviewToDelete.reviewId);
                    toast.success("Đã xóa đánh giá thành công");
                    setReviewToDelete(null);
                  } catch {
                    toast.error("Không thể xóa đánh giá");
                  }
                }}
                className="h-[34px] px-4 text-xs font-medium rounded-sm shadow-none"
              >
                {deleteMut.isPending ? "Đang xóa..." : "Xóa vĩnh viễn"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// ── Review Reply Modal ──
interface ReviewReplyModalProps {
  review: AdminReviewDto;
  onClose: () => void;
}

function ReviewReplyModal({ review, onClose }: ReviewReplyModalProps) {
  const [message, setMessage] = useState(review.replyMessage || "");
  const replyMut = useReplyAdminReview();
  const toast = useToast();

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await replyMut.mutateAsync({
        reviewId: review.reviewId,
        message: message.trim(),
      });
      toast.success("Đã đăng phản hồi từ cửa hàng thành công");
      onClose();
    } catch {
      toast.error("Không thể đăng phản hồi. Vui lòng thử lại");
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-5 rounded-sm border border-border bg-card shadow-md gap-0 overflow-hidden">
        <DialogHeader className="pb-3 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <ChatBubbleBottomCenterTextIcon className="w-4 h-4 text-primary stroke-[1.5]" />
            <span>Phản hồi đánh giá</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Phản hồi này sẽ được hiển thị công khai ngay dưới đánh giá của khách hàng.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSendReply} className="pt-4 flex flex-col gap-3.5">
          {/* Customer review context */}
          <div className="p-3 bg-surface/50 border-0 rounded-sm flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">{review.productName}</span>
              <span className="font-mono text-amber-500 font-medium">★ {review.rating}/5</span>
            </div>
            <p className="text-muted-foreground italic mt-0.5">
              "{review.content || review.title || "Không có lời bình luận"}"
            </p>
            <span className="text-[11px] text-muted-foreground/80 font-mono mt-1">
              Bởi {review.reviewerName || "Khách hàng"} •{" "}
              {new Date(review.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Nội dung phản hồi đại diện cửa hàng:
            </label>
            <TextArea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="VD: Cảm ơn bạn đã tin tưởng ủng hộ sản phẩm của chúng tôi! Nếu có bất kỳ thắc mắc..."
              className="w-full bg-surface border-border text-xs rounded-sm text-foreground focus:ring-1 focus:ring-primary resize-none leading-relaxed shadow-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-[34px] px-3.5 text-xs font-medium rounded-sm shadow-none"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={replyMut.isPending || !message.trim()}
              className="h-[34px] px-4 text-xs font-medium rounded-sm shadow-none"
            >
              {replyMut.isPending ? "Đang gửi..." : "Đăng Phản Hồi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
