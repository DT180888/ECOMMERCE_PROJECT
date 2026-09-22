export type CartId = number;
export type CartItemId = number;
export type SkuId = number;

export type CartItem = {
  cartItemId?: CartItemId;   // server có, local có thể undefined
  skuId: SkuId;
  productId?: number;
  name: string;
  skuCode: string;
  priceMinor: number;
  quantity: number;
  primaryImageUrl?: string;
  isSelected: boolean;
};

export type Cart = {
  cartId?: CartId;
  totalItems: number;        // số dòng
  subtotalMinor: number;     // tạm tính
  items: CartItem[];
};

// === Server DTOs (khớp CartController) ===
export type CartRes = {
  cartId: CartId;
  totalItems: number;
  subtotalMinor: number;
  items: Array<{
    cartItemId: CartItemId;
    skuId: SkuId;
    productId: number;
    name: string;
    skuCode: string;
    priceMinor: number;
    quantity: number;
    primaryImageUrl?: string;
    isSelected: boolean;
  }>;
};

export type AddToCartReq = { skuId: SkuId; quantity: number };
export type UpdateCartItemReq = { quantity?: number; isSelected?: boolean };

export interface MergeCartItemReq {
  skuId: number;
  quantity: number;
}

export interface MergeCartReq {
  items: MergeCartItemReq[];
}