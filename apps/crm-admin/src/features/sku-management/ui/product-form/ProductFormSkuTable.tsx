import React, { useState } from "react";
import { Control, UseFormRegister, UseFormSetValue, UseFormGetValues, UseFieldArrayRemove } from "react-hook-form";
import { Button, Input, Checkbox, Dialog, DialogContent, DialogTitle } from "@my-project/ui";
import { PhotoIcon, TrashIcon, PencilSquareIcon, SwatchIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ProductFormSchema } from "@schemas/product";
import ImageUploader from "@widgets/admin/Uploader/ImageUploader";
import { ProductFormSkuOptionsEditor } from "./ProductFormSkuOptionsEditor";
import { AdminTable, AdminTableColumn } from "@shared/ui/table";
import { cn } from "@shared/lib/utils";

interface Props {
  skusFA: {
    fields: Record<string, any>[];
    remove: UseFieldArrayRemove;
    append: (value: any) => void;
  };
  imagesFA: {
    fields: Record<string, any>[];
    remove: UseFieldArrayRemove;
    append: (value: any) => void;
  };
  register: UseFormRegister<ProductFormSchema>;
  control: Control<ProductFormSchema>;
  watch: any;
  setValue: UseFormSetValue<ProductFormSchema>;
  getValues: UseFormGetValues<ProductFormSchema>;
  errors: any;
  variantOptions: Array<{ value: number; label: string }>;
  attrAll: any[];
  isCreate: boolean;
  toast: any;
  buildImgSrc: (url: string) => string;
  DEFAULT_PRODUCT_IMAGE_URL: string;
  editingSkuIdx: number | null;
  setEditingSkuIdx: (idx: number | null) => void;
}

