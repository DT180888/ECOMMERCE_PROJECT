import { useEffect, useMemo, useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProductDetail, useCreateProduct, useUpdateProduct, useUpsertProductImages } from "@entities/product/hooks";
import type {
  Id,
  ProductStatus,
  ProductImageUpsert,
  ProductSkuCreate,
  ProductSkuUpdate,
  ProductAttributeUpsert,
} from "@entities/product/types";
import { useBrandOptions } from "@entities/brand/hooks";
import { useCategoryOptions } from "@entities/category/hooks";
import { useAttributeOptions } from "@entities/attribute/hooks";
import { useCollections } from "@entities/collection/hooks";
import { productFormSchema, type ProductFormSchema } from "@schemas/product";
import { useToast } from "@my-project/ui";
import { useSkuList } from "@entities/sku";
import usePermission from "@shared/hooks/usePermission";

// --- TYPES ---
export type BasicForm = {
  name: string;
  slug: string;
  description?: string;
  status: ProductStatus | number;
  brandId?: string;
  categoryIds: string[];
  collectionIds: string[];
};

export type SkuOptionRow = { attributeId: number; value: string };
export type SkuRow = {
  skuId?: number;
  skuCode: string;
  priceMinor: number;
  isActive: boolean;
  options?: SkuOptionRow[];
};

export type ImageRow = { url: string; isPrimary?: boolean; sortOrder?: number; skuCode?: string | null };
export type AttrRow = { attributeId: number; valueText?: string; valueNumber?: number; valueBool?: boolean };

export type FormValues = BasicForm & {
  skus: SkuRow[];
  images: ImageRow[];
  attributes: AttrRow[];
};

