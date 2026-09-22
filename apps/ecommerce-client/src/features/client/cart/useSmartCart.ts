import { useAuthUser } from "@entities/auth/hooks";
// Import Remote Hooks
import { useCart as useRemoteCart, useAddToCart as useRemoteAdd, useUpdateCartItem as useRemoteUpdate, useRemoveCartItem as useRemoteRemove, useClearCart as useRemoteClear } from "@entities/cart/hooks";

// Import Local Hooks
import { useLocalCart, useLocalAddToCart, useLocalUpdateCartItem, useLocalRemoveCartItem, useLocalClearCart } from "./local-cart";

// Type cho hÃ m Add chung (cáº§n Ä‘á»§ thÃ´ng tin cho Local)
import { CartItem } from "@entities/cart/types";

export function useSmartCart() {
  // 1. Kiá»ƒm tra tráº¡ng thÃ¡i Ä‘Äƒng nháº­p
  const { data: user } = useAuthUser();
  const isLoggedIn = !!user;

  // 2. Gá»i cáº£ 2 hooks nhÆ°ng dÃ¹ng 'enabled' Ä‘á»ƒ báº­t/táº¯t
  const remoteQuery = useRemoteCart({ enabled: isLoggedIn });
  const localQuery = useLocalCart({ enabled: !isLoggedIn });

  // 3. Mutations - Remote
  const rAdd = useRemoteAdd();
  const rUpdate = useRemoteUpdate();
  const rRemove = useRemoteRemove();
  const rClear = useRemoteClear();

  // 4. Mutations - Local
  const lAdd = useLocalAddToCart();
  const lUpdate = useLocalUpdateCartItem();
  const lRemove = useLocalRemoveCartItem();
  const lClear = useLocalClearCart();

  // 5. Há»£p nháº¥t dá»¯ liá»‡u (Data Unification)
  // Náº¿u Ä‘ang login -> dÃ¹ng Remote data, ngÆ°á»£c láº¡i dÃ¹ng Local data
  const cart = isLoggedIn ? remoteQuery.data : localQuery.data;
  
  // TÃ­nh toÃ¡n sá»‘ lÆ°á»£ng hiá»ƒn thá»‹ trÃªn Header
  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;
  
  // TÃ­nh tráº¡ng thÃ¡i Loading
  const isLoading = isLoggedIn ? remoteQuery.isLoading : localQuery.isLoading;

  // 6. CÃ¡c hÃ nh Ä‘á»™ng há»£p nháº¥t (Unified Actions)

  const addToCart = async (item: Omit<CartItem, "cartItemId" | "isSelected">) => {
    if (isLoggedIn) {
      // Remote: Chá»‰ cáº§n gá»­i skuId vÃ  quantity (BE tá»± láº¥y giÃ¡/tÃªn)
      return rAdd.mutateAsync({ skuId: item.skuId, quantity: item.quantity });
    } else {
      // Local: Cáº§n lÆ°u Ä‘áº§y Ä‘á»§ thÃ´ng tin Ä‘á»ƒ hiá»ƒn thá»‹
      return lAdd.mutateAsync(item);
    }
  };

  const updateQuantity = async (skuId: number, quantity: number) => {
    if (isLoggedIn) {
      // Remote: Cáº§n tÃ¬m cartItemId tÆ°Æ¡ng á»©ng vá»›i skuId (náº¿u API yÃªu cáº§u cartItemId)
      // Giáº£ sá»­ API update cáº§n CartItemId, ta pháº£i tÃ¬m trong list items
      const cartItem = cart?.items?.find(x => x.skuId === skuId);
      if (!cartItem) return;
      return rUpdate.mutateAsync({ 
          cartItemId: cartItem.cartItemId!, // Remote cÃ³ cartItemId
          payload: { quantity } 
      });
    } else {
      // Local: Update theo SkuId
      return lUpdate.mutateAsync({ skuId, quantity });
    }
  };

  const removeItem = async (skuId: number) => {
    if (isLoggedIn) {
      const cartItem = cart?.items?.find(x => x.skuId === skuId);
      if (!cartItem?.cartItemId) return;
      return rRemove.mutateAsync(cartItem.cartItemId);
    } else {
      return lRemove.mutateAsync(skuId);
    }
  };

  const clearCart = async () => {
    if (isLoggedIn) {
      return rClear.mutateAsync();
    } else {
      return lClear.mutateAsync();
    }
  };

  return {
    cart,
    cartCount,
    isLoading,
    isLoggedIn, // Tráº£ vá» Ä‘á»ƒ UI biáº¿t Ä‘ang á»Ÿ mode nÃ o náº¿u cáº§n
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    // Tráº£ vá» tráº¡ng thÃ¡i pending cá»§a cÃ¡c action Ä‘á»ƒ disable button
    isActionPending: rAdd.isPending || lAdd.isPending || rUpdate.isPending || lUpdate.isPending
  };
}

