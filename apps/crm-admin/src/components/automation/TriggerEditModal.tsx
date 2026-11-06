import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  TextArea,
  useToast,
} from "@my-project/ui";
import {
  useCreateAutomationTrigger,
  useUpdateAutomationTrigger,
} from "@hooks/useAutomation";
import type { AutomationTriggerDto, AutomationEventType } from "@my-project/api";

export interface TriggerEditModalProps {
  trigger: AutomationTriggerDto | null;
  isOpen: boolean;
  onClose: () => void;
}

const EVENT_TYPE_OPTIONS: { value: AutomationEventType; label: string; desc: string }[] = [
  {
    value: "Birthday",
    label: "🎂 Chúc mừng Sinh nhật Khách hàng",
    desc: "Tự động gửi thư và mã ưu đãi vào ngày sinh nhật của khách",
  },
  {
    value: "DormantCustomer",
    label: "❄️ Kéo Khách hàng Ngủ đông (Dormant)",
    desc: "Tự động kích hoạt khi khách hàng không có đơn hàng mới trong 60-90 ngày",
  },
  {
    value: "TierUpgrade",
    label: "⭐ Chúc mừng Thăng hạng Thành viên",
    desc: "Gửi thư chúc mừng khi khách hàng đạt đủ điểm nâng hạng VIP",
  },
  {
    value: "FirstOrderThankYou",
    label: "🎁 Cảm ơn Đơn hàng Đầu tiên",
    desc: "Gửi lời tri ân và mã voucher sau khi khách hoàn thành đơn đầu",
  },
];

const CHANNEL_OPTIONS = ["Email", "SMS", "Zalo"];

export function TriggerEditModal({ trigger, isOpen, onClose }: TriggerEditModalProps) {
  const toast = useToast();
  const createMutation = useCreateAutomationTrigger();
  const updateMutation = useUpdateAutomationTrigger();

  const isEdit = Boolean(trigger);

  const [triggerName, setTriggerName] = useState("");
  const [eventType, setEventType] = useState<AutomationEventType>("Birthday");
  const [channel, setChannel] = useState<string>("Email");
  const [couponCodeTemplate, setCouponCodeTemplate] = useState("");
  const [templateContent, setTemplateContent] = useState("");

  useEffect(() => {
    if (trigger) {
      setTriggerName(trigger.triggerName);
      setEventType((trigger.eventType as AutomationEventType) || "Birthday");
      setChannel(trigger.channel || "Email");
      setCouponCodeTemplate(trigger.couponCodeTemplate || "");
      setTemplateContent(trigger.templateContent || "");
    } else {
      setTriggerName("");
      setEventType("Birthday");
      setChannel("Email");
      setCouponCodeTemplate("");
      setTemplateContent("");
    }
  }, [trigger, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!triggerName.trim()) {
      toast.error("Vui lòng nhập tên kịch bản");
      return;
    }
    if (!templateContent.trim()) {
      toast.error("Vui lòng nhập nội dung thông điệp mẫu");
      return;
    }

    try {
      if (isEdit && trigger) {
        await updateMutation.mutateAsync({
          id: trigger.id,
          payload: {
            triggerName: triggerName.trim(),
            channel,
            templateContent: templateContent.trim(),
            couponCodeTemplate: couponCodeTemplate.trim() || undefined,
          },
        });
        toast.success("Cập nhật kịch bản thành công");
      } else {
        await createMutation.mutateAsync({
          triggerName: triggerName.trim(),
          eventType,
          channel,
          templateContent: templateContent.trim(),
          couponCodeTemplate: couponCodeTemplate.trim() || undefined,
          isEnabled: true,
        });
        toast.success("Tạo mới kịch bản tiếp thị thành công");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Có lỗi xảy ra khi lưu kịch bản");
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-card border border-border rounded-[2px] shadow-none">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold uppercase tracking-wider text-foreground">
            {isEdit ? "Chỉnh sửa Kịch bản Tiếp thị" : "Tạo Kịch bản Tiếp thị Mới"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Thiết lập điều kiện gửi tự động, kênh truyền thông và nội dung mẫu đính kèm voucher.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Trigger Name */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Tên kịch bản:</label>
            <Input
              value={triggerName}
              onChange={(e) => setTriggerName(e.target.value)}
              placeholder="VD: Chúc mừng sinh nhật khách hàng tháng này..."
              className="h-8 text-xs bg-background border-border rounded-[2px]"
              maxLength={150}
            />
          </div>

          {/* Event Type (only editable when creating) */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Sự kiện kích hoạt (Event Type):</label>
            {isEdit ? (
              <div className="p-2 text-xs bg-surface border border-border rounded-[2px] font-mono text-foreground">
                {trigger?.eventType}
              </div>
            ) : (
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as AutomationEventType)}
                className="w-full h-8 px-2.5 text-xs bg-background border border-border rounded-[2px] text-foreground focus:outline-none"
              >
                {EVENT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Channel */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Kênh gửi tin:</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full h-8 px-2.5 text-xs bg-background border border-border rounded-[2px] text-foreground focus:outline-none"
              >
                {CHANNEL_OPTIONS.map((ch) => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))}
              </select>
            </div>

            {/* Coupon Code Template */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Mã Voucher đính kèm (nếu có):</label>
              <Input
                value={couponCodeTemplate}
                onChange={(e) => setCouponCodeTemplate(e.target.value.toUpperCase())}
                placeholder="VD: HPBD-SPECIAL, COMEBACK50"
                className="h-8 text-xs bg-background border-border rounded-[2px] font-mono uppercase"
                maxLength={50}
              />
            </div>
          </div>

          {/* Template Content */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Nội dung thông điệp (Template):</label>
              <span className="text-[10px] font-mono text-muted-foreground">
                Biến hỗ trợ: {"{CustomerName}"}, {"{CouponCode}"}
              </span>
            </div>
            <TextArea
              value={templateContent}
              onChange={(e) => setTemplateContent(e.target.value)}
              rows={5}
              placeholder="VD: Chào {CustomerName}, Chúc bạn một ngày sinh nhật thật ý nghĩa! Shop xin gửi tặng bạn món quà nhỏ mã voucher {CouponCode} giảm 15%..."
              className="text-xs bg-background border-border rounded-[2px]"
            />
          </div>

          <DialogFooter className="mt-6 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 px-3 text-xs rounded-[2px]"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="h-8 px-4 text-xs font-medium rounded-[2px]"
            >
              {isPending ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo kịch bản"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TriggerEditModal;

