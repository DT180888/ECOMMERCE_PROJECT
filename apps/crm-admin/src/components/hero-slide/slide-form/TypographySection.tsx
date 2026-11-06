import { UseFormRegister } from "react-hook-form";
import { Input, Label } from "@my-project/ui";
import { HeroSlideFormData } from "@my-project/api";

interface TypographySectionProps {
  register: UseFormRegister<HeroSlideFormData>;
}

export function TypographySection({ register }: TypographySectionProps) {
  return (
    <div className="space-y-4">
      <div className="border-b border-border/60 pb-1.5">
        <h3 className="text-xs font-bold uppercase tracking-wider font-display text-foreground">
          Nội Dung Chữ (Typography)
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground">Thương hiệu (Brand Text)</Label>
          <Input
            {...register("brandText")}
            placeholder="VD: BỘ SƯU TẬP 2026"
            className="h-8 text-xs rounded-[2px] border-border/60 focus:border-foreground"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground">
            Tiêu đề chính (Title Text) <span className="text-destructive">*</span>
          </Label>
          <Input
            {...register("titleText", { required: true })}
            placeholder="VD: PHONG CÁCH TỐI GIẢN"
            className="h-8 text-xs rounded-[2px] border-border/60 focus:border-foreground"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground">Thẻ phụ trợ (Tag Text)</Label>
          <Input
            {...register("tagText")}
            placeholder="VD: BST Thu/Đông"
            className="h-8 text-xs rounded-[2px] border-border/60 focus:border-foreground"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground">Giá (Price Text)</Label>
          <Input
            {...register("priceText")}
            placeholder="VD: 1.999.000 đ"
            className="h-8 text-xs rounded-[2px] border-border/60 focus:border-foreground font-mono"
          />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-xs font-medium text-foreground">Thứ tự hiển thị (Sort Order)</Label>
          <Input
            type="number"
            {...register("sortOrder", { valueAsNumber: true })}
            className="h-8 text-xs rounded-[2px] border-border/60 focus:border-foreground font-mono"
          />
        </div>
      </div>
    </div>
  );
}
