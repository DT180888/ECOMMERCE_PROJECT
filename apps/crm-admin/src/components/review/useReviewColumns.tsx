import { useMemo } from "react";
import { Badge, Button } from "@my-project/ui";
import { AdminTableColumn } from "@shared/ui/table";
import {
  StarIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ArrowUturnLeftIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import type { AdminReviewDto } from "@my-project/api";

export interface UseReviewColumnsProps {
  onToggleApproval: (reviewId: number, currentStatus: boolean) => void;
  onReply: (review: AdminReviewDto) => void;
  onDelete: (review: AdminReviewDto) => void;
}

export function useReviewColumns({
  onToggleApproval,
  onReply,
  onDelete,
}: UseReviewColumnsProps): AdminTableColumn<AdminReviewDto>[] {
  return useMemo(
    () => [
      {
        key: "product",
        label: "Sản phẩm",
        isMain: true,
        render: (r) => (
          <div className="max-w-[200px]">
            <p className="font-medium text-foreground truncate">{r.productName}</p>
            <span className="text-[10px] text-muted-foreground font-mono">
              ID: #{r.productId}
            </span>
          </div>
        ),
      },
      {
        key: "reviewer",
        label: "Người đánh giá",
        render: (r) => (
          <div className="whitespace-nowrap">
            <p className="font-medium text-foreground">{r.reviewerName || "Khách hàng"}</p>
            <span className="text-[11px] text-muted-foreground font-mono">
              {new Date(r.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        ),
      },
      {
        key: "rating",
        label: "Số sao",
        render: (r) => (
          <div className="flex items-center gap-0.5 text-amber-400 whitespace-nowrap">
            {[1, 2, 3, 4, 5].map((star) =>
              star <= r.rating ? (
                <StarSolid key={star} className="w-3.5 h-3.5" />
              ) : (
                <StarIcon key={star} className="w-3.5 h-3.5 text-border" />
              )
            )}
          </div>
        ),
      },
      {
        key: "content",
        label: "Nội dung đánh giá & Phản hồi",
        render: (r) => (
          <div className="flex flex-col gap-1.5 max-w-[340px]">
            {r.title && <span className="font-semibold text-foreground">{r.title}</span>}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {r.content || <span className="italic">Không có lời bình luận</span>}
            </p>
            {r.replyMessage && (
              <div className="p-2.5 rounded-sm bg-surface/50 border-0 flex flex-col gap-1 text-[11px]">
                <div className="flex items-center gap-1 font-medium text-foreground">
                  <ArrowUturnLeftIcon className="w-3 h-3 stroke-[2] text-primary" />
                  <span>Phản hồi từ cửa hàng:</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{r.replyMessage}</p>
              </div>
            )}
          </div>
        ),
      },
      {
        key: "status",
        label: "Trạng thái",
        align: "center",
        render: (r) =>
          r.isApproved ? (
            <Badge variant="success" className="text-[11px] font-medium rounded-sm">
              Đã duyệt
            </Badge>
          ) : (
            <Badge variant="warning" className="text-[11px] font-medium rounded-sm">
              Chờ duyệt
            </Badge>
          ),
      },
      {
        key: "actions",
        label: "Hành động",
        align: "center",
        render: (r) => (
          <div className="flex items-center justify-center gap-1">
            <Button
              size="icon-xs"
              variant="outline"
              onClick={() => onToggleApproval(r.reviewId, r.isApproved)}
              title={r.isApproved ? "Hủy duyệt (Ẩn đi)" : "Duyệt (Cho phép hiển thị)"}
              className={`rounded-sm shadow-none ${
                r.isApproved
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-success hover:bg-success/10"
              }`}
              icon={
                r.isApproved ? (
                  <XMarkIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                ) : (
                  <CheckIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                )
              }
            />
            <Button
              size="icon-xs"
              variant="outline"
              onClick={() => onReply(r)}
              title="Phản hồi đánh giá"
              className="rounded-sm shadow-none text-foreground"
              icon={<ChatBubbleLeftEllipsisIcon className="w-3.5 h-3.5 stroke-[1.5]" />}
            />
            <Button
              size="icon-xs"
              variant="outline"
              onClick={() => onDelete(r)}
              title="Xóa vĩnh viễn"
              className="rounded-sm shadow-none text-muted-foreground hover:text-error hover:border-error/30"
              icon={<TrashIcon className="w-3.5 h-3.5 stroke-[1.5]" />}
            />
          </div>
        ),
      },
    ],
    [onToggleApproval, onReply, onDelete]
  );
}

export default useReviewColumns;
