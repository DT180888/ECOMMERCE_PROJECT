import React from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { PhotoIcon } from "@heroicons/react/24/outline";
import ImageUploader from "@widgets/admin/Uploader/ImageUploader";
import { buildImgSrc } from "@shared/lib/url";
import { DEFAULT_PRODUCT_IMAGE_URL } from "@shared/constants";

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
    <div className="bg-transparent border border-neo-bevel rounded-card p-6 space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">Thư viện ảnh</h3>
            <span className="text-xs bg-accent/10 text-accent border border-accent/20 px-2 py-1 rounded-button font-semibold">
                {imagesFA.fields.length} ảnh đã chọn
            </span>
        </div>

        <ImageUploader onUploaded={onImagesUploaded} />
        
        {imagesFA.fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted border border-neo-bevel rounded-card bg-transparent">
                <PhotoIcon className="w-16 h-16 mb-3 opacity-20" />
                <p className="text-sm">Chưa có hình ảnh nào. Hãy tải lên ảnh sản phẩm.</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {imagesFA.fields.map((field, idx) => {
                    const isPrimary = watch(`images.${idx}.isPrimary`);
                    const url = watch(`images.${idx}.url`);
                    const imageSkuCode = watch(`images.${idx}.skuCode`);
                    // Hiển thị ảnh chung (không gán SKU)
                    if (imageSkuCode) return null;
                    return (
                        <div key={field.id} className={`flex flex-col gap-2 p-2 rounded-card border transition-all bg-transparent ${isPrimary ? "border-accent shadow-neo-sm" : "border-neo-bevel hover:border-foreground/[0.12] dark:hover:border-white/[0.12]"}`}>
                            <div className="relative group aspect-square rounded-inner overflow-hidden">
                                <img src={buildImgSrc(url) ?? DEFAULT_PRODUCT_IMAGE_URL} alt="" className="w-full h-full object-cover" />
                                
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3 backdrop-blur-sm">
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            const currentImages = getValues("images") || [];
                                            currentImages.forEach((img: any, j: number) => {
                                                if (!img.skuCode) {
                                                    setValue(`images.${j}.isPrimary`, j === idx);
                                                }
                                            });
                                        }} 
                                        className={`text-xs px-3 py-1.5 rounded-button font-medium w-full transition-colors ${isPrimary ? 'bg-accent text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                                    >
                                        {isPrimary ? "✓ Ảnh chính" : "Đặt làm chính"}
                                    </button>
                                    <button type="button" onClick={() => imagesFA.remove(idx)} className="text-xs px-3 py-1.5 rounded-button w-full bg-destructive/20 text-destructive hover:bg-destructive/30 transition-all duration-200">
                                        Xóa
                                    </button>
                                </div>
                                {isPrimary && <div className="absolute top-2 right-2 w-3 h-3 bg-accent rounded-full shadow ring-2 ring-black/50"></div>}
                            </div>
                            <div className="px-1">
                                <Controller
                                    control={control}
                                    name={`images.${idx}.skuCode`}
                                    render={({ field: { onChange, value } }) => (
                                        <select
                                            value={value || ""}
                                            onChange={(e) => onChange(e.target.value || null)}
                                            className="w-full text-[11px] bg-background border border-foreground/[0.08] dark:border-white/[0.08] rounded-button px-2 py-1 text-foreground focus:border-accent focus:ring-1 focus:ring-accent/20 outline-none transition-all duration-200 cursor-pointer"
                                        >
                                            <option value="">Ảnh chung (Không SKU)</option>
                                            {watch("skus")
                                                ?.map((s: any) => s.skuCode)
                                                .filter(Boolean)
                                                .map((code: string) => (
                                                    <option key={code} value={code}>
                                                        SKU: {code}
                                                    </option>
                                                ))}
                                        </select>
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
