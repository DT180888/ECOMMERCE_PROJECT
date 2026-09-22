// src/entities/cart/api.ts
import { axiosClient } from "@my-project/shared-utils";
import type { Cart, CartRes, AddToCartReq, UpdateCartItemReq, CartItem, MergeCartReq } from "./types";

function mapCartRes(res: CartRes): Cart {
  const items: CartItem[] = res.items.map(i => ({
    cartItemId: i.cartItemId,
    skuId: i.skuId,
    productId: i.productId,
    name: i.name,
    skuCode: i.skuCode,
    priceMinor: i.priceMinor,
    quantity: i.quantity,
    primaryImageUrl: i.primaryImageUrl,
    isSelected: i.isSelected,
  }));
  return {
    cartId: res.cartId,
    totalItems: res.totalItems,
    subtotalMinor: res.subtotalMinor,
    items,
  };
}

export async function apiGetCart(): Promise<Cart> {
  const { data } = await axiosClient.get<CartRes>("/api/v1/cart");
  return mapCartRes(data);
}

export async function apiAddCartItem(payload: AddToCartReq): Promise<void> {
  await axiosClient.post("/api/v1/cart/items", payload);
}

export async function apiUpdateCartItem(cartItemId: number, payload: UpdateCartItemReq): Promise<void> {
  await axiosClient.put(`/api/v1/cart/items/${cartItemId}`, payload);
}

export async function apiRemoveCartItem(cartItemId: number): Promise<void> {
  await axiosClient.delete(`/api/v1/cart/items/${cartItemId}`);
}

export async function apiClearCart(): Promise<void> {
  await axiosClient.delete("/api/v1/cart");
}

export async function apiMergeCart(payload: MergeCartReq): Promise<void> {
  // Endpoint nÃ y pháº£i khá»›p vá»›i Controller báº¡n viáº¿t: [HttpPost("merge")]
  await axiosClient.post("/api/v1/cart/merge", payload);
}
