import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@my-project/ui";
import { PlusIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import { SkuMatrixGenerator, ProductFormSkuTable } from '@features/sku-management';
import { buildImgSrc } from "@shared/lib/url";
import { DEFAULT_PRODUCT_IMAGE_URL } from "@shared/constants";

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
  const { register, control, watch, setValue, getValues, formState: { errors } } = useFormContext<any>();
  const [showMatrixGen, setShowMatrixGen] = useState<boolean>(false);
  const [editingSkuIdx, setEditingSkuIdx] = useState<number | null>(null);
  
  const skusFA = useFieldArray({ control, name: "skus" });
  const imagesFA = useFieldArray({ control, name: "images" });

  return (
    <div className="bg-transparent border border-neo-bevel rounded-card p-6">
       <div className="flex justify-between items-center mb-6">
           <div className="space-y-1">
               <h3 className="text-lg font-medium text-foreground">Quản lý biến thể (SKUs)</h3>
               <p className="text-sm text-muted">Thiết lập giá và mã kho cho từng phiên bản</p>
           </div>
           <div className="flex gap-2">
               {isCreate && (
                   <Button 
                       type="button" 
                       variant="outline" 
                       onClick={() => {
                           setShowMatrixGen(!showMatrixGen);
                       }} 
                       className="text-xs py-2 px-3 border-dashed border-border"
                   >
                       <TableCellsIcon className="w-4 h-4 mr-1 text-accent"/> {showMatrixGen ? "Đóng trình tạo" : "Tạo tự động (Matrix)"}
                   </Button>
               )}
               <Button 
                   type="button" 
                   onClick={() => {
                       skusFA.append({ skuCode: "", priceMinor: 0, isActive: true, options: [] });
                       setEditingSkuIdx(skusFA.fields.length);
                   }} 
                   className="text-sm py-2 px-4 rounded-button transition-all"
               >
                   <PlusIcon className="w-3 h-3 md:w-4 md:h-4 mr-2"/> Thêm SKU
               </Button>
           </div>
       </div>

       {isCreate && showMatrixGen && (
           <SkuMatrixGenerator
               variantOptions={variantOptions}
               productSlug={watch("slug") || (watch("name") ? slugify(watch("name")) : "product")}
               onGenerate={(newSkus: any[]) => {
                   const existingCodes = new Set(watch("skus")?.map((s: any) => s.skuCode.trim().toUpperCase()) || []);
                   let count = 0;
                   const currentSkus = watch("skus") || [];
                   if (currentSkus.length === 1 && !currentSkus[0].skuCode && (!currentSkus[0].options || currentSkus[0].options.length === 0)) {
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
