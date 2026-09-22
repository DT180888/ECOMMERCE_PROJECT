// src/shared/ui/Tabs.tsx
import * as React from "react";

type TabsContextValue = {
  value: string;
  setValue: (v: string) => void;
};
const TabsCtx = React.createContext<TabsContextValue | null>(null);

type TabsProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  className?: string;
  children: React.ReactNode;
};

export function Tabs({ value, defaultValue, onValueChange, className, children }: TabsProps) {
  const isControlled = value !== undefined;
  const [inner, setInner] = React.useState(defaultValue ?? "");
  const cur = isControlled ? (value as string) : inner;

  const setValue = React.useCallback(
    (v: string) => {
      if (!isControlled) setInner(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange]
  );

  const ctx = React.useMemo(() => ({ value: cur, setValue }), [cur, setValue]);

  return (
    <TabsCtx.Provider value={ctx}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={["inline-flex rounded-[8px] background-glass h-fit items-center p-2 gap-2", className].filter(Boolean).join(" ")}>{children}</div>;
}

export function TabsTrigger({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(TabsCtx);
  if (!ctx) throw new Error("TabsTrigger must be used within <Tabs>.");
  const active = ctx.value === value;
  return (
    <button
      type="button"
      onClick={() => ctx.setValue(value)}
      data-state={active ? "active" : "inactive"}
      className={[
        "px-3 py-1.5 rounded-[8px] border-none transition",
        active ? "background-content-glass text-white   " : "!bg-white/20  text-white  hover:bg-white/50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(TabsCtx);
  if (!ctx) throw new Error("TabsContent must be used within <Tabs>.");
  if (ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
}
