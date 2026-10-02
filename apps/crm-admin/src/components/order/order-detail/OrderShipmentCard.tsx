import { Button } from "@my-project/ui";
import { Input } from "@my-project/ui";
import { TruckIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

interface Shipment {
  shipmentId: number;
  carrier: string;
  statusText: string;
  serviceCode?: string | null;
  trackingNumber?: string | null;
  status: number;
}

interface Props {
  shipments: Shipment[];
  trackingDraft: Record<number, string>;
  onDraftChange: (shipmentId: number, value: string) => void;
  onSaveTracking: (shipmentId: number) => void;
  isUpdating: boolean;
}

const DetailCardHeader = ({ title, icon: Icon }: { title: string; icon: React.ElementType }) => (
  <div className="flex items-center gap-2 pb-3 mb-4">
    <Icon className="w-5 h-5 text-primary" />
    <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">{title}</h3>
  </div>
);

export function OrderShipmentCard({ shipments, trackingDraft, onDraftChange, onSaveTracking, isUpdating }: Props) {
  if (shipments.length === 0) return null;

  return (
    <section className="bg-card rounded-card overflow-hidden border border-foreground/[0.04] dark:border-white/[0.05] shadow-neo-sm">
      <div className="p-6">
        <DetailCardHeader title="Thông tin Vận chuyển" icon={TruckIcon} />
        <div className="space-y-4">
          {shipments.map((s) => {
            const draftValue = trackingDraft[s.shipmentId] ?? s.trackingNumber ?? "";
            const isDrafted = draftValue !== (s.trackingNumber ?? "");
            return (
              <div key={s.shipmentId} className="p-5 bg-muted/10 border border-foreground/[0.04] dark:border-white/[0.05] rounded-card transition-colors hover:bg-muted/20">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-foreground font-bold text-sm">{s.carrier}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-inner uppercase font-semibold tracking-wide ${
                        s.status === 1 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}>
                        {s.statusText}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground font-sans">Dịch vụ: {s.serviceCode || "Tiêu chuẩn"}</div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Mã vận đơn hiện tại</div>
                    <div className="font-mono text-accent text-xs bg-accent/5 px-2 py-1 rounded-inner inline-block">
                      {s.trackingNumber || "Chưa cập nhật"}
                    </div>
                  </div>
                </div>

                <div className="flex items-end gap-3 p-3 bg-muted/10 border border-foreground/[0.04] dark:border-white/[0.05] rounded-button">
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Cập nhật Mã vận đơn</label>
                    <Input
                      placeholder="Nhập mã tracking..."
                      value={draftValue}
                      onChange={(e) => onDraftChange(s.shipmentId, e.target.value)}
                      className={`bg-muted/20 text-xs font-mono text-foreground focus:ring-2 focus:ring-accent/20 transition-all border-transparent focus:border-accent focus:bg-card ${isDrafted ? "ring-2 ring-accent/20 border-accent bg-card" : ""}`}
                    />
                  </div>
                  <Button
                    size="sm"
                    disabled={isUpdating || !isDrafted}
                    onClick={() => onSaveTracking(s.shipmentId)}
                    className={`px-4 rounded-button text-xs font-medium transition-all ${
                      isDrafted ? "bg-primary text-primary-foreground hover:bg-primary/95 hover:-translate-y-[1px] active:translate-y-[0.5px]" : "bg-muted/20 border border-border/10 text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {isUpdating ? "..." : <><PaperAirplaneIcon className="w-3 h-3 md:w-4 md:h-4 mr-1.5" /> Lưu</>}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
