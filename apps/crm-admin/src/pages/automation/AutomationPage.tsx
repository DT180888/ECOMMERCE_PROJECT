import { useState } from "react";
import {
  BoltIcon,
  PlusIcon,
  PlayIcon,
  PencilSquareIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { Button, Switch, useToast, Skeleton, Badge, Tabs, TabsList, TabsTrigger, cn } from "@my-project/ui";
import { AdminPageShell } from "@shared/ui";
import {
  useAutomationTriggers,
  useToggleAutomationTrigger,
  useRunAutomationTriggersNow,
} from "@hooks/useAutomation";
import { TriggerEditModal } from "@components/automation";
import type { AutomationTriggerDto } from "@my-project/api";

const EVENT_TYPE_BADGES: Record<
  string,
  { label: string; variant?: "flat" | "raised" | "inset" | "primary" | "success" | "warning" | "error" | "info" }
> = {
  Birthday: { label: "Sinh nhật", variant: "info" },
  DormantCustomer: { label: "Khách ngủ đông", variant: "warning" },
  TierUpgrade: { label: "Thăng hạng", variant: "primary" },
  FirstOrderThankYou: { label: "Tri ân đơn đầu", variant: "success" },
};

const CHANNEL_ICONS: Record<string, any> = {
  Email: EnvelopeIcon,
  SMS: DevicePhoneMobileIcon,
  Zalo: ChatBubbleLeftRightIcon,
};

const CHANNELS = ["ALL", "Email", "SMS", "Zalo"] as const;
type ChannelFilter = (typeof CHANNELS)[number];

export function AutomationPage() {
  const toast = useToast();
  const { data: triggers = [], isLoading } = useAutomationTriggers();
  const toggleMutation = useToggleAutomationTrigger();
  const runNowMutation = useRunAutomationTriggersNow();

  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("ALL");
  const [selectedTrigger, setSelectedTrigger] = useState<AutomationTriggerDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeTriggersCount = triggers.filter((t) => t.isEnabled).length;
  const filteredTriggers = triggers.filter((t) => {
    if (channelFilter === "ALL") return true;
    return t.channel === channelFilter;
  });

  const handleToggle = async (t: AutomationTriggerDto, isChecked: boolean) => {
    try {
      await toggleMutation.mutateAsync({ id: t.id, isEnabled: isChecked });
      toast.success(
        isChecked
          ? `Đã kích hoạt kịch bản "${t.triggerName}"`
          : `Đã tạm dừng kịch bản "${t.triggerName}"`
      );
    } catch {
      toast.error("Không thể thay đổi trạng thái kịch bản");
    }
  };

  const handleRunNow = async () => {
    try {
      const msg = await runNowMutation.mutateAsync();
      toast.success(msg || "Đã quét và kích hoạt gửi thông điệp tiếp thị tự động thành công");
    } catch {
      toast.error("Không thể kích hoạt quét tự động lúc này");
    }
  };

  const handleCreateNew = () => {
    setSelectedTrigger(null);
    setIsModalOpen(true);
  };

  const handleEdit = (t: AutomationTriggerDto) => {
    setSelectedTrigger(t);
    setIsModalOpen(true);
  };

  return (
    <AdminPageShell>
      <AdminPageShell.Header
        icon={BoltIcon}
        title="Tiếp Thị Tự Động (Marketing Automation)"
        badge="Trigger Campaigns"
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<PlusIcon className="w-3.5 h-3.5 stroke-[1.5]" />}
              onClick={handleCreateNew}
              className="h-[34px] px-3.5 text-xs font-medium rounded-sm shadow-none flex items-center gap-1.5"
            >
              <span>Tạo kịch bản mới</span>
            </Button>

            <Button
              type="button"
              size="sm"
              icon={<PlayIcon className={`w-3.5 h-3.5 stroke-[1.5] ${runNowMutation.isPending ? "animate-spin" : ""}`} />}
              disabled={runNowMutation.isPending}
              onClick={handleRunNow}
            >
              <span>{runNowMutation.isPending ? "Đang quét..." : "Quét & Gửi Ngay"}</span>
            </Button>
          </div>
        }
      />

      <AdminPageShell.Body padded>
        <div className="space-y-6">
          {/* ── Operational Metric Strip (Pure Editorial Tonal Contrast - border-0) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 select-none">
            <div className="p-4 bg-card border-0 rounded-sm shadow-none flex flex-col justify-between gap-1 hover:bg-surface-hover/80 transition-colors">
              <span className="text-xs text-muted-foreground font-medium">
                Kịch bản đang chạy
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg sm:text-xl font-semibold font-mono tabular-nums text-foreground">
                  {activeTriggersCount} / {triggers.length}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">kịch bản</span>
              </div>
              <span className="text-[10px] text-muted-foreground/70 font-sans">
                Tự động kích hoạt theo sự kiện
              </span>
            </div>

            <div className="p-4 bg-card border-0 rounded-sm shadow-none flex flex-col justify-between gap-1 hover:bg-surface-hover/80 transition-colors">
              <span className="text-xs text-muted-foreground font-medium">
                Lịch quét hệ thống
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg sm:text-xl font-semibold font-mono text-foreground">
                  08:00 AM
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">Hàng ngày</span>
              </div>
              <span className="text-[10px] text-muted-foreground/70 font-sans">
                Chúc mừng sinh nhật &amp; khách ngủ đông
              </span>
            </div>

            <div className="p-4 bg-card border-0 rounded-sm shadow-none flex flex-col justify-between gap-1 hover:bg-surface-hover/80 transition-colors">
              <span className="text-xs text-muted-foreground font-medium">
                Trạng thái Worker
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />
                <span className="text-base font-semibold text-foreground">
                  Đang hoạt động
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground/70 font-sans">
                Background task engine sẵn sàng
              </span>
            </div>
          </div>

          {/* ── Channel Filter Tabs Toolbar ── */}
          <AdminPageShell.Toolbar
            tabs={
              <Tabs
                value={channelFilter}
                onValueChange={(val) => setChannelFilter(val as ChannelFilter)}
                variant="segmented"
                size="sm"
              >
                <TabsList mode="auto" size="sm">
                  {CHANNELS.map((ch) => {
                    const count = ch === "ALL" ? triggers.length : triggers.filter((t) => t.channel === ch).length;
                    const IconComp = ch !== "ALL" ? CHANNEL_ICONS[ch] : undefined;
                    return (
                      <TabsTrigger
                        key={ch}
                        value={ch}
                        badge={count}
                        icon={IconComp ? <IconComp className="w-3.5 h-3.5 stroke-[1.5]" /> : undefined}
                      >
                        {ch === "ALL" ? "Tất cả kênh" : ch}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            }
          />

          {/* ── Triggers Cards Grid ── */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-60 rounded-sm" />
              ))}
            </div>
          ) : filteredTriggers.length === 0 ? (
            <div className="py-20 text-center text-xs text-muted-foreground border border-dashed border-border rounded-sm bg-surface/30">
              {triggers.length === 0
                ? 'Chưa có kịch bản tiếp thị tự động nào được tạo. Bấm "Tạo kịch bản mới" để bắt đầu!'
                : `Không tìm thấy kịch bản nào thuộc kênh "${channelFilter}".`}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTriggers.map((t) => {
                const eventBadge = EVENT_TYPE_BADGES[t.eventType] || {
                  label: t.eventType,
                };
                const ChannelIcon = CHANNEL_ICONS[t.channel] || EnvelopeIcon;

                return (
                  <div
                    key={t.id}
                    className="group relative p-4 rounded-sm bg-card border-0 shadow-none flex flex-col justify-between space-y-4 hover:bg-surface-hover/80 transition-colors select-none"
                  >
                    <div>
                      {/* Top Header: Switch + Badges */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={eventBadge.variant ?? "raised"} className="text-[11px] font-medium rounded-sm">
                            {eventBadge.label}
                          </Badge>

                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-sm bg-surface border border-border text-foreground">
                            <ChannelIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                            <span>{t.channel}</span>
                          </span>

                          {t.couponCodeTemplate && (
                            <Badge variant="raised" className="text-[11px] font-mono border-dashed rounded-sm text-foreground">
                              {t.couponCodeTemplate}
                            </Badge>
                          )}
                        </div>

                        {/* Toggle switch */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-mono uppercase text-muted-foreground">
                            {t.isEnabled ? "Bật" : "Tắt"}
                          </span>
                          <Switch
                            checked={t.isEnabled}
                            onCheckedChange={(checked) => handleToggle(t, checked)}
                            disabled={toggleMutation.isPending}
                          />
                        </div>
                      </div>

                      {/* Trigger Name */}
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        {t.triggerName}
                      </h3>
                      <div className="text-[11px] font-mono text-muted-foreground mb-3">
                        Cập nhật: {new Date(t.updatedAt).toLocaleString("vi-VN")}
                      </div>

                      {/* Template Preview (Flat Tonal, No Border, line-clamp-3) */}
                      <div className="p-3 rounded-sm bg-surface/50 border-0 text-xs font-sans text-muted-foreground leading-relaxed line-clamp-3 select-text">
                        {t.templateContent}
                      </div>
                    </div>

                    {/* Bottom Actions with Progressive Hover Disclosure */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/60">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(t)}
                        className="h-8 px-3 text-xs font-medium rounded-sm flex items-center gap-1.5 shadow-none hover:bg-surface opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                      >
                        <PencilSquareIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                        <span>Chỉnh sửa kịch bản</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </AdminPageShell.Body>

      {/* Edit / Create Modal */}
      <TriggerEditModal
        trigger={selectedTrigger}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTrigger(null);
        }}
      />
    </AdminPageShell>
  );
}

export default AutomationPage;
