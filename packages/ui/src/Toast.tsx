import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { cn } from "./utils";

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
      
      // Logic timeout: 
      // Nếu là 'confirm' thì KHÔNG tự tắt (trừ khi truyền timeout cụ thể)
      // Các loại khác mặc định 3000ms
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
    success: "bg-success/10 border-success/15 text-success",
    error:   "bg-error/10 border-error/15 text-error",
    info:    "bg-accent/10 border-accent/15 text-accent",
    warning: "bg-amber-500/10 border-amber-500/15 text-amber-700 dark:text-amber-400",
    confirm: "bg-card text-foreground border border-foreground/10", // Style riêng cho confirm
  };

  const icons = {
    success: <CheckCircleIcon className="w-6 h-6 text-success" />,
    error:   <ExclamationCircleIcon className="w-6 h-6 text-error" />,
    info:    <InformationCircleIcon className="w-6 h-6 text-accent" />,
    warning: <ExclamationCircleIcon className="w-6 h-6 text-amber-500" />,
    confirm: <QuestionMarkCircleIcon className="w-6 h-6 text-accent" />,
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
        "pointer-events-auto w-full md:min-w-[320px] max-w-full md:max-w-sm flex flex-col p-4 rounded-button shadow-neo border transition-all duration-300 ease-out animate-in slide-in-from-bottom-5 md:slide-in-from-right-full fade-in zoom-in-95",
        styles[item.type]
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">{icons[item.type]}</div>
        <div className="flex-1 text-sm font-medium leading-relaxed">
            {item.message}
        </div>
        {item.type !== 'confirm' && (
           <button onClick={onClose} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
             <XMarkIcon className="w-3 h-3 md:w-4 md:h-4" />
           </button>
        )}
      </div>

      {/* Nút bấm cho Confirm Toast */}
      {item.type === 'confirm' && (
          <div className="mt-3 flex justify-end gap-2">
              <button 
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary/20 rounded-button transition-all duration-300"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleConfirm}
                className="px-3 py-1.5 text-xs font-bold text-accent-foreground bg-accent hover:bg-accent/90 rounded-button shadow-neo-sm hover:shadow-neo-hover active:shadow-neo-inset-sm transition-all duration-300"
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