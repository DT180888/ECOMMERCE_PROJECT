import { useAuthUser } from "@hooks/useAuth";
import { 
  useCart as useRemoteCart, 
  useAddToCart as useRemoteAdd, 
  useUpdateCartItem as useRemoteUpdate, 
  useRemoveCartItem as useRemoteRemove, 
  useClearCart as useRemoteClear 
} from "@hooks/useCart";
import { 
  useLocalCart, 
  useLocalAddToCart, 
  useLocalUpdateCartItem, 
  useLocalRemoveCartItem, 
  useLocalClearCart 
} from "@hooks/useLocalCart";
import type { CartItem } from "@my-project/api";

export function useSmartCart() {
  const { data: user } = useAuthUser();
  const isLoggedIn = !!user;

  const remoteQuery = useRemoteCart({ enabled: isLoggedIn });
  const localQuery = useLocalCart({ enabled: !isLoggedIn });

  const rAdd = useRemoteAdd();
  const rUpdate = useRemoteUpdate();
  const rRemove = useRemoteRemove();
  const rClear = useRemoteClear();

  const lAdd = useLocalAddToCart();
  const lUpdate = useLocalUpdateCartItem();
  const lRemove = useLocalRemoveCartItem();
  const lClear = useLocalClearCart();

  const cart = isLoggedIn ? remoteQuery.data : localQuery.data;
  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;
  const isLoading = isLoggedIn ? remoteQuery.isLoading : localQuery.isLoading;

  const addToCart = async (item: Omit<CartItem, "cartItemId" | "isSelected">) => {
    if (isLoggedIn) {
      return rAdd.mutateAsync({ skuId: item.skuId, quantity: item.quantity });
    } else {
      return lAdd.mutateAsync(item);
    }
  };

  const updateQuantity = async (skuId: number, quantity: number) => {
    if (isLoggedIn) {
      const cartItem = cart?.items?.find(x => x.skuId === skuId);
      if (!cartItem) return;
      return rUpdate.mutateAsync({ 
        cartItemId: cartItem.cartItemId!, 
        payload: { quantity } 
      });
    } else {
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
    isLoggedIn,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    isActionPending: rAdd.isPending || lAdd.isPending || rUpdate.isPending || lUpdate.isPending
  };
}
