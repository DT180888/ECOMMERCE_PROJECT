import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@my-project/ui";
import { PlusIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import { SkuMatrixGenerator, ProductFormSkuTable } from "@components/sku";
import { buildImgSrc } from "@my-project/shared-utils";
import { DEFAULT_PRODUCT_IMAGE_URL } from "@my-project/shared-utils";

// Helper function slugify
const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

interface Props {
  isCreate: boolean;
  variantOptions: Array<{ value: number; label: string }>;
  attrAll: any[];
  toast: any;
}

export function ProductSkus({ isCreate, variantOptions, attrAll, toast }: Props) {
  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<any>();
  const [showMatrixGen, setShowMatrixGen] = useState<boolean>(false);
  const [editingSkuIdx, setEditingSkuIdx] = useState<number | null>(null);

  const skusFA = useFieldArray({ control, name: "skus" });
  const imagesFA = useFieldArray({ control, name: "images" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-xs font-medium font-sans uppercase tracking-[0.16em] text-foreground">
            Quản lý biến thể & giá bán (SKUs)
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Thiết lập mã kho SKU, giá bán niêm yết và tùy chọn kích cỡ/màu sắc cho từng phiên bản.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isCreate && (
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => setShowMatrixGen(!showMatrixGen)}
              className="text-xs h-8 px-3 rounded-[2px] border-dashed border-border/60 font-semibold shadow-none gap-1"
            >
              <TableCellsIcon className="w-3.5 h-3.5 text-muted-foreground" />
              {showMatrixGen ? "Đóng ma trận" : "Tạo tự động (Matrix)"}
            </Button>
          )}
          <Button
            type="button"
            size="default"
            onClick={() => {
              skusFA.append({ skuCode: "", priceMinor: 0, isActive: true, options: [] });
              setEditingSkuIdx(skusFA.fields.length);
            }}
            className="text-xs h-8 px-3.5 rounded-[2px] font-semibold uppercase tracking-wider shadow-none gap-1"
          >
            <PlusIcon className="w-3.5 h-3.5" /> Thêm SKU
          </Button>
        </div>
      </div>

      {isCreate && showMatrixGen && (
        <SkuMatrixGenerator
          variantOptions={variantOptions}
          productSlug={watch("slug") || (watch("name") ? slugify(watch("name")) : "product")}
          onGenerate={(newSkus: any[]) => {
            const existingCodes = new Set(
              watch("skus")?.map((s: any) => s.skuCode.trim().toUpperCase()) || []
            );
            let count = 0;
            const currentSkus = watch("skus") || [];
            if (
              currentSkus.length === 1 &&
              !currentSkus[0].skuCode &&
              (!currentSkus[0].options || currentSkus[0].options.length === 0)
            ) {
              skusFA.remove(0);
            }
            newSkus.forEach((item: any) => {
              if (!existingCodes.has(item.skuCode.toUpperCase())) {
                skusFA.append(item);
                count++;
              }
            });
            toast.success(`Đã tự động tạo và thêm ${count} SKU mới vào danh sách!`);
            setShowMatrixGen(false);
          }}
          toast={toast}
          attrAll={attrAll}
        />
      )}

      <ProductFormSkuTable
        skusFA={skusFA}
        imagesFA={imagesFA}
        register={register}
        control={control}
        watch={watch}
        setValue={setValue}
        getValues={getValues}
        errors={errors}
        variantOptions={variantOptions}
        attrAll={attrAll}
        isCreate={isCreate}
        toast={toast}
        buildImgSrc={buildImgSrc}
        DEFAULT_PRODUCT_IMAGE_URL={DEFAULT_PRODUCT_IMAGE_URL}
        editingSkuIdx={editingSkuIdx}
        setEditingSkuIdx={setEditingSkuIdx}
      />
    </div>
  );
}
