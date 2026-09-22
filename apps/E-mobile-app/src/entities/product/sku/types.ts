export type ProductId = number;
export type SkuId = number;
export type AttributeId = number;

export type SkuOption = {
  attributeId: AttributeId;
  attributeName: string;
  value: string; // hiển thị (màu: "Đỏ", size: "M")
};

export type Sku = {
  skuId: SkuId;
  productId: ProductId;
  skuCode: string;
  priceMinor: number;
  isActive: boolean;
  options: SkuOption[];

  // 👇 BỔ SUNG CÁC TRƯỜNG TỒN KHO NÀY 👇
  quantityOnHand: number;
  quantityReserved: number;
  available: number;
};

// API DTOs
export type SkuRes = Sku;

export type CreateSkuReq = {
  skuCode: string;
  priceMinor: number;
  isActive: boolean;
  options?: Array<{ attributeId: AttributeId; value: string }>;
};

export type UpdateSkuReq = CreateSkuReq;

// UI helper
export type VariantGroup = {
  attributeId: AttributeId;
  attributeName: string;
  values: string[];          // các giá trị khả dụng
};

export type VariantPick = Record<AttributeId, string>; // { [attributeId]: value }