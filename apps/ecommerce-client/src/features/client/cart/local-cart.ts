// src/features/cart/local-cart.ts
import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Cart, CartItem } from "@entities/cart/types";
import type { SkuId } from "@entities/product/sku/types";

const LS_KEY = "CART_V1";

function readLocal(): Cart {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return { totalItems: 0, subtotalMinor: 0, items: [] };
  try {
    const parsed = JSON.parse(raw) as Cart;
    return normalize(parsed);
  } catch {
    return { totalItems: 0, subtotalMinor: 0, items: [] };
  }
}

function writeLocal(c: Cart) {
  localStorage.setItem(LS_KEY, JSON.stringify(c));
}

function normalize(c: Cart): Cart {
  const items = (c.items ?? []).map(i => ({ ...i, quantity: Math.max(1, i.quantity || 1), isSelected: !!i.isSelected }));
  const totalItems = items.length;
  const subtotalMinor = items.reduce((sum, i) => sum + i.priceMinor * i.quantity, 0);
  return { cartId: c.cartId, totalItems, subtotalMinor, items };
}

// Public API (fake server-like)
export function getLocalCart(): Cart {
  return readLocal();
}

export function localAddItem(item: Omit<CartItem, "cartItemId" | "isSelected"> & { isSelected?: boolean }) {
  const cart = readLocal();
  const found = cart.items.find(i => i.skuId === item.skuId);
  if (found) {
    found.quantity += item.quantity;
  } else {
    cart.items.push({
      ...item,
      isSelected: item.isSelected ?? true,
    });
  }
  writeLocal(normalize(cart));
}

export function localUpdateItem(skuId: SkuId, patch: Partial<Pick<CartItem, "quantity" | "isSelected">>) {
  const cart = readLocal();
  const found = cart.items.find(i => i.skuId === skuId);
  if (found) {
    if (typeof patch.quantity === "number") found.quantity = Math.max(1, patch.quantity);
    if (typeof patch.isSelected === "boolean") found.isSelected = patch.isSelected;
  }
  writeLocal(normalize(cart));
}

export function localRemoveItem(skuId: SkuId) {
  const cart = readLocal();
  cart.items = cart.items.filter(i => i.skuId !== skuId);
  writeLocal(normalize(cart));
}

export function localClear() {
  writeLocal({ totalItems: 0, subtotalMinor: 0, items: [] });
}

// === React Query hooks for local cart (same shape as server hooks) ===
export const localCartKeys = { root: ["local-cart"] as const };

export function useLocalCart(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: localCartKeys.root,
    queryFn: async () => getLocalCart(),
    staleTime: 0,
    // ðŸ‘‡ THÃŠM DÃ’NG NÃ€Y: Äá»ƒ báº­t/táº¯t query dá»±a trÃªn tham sá»‘ truyá»n vÃ o
    enabled: options?.enabled ?? true, 
  });
}

export function useLocalAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: Parameters<typeof localAddItem>[0]) => localAddItem(item),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: localCartKeys.root });
    },
  });
}

export function useLocalUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { skuId: SkuId; quantity?: number; isSelected?: boolean }) =>
      localUpdateItem(args.skuId, { quantity: args.quantity, isSelected: args.isSelected }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: localCartKeys.root });
    },
  });
}

export function useLocalRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (skuId: SkuId) => localRemoveItem(skuId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: localCartKeys.root });
    },
  });
}

export function useLocalClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => localClear(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: localCartKeys.root });
    },
  });
}


