import React from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { PhotoIcon } from "@heroicons/react/24/outline";
import ImageUploader from "@components/common/ImageUploader";
import { buildImgSrc, DEFAULT_PRODUCT_IMAGE_URL } from "@my-project/shared-utils";
import { Button, cn, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@my-project/ui";

export function ProductImages() {
  const { control, watch, setValue, getValues } = useFormContext<any>();
  const imagesFA = useFieldArray({ control, name: "images" });

  const onImagesUploaded = (items: { url: string }[]) => {
    const had = imagesFA.fields.length > 0;
    items.forEach((it, i) => {
      imagesFA.append({
        url: it.url,
        isPrimary: had ? false : i === 0,
        sortOrder: imagesFA.fields.length + i + 1,
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-medium font-sans uppercase tracking-[0.16em] text-foreground">
            Thư viện hình ảnh sản phẩm
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Tải lên hình ảnh góc chụp chi tiết của sản phẩm (khuyến nghị tỷ lệ vuông 1:1 hoặc 3:4).
          </p>
        </div>
        <span className="font-mono text-[10.5px] tabular-nums bg-surface border border-border/60 text-muted-foreground px-2 py-0.5 rounded-[2px] font-medium shrink-0">
          {imagesFA.fields.length} ảnh đã chọn
        </span>
      </div>

      <ImageUploader onUploaded={onImagesUploaded} />

      {imagesFA.fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border border-dashed border-border/60 rounded-[2px] bg-transparent">
          <PhotoIcon className="w-10 h-10 mb-2 opacity-30 text-muted-foreground" />
          <p className="text-xs">Chưa có hình ảnh nào được tải lên cho sản phẩm.</p>
          <p className="text-[11px] text-muted-foreground/70 font-mono mt-1">Định dạng hỗ trợ: JPG, PNG, WEBP</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
          {imagesFA.fields.map((field, idx) => {
            const isPrimary = watch(`images.${idx}.isPrimary`);
            const url = watch(`images.${idx}.url`);
            const imageSkuCode = watch(`images.${idx}.skuCode`);
            // Hiển thị ảnh chung (không gán SKU)
            if (imageSkuCode) return null;
            return (
              <div
                key={field.id}
                className={cn(
                  "flex flex-col gap-2 p-1.5 rounded-[2px] border transition-colors bg-card",
                  isPrimary ? "border-primary" : "border-border/60 hover:border-border"
                )}
              >
                <div className="relative group aspect-square rounded-[2px] overflow-hidden bg-surface">
                  <img
                    src={buildImgSrc(url) ?? DEFAULT_PRODUCT_IMAGE_URL}
                    alt=""
                    className="w-full h-full object-cover select-none"
                  />

                  {/* Primary Corner Accent */}
                  {isPrimary && (
                    <div className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 bg-background/90 backdrop-blur-sm border border-border/80 rounded-[1px] text-[9px] font-mono uppercase tracking-wider text-foreground flex items-center gap-1 font-semibold shadow-none">
                      <span className="w-1 h-1 rounded-[0.5px] bg-primary" />
                      Ảnh chính
                    </div>
                  )}

                  {/* Progressive Hover Disclosure Overlay */}
                  <div className="absolute inset-0 bg-background/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 z-20">
                    <Button
                      type="button"
                      size="default"
                      variant={isPrimary ? "default" : "outline"}
                      onClick={() => {
                        const currentImages = getValues("images") || [];
                        currentImages.forEach((img: any, j: number) => {
                          if (!img.skuCode) {
                            setValue(`images.${j}.isPrimary`, j === idx, { shouldDirty: true });
                          }
                        });
                      }}
                      className="text-[10.5px] h-6 rounded-[2px] font-medium w-full shadow-none"
                    >
                      {isPrimary ? "Ảnh chính" : "Đặt làm chính"}
                    </Button>
                    <Button
                      type="button"
                      size="default"
                      variant="ghost"
                      onClick={() => imagesFA.remove(idx)}
                      className="text-[10.5px] h-6 rounded-[2px] w-full text-destructive hover:bg-destructive/10"
                    >
                      Xóa ảnh
                    </Button>
                  </div>
                </div>

                <div className="px-0.5">
                  <Controller
                    control={control}
                    name={`images.${idx}.skuCode`}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        value={value || "ALL"}
                        onValueChange={(val) => onChange(val === "ALL" ? null : val)}
                      >
                        <SelectTrigger className="h-6 text-[10px] px-1.5 py-0 bg-surface border-border/60 rounded-[2px]">
                          <SelectValue placeholder="Gán SKU..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-[2px] border-border/60">
                          <SelectItem value="ALL">Ảnh chung (Toàn bộ)</SelectItem>
                          {watch("skus")
                            ?.map((s: any) => s.skuCode)
                            .filter(Boolean)
                            .map((code: string) => (
                              <SelectItem key={code} value={code}>
                                SKU: {code}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
