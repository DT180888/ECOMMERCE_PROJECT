import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { Input, Checkbox } from "@my-project/ui";
import { cn } from "@shared/lib/utils";

import { useProductDetail, useUpsertProductImages } from "@entities/product/hooks";
import { useSkuList, useUpdateSku, useDeleteSku } from "@entities/sku";
import { useBrandOptions } from "@entities/brand/hooks";
import { useCategoryOptions } from "@entities/category/hooks";
import { useAttributeOptions } from "@entities/attribute/hooks";

import { Button } from "@my-project/ui";
import { API_BASE } from "@shared/config/env";
import {
  PencilSquareIcon,
  ArrowLeftIcon,
  PhotoIcon,
  CubeIcon,
  TagIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  ArchiveBoxIcon,
  CheckIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

import { ProductDetailSkuAddModal, InventoryCell, ProductDetailSkuEditModal } from "@features/sku-management";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@my-project/ui";
import { AdminTable, AdminTableColumn } from "@shared/ui/table";
import { Guard, AdminPageShell } from "@shared/ui";

const formatVND = (minor: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(minor ?? 0);

const buildImgSrc = (u?: string) =>
  u ? (u.startsWith("http") ? u : `${API_BASE}${u}`) : "";

export function AdminProductDetail() {
  const { id: idParam } = useParams();
  const id = Number(idParam);

  const {
    data: product,
    isLoading: loadingProduct,
    isError,
  } = useProductDetail(id, { enabled: !!id });

  const {
    data: skus,
    isLoading: loadingSkus,
  } = useSkuList(id, { enabled: !!id });

  const { options: brandOptions } = useBrandOptions();
  const { options: categoryOptions } = useCategoryOptions();
  const { raw: attributeRaw } = useAttributeOptions({ page: 1, size: 500 });

  const updateSku = useUpdateSku(id);
  const deleteSku = useDeleteSku(id);
  const upsertImages = useUpsertProductImages();

  const [isAddSkuOpen, setIsAddSkuOpen] = useState(false);
  const [editingSkuId, setEditingSkuId] = useState<number | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

  // ===== Derived data =====
  const brandName = useMemo(() => {
    if (!product?.brandId) return "-";
    return (
      brandOptions.find((b) => Number(b.value) === product.brandId)?.label ??
      String(product.brandId)
    );
  }, [brandOptions, product?.brandId]);

  const categoryNames = useMemo(() => {
    if (!product?.categoryIds?.length) return [];
    const map = new Map<number, string>();
    categoryOptions.forEach((c) => map.set(Number(c.value), c.label));
    return product.categoryIds.map((cid) => map.get(cid) ?? String(cid));
  }, [categoryOptions, product?.categoryIds]);

  const attrNameMap = useMemo(() => {
    const m = new Map<number, { name: string; unit?: string | null }>();
    (attributeRaw ?? []).forEach((a) =>
      m.set(a.attributeId, { name: a.name, unit: a.unit ?? null })
    );
    return m;
  }, [attributeRaw]);

  const variantAttrOptions = useMemo(
    () =>
      (attributeRaw ?? [])
        .filter((a) => a.isVariant)
        .map((a) => ({ value: a.attributeId, label: a.name })),
    [attributeRaw]
  );

  const imagesSorted = useMemo(
    () =>
      (product?.images ?? [])
        .slice()
        .sort(
          (a, b) =>
            (a.sortOrder ?? Number.MAX_SAFE_INTEGER) -
            (b.sortOrder ?? Number.MAX_SAFE_INTEGER)
        ),
    [product?.images]
  );

  const activeImage = useMemo(() => {
    if (selectedImageId) return imagesSorted.find(i => i.imageId === selectedImageId) ?? imagesSorted[0];
    return imagesSorted.find((i) => i.isPrimary) ?? imagesSorted[0];
  }, [imagesSorted, selectedImageId]);

  const skuRows = useMemo(
    () => skus ?? product?.skus ?? [],
    [skus, product?.skus]
  );

  const minPriceFromSkus = useMemo(() => {
    const list = skuRows ?? [];
    if (!list.length) return null;
    return Math.min(...list.map((s) => s.priceMinor));
  }, [skuRows]);

  const existingSkusForModal = useMemo(
    () =>
      (skuRows ?? []).map((s) => ({
        skuCode: s.skuCode,
        options:
          s.options?.map((o) => ({
            attributeId: o.attributeId,
            value: o.value,
          })) ?? [],
      })),
    [skuRows]
  );

  const editingSku = useMemo(() => {
    if (!editingSkuId) return null;
    return skuRows.find((s) => s.skuId === editingSkuId) ?? null;
  }, [editingSkuId, skuRows]);

  const editMethods = useForm<any>();
  const { register, reset, handleSubmit } = editMethods;

  // ===== Handlers =====
  const onSaveSkuForm = async (v: any) => {
    if (!editingSkuId) return;

    const cleanOptions = (v.options || [])
      .filter((o: any) => Number(o.attributeId) > 0 && o.value?.trim())
      .map((o: any) => ({ attributeId: Number(o.attributeId), value: o.value.trim() }));

    const attrIds = cleanOptions.map((o: any) => o.attributeId);
    const dup = attrIds.filter((id: any, i: any) => attrIds.indexOf(id) !== i);

    if (dup.length > 0) {
      alert("Không thể lưu: Có thuộc tính trùng nhau trong option.");
      return;
    }

    try {
      // 1. Update SKU info
      await updateSku.mutateAsync({
        skuId: editingSkuId,
        payload: {
          skuCode: v.skuCode.trim(),
          priceMinor: Number(v.priceMinor) || 0,
          isActive: !!v.isActive,
          options: cleanOptions,
        }
      });

      // 2. Update Image
      const skuCodeClean = v.skuCode.trim();
      const currentImages = product?.images || [];
      const finalImagesToSave = currentImages.map(img => {
        if (img.skuCode === skuCodeClean && (!v.image || img.url !== v.image.url)) {
          return { ...img, skuCode: null };
        }
        if (v.image && img.url === v.image.url) {
          return { ...img, skuCode: skuCodeClean };
        }
        return img;
      });

      const hasImageChanges = JSON.stringify(currentImages) !== JSON.stringify(finalImagesToSave);
      if (hasImageChanges) {
        await upsertImages.mutateAsync({
            id: product!.productId,
            payload: {
                images: finalImagesToSave
            }
        });
      }

      setEditingSkuId(null);
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Lỗi khi cập nhật SKU.");
    }
  };
  const handleSaveSku =
    (skuId: number) =>
    async (payload: {
      skuCode: string;
      priceMinor: number;
      isActive: boolean;
      options?: { attributeId: number; value: string }[];
    }) => {
      await updateSku.mutateAsync({ skuId, payload });
    };

  const handleSoftDeleteSku = (skuId: number) => async () => {
    if (!confirm("Xoá SKU này (xoá mềm)?")) return;
    await deleteSku.mutateAsync({ skuId, hard: false });
  };

  const handleHardDeleteSku = (skuId: number) => async () => {
    if (
      !confirm(
        "Bạn có chắc chắn muốn XOÁ VĨNH VIỄN SKU này?\nHành động này không thể khôi phục."
      )
    )
      return;

    await deleteSku.mutateAsync({ skuId, hard: true });
  };

  const renderSkuTable = (rows: typeof skuRows) => {
    const list = rows ?? [];
    
    const columns: AdminTableColumn<typeof list[0]>[] = [
      {
        key: "skuId",
        label: "SKU ID",
        render: (s) => <span className="font-mono text-muted-foreground">#{s.skuId}</span>
      },
      {
        key: "image",
        label: "Hình ảnh",
        align: "center",
        render: (s) => {
          const skuImages = (product?.images || []).filter(img => img.skuCode === s.skuCode);
          const primaryImage = skuImages.find(img => img.isPrimary) || skuImages[0];
          const displayUrl = primaryImage?.url || s.imageUrl;
          
          return (
            <div className="w-10 h-10 rounded-button mx-auto border border-foreground/[0.04] bg-muted/20 flex items-center justify-center overflow-hidden">
              {displayUrl ? (
                <img src={buildImgSrc(displayUrl)} alt="" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <PhotoIcon className="w-4 h-4 text-muted-foreground opacity-50" />
              )}
            </div>
          );
        }
      },
      {
        key: "skuCode",
        label: "Mã SKU",
        render: (s) => (
          <div className="font-mono font-bold text-foreground">
            {s.skuCode}
          </div>
        )
      },
      {
        key: "priceMinor",
        label: "Giá bán",
        render: (s) => (
          <span className="font-mono font-bold text-success text-sm">
            {formatVND(s.priceMinor)}
          </span>
        )
      },
      {
        key: "isActive",
        label: "Trạng thái",
        align: "center",
        render: (s) => (
          <span
            className={cn(
              "inline-flex px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider",
              s.isActive
                ? "bg-success/10 text-success border border-success/20"
                : "bg-muted text-muted-foreground border border-foreground/[0.04]"
            )}
          >
            {s.isActive ? "Hoạt động" : "Bị ẩn"}
          </span>
        )
      },
      {
        key: "options",
        label: "Thuộc tính",
        render: (s) => (
          <div className="flex flex-wrap gap-1">
            {s.options && s.options.length > 0 ? (
              s.options.map((o: any, idx: number) => {
                const attrName = o.attributeName ?? `#${o.attributeId}`;
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-accent/10 text-accent border border-accent/10"
                  >
                    {attrName}: {o.value}
                  </span>
                );
              })
            ) : (
              <span className="text-[10px] text-muted-foreground italic">Không có</span>
            )}
          </div>
        )
      },
      {
        key: "inventory",
        label: "Tồn kho",
        render: (s) => <InventoryCell skuId={s.skuId} />
      },
      {
        key: "actions",
        label: "Thao tác",
        isAction: true,
        align: "center",
        render: (s) => {
          return (
            <div className="flex items-center justify-center gap-1">
              <Guard permission="Permissions.Products.Edit">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingSkuId(s.skuId);
                  }}
                  className="h-7 w-7 p-0 transition-colors text-muted hover:text-accent hover:bg-accent/10"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                </Button>
              </Guard>
 
              <Guard permission="Permissions.Products.Delete">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSoftDeleteSku(s.skuId)();
                  }}
                  className="h-7 w-7 p-0 text-muted hover:text-error hover:bg-error/10 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </Guard>
            </div>
          );
        }
      }
    ];

    return (
      <div className="border border-foreground/[0.04] dark:border-white/[0.05] rounded-card overflow-hidden h-full flex flex-col">
        <div className="flex-1 overflow-auto custom-scrollbar min-h-[300px]">
          <AdminTable
            columns={columns}
            data={list}
            emptyIcon={ArchiveBoxIcon}
            emptyTitle="Chưa có biến thể SKU nào được tạo."
            emptyDescription="Vui lòng bấm 'Thêm biến thể' để bắt đầu."
            className="border-none shadow-none h-full bg-transparent"
            rowKey={(s) => s.skuId}
          />
        </div>
      </div>
    );
  };

  if (!id) return <div className="p-8 text-center text-destructive">Thiếu ID sản phẩm.</div>;
  if (loadingProduct) return <div className="p-8 text-center text-muted-foreground animate-pulse">Đang tải thông tin sản phẩm...</div>;
  if (isError || !product)
    return <div className="p-8 text-center text-destructive">Không tìm thấy sản phẩm hoặc có lỗi xảy ra.</div>;

  return (
    <>
      <AdminPageShell
        title={product.name}
        badge={`ID: #${product.productId}`}
        noCard={true}
        actions={
          <div className="flex items-center gap-2 shrink-0">
            <Link to={`/admin/product/${product.productId}`}>
               <Button variant="outline" className="h-9 px-2 sm:px-3 text-xs font-semibold shadow-none rounded-button">
                  <PencilSquareIcon className="w-4 h-4 sm:mr-1.5" /> <span className="hidden sm:inline-block whitespace-nowrap">Sửa</span>
              </Button>
            </Link>
 
            <Link to="/admin/product">
              <Button variant="outline" className="h-9 px-2 sm:px-3 text-xs font-semibold shadow-none rounded-button">
                <ArrowLeftIcon className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        }
      >
        <div className="flex flex-col gap-6 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 responsive-gap shrink-0">
              {/* Card: Gallery + Basic Info */}
              <div className="bg-card rounded-card p-6 flex flex-col sm:flex-row gap-6 border border-neo-bevel shadow-neo-sm">
                  {/* Inline Gallery */}
                  <div className="flex flex-col gap-3 shrink-0">
                      <div className="w-40 h-40 rounded-card bg-muted/5 flex items-center justify-center overflow-hidden relative border border-foreground/[0.04] dark:border-white/[0.05]">
                          {activeImage?.url ? (
                              <img
                                  src={buildImgSrc(activeImage.url)}
                                  alt="Active"
                                  className="h-full w-full object-contain"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                              />
                          ) : (
                              <div className="text-muted-foreground flex flex-col items-center gap-2 opacity-50">
                                  <PhotoIcon className="w-8 h-8"/>
                              </div>
                          )}
                          {activeImage?.isPrimary && (
                              <div className="absolute top-2 right-2 bg-accent text-accent-foreground text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-inner shadow-sm">
                                  CHÍNH
                              </div>
                          )}
                      </div>
                      
                      {imagesSorted.length > 1 && (
                          <div className="flex gap-2 overflow-x-auto w-40 pb-1 custom-scrollbar">
                              {imagesSorted.map((img) => (
                                  <div
                                      key={img.imageId}
                                      onClick={() => setSelectedImageId(img.imageId)}
                                      className={`shrink-0 w-10 h-10 rounded-button cursor-pointer overflow-hidden transition-all border ${
                                          activeImage?.imageId === img.imageId 
                                          ? "border-accent ring-1 ring-accent/30" 
                                          : "border-foreground/[0.04] dark:border-white/[0.05] opacity-75 hover:opacity-100 hover:border-accent/40"
                                      }`}
                                  >
                                      {img.url && (
                                          <img
                                              src={buildImgSrc(img.url)}
                                              alt=""
                                              className="h-full w-full object-cover"
                                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                          />
                                      )}
                                  </div>
                                ))}
                          </div>
                      )}
                  </div>
 
                  {/* Info Details */}
                  <div className="flex-1 flex flex-col space-y-4">
                      <h3 className="text-xs font-bold font-display text-foreground flex items-center gap-2 uppercase tracking-wider pb-2 border-b border-foreground/[0.04] dark:border-white/[0.05]">
                          <CubeIcon className="w-3 h-3 md:w-4 md:h-4 text-accent"/> Chi tiết cơ bản
                      </h3>
                      
                      <div className="space-y-3 text-xs">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Thương hiệu</span>
                                <span className="text-foreground font-semibold">{brandName}</span>
                            </div>
                            
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Danh mục</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {categoryNames.length > 0 ? categoryNames.map(c => (
                                        <span key={c} className="text-xs bg-muted/20 text-foreground px-2 py-0.5 rounded-inner border border-muted/10">
                                            {c}
                                        </span>
                                    )) : <span className="text-muted-foreground italic text-[11px]">Chưa phân loại</span>}
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Đường dẫn (Slug)</span>
                                <code className="text-[11px] text-foreground bg-muted/20 border border-muted/10 px-2.5 py-0.5 rounded-inner break-all font-mono w-fit">
                                    {product.slug}
                                </code>
                            </div>
                            
                            <div className="flex flex-col gap-1 pt-1">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Giá sàn (Min)</span>
                                <span className="text-base font-bold text-foreground font-mono">
                                  {loadingSkus ? "..." : minPriceFromSkus != null ? formatVND(minPriceFromSkus) : "N/A"}
                                </span>
                            </div>
 
                            <div className="flex flex-col gap-1 pt-1">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Trạng thái hiển thị</span>
                                <div>
                                  <span className={`text-xs px-2.5 py-1 rounded-inner font-semibold tracking-wide uppercase border border-border/50 ${
                                      Number(product.status) === 1 
                                      ? "badge-green" 
                                      : "badge-red"
                                  }`}>
                                      {Number(product.status) === 1 ? "Active" : "Inactive"}
                                  </span>
                                </div>
                            </div>
                      </div>
                  </div>
              </div>
 
              <div className="bg-card rounded-card p-6 flex flex-col border border-neo-bevel shadow-neo-sm">
                    <h3 className="text-xs font-bold font-display text-foreground flex items-center gap-2 uppercase tracking-wider pb-2 mb-4 border-b border-foreground/[0.04] dark:border-white/[0.05]">
                      <TagIcon className="w-3 h-3 md:w-4 md:h-4 text-accent"/> Thông số kỹ thuật
                    </h3>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 lg:max-h-[300px]">
                        {product.attributes?.length ? (
                            <div className="grid grid-cols-1 divide-y divide-foreground/[0.04] dark:divide-white/[0.05]">
                                {product.attributes.map((a) => {
                                    const meta = attrNameMap.get(a.attributeId);
                                    const label = meta?.name ?? `#${a.attributeId}`;
                                    const unit = meta?.unit ? ` ${meta.unit}` : "";
                                    const value = a.valueText ?? (a.valueNumber != null ? `${a.valueNumber}${unit}` : undefined) ?? (typeof a.valueBool === "boolean" ? (a.valueBool ? "Có" : "Không") : undefined) ?? "—";
      
                                    return (
                                        <div key={a.attributeId} className="flex justify-between items-center gap-4 py-2 hover:bg-muted/5 px-2 rounded-inner transition-colors duration-150">
                                            <span className="text-muted-foreground text-xs">{label}</span>
                                            <span className="text-foreground font-medium text-xs text-right break-all">{String(value)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                      ) : (
                          <div className="text-xs text-muted-foreground italic text-center py-8 flex flex-col items-center gap-2 opacity-50">
                              <TagIcon className="w-8 h-8"/>
                              Sản phẩm chưa có thuộc tính.
                          </div>
                      )}
                    </div>
              </div>
          </div>
 
          <div className="bg-card rounded-card flex flex-col flex-1 border border-neo-bevel shadow-neo-sm overflow-hidden shrink-0">
              <div className="p-3 flex flex-wrap justify-between items-center gap-4 border-b border-neo-bevel">
                <h3 className="text-sm font-bold font-display text-foreground uppercase tracking-wider flex items-center gap-2">
                      📦 Quản lý biến thể (SKU)
                      <span className="text-xs font-mono font-bold bg-muted/20 border border-border/50 text-foreground px-2.5 py-0.5 rounded-full">
                        {skuRows.length}
                      </span>
                </h3>
                <Button 
                      onClick={() => setIsAddSkuOpen(true)}
                      variant="default"
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/95 hover:-translate-y-[1px] active:translate-y-[0.5px] transition-all rounded-button text-xs font-medium"
                >
                      <PlusIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" /> Thêm biến thể
                </Button>
              </div>
 
              <div className="flex-1 flex flex-col relative h-full">
                {loadingSkus ? (
                    <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground animate-pulse py-12 font-mono">
                        Đang tải dữ liệu SKU...
                    </div>
                ) : (
                      <Tabs defaultValue="all" className="flex flex-col h-full">
                            <div className="p-3 pb-0 overflow-x-auto custom-scrollbar">
                              <TabsList className="bg-muted/10 p-1 rounded-button inline-flex h-auto w-max min-w-min">
                                <TabsTrigger value="all" className="px-4 py-1.5 text-xs uppercase font-bold tracking-wider data-[state=active]:bg-card data-[state=active]:shadow-neo-sm data-[state=active]:text-primary text-muted-foreground transition-all rounded-inner whitespace-nowrap">Tất cả</TabsTrigger>
                                <TabsTrigger value="active" className="px-4 py-1.5 text-xs uppercase font-bold tracking-wider data-[state=active]:bg-card data-[state=active]:shadow-neo-sm data-[state=active]:text-[hsl(var(--badge-green-fg))] text-muted-foreground transition-all rounded-inner whitespace-nowrap">Hoạt động</TabsTrigger>
                                <TabsTrigger value="inactive" className="px-4 py-1.5 text-xs uppercase font-bold tracking-wider data-[state=active]:bg-card data-[state=active]:shadow-neo-sm data-[state=active]:text-[hsl(var(--badge-red-fg))] text-muted-foreground transition-all rounded-inner whitespace-nowrap">Đã ẩn</TabsTrigger>
                            </TabsList>
                          </div>
 
                          <div className="flex-1 p-3 h-full overflow-hidden">
                            <TabsContent value="all" className="m-0 h-full border-none outline-none overflow-hidden">
                                {renderSkuTable(skuRows)}
                            </TabsContent>
 
                            <TabsContent value="active" className="m-0 h-full border-none outline-none overflow-hidden">
                                {renderSkuTable((skuRows ?? []).filter((s) => s.isActive) as typeof skuRows)}
                            </TabsContent>
 
                            <TabsContent value="inactive" className="m-0 h-full border-none outline-none overflow-hidden">
                                {renderSkuTable((skuRows ?? []).filter((s) => !s.isActive) as typeof skuRows)}
                            </TabsContent>
                          </div>
                      </Tabs>
                )}
              </div>
          </div>
 
        </div>
      </AdminPageShell>
 
      {isAddSkuOpen && (
        <ProductDetailSkuAddModal
          productId={product.productId}
          productSlug={product.slug}
          existingSkus={existingSkusForModal}
          onClose={() => setIsAddSkuOpen(false)}
          onCreated={() => {
            setIsAddSkuOpen(false);
          }}
        />
      )}
 
      {editingSku && (
        <ProductDetailSkuEditModal
          productId={product.productId}
          productImages={product.images || []}
          sku={{
            skuId: editingSku.skuId,
            skuCode: editingSku.skuCode,
            priceMinor: editingSku.priceMinor,
            isActive: editingSku.isActive,
            options: editingSku.options?.map((o) => ({
              attributeId: o.attributeId,
              attributeName: o.attributeName ?? `#${o.attributeId}`,
              value: o.value,
            })) ?? [],
          }}
          attributeOptions={variantAttrOptions}
          onClose={() => setEditingSkuId(null)}
          onSave={async ({ skuPayload, imagesPayload }) => {
            await handleSaveSku(editingSku.skuId)(skuPayload);
            if (imagesPayload) {
              await upsertImages.mutateAsync({
                id: product.productId,
                payload: {
                  images: imagesPayload
                }
              });
            }
          }}
        />
      )}
    </>
  );
}



