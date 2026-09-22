import { resolveSkuByPick, useSkuList, useVariantGroups } from "@entities/product/sku/hooks";
import type { ProductId } from "@entities/product/sku/types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  productId: ProductId;
  onChange?: (skuId: number | null, priceMinor?: number, skuCode?: string) => void;
  defaultPick?: Record<number, string>;
};

export default function SkuSelector({ productId, onChange, defaultPick }: Props) {
  const { data: skus, isLoading } = useSkuList(productId, { enabled: !!productId });

  const activeSkus = useMemo(() => (skus ?? []).filter((s) => s.isActive), [skus]);
  const groups = useVariantGroups(activeSkus);
  const [pick, setPick] = useState<Record<number, string>>(defaultPick ?? {});
  const hasAutoSelected = useRef(false);

  // Logic Auto-select (Giống hệt Web)
  useEffect(() => {
    if (activeSkus.length > 0 && !hasAutoSelected.current && Object.keys(pick).length === 0) {
      const firstSku = activeSkus[0];
      const newPick: Record<number, string> = {};
      firstSku.options.forEach(o => { newPick[o.attributeId] = o.value; });
      setPick(newPick);
      hasAutoSelected.current = true;
    }
  }, [activeSkus]);

  const current = useMemo(() => resolveSkuByPick(activeSkus, pick), [activeSkus, pick]);

  useEffect(() => {
    if (!onChange || isLoading || activeSkus.length === 0) return;
    if (current) {
      onChange(current.skuId, current.priceMinor, current.skuCode);
    } else {
      onChange(null);
    }
  }, [current, onChange, isLoading, activeSkus.length]);

  // Logic check disable (Giống hệt Web)
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

  if (isLoading) return <View className="h-20 bg-gray-100 rounded-xl animate-pulse" />;
  if (!activeSkus.length || !groups.length) return null;

  return (
    <View className="space-y-4">
      {groups.map((g) => (
        <View key={g.attributeId} className="space-y-2">
          <View className="flex-row justify-between">
             <Text className="text-sm font-bold text-gray-700 uppercase">{g.attributeName}</Text>
             {pick[g.attributeId] ? (
                 <Text className="text-xs text-blue-600 font-medium">{pick[g.attributeId]}</Text>
             ) : null}
          </View>
          
          <View className="flex-row flex-wrap gap-2">
            {g.values.map((val) => {
              const active = pick[g.attributeId] === val;
              const disabled = isOptionDisabled(g.attributeId, val);

              return (
                <TouchableOpacity
                  key={val}
                  disabled={disabled}
                  onPress={() =>
                    setPick((old) => ({
                      ...old,
                      [g.attributeId]: old[g.attributeId] === val ? "" : val,
                    }))
                  }
                  className={`
                    px-4 py-2 rounded-lg border
                    ${active 
                        ? "bg-blue-600 border-blue-600" 
                        : disabled 
                            ? "bg-gray-100 border-gray-100 opacity-50" 
                            : "bg-white border-gray-300"
                    }
                  `}
                >
                  <Text className={`font-medium ${active ? "text-white" : disabled ? "text-gray-400 decoration-line-through" : "text-gray-700"}`}>
                    {val}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}