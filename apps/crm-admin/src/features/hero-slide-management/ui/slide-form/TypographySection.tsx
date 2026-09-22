import { UseFormRegister } from "react-hook-form";
import { Input, Label } from "@my-project/ui";
import { HeroSlideFormData } from "@entities/hero-slide/types";

interface TypographySectionProps {
  register: UseFormRegister<HeroSlideFormData>;
}

export function TypographySection({ register }: TypographySectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">Nội Dung Chữ (Typography)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Thương hiệu (Brand Text)</Label>
          <Input {...register("brandText")} placeholder="VD: Bộ sưu tập 2026" />
        </div>
        <div className="space-y-2">
          <Label>Tiêu đề chính (Title Text) *</Label>
          <Input {...register("titleText", { required: true })} placeholder="VD: PHONG CÁCH TỐI GIẢN" />
        </div>
        <div className="space-y-2">
          <Label>Thẻ phụ trợ (Tag Text)</Label>
          <Input {...register("tagText")} placeholder="VD: BST Thu/Đông" />
        </div>
        <div className="space-y-2">
          <Label>Giá (Price Text)</Label>
          <Input {...register("priceText")} placeholder="VD: 1.999.000 đ" />
        </div>
        <div className="space-y-2">
          <Label>Thứ tự hiển thị (Sort Order)</Label>
          <Input type="number" {...register("sortOrder", { valueAsNumber: true })} />
        </div>
      </div>
    </div>
  );
}

