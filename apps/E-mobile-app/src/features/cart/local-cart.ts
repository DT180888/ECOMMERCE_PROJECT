import type { Cart, CartItem } from "@entities/cart/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// 1. Interface phẳng (Không còn nested actions)
interface LocalCartState {
  cart: Cart;
  addItem: (item: CartItem) => void;
  removeItem: (skuId: number) => void;
  updateQuantity: (skuId: number, quantity: number) => void;
  toggleSelection: (skuId: number) => void;
  clearCart: () => void;
}

const INITIAL_CART: Cart = {
  cartId: 0,
  totalItems: 0,
  subtotalMinor: 0,
  items: [],
};

const recalculateCart = (items: CartItem[]): Cart => {
  const subtotalMinor = items.reduce((sum, item) => sum + item.priceMinor * item.quantity, 0);
  return {
    cartId: 0,
    totalItems: items.length,
    subtotalMinor,
    items,
  };
};

export const useLocalCartStore = create<LocalCartState>()(
  persist(
    (set, get) => ({
      cart: INITIAL_CART,

      // 2. Các hàm nằm ngay ở root
      addItem: (newItem) => {
        const { cart } = get();
        const existingItemIndex = cart.items.findIndex((i) => i.skuId === newItem.skuId);
        let newItems = [...cart.items];

        if (existingItemIndex > -1) {
          const existingItem = newItems[existingItemIndex];
          newItems[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + newItem.quantity,
            priceMinor: newItem.priceMinor,
            name: newItem.name,
            primaryImageUrl: newItem.primaryImageUrl,
          };
        } else {
          newItems.push({ ...newItem, isSelected: true });
        }
        set({ cart: recalculateCart(newItems) });
      },

      removeItem: (skuId) => {
        const { cart } = get();
        const newItems = cart.items.filter((i) => i.skuId !== skuId);
        set({ cart: recalculateCart(newItems) });
      },

      updateQuantity: (skuId, quantity) => {
        const { cart } = get();
        if (quantity <= 0) {
          get().removeItem(skuId); // Gọi hàm cùng cấp
          return;
        }
        const newItems = cart.items.map((i) =>
          i.skuId === skuId ? { ...i, quantity } : i
        );
        set({ cart: recalculateCart(newItems) });
      },

      toggleSelection: (skuId) => {
        const { cart } = get();
        const newItems = cart.items.map((i) =>
          i.skuId === skuId ? { ...i, isSelected: !i.isSelected } : i
        );
        set({ cart: recalculateCart(newItems) });
      },

      clearCart: () => {
        set({ cart: INITIAL_CART });
      },
    }),
    {
      name: "local-cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);