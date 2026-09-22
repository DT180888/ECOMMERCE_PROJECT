// src/schema/product.ts
import { z } from "zod";

export const skuOptionSchema = z.object({
  attributeId: z.coerce.number().int().positive({ message: "Chọn thuộc tính" }),
  value: z.string().trim().min(1, "Giá trị bắt buộc"),
});

export const skuRowSchema = z.object({
  skuId: z.coerce.number().optional(),
  skuCode: z.string().trim().min(1, "SKU code bắt buộc"),
  priceMinor: z.coerce.number().positive("Giá phải > 0"),
  isActive: z.coerce.boolean(), 
  options: z.array(skuOptionSchema).optional(),
});

export const attributeRowSchema = z.object({
  attributeId: z.coerce.number().int().positive({ message: "Chọn thuộc tính" }),
  valueText: z.string().optional(),
  valueNumber: z.coerce.number().optional(),
  valueBool: z.coerce.boolean().optional(),
});

export const imageRowSchema = z.object({
  url: z.string().trim().min(1, "URL ảnh không hợp lệ"),
  isPrimary: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().optional(),
  skuCode: z.string().trim().nullish(),
});

export const productFormSchema = z.object({
  name: z.string().trim().min(1, "Bắt buộc"),
  slug: z.string().trim().min(1, "Bắt buộc"),
  description: z.string().optional(),
  status: z.union([z.string(), z.number()]),
  brandId: z.string().optional(),
  categoryIds: z.array(z.string()),
  skus: z.array(skuRowSchema).min(1, "Cần ít nhất 1 SKU"),
  images: z.array(imageRowSchema),
  attributes: z.array(attributeRowSchema),
});

export type ProductFormSchema = z.infer<typeof productFormSchema>;