// --- HELPERS ---
const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export function useProductFormManager() {
  const { hasPermission } = usePermission();
  const typedResolver = zodResolver(productFormSchema) as Resolver<ProductFormSchema>;
  const nav = useNavigate();
  const { "*": idParam } = useParams();
  const isCreate = idParam === "new";
  const id = !isCreate ? (Number(idParam) as Id) : undefined;

  const toast = useToast();

  const { options: brandOptions } = useBrandOptions();
  const { options: categoryOptions } = useCategoryOptions();
  const { raw: attrAll } = useAttributeOptions({ page: 1, size: 500 });
  const { data: collectionsData } = useCollections({ page: 1, size: 500 });
  const collectionOptions = useMemo(() => {
    return (collectionsData?.items || []).map((c) => ({
      value: String(c.id),
      label: c.name,
    }));
  }, [collectionsData]);

  const hasAccess = isCreate ? hasPermission("Permissions.Products.Create") : hasPermission("Permissions.Products.Edit");

  const variantOptions = useMemo(
    () => attrAll.filter(a => a.isVariant).map(a => ({ value: a.attributeId, label: a.name })),
    [attrAll]
  );
  const attrOptions = useMemo(
    () => attrAll.filter(a => !a.isVariant).map(a => ({ value: a.attributeId, label: `${a.name}${a.unit ? ` (${a.unit})` : ""}` })),
    [attrAll]
  );

  const { data, isLoading } = useProductDetail(id, { enabled: !!id });
  const { data: skuList } = useSkuList(id!, { enabled: !!id });
  const createMut = useCreateProduct();
  const updateMut = useUpdateProduct();
  const upsertImagesMut = useUpsertProductImages();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("basic");

  const methods = useForm<ProductFormSchema>({
    resolver: typedResolver,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      status: 1,
      brandId: "",
      categoryIds: [],
      collectionIds: [],
      skus: [{ skuCode: "", priceMinor: 0, isActive: true, options: [] }],
      images: [],
      attributes: [],
    },
    mode: "onBlur",
  });

  const { watch, reset, formState: { errors } } = methods;

  // Sync activeTab with currentStep for wizard mode
  useEffect(() => {
    if (isCreate) {
      const stepTabMap: Record<number, string> = {
        1: "basic",
        2: "attrs",
        3: "images",
        4: "skus",
      };
      setActiveTab(stepTabMap[currentStep] || "basic");
    }
  }, [currentStep, isCreate]);

  // Auto slug
  useEffect(() => {
    if (isCreate) {
      const sub = watch((v, { name }) => {
        if (name === "name") {
          reset((cur) => ({ ...cur, slug: slugify(v.name || "") }));
        }
      });
      return () => sub.unsubscribe();
    }
  }, [isCreate, reset, watch]);

  // Load Data
  useEffect(() => {
    if (!isCreate && data) {
      const mapped: ProductFormSchema = {
        name: data.name,
        slug: data.slug,
        description: data.description ?? "",
        status: data.status as any,
        brandId: data.brandId ? String(data.brandId) : "",
        categoryIds: data.categoryIds.map(String),
        collectionIds: data.collectionIds?.map(String) || [],
        skus: data.skus.map((s) => ({
          skuId: s.skuId,
          skuCode: s.skuCode,
          priceMinor: s.priceMinor,
          isActive: s.isActive,
          options: s.options?.map((o) => ({ attributeId: o.attributeId, value: o.value })) || [],
        })),
        images: data.images
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((i, idx) => ({
            url: i.url,
            isPrimary: i.isPrimary,
            sortOrder: i.sortOrder ?? idx + 1,
            skuCode: i.skuCode || null,
          })),
        attributes: data.attributes.map((a) => ({
          attributeId: a.attributeId,
          valueText: a.valueText ?? undefined,
          valueNumber: a.valueNumber ?? undefined,
          valueBool: a.valueBool ?? undefined,
        })),
      };
      reset(mapped);
    }
  }, [isCreate, data, reset]);
    
  const executeSubmit = async (skus: any, v: FormValues) => {
      const categoryIds = (v.categoryIds || []).map((x) => Number(x));
      const collectionIds = (v.collectionIds || []).map((x) => Number(x));
      
      const images: ProductImageUpsert[] = (v.images || []).map((i, idx) => ({
        url: i.url,
        isPrimary: i.isPrimary ?? false,
        sortOrder: i.sortOrder ?? idx + 1,
        skuCode: i.skuCode || null,
      }));
      if (images.length > 0 && !images.some((x) => x.isPrimary)) {
        images[0].isPrimary = true;
      }

      const attributes: ProductAttributeUpsert[] = (v.attributes || []).map((a) => {
        const valNum = typeof a.valueNumber === "number" && !isNaN(a.valueNumber) ? a.valueNumber : null;
        const valText = a.valueText && a.valueText.trim() !== "" ? a.valueText.trim() : null;
        const valBool = typeof a.valueBool === "boolean" ? a.valueBool : null;
        return {
          attributeId: Number(a.attributeId),
          valueText: valText,
          valueNumber: valNum,
          valueBool: valBool,
        };
      });

      try {
          if (isCreate) {
              await createMut.mutateAsync({
                name: v.name,
                slug: v.slug,
                description: v.description ?? "",
                status: v.status as any,
                brandId: v.brandId ? Number(v.brandId) : null,
                skus,
                images,
                categoryIds,
                collectionIds,
                attributes,
              });
          } else {
              await updateMut.mutateAsync({
                id: id!,
                payload: {
                  name: v.name,
                  slug: v.slug,
                  description: v.description ?? "",
                  status: v.status as any,
                  brandId: v.brandId ? Number(v.brandId) : null,
                  skus, 
                  images,
                  categoryIds,
                  collectionIds,
                  attributes,
                },
              });

              await upsertImagesMut.mutateAsync({
                id: id!,
                payload: { images }
              });
          }

          toast.success(`Sản phẩm ${isCreate ? 'đã tạo' : 'đã cập nhật'} thành công!`); 
          nav("/admin/product");

      } catch (error: any) {
          const msg = error?.message || error?.message || `Lỗi khi ${isCreate ? 'tạo' : 'cập nhật'} sản phẩm.`;
          toast.error(msg);
      }
  };

  const onSubmit = async (v: FormValues) => {
      const skus: (ProductSkuCreate | ProductSkuUpdate)[] = [];
      const formSkuById = new Map<number, { skuCode: string; priceMinor: number; isActive: boolean; options?: { attributeId: number; value: string }[] }>();
      
      if (isCreate) {
          const createdSkus: ProductSkuCreate[] = (v.skus || []).map((s) => ({
            skuCode: s.skuCode.trim(),
            priceMinor: Number(s.priceMinor),
            isActive: !!s.isActive,
            options: (s.options || []).filter((o) => o.attributeId && o.value?.trim())
              .map((o) => ({ attributeId: Number(o.attributeId), value: o.value.trim() })),
          }));
          skus.push(...createdSkus);
      } else {
          (v.skus || []).forEach((s) => {
            if (s.skuId && s.skuId > 0) {
              formSkuById.set(Number(s.skuId), {
                skuCode: s.skuCode.trim(),
                priceMinor: Number(s.priceMinor),
                isActive: !!s.isActive,
                options: (s.options || []).filter((o) => o.attributeId && o.value?.trim())
                  .map((o) => ({ attributeId: Number(o.attributeId), value: o.value.trim() })),
              });
            }
          });

          const keepExistingSkus: ProductSkuUpdate[] = (skuList || []).map((s) => {
            const patched = formSkuById.get(s.skuId);
            return {
              skuId: s.skuId,
              skuCode: patched?.skuCode ?? s.skuCode,
              priceMinor: patched?.priceMinor ?? s.priceMinor,
              isActive: patched?.isActive ?? s.isActive,
              options: (patched?.options && patched.options.length > 0)
                ? patched.options 
                : (s.options || []).map((o) => ({ attributeId: o.attributeId, value: o.value })),
            };
          });

          const newSkusFromForm: ProductSkuUpdate[] = (v.skus || [])
            .filter((s) => !s.skuId || Number(s.skuId) <= 0)
            .map((s) => ({
              skuId: null as any, 
              skuCode: s.skuCode.trim(),
              priceMinor: Number(s.priceMinor) || 0,
              isActive: !!s.isActive,
              options: (s.options || []).filter((o) => o.attributeId && o.value?.trim())
                .map((o) => ({ attributeId: Number(o.attributeId), value: o.value.trim() })),
            }));
          
          skus.push(...keepExistingSkus, ...newSkusFromForm);
      }

      const skuCodeCount: Record<string, number> = {};
      for (const s of skus) {
        const code = (s.skuCode ?? "").trim();
        if (!code) continue;
        skuCodeCount[code] = (skuCodeCount[code] || 0) + 1;
      }
      const dupCodes = Object.entries(skuCodeCount).filter(([, n]) => n > 1).map(([k]) => k);
      if (dupCodes.length) {
        toast.error(`SkuCode trùng lặp: ${dupCodes.join(", ")}`);
        return;
      }

      await executeSubmit(skus, v);
  };

  const hasBasicErrors = !!(errors.name || errors.slug || errors.brandId || errors.categoryIds);
  const hasImageErrors = !!errors.images;
  const hasAttrErrors = !!errors.attributes;
  const hasSkuErrors = !!errors.skus;

  return {
    methods,
    onSubmit,
    hasAccess,
    isCreate,
    id,
    isLoading,
    brandOptions,
    categoryOptions,
    collectionOptions,
    attrAll,
    variantOptions,
    attrOptions,
    currentStep,
    setCurrentStep,
    activeTab,
    setActiveTab,
    hasBasicErrors,
    hasImageErrors,
    hasAttrErrors,
    hasSkuErrors,
    nav,
    toast,
  };
}
