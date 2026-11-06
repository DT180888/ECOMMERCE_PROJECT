import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle, WarningCircle, Info, Question, X } from "@phosphor-icons/react";
import { cn } from "../shared/utils";

// --- 1. Định nghĩa Types mới ---
type ToastType = "success" | "error" | "info" | "warning" | "confirm"; 

type ToastItem = { 
  id: number; 
  type: ToastType; 
  message: string; 
  timeout?: number; 
  // Options cho confirm
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
};

type ToastContextType = {
  push: (t: Omit<ToastItem, "id">) => void;
  remove: (id: number) => void;
};

const ToastCtx = createContext<ToastContextType | null>(null);
let _counter = 1;

// --- 2. Provider ---
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const remove = (id: number) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  };

  const api = useMemo<ToastContextType>(() => ({
    push: (item) => {
      const id = _counter++;
      setItems((prev) => [...prev, { ...item, id }]);
      
      const duration = item.timeout ?? (item.type === 'confirm' ? Infinity : 3000);

      if (duration !== Infinity) {
        timers.current[id] = setTimeout(() => {
          remove(id);
        }, duration);
      }
    },
    remove
  }), []);

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="fixed bottom-4 left-4 right-4 md:bottom-auto md:left-auto md:top-4 md:right-4 z-[9999] flex flex-col gap-3 pointer-events-none md:max-w-sm">
        {items.map((t) => (
          <ToastItemUI key={t.id} item={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

// --- 3. UI Component ---
function ToastItemUI({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  const styles = {
    success: "bg-card text-foreground border-border/60",
    error:   "bg-card text-foreground border-error/40",
    info:    "bg-card text-foreground border-border/60",
    warning: "bg-card text-foreground border-warning/40",
    confirm: "bg-card text-foreground border-border/60",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success" weight="light" />,
    error:   <WarningCircle className="w-5 h-5 text-error" weight="light" />,
    info:    <Info className="w-5 h-5 text-foreground" weight="light" />,
    warning: <WarningCircle className="w-5 h-5 text-warning" weight="light" />,
    confirm: <Question className="w-5 h-5 text-foreground" weight="light" />,
  };

  const handleConfirm = () => {
    item.onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    item.onCancel?.();
    onClose();
  };

  return (
    <div
      className={cn(
        "pointer-events-auto w-full md:min-w-[320px] max-w-full md:max-w-sm flex flex-col p-4 rounded-[2px] shadow-none border bg-card text-foreground transition-all duration-200 animate-in fade-in duration-200",
        styles[item.type]
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">{icons[item.type]}</div>
        <div className="flex-1 text-xs font-display leading-relaxed text-foreground">
            {item.message}
        </div>
        {item.type !== 'confirm' && (
           <button onClick={onClose} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
             <X className="w-4 h-4" weight="light" />
           </button>
        )}
      </div>

      {/* Nút bấm cho Confirm Toast */}
      {item.type === 'confirm' && (
          <div className="mt-3 flex justify-end gap-2">
              <button 
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs font-display uppercase tracking-wider text-muted-foreground hover:bg-surface rounded-[2px] transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleConfirm}
                className="px-3 py-1.5 text-xs font-display uppercase tracking-wider font-medium text-background bg-foreground hover:opacity-90 rounded-[2px] transition-opacity"
              >
                {item.confirmLabel || "Đồng ý"}
              </button>
          </div>
      )}
    </div>
  );
}

// --- 4. Hook Helper ---
// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");

  return {
    success: (msg: string, time?: number) => ctx.push({ type: "success", message: msg, timeout: time }),
    error:   (msg: string, time?: number) => ctx.push({ type: "error", message: msg, timeout: time }),
    info:    (msg: string, time?: number) => ctx.push({ type: "info", message: msg, timeout: time }),
    warning: (msg: string, time?: number) => ctx.push({ type: "warning", message: msg, timeout: time }),
    
    // Hàm confirm đặc biệt
    confirm: (message: string, onConfirm: () => void, label = "Xác nhận") => {
        ctx.push({ 
            type: "confirm", 
            message, 
            onConfirm, 
            confirmLabel: label 
        });
    }
  };
}
