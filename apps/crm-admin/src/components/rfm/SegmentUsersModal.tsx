import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
  useToast,
  Skeleton,
} from "@my-project/ui";
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { formatVND } from "@my-project/shared-utils";
import { useRfmSegmentUsers, useDownloadRfmAudienceCsv } from "@hooks/useRfm";
import type { SegmentSummaryDto } from "@my-project/api";

export interface SegmentUsersModalProps {
  segment: SegmentSummaryDto | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomer360?: (userId: string) => void;
}

export function SegmentUsersModal({
  segment,
  isOpen,
  onClose,
  onOpenCustomer360,
}: SegmentUsersModalProps) {
  const toast = useToast();
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const { data, isLoading } = useRfmSegmentUsers(
    segment?.key,
    { keyword: keyword.trim() || undefined, page, pageSize },
    { enabled: isOpen && Boolean(segment) }
  );

  const downloadMutation = useDownloadRfmAudienceCsv();

  const handleDownloadCsv = async () => {
    if (!segment) return;
    try {
      await downloadMutation.mutateAsync(segment.key);
      toast.success(`Đã tải xuống tệp Audience cho nhóm ${segment.name}`);
    } catch {
      toast.error("Không thể tải xuống tệp CSV lúc này");
    }
  };

  const users = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-background border border-border rounded-[2px] shadow-none">
        {/* Header */}
        <DialogHeader className="p-4 border-b border-border bg-surface shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: segment?.colorHex || "#10B981" }}
                />
                <DialogTitle className="text-sm font-semibold uppercase tracking-wider text-foreground truncate">
                  {segment?.name} ({segment?.key})
                </DialogTitle>
                <span className="text-xs font-mono text-muted-foreground">
                  ({total} khách hàng)
                </span>
              </div>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {segment?.description}
              </DialogDescription>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={downloadMutation.isPending}
              onClick={handleDownloadCsv}
              className="h-8 px-3 text-xs font-medium rounded-[2px] shrink-0 flex items-center gap-1.5"
            >
              <ArrowDownTrayIcon className="w-3.5 h-3.5" />
              <span>{downloadMutation.isPending ? "Đang tải..." : "Tải CSV Audience"}</span>
            </Button>
          </div>

          {/* Search bar */}
          <div className="relative mt-3">
            <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm theo tên, email, số điện thoại..."
              className="pl-8 h-8 text-xs bg-background border-border rounded-[2px]"
            />
          </div>
        </DialogHeader>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-[2px]" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center text-xs text-muted-foreground">
              Không có khách hàng nào trong phân cụm này{keyword ? " khớp với từ khóa tìm kiếm" : ""}.
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface/50 text-[10px] uppercase font-semibold text-muted-foreground select-none">
                    <th className="py-2.5 px-3">Khách hàng</th>
                    <th className="py-2.5 px-3">Điểm R - F - M</th>
                    <th className="py-2.5 px-3 text-right">Lần mua cuối</th>
                    <th className="py-2.5 px-3 text-right">Tổng đơn</th>
                    <th className="py-2.5 px-3 text-right">Tổng chi tiêu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {users.map((u) => (
                    <tr
                      key={u.userId}
                      className="hover:bg-surface/60 transition-colors group"
                    >
                      <td className="py-2.5 px-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenCustomer360) {
                              onClose();
                              onOpenCustomer360(u.userId);
                            }
                          }}
                          className="text-left font-medium text-foreground hover:underline block truncate max-w-[200px]"
                        >
                          {u.fullName || "Khách hàng"}
                        </button>
                        <div className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                          {u.email || u.phone || "—"}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-[2px] bg-surface border border-border">
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold" title="Recency Score">
                            R:{u.rScore}
                          </span>
                          <span className="text-border">|</span>
                          <span className="text-blue-600 dark:text-blue-400 font-semibold" title="Frequency Score">
                            F:{u.fScore}
                          </span>
                          <span className="text-border">|</span>
                          <span className="text-purple-600 dark:text-purple-400 font-semibold" title="Monetary Score">
                            M:{u.mScore}
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono text-muted-foreground">
                        <div>{u.recencyDays} ngày trước</div>
                        <div className="text-[10px] text-muted-foreground/70">
                          {u.lastOrderDate ? new Date(u.lastOrderDate).toLocaleDateString("vi-VN") : "—"}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono font-medium text-foreground">
                        {u.orderCount} đơn
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-foreground">
                        {formatVND(u.totalSpendMinor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer with Pagination */}
        <div className="p-3 border-t border-border bg-surface shrink-0 flex items-center justify-between text-xs text-muted-foreground">
          <div className="font-mono text-[11px]">
            Trang {page} / {totalPages} (Tổng {total} khách hàng)
          </div>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-9 w-9 p-0 rounded-[2px]"
            >
              <ChevronLeftIcon className="w-3.5 h-3.5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-9 w-9 p-0 rounded-[2px]"
            >
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SegmentUsersModal;