const formatVND = (minor: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(minor ?? 0);

export function ProductFormSkuTable({
  skusFA,
  imagesFA,
  register,
  control,
  watch,
  setValue,
  getValues,
  errors,
  variantOptions,
  attrAll,
  isCreate,
  toast,
  buildImgSrc,
  DEFAULT_PRODUCT_IMAGE_URL,
  editingSkuIdx,
  setEditingSkuIdx,
}: Props) {
  const [bulkPrice, setBulkPrice] = useState<number | "">("");

  const handleCloseModal = () => {
    if (editingSkuIdx !== null) {
      const skuCodeVal = watch(`skus.${editingSkuIdx}.skuCode`) || "";
      const skuIdVal = watch(`skus.${editingSkuIdx}.skuId`);
      if (!skuCodeVal.trim() && !skuIdVal) {
        skusFA.remove(editingSkuIdx);
      }
    }
    setEditingSkuIdx(null);
  };

  // Watch top-level state to trigger re-renders
  const allImages = watch("images") || [];

  const handleSyncBulkPrice = () => {
    if (bulkPrice === "" || isNaN(Number(bulkPrice)) || Number(bulkPrice) < 0) {
      toast.error("Vui lòng nhập giá bán hợp lệ.");
      return;
    }
    const val = Number(bulkPrice);
    const list = watch("skus") || [];
    list.forEach((_: any, idx: number) => {
      setValue(`skus.${idx}.priceMinor`, val, { shouldDirty: true, shouldValidate: true });
    });
    toast.success(`Đã cập nhật giá ${val.toLocaleString()} VNĐ cho tất cả ${list.length} SKU.`);
  };

  const columns: AdminTableColumn<Record<string, any>>[] = [
    {
      key: "skuCode",
      label: "Mã SKU",
      render: (item: any, idx) => {
        const val = watch(`skus.${idx}.skuCode`) || "";
        return (
          <span className="font-mono text-xs font-semibold text-foreground">
            {val || <span className="text-muted-foreground italic">Chưa đặt</span>}
          </span>
        );
      }
    },
    {
      key: "priceMinor",
      label: "Giá bán",
      render: (item: any, idx) => {
        const val = watch(`skus.${idx}.priceMinor`) || 0;
        return (
          <span className="font-mono font-bold text-success text-xs">
            {formatVND(val)}
          </span>
        );
      }
    },
    {
      key: "options",
      label: "Biến thể",
      render: (_, idx) => {
        const options = watch(`skus.${idx}.options`);
        return (
          <div className="flex flex-wrap gap-1">
            {options && options.length > 0 ? (
              options.map((o: any, oIdx: number) => {
                const attrName =
                  attrAll.find((a) => Number(a.attributeId) === Number(o.attributeId))?.name ||
                  `Attr #${o.attributeId}`;
                return (
                  <span
                    key={oIdx}
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-accent/10 text-accent border border-accent/10"
                  >
                    {attrName}: {o.value}
                  </span>
                );
              })
            ) : (
              <span className="text-[10px] text-muted italic">Không có thuộc tính</span>
            )}
          </div>
        );
      }
    },
    {
      key: "skuImagesCount",
      label: "Hình ảnh",
      align: "center",
      render: (_, idx) => {
        const skuCodeVal = watch(`skus.${idx}.skuCode`) || "";
        const skuImages = allImages.filter((img: any) => img.skuCode === skuCodeVal);
        const primaryImage = skuImages.find((img: any) => img.isPrimary) || skuImages[0];
        const skuImageUrl = watch(`skus.${idx}.imageUrl`);
        const displayUrl = primaryImage?.url || skuImageUrl;
        
        return (
          <button
            type="button"
            onClick={() => setEditingSkuIdx(idx)}
            className="group relative w-10 h-10 rounded-button mx-auto border border-foreground/[0.04] bg-muted/20 flex items-center justify-center overflow-hidden hover:border-accent/40 hover:shadow-neo-sm transition-all"
            title="Nhấp để tải/sửa ảnh"
          >
            {displayUrl ? (
              <img src={buildImgSrc(displayUrl) ?? DEFAULT_PRODUCT_IMAGE_URL} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
            ) : (
              <PhotoIcon className="w-4 h-4 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-accent transition-all" />
            )}
          </button>
        );
      }
    },
    {
      key: "isActive",
      label: "Trạng thái",
      align: "center",
      render: (_, idx) => {
        const active = watch(`skus.${idx}.isActive`);
        return (
          <span
            className={cn(
              "inline-flex px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider",
              active
                ? "bg-success/10 text-success border border-success/20"
                : "bg-muted text-muted-foreground border border-foreground/[0.04]"
            )}
          >
            {active ? "Hoạt động" : "Bị ẩn"}
          </span>
        );
      }
    },
    {
      key: "actions",
      label: "Thao tác",
      align: "center",
      isAction: true,
      render: (_, idx) => {
        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              type="button"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setEditingSkuIdx(idx);
              }}
              className="h-7 w-7 p-0 transition-colors text-muted hover:text-accent hover:bg-accent/10"
            >
              <PencilSquareIcon className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                skusFA.remove(idx);
                if (editingSkuIdx === idx) setEditingSkuIdx(null);
              }}
              disabled={skusFA.fields.length <= 1}
              className="h-7 w-7 p-0 text-muted hover:text-error hover:bg-error/10 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  const renderEditModal = () => {
    if (editingSkuIdx === null) return null;
    
    const idx = editingSkuIdx;
    const skuIdVal = watch(`skus.${idx}.skuCode`) ? watch(`skus.${idx}.skuId`) : 0;
    const skuCodeVal = watch(`skus.${idx}.skuCode`) || "";
    const err = errors.skus?.[idx];

    return (
      <Dialog open={true} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent noClose className="max-w-3xl p-0 overflow-hidden flex flex-col max-h-[90vh] bg-card rounded-card border border-foreground/[0.04] dark:border-white/[0.05] shadow-neo">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-muted/5 border-b border-foreground/[0.04] dark:border-white/[0.05] shrink-0">
            <div>
              <DialogTitle className="text-base font-bold font-display text-foreground tracking-tight normal-case">
                Chỉnh Sửa SKU #{idx + 1}
              </DialogTitle>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Cập nhật mã SKU, giá bán, thuộc tính và ảnh đại diện
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseModal}
              size="icon"
              className="text-muted-foreground hover:text-foreground hover:bg-muted/10 rounded-full w-8 h-8 p-0 transition-all duration-200"
            >
              <XMarkIcon className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Column 1: Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Mã SKU <span className="text-error">*</span>
                  </label>
                  <Input
                    {...register(`skus.${idx}.skuCode`, { required: "Vui lòng nhập mã SKU" })}
                    placeholder="VD: IP15-BLU-128"
                    className="w-full bg-card"
                  />
                  {err?.skuCode && (
                    <p className="text-xs text-error mt-1">⚠️ {err.skuCode.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Giá bán (VNĐ) <span className="text-error">*</span>
                  </label>
                  <Input
                    type="number"
                    min={0}
                    {...register(`skus.${idx}.priceMinor`, { required: "Vui lòng nhập giá bán", valueAsNumber: true })}
                    placeholder="0"
                    className="w-full bg-card font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    id={`isActive-${idx}`}
                    {...register(`skus.${idx}.isActive`)}
                  />
                  <label
                    htmlFor={`isActive-${idx}`}
                    className="text-xs font-semibold text-muted-foreground cursor-pointer select-none"
                  >
                    Kích hoạt hoạt động (Active)
                  </label>
                </div>
              </div>

              {/* Column 2: Options */}
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <SwatchIcon className="w-4 h-4 text-accent" /> Biến thể
                </label>

                {!skuIdVal || skuIdVal <= 0 ? (
                  <div className="bg-card/50 p-3 rounded border border-foreground/[0.04] max-h-[220px] overflow-y-auto custom-scrollbar">
                    <ProductFormSkuOptionsEditor
                      control={control}
                      index={idx}
                      variantOptions={variantOptions}
                      getError={(oIdx: number, path: string) =>
                        (errors.skus?.[idx]?.options?.[oIdx] as any)?.[path]?.message
                      }
                    />
                  </div>
                ) : (
                  <div className="bg-card/50 p-4 rounded border border-foreground/[0.04]">
                    <p className="text-[11px] text-muted-foreground mb-2">
                      Thuộc tính của SKU đã lưu không thể thay đổi
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(watch(`skus.${idx}.options`) || []).map((o: any, oIdx: number) => {
                        const attrName =
                          attrAll.find((a) => Number(a.attributeId) === Number(o.attributeId))?.name ||
                          `Attr #${o.attributeId}`;
                        return (
                          <span
                            key={oIdx}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-accent/10 text-accent border border-accent/10"
                          >
                            {attrName}: {o.value}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Column 3: Image */}
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <PhotoIcon className="w-4 h-4 text-accent" /> Hình ảnh đại diện
                </label>

                {skuCodeVal.trim() ? (
                  <div className="space-y-4">
                    {/* Upload new image */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                        Tải ảnh mới cho SKU
                      </span>
                      <ImageUploader
                        compact={true}
                        multiple={false}
                        maxFiles={1}
                        onUploaded={(uploadedItems) => {
                          if (uploadedItems.length === 0) return;
                          const firstItem = uploadedItems[0];
                          
                          const currentImages = getValues("images") || [];
                          for (let j = currentImages.length - 1; j >= 0; j--) {
                            if (currentImages[j].skuCode === skuCodeVal.trim()) {
                              imagesFA.remove(j);
                            }
                          }

                          imagesFA.append({
                            url: firstItem.url,
                            isPrimary: false,
                            sortOrder: imagesFA.fields.length + 1,
                            skuCode: skuCodeVal.trim(),
                          });
                        }}
                      />
                    </div>

                    {/* Choose from existing gallery */}
                    {allImages.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                          Chọn từ thư viện ảnh sản phẩm
                        </span>
                        <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto p-1 border border-border/10 rounded-button bg-card custom-scrollbar">
                          {allImages.map((img: any, imgIdx: number) => {
                            const isAssignedToThisSku = img.skuCode === skuCodeVal.trim();
                            return (
                              <div
                                key={imgIdx}
                                onClick={() => {
                                  if (isAssignedToThisSku) {
                                    setValue(`images.${imgIdx}.skuCode`, null, { shouldDirty: true });
                                  } else {
                                    // Clear skuCode on other images of this SKU first
                                    allImages.forEach((otherImg: any, otherIdx: number) => {
                                      if (otherImg.skuCode === skuCodeVal.trim()) {
                                        setValue(`images.${otherIdx}.skuCode`, null, { shouldDirty: true });
                                      }
                                    });
                                    setValue(`images.${imgIdx}.skuCode`, skuCodeVal.trim(), { shouldDirty: true });
                                  }
                                }}
                                className={cn(
                                  "w-12 h-12 rounded-inner border cursor-pointer relative overflow-hidden flex items-center justify-center transition-all bg-muted/20",
                                  isAssignedToThisSku
                                    ? "border-accent ring-2 ring-accent/20 scale-95"
                                    : img.skuCode
                                    ? "border-border/10 opacity-30 hover:opacity-50"
                                    : "border-border/30 hover:border-accent/40"
                                )}
                                title={img.skuCode ? `Đang gán cho SKU: ${img.skuCode}` : "Nhấp để chọn"}
                              >
                                <img
                                  src={buildImgSrc(img.url) ?? DEFAULT_PRODUCT_IMAGE_URL}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                                {img.isPrimary && (
                                  <div className="absolute top-0 right-0 bg-accent text-[8px] font-bold text-accent-foreground px-1 py-0.5 rounded-bl">
                                    P
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-warning bg-warning/10 border border-warning/20 p-2.5 rounded-[4px]">
                    Vui lòng nhập Mã SKU cho dòng này trước khi tải/chọn ảnh.
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-neo-bevel pt-4 mt-6">
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleCloseModal}
              >
                Đóng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-4">
      {/* Bulk Price Sync controls */}
      {skusFA.fields.length > 0 && (
        <div className="flex items-center gap-3 bg-muted/20 border border-foreground/[0.04] dark:border-white/[0.05] p-3 rounded-card mb-4 max-w-md">
          <div className="flex-1 space-y-1">
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">
              Đồng bộ giá hàng loạt (VNĐ)
            </label>
            <Input
              type="number"
              min={0}
              value={bulkPrice}
              onChange={(e) => setBulkPrice(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="Nhập giá chung..."
              className="h-8 text-xs bg-card"
            />
          </div>
          <Button type="button" onClick={handleSyncBulkPrice} className="mt-5 text-xs py-2 px-3 h-8 shrink-0">
            Áp dụng
          </Button>
        </div>
      )}

      <div className="border border-foreground/[0.04] dark:border-white/[0.05] rounded-card overflow-hidden bg-background/30">
        <AdminTable
          columns={columns}
          data={skusFA.fields}
          emptyTitle="Chưa có biến thể nào được tạo."
          className="border-none shadow-none bg-transparent"
          rowKey={(item: any) => item.id}
        />
      </div>

      {renderEditModal()}
    </div>
  );
}
