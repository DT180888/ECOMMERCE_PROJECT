import { useAuthStore } from "@entities/auth/model/store";
import {
    useAddToCart,
    useCart,
    useClearCart,
    useRemoveCartItem,
    useUpdateCartItem,
} from "@entities/cart/hooks";
import type { CartItem } from "@entities/cart/types";
import { useMemo } from "react";
import { useLocalCartStore } from "./local-cart";

export function useSmartCart() {
  // 1. Kiểm tra trạng thái đăng nhập
  const { isAuthenticated } = useAuthStore();
  
  // 2. Lấy Local Cart Store (Lấy toàn bộ state phẳng)
  const localStore = useLocalCartStore();

  // 3. Gọi Server Hooks (Chỉ chạy khi đã login)
  const { data: serverCart, isLoading: isServerLoading } = useCart({
    enabled: isAuthenticated,
  });
  
  const addMut = useAddToCart();
  const updateMut = useUpdateCartItem();
  const removeMut = useRemoveCartItem();
  const clearMut = useClearCart();

  // 4. Quyết định dùng giỏ hàng nào (Server hay Local?)
  // Nếu đã login -> Dùng serverCart. Nếu chưa -> Dùng localStore.cart
  const cart = isAuthenticated 
    ? (serverCart || { cartId: 0, items: [], totalItems: 0, subtotalMinor: 0 }) 
    : localStore.cart;

  const isLoading = isAuthenticated ? isServerLoading : false;

  // Trạng thái đang xử lý (Loading khi bấm nút)
  const isActionPending =
    addMut.isPending || updateMut.isPending || removeMut.isPending || clearMut.isPending;

  // --- ACTIONS (Hàm hành động - Đã sửa lỗi .actions) ---

  // A. Thêm vào giỏ
  const addToCart = async (item: Partial<CartItem> & { skuId: number; quantity: number }) => {
    if (isAuthenticated) {
      // Nếu đã login -> Gọi API Server
      await addMut.mutateAsync({ skuId: item.skuId, quantity: item.quantity });
    } else {
      // Nếu chưa login -> Lưu vào Local
      if (!item.name && !item.name) {
        // Fallback name nếu thiếu
        item.name = "Sản phẩm";
      }

      // Map dữ liệu đầu vào thành CartItem chuẩn cho Local
      const localItem: CartItem = {
        cartItemId: Date.now(), // ID tạm
        skuId: item.skuId,
        quantity: item.quantity,
        // Frontend thường truyền productName, nhưng Type là name -> Map sang
        name: item.name || item.name || "Sản phẩm",
        skuCode: item.skuCode || "",
        priceMinor: item.priceMinor || 0,
        primaryImageUrl: item.primaryImageUrl,
        isSelected: true,
      };

      // ✅ FIX: Gọi trực tiếp, không qua .actions
      localStore.addItem(localItem);
    }
  };

  // B. Xóa khỏi giỏ
  const removeFromCart = async (skuId: number) => {
    if (isAuthenticated) {
      // Server cần cartItemId để xóa
      const item = cart.items.find((i) => i.skuId === skuId);
      if (item?.cartItemId) {
        await removeMut.mutateAsync(item.cartItemId);
      }
    } else {
      // ✅ FIX: Gọi trực tiếp
      localStore.removeItem(skuId);
    }
  };

  // C. Cập nhật số lượng
  const updateQuantity = async (skuId: number, quantity: number) => {
    // Nếu giảm về 0 -> Xóa luôn
    if (quantity <= 0) {
       await removeFromCart(skuId);
       return;
    }

    if (isAuthenticated) {
      const item = cart.items.find((i) => i.skuId === skuId);
      if (item?.cartItemId) {
        await updateMut.mutateAsync({ 
            cartItemId: item.cartItemId, 
            payload: { quantity } 
        });
      }
    } else {
      // ✅ FIX: Gọi trực tiếp
      localStore.updateQuantity(skuId, quantity);
    }
  };

  // D. Chọn / Bỏ chọn
  const toggleSelection = async (skuId: number) => {
    if (isAuthenticated) {
      const item = cart.items.find((i) => i.skuId === skuId);
      if (item?.cartItemId) {
         await updateMut.mutateAsync({ 
            cartItemId: item.cartItemId, 
            payload: { isSelected: !item.isSelected } 
        });
      }
    } else {
      // ✅ FIX: Gọi trực tiếp
      localStore.toggleSelection(skuId);
    }
  };

  // E. Xóa sạch giỏ
  const clearCart = async () => {
    if (isAuthenticated) {
      await clearMut.mutateAsync();
    } else {
      // ✅ FIX: Gọi trực tiếp
      localStore.clearCart();
    }
  };

  // Tính tổng số lượng item (cho Badge trên Header)
  const cartCount = useMemo(() => {
    return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }, [cart]);

  return {
    cart,
    isLoading,
    isActionPending,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleSelection,
    clearCart,
  };
}