import { useEffect, useMemo, useState, useRef } from "react";
import { useSkuList, useVariantGroups, resolveSkuByPick } from "@entities/product/sku/hooks";
import type { ProductId } from "@entities/product/sku/types";

type Props = {
  productId: ProductId;
  onChange?: (skuId: number | null, priceMinor?: number, skuCode?: string) => void;
  defaultPick?: Record<number, string>;
};

export default function SkuSelector({ productId, onChange, defaultPick }: Props) {
  const { data: skus, isLoading } = useSkuList(productId, { enabled: !!productId });

  // 1. Chá»‰ láº¥y SKU Active
  const activeSkus = useMemo(() => (skus ?? []).filter((s) => s.isActive), [skus]);

  // 2. NhÃ³m variant
  const groups = useVariantGroups(activeSkus);

  // 3. State lÆ°u lá»±a chá»n
  const [pick, setPick] = useState<Record<number, string>>(defaultPick ?? {});
  
  const hasAutoSelected = useRef(false);

  // Cáº­p nháº­t khi props thay Ä‘á»•i
  useEffect(() => {
    if (defaultPick) setPick(defaultPick);
  }, [defaultPick]);

  // --- LOGIC AUTO-SELECT SKU Äáº¦U TIÃŠN ---
  useEffect(() => {
    if (activeSkus.length > 0 && !hasAutoSelected.current && Object.keys(pick).length === 0) {
      const firstSku = activeSkus[0];
      const newPick: Record<number, string> = {};
      firstSku.options.forEach(o => {
        newPick[o.attributeId] = o.value;
      });
      setPick(newPick);
      hasAutoSelected.current = true;
    }
  }, [activeSkus, pick]); 

  // 4. Resolve SKU hiá»‡n táº¡i
  const current = useMemo(() => resolveSkuByPick(activeSkus, pick), [activeSkus, pick]);

  // 5. BÃ¡o ra ngoÃ i (onChange)
  useEffect(() => {
    if (!onChange) return;
    if (isLoading || activeSkus.length === 0) return;
    if (current) {
      onChange(current.skuId, current.priceMinor, current.skuCode);
    } else {
      onChange(null);
    }
  }, [current, onChange, isLoading, activeSkus.length]);

  // --- Logic kiá»ƒm tra Disable ---
  const isOptionDisabled = (attributeId: number, value: string) => {
    const nextPick = { ...pick, [attributeId]: value };
    const potentialSkus = activeSkus.filter(sku => {
        return Object.entries(nextPick).every(([keyAttrId, val]) => {
            if (Number(keyAttrId) === attributeId) return true;
            if (!val) return true;
            const opt = sku.options.find(o => o.attributeId === Number(keyAttrId));
            return opt && opt.value === val;
        });
    });
    
    const validSku = potentialSkus.find(sku => {
        const hasOption = sku.options.some(o => o.attributeId === attributeId && o.value === value);
        return hasOption && (sku.available > 0);
    });

    return !validSku;
  };

  if (isLoading) return <div className="h-40 w-full animate-pulse bg-muted/20 rounded-card"></div>;
  if (!activeSkus.length || !groups.length) return null;

  return (
    <div className="space-y-10">
      {groups.map((g) => (
        <div key={g.attributeId} className="space-y-4">
          <div className="flex items-center justify-between">
             <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">
                {g.attributeName}
             </span>
             {pick[g.attributeId] && (
                 <span className="text-[10px] text-foreground font-black uppercase tracking-widest animate-in fade-in slide-in-from-right-2">
                     {pick[g.attributeId]}
                 </span>
             )}
          </div>
          
          <div className="flex flex-wrap gap-3">
             {g.values.map((val) => {
              const active = pick[g.attributeId] === val;
              const disabled = isOptionDisabled(g.attributeId, val);

              return (
                <button
                  key={val}
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    setPick((old) => ({
                      ...old,
                      [g.attributeId]: old[g.attributeId] === val ? "" : val,
                    }))
                  }
                  className={`
                    px-5 py-2.5 rounded-button text-xs font-bold transition-all duration-300 border-none outline-none
                    focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
                    ${
                      active
                        ? "bg-background text-primary shadow-neo-inset-sm translate-y-0.5"
                        : disabled 
                            ? "bg-transparent text-muted/30 line-through cursor-not-allowed opacity-40 shadow-none" 
                            : "bg-background text-foreground shadow-neo-sm hover:shadow-neo-hover active:shadow-neo-inset-sm active:translate-y-0.5"
                    }
                  `}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Simplified Status Info */}
      <div className="pt-2">
          {current ? (
             <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${current.available > 0 ? "text-success" : "text-error"}`}>
                   <span className={`w-1.5 h-1.5 rounded-full ${current.available > 0 ? "bg-success" : "bg-error"} animate-pulse`} />
                   {current.available > 0 ? `Sáºµn hÃ ng (${current.available} sáº£n pháº©m)` : "Háº¿t hÃ ng"}
                </div>
                <div className="text-[10px] font-mono text-muted">
                   {current.skuCode}
                </div>
             </div>
          ) : (
             <p className="text-[10px] font-bold text-muted uppercase tracking-[0.15em] italic">
                * Vui lÃ²ng chá»n Ä‘áº§y Ä‘á»§ tÃ¹y chá»n
             </p>
          )}
      </div>
    </div>
  );
}

