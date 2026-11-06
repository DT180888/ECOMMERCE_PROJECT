import { useState } from "react";
import {
  SparklesIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";
import { Button, useToast, Skeleton } from "@my-project/ui";
import { AdminPageShell } from "@shared/ui";
import { formatVND } from "@my-project/shared-utils";
import {
  useRfmSegmentsOverview,
  useRecalculateRfm,
  useDownloadRfmAudienceCsv,
} from "@hooks/useRfm";
import { SegmentUsersModal } from "@components/rfm";
import { Customer360Drawer } from "@components/customer/Customer360Drawer";
import type { SegmentSummaryDto } from "@my-project/api";

const SEGMENT_ICONS: Record<string, string> = {
  Champions: "🏆",
  Loyal: "💎",
  Potential: "🚀",
  NewCustomers: "🌱",
  Promising: "✨",
  AtRisk: "⚠️",
  Hibernating: "❄️",
  Lost: "🥀",
};

export function RfmSegmentsPage() {
  const toast = useToast();
  const { data: segments = [], isLoading, isRefetching } = useRfmSegmentsOverview();
  const recalculateMutation = useRecalculateRfm();
  const downloadMutation = useDownloadRfmAudienceCsv();

  const [activeSegment, setActiveSegment] = useState<SegmentSummaryDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRecalculate = async () => {
    try {
      const msg = await recalculateMutation.mutateAsync();
      toast.success(msg || "Đã kích hoạt tính toán phân cụm RFM thành công");
    } catch {
      toast.error("Không thể tính toán phân cụm lúc này");
    }
  };

  const handleQuickDownload = async (seg: SegmentSummaryDto, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await downloadMutation.mutateAsync(seg.key);
      toast.success(`Đang tải xuống tệp Audience cho ${seg.name}`);
    } catch {
      toast.error("Lỗi khi tải file CSV");
    }
  };

  const handleOpenSegment = (seg: SegmentSummaryDto) => {
    setActiveSegment(seg);
    setIsModalOpen(true);
  };

  const handleOpen360 = (userId: string) => {
    setSelectedUserId(userId);
    setIsDrawerOpen(true);
  };

  const totalCustomers = segments.reduce((acc, s) => acc + s.customerCount, 0);

  return (
    <AdminPageShell>
      <AdminPageShell.Header
        icon={ChartPieIcon}
        title="Phân Cụm Khách Hàng Thông Minh (RFM)"
        badge="AI Segmentation"
      >
        <Button
          type="button"
          size="sm"
          disabled={recalculateMutation.isPending || isRefetching}
          onClick={handleRecalculate}
          icon={<ArrowPathIcon className={`w-3.5 h-3.5 ${
            recalculateMutation.isPending || isRefetching ? "animate-spin" : ""
          }`} />}
          className="h-[34px] px-3.5 text-xs font-medium rounded-md flex items-center gap-2 shadow-sm"
        >
          <span>{recalculateMutation.isPending ? "Đang tính..." : "Tính toán lại RFM"}</span>
        </Button>
      </AdminPageShell.Header>

      <AdminPageShell.Body padded>
        <div className="space-y-6">
          {/* Explanation Banner */}
          <div className="p-4 rounded-lg bg-card shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Mô hình Phân tích Khách hàng RFM
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
                Hệ thống tự động phân loại người mua thành 8 nhóm hành vi dựa trên:{" "}
                <strong className="text-foreground">Recency</strong> (Số ngày từ đơn mua gần nhất),{" "}
                <strong className="text-foreground">Frequency</strong> (Tần suất số lượng đơn hàng), và{" "}
                <strong className="text-foreground">Monetary</strong> (Tổng giá trị chi tiêu) trong 12 tháng qua.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 font-mono text-xs text-muted-foreground px-3 py-1.5 rounded-md bg-surface border border-border">
              <UserGroupIcon className="w-4 h-4 text-foreground stroke-[1.5]" />
              <span>Tổng: <strong className="text-foreground">{totalCustomers}</strong> khách</span>
            </div>
          </div>

          {/* Grid 8 Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, idx) => (
                <Skeleton key={idx} className="h-64 rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {segments.map((seg) => {
                const icon = SEGMENT_ICONS[seg.key] || "🏷️";
                return (
                  <div
                    key={seg.key}
                    onClick={() => handleOpenSegment(seg)}
                    className="p-4 rounded-sm bg-card hover:bg-surface-hover/80 transition-colors flex flex-col justify-between cursor-pointer group select-none relative border-0 shadow-none"
                  >
                    <div>
                      {/* Top Row: Icon + Title + Pct */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xl shrink-0">{icon}</span>
                          <div className="min-w-0">
                            <h3 className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                              {seg.name}
                            </h3>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {seg.key}
                            </span>
                          </div>
                        </div>

                        <span
                          className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded-sm shrink-0 border"
                          style={{
                            backgroundColor: `${seg.colorHex}15`,
                            color: seg.colorHex,
                            borderColor: `${seg.colorHex}40`,
                          }}
                        >
                          {seg.percentage}%
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px] mb-3 leading-relaxed">
                        {seg.description}
                      </p>

                      {/* Metrics bar */}
                      <div className="p-3 rounded-sm bg-surface/50 border-0 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-[10px] uppercase font-medium">Quy mô</span>
                          <span className="font-semibold font-mono tabular-nums text-foreground">
                            {seg.customerCount} khách
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-[10px] uppercase font-medium">Chi tiêu TB</span>
                          <span className="font-semibold font-mono tabular-nums text-foreground">
                            {formatVND(seg.averageSpendMinor)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-[10px] uppercase font-medium">Đơn TB</span>
                          <span className="font-semibold font-mono tabular-nums text-foreground">
                            {seg.averageOrders} đơn
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border-subtle">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenSegment(seg);
                        }}
                        className="flex-1 h-8 text-xs font-medium rounded-sm shadow-none hover:bg-surface"
                      >
                        Xem tệp
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleQuickDownload(seg, e)}
                        className="h-8 w-8 p-0 text-xs rounded-sm shadow-none hover:bg-surface flex items-center justify-center shrink-0"
                        title="Tải tệp Audience CSV"
                      >
                        <ArrowDownTrayIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </AdminPageShell.Body>

      {/* Segment Users Modal */}
      <SegmentUsersModal
        segment={activeSegment}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveSegment(null);
        }}
        onOpenCustomer360={handleOpen360}
      />

      {/* Customer 360 Drawer */}
      <Customer360Drawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedUserId(null);
        }}
        userId={selectedUserId}
      />
    </AdminPageShell>
  );
}
export default RfmSegmentsPage;

