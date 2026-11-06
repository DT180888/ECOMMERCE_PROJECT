import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  TagIcon,
  ShoppingBagIcon,
  MapPinIcon,
  TicketIcon,
  ChatBubbleLeftEllipsisIcon,
  BookmarkSquareIcon,
  TrashIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  useToast,
  cn,
  TextArea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  Tabs,
  TabsList,
  TabsTrigger,
  Badge,
} from "@my-project/ui";
import { formatVND } from "@my-project/shared-utils";
import { SplitPaneInspector } from "@components/common/SplitPaneInspector";
import { AdminStatusBadge } from "@components/common/AdminStatusBadge";
import { AdminTable, type AdminTableColumn } from "@shared/ui";
import {
  useCustomer360,
  useCustomerNotes,
  useCreateCustomerNote,
  useDeleteCustomerNote,
  useTogglePinCustomerNote,
  useCustomerTags,
  useAssignCustomerTags,
} from "@hooks/useCustomer360";
import type { CustomerTagDto } from "@my-project/api";

interface Customer360DrawerProps {
  open: boolean;
  onClose: () => void;
  userId: string | null;
}

type ActiveTab = "notes" | "orders" | "addresses" | "vouchers";

export function Customer360Drawer({ open, onClose, userId }: Customer360DrawerProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("notes");
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // Queries
  const { data: c360, isLoading } = useCustomer360(userId ?? undefined);
  const { data: notes = [], isLoading: isLoadingNotes } = useCustomerNotes(userId ?? undefined);

  // Mutations
  const createNoteMut = useCreateCustomerNote(userId || "");
  const deleteNoteMut = useDeleteCustomerNote(userId || "");
  const togglePinMut = useTogglePinCustomerNote(userId || "");
  const assignTagsMut = useAssignCustomerTags(userId || "");
  const { data: allTags = [] } = useCustomerTags({ enabled: open });

  // Form states for new note
  const [noteContent, setNoteContent] = useState("");
  const [noteCategory, setNoteCategory] = useState("General");
  const [noteIsPinned, setNoteIsPinned] = useState(false);
  const toast = useToast();

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    try {
      await createNoteMut.mutateAsync({
        content: noteContent.trim(),
        category: noteCategory,
        isPinned: noteIsPinned,
      });
      setNoteContent("");
      setNoteIsPinned(false);
      toast.success("Đã thêm ghi chú CSKH thành công");
    } catch {
      toast.error("Không thể lưu ghi chú. Vui lòng thử lại");
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      await deleteNoteMut.mutateAsync(noteId);
      toast.success("Đã xóa ghi chú");
    } catch {
      toast.error("Không thể xóa ghi chú");
    }
  };

  const handleTogglePin = async (noteId: number, currentPinned: boolean) => {
    try {
      await togglePinMut.mutateAsync({ noteId, isPinned: !currentPinned });
      toast.success(!currentPinned ? "Đã ghim ghi chú" : "Đã bỏ ghim ghi chú");
    } catch {
      toast.error("Không thể thay đổi trạng thái ghim");
    }
  };

  const handleToggleTag = async (tagId: number) => {
    if (!userId || !c360) return;
    const currentTagIds = c360.tags.map((t) => t.tagId);
    const newTagIds = currentTagIds.includes(tagId)
      ? currentTagIds.filter((id) => id !== tagId)
      : [...currentTagIds, tagId];
    try {
      await assignTagsMut.mutateAsync({ tagIds: newTagIds });
      toast.success("Cập nhật nhãn thành công");
    } catch {
      toast.error("Không thể cập nhật nhãn");
    }
  };

  const profile = c360?.profile;
  const metrics = c360?.metrics;

  const orderColumns: AdminTableColumn<NonNullable<typeof c360>["recentOrders"][number]>[] = useMemo(
    () => [
      {
        key: "orderNumber",
        label: "Mã đơn",
        render: (o) => (
          <Link
            to={`/admin/orders/${o.orderId}`}
            className="font-mono text-xs font-medium text-foreground hover:underline"
          >
            {o.orderNumber}
          </Link>
        ),
      },
      {
        key: "createdAt",
        label: "Ngày đặt",
        render: (o) => (
          <span className="font-mono text-muted-foreground">
            {new Date(o.createdAt).toLocaleDateString("vi-VN")}
          </span>
        ),
      },
      {
        key: "itemCount",
        label: "Mặt hàng",
        align: "right",
        render: (o) => <span className="font-mono tabular-nums">{o.itemCount} sp</span>,
      },
      {
        key: "totalMinor",
        label: "Tổng tiền",
        align: "right",
        render: (o) => (
          <span className="font-mono font-medium tabular-nums text-foreground">
            {formatVND(o.totalMinor)}
          </span>
        ),
      },
      {
        key: "statusText",
        label: "Trạng thái",
        align: "center",
        render: (o) => (
          <span className="font-mono text-[11px] text-muted-foreground">{o.statusText}</span>
        ),
      },
    ],
    []
  );

  return (
    <SplitPaneInspector
      open={open}
      onClose={onClose}
      title="Chân dung Khách hàng 360°"
      description={profile?.fullName || profile?.email || "Thông tin khách hàng"}
      defaultWidth={680}
      minWidth={520}
      maxWidth={850}
    >
      {isLoading || !profile ? (
        <div className="p-8 text-center text-xs text-muted-foreground font-mono">
          <div className="inline-block animate-spin mr-2">⟳</div>
          Đang nạp hồ sơ 360° khách hàng...
        </div>
      ) : (
        <div className="flex flex-col gap-4 pb-6">
          {/* ── 1. Hero Profile Card ── */}
          <div className="bg-card border border-border rounded-[2px] p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-base font-semibold text-foreground font-mono shrink-0">
                  {profile.fullName?.charAt(0).toUpperCase() || profile.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {profile.fullName || "Chưa đặt tên"}
                    </h3>
                    <AdminStatusBadge variant={profile.isLocked ? "error" : "success"}>
                      {profile.isLocked ? "Đã khóa" : "Hoạt động"}
                    </AdminStatusBadge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono truncate">{profile.email || "—"}</p>
                  <p className="text-xs text-muted-foreground font-mono">{profile.phone || "Chưa có SĐT"}</p>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsTagModalOpen(!isTagModalOpen)}
                className="h-8 gap-1.5 text-xs rounded-[2px] shrink-0"
              >
                <TagIcon className="w-3.5 h-3.5 stroke-[1.25]" />
                <span>Gắn nhãn</span>
              </Button>
            </div>

            {/* Tags Row */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/60">
              <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground mr-1">
                Nhãn:
              </span>
              {c360.tags.length === 0 ? (
                <span className="text-xs text-muted-foreground italic">Chưa gắn nhãn nào</span>
              ) : (
                c360.tags.map((t) => (
                  <span
                    key={t.tagId}
                    className="inline-flex items-center px-2 py-0.5 rounded-[2px] text-[10px] font-mono border"
                    style={{
                      borderColor: t.colorHex,
                      color: t.colorHex,
                      backgroundColor: `${t.colorHex}15`,
                    }}
                  >
                    {t.name}
                  </span>
                ))
              )}
            </div>

            {/* Tag Selection Popover / Inline Drawer */}
            {isTagModalOpen && (
              <div className="p-3 bg-surface border border-border rounded-[2px] flex flex-col gap-2">
                <span className="text-[11px] font-medium text-foreground">Chọn nhãn cho khách hàng:</span>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.map((t) => {
                    const isSelected = c360.tags.some((cur) => cur.tagId === t.id);
                    return (
                      <Button
                        key={t.id}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="xs"
                        onClick={() => handleToggleTag(t.id)}
                        className="font-mono text-xs rounded-[2px] gap-1"
                      >
                        {isSelected && <CheckIcon className="w-3 h-3 stroke-[2]" />}
                        <span>{t.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── 1.5. Phân khúc RFM Khách hàng (Phase 3) ── */}
          {c360?.rfm && (
            <div className="p-3 bg-surface border border-border rounded-[2px] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Phân khúc RFM
                </span>
                <span className="px-2 py-0.5 text-xs font-mono font-bold rounded-[2px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {c360.rfm.segmentKey}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-card p-2 rounded-[2px] border border-border">
                  <span className="block text-[10px] font-mono text-muted-foreground uppercase">Recency</span>
                  <span className="text-sm font-bold font-mono text-foreground">{c360.rfm.rScore}/5</span>
                  <span className="block text-[10px] text-muted-foreground font-mono">({c360.rfm.recencyDays} ngày)</span>
                </div>
                <div className="bg-card p-2 rounded-[2px] border border-border">
                  <span className="block text-[10px] font-mono text-muted-foreground uppercase">Frequency</span>
                  <span className="text-sm font-bold font-mono text-foreground">{c360.rfm.fScore}/5</span>
                  <span className="block text-[10px] text-muted-foreground font-mono">(Tần suất đơn)</span>
                </div>
                <div className="bg-card p-2 rounded-[2px] border border-border">
                  <span className="block text-[10px] font-mono text-muted-foreground uppercase">Monetary</span>
                  <span className="text-sm font-bold font-mono text-foreground">{c360.rfm.mScore}/5</span>
                  <span className="block text-[10px] text-muted-foreground font-mono">(Mức chi tiêu)</span>
                </div>
              </div>
            </div>
          )}

          {/* ── 2. 4 Thẻ Chỉ Số Vàng (KPIs Monolith) ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="p-3 bg-card border border-border rounded-[2px] flex flex-col gap-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                Tổng chi tiêu
              </span>
              <span className="text-sm font-semibold font-mono tabular-nums text-foreground">
                {formatVND(metrics?.lifetimeSpendMinor ?? 0)}
              </span>
            </div>

            <div className="p-3 bg-card border border-border rounded-[2px] flex flex-col gap-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                Tổng số đơn
              </span>
              <span className="text-sm font-semibold font-mono tabular-nums text-foreground">
                {metrics?.totalOrderCount ?? 0} đơn
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {metrics?.completedOrderCount ?? 0} xong • {metrics?.cancelledOrderCount ?? 0} hủy
              </span>
            </div>

            <div className="p-3 bg-card border border-border rounded-[2px] flex flex-col gap-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                Giá trị TB (AOV)
              </span>
              <span className="text-sm font-semibold font-mono tabular-nums text-foreground">
                {formatVND(metrics?.aovMinor ?? 0)}
              </span>
            </div>

            <div className="p-3 bg-card border border-border rounded-[2px] flex flex-col gap-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                Đơn gần nhất
              </span>
              <span className="text-sm font-semibold font-mono tabular-nums text-foreground truncate">
                {metrics?.lastOrderDate
                  ? new Date(metrics.lastOrderDate).toLocaleDateString("vi-VN")
                  : "Chưa có"}
              </span>
            </div>
          </div>

          {/* ── 3. Tab Bar Navigation ── */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ActiveTab)} className="w-full">
            <TabsList mode="tabs" className="w-full grid grid-cols-4 h-9 p-1 bg-surface border border-border rounded-[2px]">
              <TabsTrigger
                value="notes"
                icon={<ChatBubbleLeftEllipsisIcon className="w-3.5 h-3.5 stroke-[1.25]" />}
                badge={notes.length}
              >
                Ghi chú
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                icon={<ShoppingBagIcon className="w-3.5 h-3.5 stroke-[1.25]" />}
                badge={c360.recentOrders.length}
              >
                Đơn hàng
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                icon={<MapPinIcon className="w-3.5 h-3.5 stroke-[1.25]" />}
                badge={c360.addresses.length}
              >
                Địa chỉ
              </TabsTrigger>
              <TabsTrigger
                value="vouchers"
                icon={<TicketIcon className="w-3.5 h-3.5 stroke-[1.25]" />}
                badge={c360.availableVouchers.length}
              >
                Voucher
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* ── Tab Content: Ghi chú CSKH ── */}
          {activeTab === "notes" && (
            <div className="flex flex-col gap-3">
              {/* Note Input Box */}
              <form onSubmit={handleCreateNote} className="bg-card border border-border rounded-[2px] p-3 flex flex-col gap-2">
                <TextArea
                  rows={2}
                  placeholder="Nhập ghi chú CSKH nội bộ (khách hàng không thấy)..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full bg-surface border border-border p-2 text-xs rounded-[2px] text-foreground focus:outline-none focus:border-foreground/60 resize-none font-sans"
                />
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-3">
                    <Select value={noteCategory} onValueChange={setNoteCategory}>
                      <SelectTrigger className="h-8 w-36 bg-surface text-xs font-mono rounded-[2px] border-border shadow-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-[2px] border-border">
                        <SelectItem value="General">Chung</SelectItem>
                        <SelectItem value="Complaint">Khiếu nại</SelectItem>
                        <SelectItem value="Preference">Sở thích / Size</SelectItem>
                        <SelectItem value="VIPNote">Lưu ý VIP</SelectItem>
                      </SelectContent>
                    </Select>

                    <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                      <Checkbox
                        checked={noteIsPinned}
                        onChange={(e) => setNoteIsPinned(e.target.checked)}
                      />
                      <span>Ghim lên đầu</span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    size="sm"
                    disabled={createNoteMut.isPending || !noteContent.trim()}
                    className="h-8 px-3 text-xs rounded-[2px]"
                  >
                    <span>{createNoteMut.isPending ? "Đang lưu..." : "Lưu ghi chú"}</span>
                  </Button>
                </div>
              </form>

              {/* Notes Timeline List */}
              <div className="flex flex-col gap-2">
                {isLoadingNotes ? (
                  <div className="p-4 text-center text-xs text-muted-foreground font-mono">Đang tải ghi chú...</div>
                ) : notes.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground bg-card border border-border rounded-[2px]">
                    Chưa có ghi chú CSKH nào cho khách hàng này.
                  </div>
                ) : (
                  notes.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "p-3 rounded-[2px] border flex flex-col gap-1.5 transition-colors",
                        n.isPinned
                          ? "bg-amber-500/5 border-amber-500/30"
                          : "bg-card border-border hover:bg-surface/50"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {n.isPinned && (
                            <span className="text-[10px] font-mono text-amber-500 font-medium">📌 Đã ghim</span>
                          )}
                          <span className="px-1.5 py-0.5 rounded-[2px] text-[10px] font-mono bg-surface border border-border text-muted-foreground uppercase">
                            {n.category}
                          </span>
                          <span className="text-xs font-medium text-foreground">{n.authorName}</span>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {new Date(n.createdAt).toLocaleString("vi-VN")}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            onClick={() => handleTogglePin(n.id, n.isPinned)}
                            title={n.isPinned ? "Bỏ ghim" : "Ghim lên đầu"}
                            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-[2px]"
                          >
                            <BookmarkSquareIcon className="w-3.5 h-3.5 stroke-[1.25]" />
                          </Button>
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            onClick={() => handleDeleteNote(n.id)}
                            title="Xóa ghi chú"
                            className="h-8 w-8 text-muted-foreground hover:text-error rounded-[2px]"
                          >
                            <TrashIcon className="w-3.5 h-3.5 stroke-[1.25]" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">{n.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── Tab Content: Đơn hàng gần đây ── */}
          {activeTab === "orders" && (
              <AdminTable
                columns={orderColumns}
                data={c360.recentOrders}
                rowKey="orderId"
                emptyText="Khách hàng chưa phát sinh đơn hàng nào."
              />
          )}

          {/* ── Tab Content: Sổ địa chỉ ── */}
          {activeTab === "addresses" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {c360.addresses.length === 0 ? (
                <div className="sm:col-span-2 p-6 text-center text-xs text-muted-foreground bg-card border border-border rounded-[2px]">
                  Chưa có địa chỉ nhận hàng nào được lưu.
                </div>
              ) : (
                c360.addresses.map((a) => (
                  <div
                    key={a.addressId}
                    className="p-3 bg-card border border-border rounded-[2px] flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-foreground">{a.recipientName}</span>
                      {a.isDefault && (
                        <Badge
                          variant="flat"
                          className="px-1.5 py-0.5 rounded-[2px] text-[9px] font-mono uppercase border-border/80"
                        >
                          Mặc định
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{a.phone || "—"}</span>
                    <p className="text-xs text-muted-foreground leading-relaxed">{a.fullAddress}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── Tab Content: Ví Voucher ── */}
          {activeTab === "vouchers" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {c360.availableVouchers.length === 0 ? (
                <div className="sm:col-span-2 p-6 text-center text-xs text-muted-foreground bg-card border border-border rounded-[2px]">
                  Không có voucher hoặc mã ưu đãi nào trong ví.
                </div>
              ) : (
                c360.availableVouchers.map((v) => (
                  <div
                    key={v.couponId}
                    className="p-3 bg-card border border-dashed border-border rounded-[2px] flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-xs text-foreground px-2 py-0.5 bg-surface border border-border rounded-[2px]">
                        {v.code}
                      </span>
                      <span className="text-xs text-success font-medium font-mono">
                        {v.discountType === 0 ? `Giảm ${v.discountValue}%` : `Giảm ${formatVND(v.discountValue)}`}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-foreground truncate mt-1">{v.promotionName}</span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      HSD: {v.expiresAt ? new Date(v.expiresAt).toLocaleDateString("vi-VN") : "Vô thời hạn"}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </SplitPaneInspector>
  );
}

