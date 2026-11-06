import { useEffect, useMemo, useState, useRef } from "react";
import { useSkuList, useVariantGroups, resolveSkuByPick, type ProductId } from "@hooks/useProduct";
import { Button, Skeleton } from "@my-project/ui";

type Props = {
  productId: ProductId;
  onChange?: (skuId: number | null, priceMinor?: number, skuCode?: string) => void;
  defaultPick?: Record<number, string>;
};

/**
 * SkuSelector Component (Pure Editorial Studio Edition)
 * 
 * Chuẩn hóa 100% theo DESIGN.md:
 * - Triệt tiêu toàn bộ Neumorphism (shadow-neo*).
 * - Sử dụng Button component từ @my-project/ui.
 * - Hairline 1px border, micro rounded-[2px], 100% Plus Jakarta Sans.
 */
export default function SkuSelector({ productId, onChange, defaultPick }: Props) {
  const { data: skus, isLoading } = useSkuList(productId, { enabled: !!productId });

  const activeSkus = useMemo(() => (skus ?? []).filter((s) => s.isActive), [skus]);
  const groups = useVariantGroups(activeSkus);

  const [pick, setPick] = useState<Record<number, string>>(defaultPick ?? {});
  const hasAutoSelected = useRef(false);

  useEffect(() => {
    if (defaultPick) setPick(defaultPick);
  }, [defaultPick]);

  useEffect(() => {
    if (activeSkus.length > 0 && !hasAutoSelected.current && Object.keys(pick).length === 0) {
      const firstSku = activeSkus[0];
      const newPick: Record<number, string> = {};
      firstSku.options.forEach((o) => {
        newPick[o.attributeId] = o.value;
      });
      setPick(newPick);
      hasAutoSelected.current = true;
    }
  }, [activeSkus, pick]); 

  const current = useMemo(() => resolveSkuByPick(activeSkus, pick), [activeSkus, pick]);

  useEffect(() => {
    if (!onChange) return;
    if (isLoading || activeSkus.length === 0) return;
    if (current) {
      onChange(current.skuId, current.priceMinor, current.skuCode);
    } else {
      onChange(null);
    }
  }, [current, onChange, isLoading, activeSkus.length]);

  const isOptionDisabled = (attributeId: number, value: string) => {
    const nextPick = { ...pick, [attributeId]: value };
    const potentialSkus = activeSkus.filter((sku) => {
      return Object.entries(nextPick).every(([keyAttrId, val]) => {
        if (Number(keyAttrId) === attributeId) return true;
        if (!val) return true;
        const opt = sku.options.find((o) => o.attributeId === Number(keyAttrId));
        return opt && opt.value === val;
      });
    });
    
    const validSku = potentialSkus.find((sku) => {
      const hasOption = sku.options.some((o) => o.attributeId === attributeId && o.value === value);
      return hasOption && sku.available > 0;
    });

    return !validSku;
  };

  if (isLoading) return <Skeleton className="h-32 w-full border border-border/40" />;
  if (!activeSkus.length || !groups.length) return null;

  return (
    <div className="space-y-8 select-none">
      {groups.map((g) => (
        <div key={g.attributeId} className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-display font-medium text-muted-foreground uppercase tracking-[0.18em]">
              {g.attributeName}
            </span>
            {pick[g.attributeId] && (
              <span className="text-foreground font-display font-medium uppercase tracking-wider">
                {pick[g.attributeId]}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2.5">
            {g.values.map((val) => {
              const active = pick[g.attributeId] === val;
              const disabled = isOptionDisabled(g.attributeId, val);

              return (
                <Button
                  key={val}
                  type="button"
                  variant={active ? "default" : "outline"}
                  size="sm"
                  disabled={disabled}
                  onClick={() =>
                    setPick((old) => ({
                      ...old,
                      [g.attributeId]: old[g.attributeId] === val ? "" : val,
                    }))
                  }
                  className={`h-9 px-4 rounded-[2px] text-xs font-display uppercase tracking-wider ${
                    disabled ? "line-through opacity-30 cursor-not-allowed" : ""
                  }`}
                >
                  {val}
                </Button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="pt-2 border-t border-border/40">
        {current ? (
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 text-[11px] font-display uppercase tracking-widest ${current.available > 0 ? "text-success" : "text-error"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${current.available > 0 ? "bg-success" : "bg-error"}`} />
              {current.available > 0 ? `Sẵn hàng (${current.available} sản phẩm)` : "Tạm hết hàng"}
            </div>
            <div className="text-[11px] font-display text-muted-foreground tracking-wider">
              Mã: {current.skuCode}
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground font-display uppercase tracking-wider">
            * Vui lòng chọn đầy đủ phân loại sản phẩm
          </p>
        )}
      </div>
    </div>
  );
}
