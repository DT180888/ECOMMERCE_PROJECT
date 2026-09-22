import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiListSkus
} from "./api";
import type {
  ProductId, SkuId, Sku, VariantGroup
} from "./types";

export const skuKeys = {
  root: ["product-skus"] as const,
  list: (productId?: ProductId) => [...skuKeys.root, "list", productId] as const,
};

export function useSkuList(productId?: ProductId, opts?: { enabled?: boolean }) {
  return useQuery<Sku[]>({
    queryKey: skuKeys.list(productId),
    queryFn: () => apiListSkus(productId!),
    enabled: opts?.enabled ?? !!productId,
    staleTime: 30_000,
  });
}



/** Tá»« danh sÃ¡ch SKU, suy ra nhÃ³m thuá»™c tÃ­nh (attribute) vÃ  cÃ¡c giÃ¡ trá»‹ kháº£ dá»¥ng */
export function useVariantGroups(skus?: Sku[]) {
  const groups = useMemo<VariantGroup[]>(() => {
    if (!skus?.length) return [];
    const map = new Map<number, { name: string; values: Set<string> }>();
    for (const s of skus) {
      for (const o of s.options) {
        if (!map.has(o.attributeId)) map.set(o.attributeId, { name: o.attributeName, values: new Set() });
        map.get(o.attributeId)!.values.add(o.value);
      }
    }
    return Array.from(map.entries()).map(([attributeId, { name, values }]) => ({
      attributeId,
      attributeName: name,
      values: Array.from(values),
    }));
  }, [skus]);

  return groups;
}

/** TÃ¬m SKU khá»›p theo pick biáº¿n thá»ƒ (táº¥t cáº£ attribute/value pháº£i khá»›p) */
export function resolveSkuByPick(skus: Sku[] | undefined, pick: Record<number, string> | undefined) {
  if (!skus || !pick) return undefined;
  return skus.find((s) => {
    for (const { attributeId, value } of s.options) {
      const p = pick[attributeId];
      if (!p || p !== value) return false;
    }
    // cÅ©ng cáº§n Ä‘áº£m báº£o khÃ´ng cÃ³ attribute nÃ o trong pick bá»‹ thiáº¿u trong SKU
    for (const attrId of Object.keys(pick).map(Number)) {
      if (!s.options.some(o => o.attributeId === attrId && o.value === pick[attrId])) return false;
    }
    return true;
  });
}
