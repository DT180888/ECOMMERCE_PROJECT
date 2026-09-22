import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogTitle, DialogDescription, Button, Input, Checkbox, useToast } from "@my-project/ui";
import { TrashIcon, SwatchIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ReactSelect from "react-select";
import { reactSelectDarkStyles } from "@my-project/ui";
import { buildImgSrc } from "@shared/lib/url";
import { cn } from "@shared/lib/utils";

interface SkuOptionValuePayload {
  attributeId: number;
  value: string;
}

interface SkuFormData {
  skuCode: string;
  priceMinor: number;
  isActive: boolean;
  options: SkuOptionValuePayload[];
}

export type ProductImageItem = {
  url: string;
  isPrimary: boolean;
  sortOrder: number;
  skuCode?: string | null;
};

interface Props {
  productId: number;
  productImages: ProductImageItem[];
  sku: {
    skuId: number;
    skuCode: string;
    priceMinor: number;
    isActive: boolean;
    options: Array<{ attributeId: number; attributeName: string; value: string }>;
  };
  attributeOptions: Array<{ value: number | string; label: string }>;
  onClose: () => void;
  onSave: (payload: {
    skuPayload: {
      skuCode: string;
      priceMinor: number;
      isActive: boolean;
      options?: SkuOptionValuePayload[];
    };
    imagesPayload?: ProductImageItem[];
  }) => Promise<void>;
}

const compactSelectStyles = {
  ...reactSelectDarkStyles,
  control: (base: any, state: any) => ({
    ...reactSelectDarkStyles.control!(base, state),
    minHeight: '36px',
    height: '36px',
    fontSize: '0.875rem',
    backgroundColor: 'hsl(var(--card))',
    borderColor: state.isFocused ? 'hsl(var(--accent))' : 'hsl(var(--border) / 0.4)',
  }),
};

export function ProductDetailSkuEditModal({
  productImages,
  sku,
  attributeOptions,
  onClose,
  onSave,
}: Props) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ProductImageItem | null>(null);

  const { register, control, handleSubmit, formState: { errors } } = useForm<SkuFormData>({
    defaultValues: {
      skuCode: sku.skuCode,
      priceMinor: sku.priceMinor,
      isActive: sku.isActive,
      options: sku.options.map(o => ({ attributeId: o.attributeId, value: o.value })),
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options"
  });

  useEffect(() => {
    const skuImg = productImages.find(img => img.skuCode === sku.skuCode);
    if (skuImg) {
      setSelectedImage(skuImg);
    } else {
      setSelectedImage(null);
    }
  }, [productImages, sku.skuCode]);

  const onSubmitForm = async (data: SkuFormData) => {
    setIsSubmitting(true);
    try {
      let imagesPayload: ProductImageItem[] | undefined = undefined;

      if (selectedImage) {
        imagesPayload = productImages.map(img => {
          if (img.url === selectedImage.url) {
            return { ...img, skuCode: data.skuCode };
          }
          if (img.skuCode === sku.skuCode && img.url !== selectedImage.url) {
            return { ...img, skuCode: null };
          }
          return img;
        });

        if (!imagesPayload.some(img => img.url === selectedImage.url)) {
          imagesPayload.push({
            url: selectedImage.url,
            isPrimary: false,
            sortOrder: productImages.length + 1,
            skuCode: data.skuCode
          });
        }
      } else {
        imagesPayload = productImages.map(img => {
          if (img.skuCode === sku.skuCode) {
            return { ...img, skuCode: null };
          }
          return img;
        });
      }

      await onSave({
        skuPayload: {
          skuCode: data.skuCode,
          priceMinor: Number(data.priceMinor) || 0,
          isActive: data.isActive,
          options: data.options.filter(o => o.attributeId > 0 && o.value.trim() !== ""),
        },
        imagesPayload
      });
      toast.success("Cập nhật SKU thành công");
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Lỗi khi cập nhật SKU");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectImage = (img: ProductImageItem) => {
    setSelectedImage(img);
  };

  const getOptionError = (idx: number, field: "attributeId" | "value") => {
    const errs = errors?.options as any;
    return errs?.[idx]?.[field]?.message;
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent noClose className="max-w-3xl p-0 overflow-hidden flex flex-col max-h-[90vh] bg-card rounded-card border border-foreground/[0.04] dark:border-white/[0.05] shadow-neo">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-muted/5 border-b border-foreground/[0.04] dark:border-white/[0.05] shrink-0">
          <div>
            <DialogTitle className="text-base font-bold font-display text-foreground tracking-tight normal-case">
              Chỉnh Sửa SKU
            </DialogTitle>
            <DialogDescription className="text-[11px] text-muted-foreground mt-0.5">
              Cập nhật mã SKU, giá bán, thuộc tính và hình ảnh đại diện biến thể
            </DialogDescription>
          </div>
          <Button variant="ghost" onClick={onClose} size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted/10 rounded-full w-8 h-8 p-0 transition-all duration-200">
            <XMarkIcon className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Column 1: Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Mã SKU <span className="text-error">*</span></label>
                <Input
                  {...register("skuCode", { required: "Vui lòng nhập mã SKU" })}
                  placeholder="VD: IP15-BLU-128"
                  className="w-full bg-card"
                />
                {errors.skuCode && <p className="text-xs text-error mt-1">⚠️ {errors.skuCode.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Giá bán (VNĐ) <span className="text-error">*</span></label>
                <Input
                  type="number"
                  min={0}
                  {...register("priceMinor", { required: "Vui lòng nhập giá bán", valueAsNumber: true })}
                  placeholder="0"
                  className="w-full bg-card font-mono"
                />
                {errors.priceMinor && <p className="text-xs text-error mt-1">⚠️ {errors.priceMinor.message}</p>}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Checkbox id={`isActive-${sku.skuId}`} {...register("isActive")} />
                <label htmlFor={`isActive-${sku.skuId}`} className="text-xs font-semibold text-muted-foreground cursor-pointer select-none">
                  Kích hoạt hoạt động (Active)
                </label>
              </div>
            </div>

            {/* Column 2: Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <SwatchIcon className="w-4 h-4 text-accent" /> Biến thể
                </label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => append({ attributeId: 0, value: "" })}
                  className="text-xs h-6 px-2 text-accent hover:bg-accent/10"
                >
                  + Thêm
                </Button>
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                {fields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Controller
                        control={control}
                        name={`options.${idx}.attributeId`}
                        render={({ field: { onChange, value } }) => (
                          <ReactSelect
                            options={attributeOptions.map(o => ({ value: Number(o.value), label: o.label }))}
                            value={attributeOptions.map(o => ({ value: Number(o.value), label: o.label })).find(o => o.value === value)}
                            onChange={(val: any) => onChange(val?.value || 0)}
                            styles={compactSelectStyles}
                            placeholder="Chọn..."
                          />
                        )}
                      />
                      {getOptionError(idx, "attributeId") && (
                        <p className="text-[10px] text-error mt-0.5">⚠️ {getOptionError(idx, "attributeId")}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        {...register(`options.${idx}.value` as const, { required: "Vui lòng nhập giá trị" })}
                        placeholder="Giá trị (VD: Đỏ)"
                        className="w-full bg-card h-[36px]"
                      />
                      {getOptionError(idx, "value") && (
                        <p className="text-[10px] text-error mt-0.5">⚠️ {getOptionError(idx, "value")}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => remove(idx)}
                      className="h-[36px] w-[36px] p-0 text-muted hover:text-error hover:bg-error/10 shrink-0"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {fields.length === 0 && (
                  <p className="text-xs text-muted-foreground italic text-center py-6">Không có thuộc tính.</p>
                )}
              </div>
            </div>

            {/* Column 3: Image */}
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <PhotoIcon className="w-4 h-4 text-accent" /> Hình ảnh đại diện
              </label>
              <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto p-1 border border-border/10 rounded-button bg-card custom-scrollbar">
                {productImages.map((img, idx) => {
                  const isSelected = selectedImage?.url === img.url;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectImage(img)}
                      className={cn(
                        "w-12 h-12 rounded-inner border cursor-pointer relative overflow-hidden flex items-center justify-center transition-all bg-muted/20",
                        isSelected ? "border-accent ring-2 ring-accent/20 scale-95" : "border-border/30 hover:border-accent/40"
                      )}
                    >
                      <img src={buildImgSrc(img.url)} alt="" className="w-full h-full object-cover" />
                      {img.isPrimary && (
                        <div className="absolute top-0 right-0 bg-accent text-[8px] font-bold text-accent-foreground px-1 py-0.5 rounded-bl">
                          P
                        </div>
                      )}
                    </div>
                  );
                })}

                {productImages.length === 0 && (
                  <div className="w-full flex flex-col items-center justify-center py-8 text-muted-foreground text-xs">
                    <PhotoIcon className="w-6 h-6 opacity-30 mb-1" />
                    <span>Không có ảnh</span>
                  </div>
                )}
              </div>
              {selectedImage && (
                <div className="flex items-center gap-2 bg-accent-soft/20 border border-accent/10 px-3 py-1.5 rounded-button w-max max-w-full">
                  <img src={buildImgSrc(selectedImage.url)} alt="" className="w-6 h-6 object-cover rounded-inner" />
                  <span className="text-[10px] text-accent font-semibold truncate max-w-[150px]">Đã chọn</span>
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="text-muted hover:text-error font-bold text-xs"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-neo-bevel pt-4 mt-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
