import React, { useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@my-project/ui";
import { Button } from "@my-project/ui";
import { Input } from "@my-project/ui";
import { Checkbox } from "@my-project/ui";
import { useAttributeOptions } from "@hooks/useAttribute";
import { useCreateSku } from "@hooks/useSku";
import { Tabs, TabsList, TabsTrigger } from "@my-project/ui";
import { 
    XMarkIcon, 
    PlusIcon, 
    TrashIcon, 
    CubeIcon, 
    TableCellsIcon, 
    SwatchIcon 
} from "@heroicons/react/24/outline";

// 1. Import ReactSelect và Styles
import ReactSelect from "react-select";
import { reactSelectDarkStyles } from "@my-project/ui";

// 2. Import Toast
import { useToast } from "@my-project/ui";
import { AdminTable, type AdminTableColumn } from "@shared/ui";
import ImageUploader from "@components/common/ImageUploader";
import { useProductDetail, useUpsertProductImages } from "@hooks/useProduct";

// ==== Types ====
type AttrOption = { value: number | string; label: string };
type SkuOptionForm = { attributeId: number; value: string };

type QuickForm = {
  skuCode: string;
  priceMinor: number;
  isActive: boolean;
  options: SkuOptionForm[];
};

type MatrixVariant = {
  attributeId: number;
  valuesText: string; 
};

type MatrixForm = {
  basePriceMinor: number;
  isActive: boolean;
  codePattern: string; 
  variants: MatrixVariant[];
};

type ExistingSku = { skuCode: string; options: { attributeId: number; value: string }[] };

type Props = {
  productId: number;
  productSlug?: string;
  existingSkus?: ExistingSku[];
  onClose: () => void;
  onCreated?: (count: number) => void;
};

// ==== Helpers ====
function normalizeStr(s: string) {
  return (s ?? "").trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/\s+/g, " ");
}

function signature(options?: { attributeId: number; value: string }[]) {
  const parts = (options ?? [])
    .map(o => ({ id: o.attributeId, v: normalizeStr(o.value) }))
    .sort((a, b) => (a.id - b.id) || a.v.localeCompare(b.v))
    .map(x => `${x.id}=${x.v}`);
  return parts.join("|");
}

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr)) as T[];
}

function splitValues(valuesText: string) {
  return unique(valuesText.split(",").map(v => v.trim()).filter(Boolean));
}

function buildSkuCode(pattern: string, ctx: { index: number; slug?: string; values: string[] }) {
  let code = pattern || "{SLUG}-{VALUES}";
  code = code.replace(/{INDEX}/g, String(ctx.index + 1));
  code = code.replace(/{SLUG}/g, (ctx.slug ?? "").toUpperCase());
  code = code.replace(/{VALUES}/g, ctx.values.map(v => v.toUpperCase().replace(/\s+/g, "")).join("-"));
  return code.replace(/--+/g, "-").replace(/^-+|-+$/g, "");
}
// Style override để Select nhỏ gọn hơn
const compactSelectStyles = {
    ...reactSelectDarkStyles,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: (base: any, state: any) => ({
        ...reactSelectDarkStyles.control!(base, state),
        minHeight: '36px',
        height: '36px',
        fontSize: '0.875rem',
        backgroundColor: 'hsl(var(--card))',
        borderColor: 'hsl(var(--foreground) / 0.08)',
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    valueContainer: (base: any) => ({
        ...base,
        padding: '0 8px',
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dropdownIndicator: (base: any) => ({
        ...base,
        padding: '4px',
    }),
};

// ==== Component ====
export function ProductDetailSkuAddModal({ productId, productSlug, existingSkus = [], onClose, onCreated }: Props) {
  const [tab, setTab] = useState<"quick" | "matrix">("quick");
  const createSku = useCreateSku(productId);
  const [priceOverrides, setPriceOverrides] = useState<Record<number, number>>({});
  const toast = useToast();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { data: product } = useProductDetail(productId);
  const upsertImages = useUpsertProductImages();

  const { raw: allAttrs } = useAttributeOptions({ page: 1, size: 500 });
  const variantAttrs = useMemo(() => (allAttrs ?? []).filter(a => a.isVariant), [allAttrs]);
  const variantAttrOptions: AttrOption[] = useMemo(
    () => variantAttrs.map(a => ({ value: a.attributeId, label: a.name })),
    [variantAttrs]
  );

  // ================= Quick Tab =================
  const quickForm = useForm<QuickForm>({
    defaultValues: { skuCode: "", priceMinor: 0, isActive: true, options: [] },
  });
  const quickOptsFA = useFieldArray({ control: quickForm.control, name: "options" });

  const quickFormValues = quickForm.watch();
  const quickErrors = useMemo(() => {
    const v = quickFormValues;
    const errs: string[] = [];
    if (!v.skuCode?.trim()) errs.push("Mã SKU không được để trống.");
    const sig = signature(v.options);
    if (!sig) errs.push("Cần chọn ít nhất 1 thuộc tính biến thể.");
    const existCode = new Set((existingSkus ?? []).map(s => s.skuCode.trim()));
    if (v.skuCode && existCode.has(v.skuCode.trim())) errs.push("Mã SKU này đã tồn tại.");
    const existSig = new Set((existingSkus ?? []).map(s => signature(s.options)));
    if (existSig.has(sig)) errs.push("Tổ hợp thuộc tính này đã tồn tại.");
    
    // Check duplicate attr
    const seen = new Set<number>();
    for (const o of v.options || []) {
      if (seen.has(o.attributeId)) errs.push("Trùng thuộc tính biến thể.");
      seen.add(o.attributeId);
    }
    return unique(errs);
  }, [quickFormValues, existingSkus]);

  const submitQuick = async (fv: QuickForm) => {
    if (quickErrors.length) {
        toast.error("Vui lòng kiểm tra lại thông tin biểu mẫu.");
        return;
    }
    try {
        await createSku.mutateAsync({
          skuCode: fv.skuCode.trim(),
          priceMinor: Number(fv.priceMinor) || 0,
          isActive: !!fv.isActive,
          options: (fv.options || []).filter(o => o.attributeId && o.value?.trim())
            .map(o => ({ attributeId: Number(o.attributeId), value: o.value.trim() })),
        });
        
        // --- UPLOAD IMAGE ---
        if (imageUrls.length > 0) {
            const currentImages = product?.images || [];
            await upsertImages.mutateAsync({
                id: productId,
                payload: {
                    images: [
                        ...currentImages.map(img => ({
                            url: img.url,
                            isPrimary: img.isPrimary,
                            sortOrder: img.sortOrder,
                            skuCode: img.skuCode || null,
                        })),
                        ...imageUrls.map((url, idx) => ({
                            url,
                            isPrimary: currentImages.length === 0 && idx === 0,
                            sortOrder: currentImages.length + idx + 1,
                            skuCode: fv.skuCode.trim(),
                        }))
                    ]
                }
            });
        }

        toast.success("Tạo SKU thành công!");
        onCreated?.(1);
        onClose();
    } catch (error: any) {
              toast.error(error?.message || "Lỗi khi tạo SKU.");
          }
  };

  // ================= Matrix Tab =================
  const matrixForm = useForm<MatrixForm>({
    defaultValues: {
      basePriceMinor: 0,
      isActive: true,
      codePattern: "{SLUG}-{VALUES}",
      variants: [],
    },
  });
  const variantsFA = useFieldArray({ control: matrixForm.control, name: "variants" });

  const matrixFormValues = matrixForm.watch();
  const combos = useMemo(() => {
    const v = matrixFormValues;
    const picked = (v.variants || [])
      .filter(x => x.attributeId && x.valuesText?.trim())
      .map(x => ({
        attributeId: Number(x.attributeId),
        attributeName: variantAttrs.find(a => a.attributeId === Number(x.attributeId))?.name ?? `#${x.attributeId}`,
        values: splitValues(x.valuesText),
      }))
      .filter(x => x.values.length > 0);

    if (picked.length === 0) return [];

    const result: { values: { attributeId: number; attributeName: string; value: string }[]; skuCode: string; priceMinor: number; isActive: boolean; }[] = [];
    const recur = (idx: number, cur: { attributeId: number; attributeName: string; value: string }[]) => {
      if (idx === picked.length) {
        const vals = cur.map(c => c.value);
        const code = buildSkuCode(v.codePattern, { index: result.length, slug: productSlug, values: vals });
        result.push({ values: cur.slice(), skuCode: code, priceMinor: Number(v.basePriceMinor) || 0, isActive: v.isActive });
        return;
      }
      for (const val of picked[idx].values) {
        recur(idx + 1, [...cur, { attributeId: picked[idx].attributeId, attributeName: picked[idx].attributeName, value: val }]);
      }
    };
    recur(0, []);
    return result;
  }, [matrixFormValues, variantAttrs, productSlug]);

  const matrixErrors = useMemo(() => {
    const errs: string[] = [];
    if ((variantsFA.fields || []).length === 0) errs.push("Vui lòng thêm ít nhất 1 dòng thuộc tính.");
    
    const codeCount: Record<string, number> = {};
    const sigSetExisting = new Set((existingSkus ?? []).map(s => signature(s.options)));
    const codeSetExisting = new Set((existingSkus ?? []).map(s => s.skuCode.trim()));

    for (const c of combos) {
      const code = c.skuCode.trim();
      codeCount[code] = (codeCount[code] || 0) + 1;
      const sig = signature(c.values.map((v: { attributeId: number, value: string }) => ({ attributeId: v.attributeId, value: v.value })));
      if (sigSetExisting.has(sig)) errs.push(`Tổ hợp thuộc tính trùng lặp (SKU cũ).`);
      if (codeSetExisting.has(code)) errs.push(`Mã SKU trùng lặp (SKU cũ).`);
    }
    
    const dupCodes = Object.entries(codeCount).filter(([, n]) => n > 1);
    if (dupCodes.length) errs.push("Mã SKU bị trùng lặp trong danh sách mới tạo.");

    const attrIds = (matrixFormValues.variants || []).map(v => Number(v.attributeId)).filter(Boolean);
    if (attrIds.length !== new Set(attrIds).size) errs.push("Các thuộc tính ma trận bị trùng lặp.");

    return unique(errs);
  }, [combos, existingSkus, variantsFA.fields, matrixFormValues]);

  const submitMatrix = async () => {
    if (matrixErrors.length) {
        toast.error("Vui lòng kiểm tra lại các lỗi của ma trận.");
        return;
    }
    try {
        for (const [i, c] of combos.entries()) {
          await createSku.mutateAsync({
            skuCode: c.skuCode,
            priceMinor: priceOverrides[i] ?? c.priceMinor,
            isActive: c.isActive,
            options: c.values.map((v: { attributeId: number, value: string }) => ({ attributeId: v.attributeId, value: v.value })),
          });
        }
        toast.success(`Đã tạo thành công ${combos.length} SKU.`);
        onCreated?.(combos.length);
        onClose();
    } catch (error: any) {
              toast.error(error?.message || "Lỗi khi tạo hàng loạt.");
          }
  };

  const matrixColumns: AdminTableColumn<any>[] = useMemo(
    () => [
      {
        key: "index",
        label: "#",
        width: "48px",
        render: (_, i) => <span className="text-muted-foreground font-mono">{i + 1}</span>,
      },
      {
        key: "skuCode",
        label: "Mã SKU",
        isMain: true,
        render: (c) => <span className="font-mono text-foreground font-medium">{c.skuCode}</span>,
      },
      {
        key: "price",
        label: "Giá bán",
        align: "right",
        width: "140px",
        render: (c, i) => (
          <Input
            type="number"
            min={0}
            value={priceOverrides[i] ?? c.priceMinor}
            onChange={(e) => {
              const v = Number(e.target.value);
              setPriceOverrides((prev) => ({ ...prev, [i]: isNaN(v) ? 0 : v }));
            }}
            className="h-7 text-xs bg-card border-border/80 focus:ring-accent/30 text-right px-2 text-foreground font-mono font-bold"
          />
        ),
      },
      {
        key: "variants",
        label: "Chi tiết biến thể",
        align: "right",
        render: (c) => (
          <span className="text-muted-foreground text-right font-medium">
            {c.values.map((v: { value: string }) => v.value).join(" / ")}
          </span>
        ),
      },
    ],
    [priceOverrides]
  );

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent noClose className="max-w-3xl p-0 overflow-hidden flex flex-col max-h-[90vh] bg-card rounded-[2px] border border-border/60 shadow-none">
        {/* Header (Horizon strip baseline h-11) */}
        <div className="h-11 px-4 flex items-center justify-between bg-surface border-b border-border/60 shrink-0 select-none">
          <div>
             <DialogTitle className="text-xs font-medium font-sans uppercase tracking-[0.16em] text-foreground">Thêm SKU Mới</DialogTitle>
          </div>
          <Button variant="ghost" onClick={onClose} size="icon" className="text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded-[2px] w-6 h-6 p-0 transition-colors">
             <XMarkIcon className="w-3.5 h-3.5 stroke-[1.25]" />
          </Button>
        </div>

        <div className="p-4 overflow-y-auto custom-scrollbar flex-1 bg-card">
            <Tabs defaultValue="quick" onValueChange={(v) => setTab(v as "quick" | "matrix")}>
            {/* Tabs Nav */}
            <TabsList className="w-full mb-4">
                <TabsTrigger value="quick" className="flex-1">
                    <CubeIcon className="w-3.5 h-3.5" /> Tạo Đơn Lẻ
                </TabsTrigger>
                <TabsTrigger value="matrix" className="flex-1">
                    <TableCellsIcon className="w-3.5 h-3.5" /> Tạo Hàng Loạt (Matrix)
                </TabsTrigger>
            </TabsList>
 
            {tab === "quick" ? (
                <form onSubmit={quickForm.handleSubmit(submitQuick)} className="space-y-4">
                {/* Nội dung form Quick */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface/30 rounded-[2px] border border-border/60 p-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Mã SKU <span className="text-error">*</span></label>
                        <Input {...quickForm.register("skuCode", { required: true })} placeholder="VD: IP15-RED-128" className="font-mono text-foreground bg-card border-border/60 focus:border-foreground" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Giá bán (VND)</label>
                        <Input type="number" min={0} {...quickForm.register("priceMinor", { valueAsNumber: true })} className="text-foreground font-bold text-right font-mono bg-card border-border/60 focus:border-foreground" />
                    </div>
                    <div className="md:col-span-2 pt-2">
                        <label className="inline-flex items-center gap-2 text-xs text-foreground cursor-pointer select-none bg-surface/50 px-3 py-1.5 rounded-[2px] border border-border/60 hover:bg-surface transition-colors">
                            <Checkbox {...quickForm.register("isActive")} /> 
                            Kích hoạt ngay
                        </label>
                    </div>
                </div>

                <div className="space-y-2 bg-surface/30 p-4 rounded-[2px] border border-border/60">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                        Hình ảnh biến thể
                    </label>
                    <ImageUploader 
                     multiple={false}   
                    maxFiles={1}
                        onUploaded={(items) => {
                            const newUrls = items.map(i => i.url);
                            setImageUrls(prev => [...prev, ...newUrls]);
                        }} 
                    />
                    {imageUrls.length > 0 && (
                        <div className="flex gap-2 mt-4 flex-wrap">
                            {imageUrls.map((url, i) => (
                                <div key={i} className="relative w-16 h-16 rounded-[2px] overflow-hidden border border-border/60">
                                    <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                                    <Button 
                                        type="button" 
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setImageUrls(prev => prev.filter((_, idx) => idx !== i))}
                                        className="absolute top-1 right-1 h-5 w-5 bg-foreground/60 text-background rounded-[2px] p-0 hover:bg-error hover:text-white transition-colors"
                                    >
                                        <XMarkIcon className="w-3 h-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <SwatchIcon className="w-3 h-3 md:w-4 md:h-4 text-accent" /> Thuộc tính biến thể
                        </div>
                        <Button type="button" variant="outline" size="default" onClick={() => quickOptsFA.append({ attributeId: 0, value: "" })}
                        className="text-xs h-8 text-muted-foreground hover:text-foreground hover:bg-muted/10 border-border/60 rounded-[2px] transition-colors">
                            <PlusIcon className="w-3 h-3 mr-1"/> Thêm thuộc tính
                        </Button>
                    </div>
                    
                    <div className="bg-surface/30 rounded-[2px] border border-border/60 p-4 min-h-[100px]">
                        {quickOptsFA.fields.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-4 text-xs italic">
                                <span>Chưa có thuộc tính nào được cấu hình (VD: Màu sắc, Kích thước).</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            {quickOptsFA.fields.map((o, idx) => (
                                <div key={o.id} className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center animate-in slide-in-from-left-2 duration-200">
                                    <div className="md:col-span-3">
                                        <ReactSelect
                                            value={variantAttrOptions.find(opt => String(opt.value) === String(quickForm.watch(`options.${idx}.attributeId`) || ""))}
                                            onChange={(val: unknown) => {
                                                const opt = val as AttrOption | null;
                                                quickForm.setValue(`options.${idx}.attributeId`, Number(opt?.value));
                                            }}
                                            options={variantAttrOptions}
                                            styles={compactSelectStyles}
                                            placeholder="Chọn thuộc tính..."
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <Input {...quickForm.register(`options.${idx}.value` as const)} placeholder="Giá trị (VD: Đỏ)" className="h-8 text-xs bg-card border-border/60 focus:border-foreground" />
                                    </div>
                                    <div className="md:col-span-1 flex justify-end">
                                        <Button type="button" variant="ghost" onClick={() => quickOptsFA.remove(idx)} className="h-8 w-8 p-0 text-muted-foreground hover:text-error hover:bg-error/10 rounded-[2px] transition-colors">
                                            <TrashIcon className="w-3.5 h-3.5 stroke-[1.25]" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {quickErrors.length > 0 && (
                    <div className="flex flex-col gap-1 text-xs text-error mt-2">
                    {unique(quickErrors).map((m, i) => (<span key={i}>⚠️ {m}</span>))}
                    </div>
                )}

                <div className="pt-2 flex justify-end">
                    <Button type="submit" disabled={createSku.isPending} variant="default" className="h-8 px-4 font-medium transition-all rounded-[2px] text-xs">
                        {createSku.isPending ? "Đang tạo..." : "Tạo SKU"}
                    </Button>
                </div>
                </form>
            ) : (
                <form onSubmit={matrixForm.handleSubmit(submitMatrix)} className="space-y-4">
                    {/* Nội dung form Matrix */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface/30 rounded-[2px] border border-border/60 p-4">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cấu trúc Mã SKU</label>
                            <Input {...matrixForm.register("codePattern")} placeholder="{SLUG}-{VALUES}" className="text-foreground font-mono bg-card border-border/60 focus:border-foreground" />
                            <p className="text-[9px] text-muted-foreground font-mono">Tham biến hỗ trợ: {"{SLUG}"}, {"{VALUES}"}, {"{INDEX}"}</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Giá gốc (VND)</label>
                            <Input type="number" min={0} {...matrixForm.register("basePriceMinor", { valueAsNumber: true })} className="text-foreground font-bold text-right font-mono bg-card border-border/60 focus:border-foreground" />
                        </div>
                        <div className="flex items-center h-full pt-4">
                            <label className="text-xs text-foreground flex items-center gap-2 cursor-pointer select-none bg-surface/50 px-3 py-1.5 rounded-[2px] w-full justify-center transition-all hover:bg-surface border border-border/60">
                                <Checkbox {...matrixForm.register("isActive")} /> 
                                Kích hoạt ngay
                            </label>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <TableCellsIcon className="w-3.5 h-3.5 text-foreground" /> Ma trận thuộc tính tạo tự động
                            </div>
                             <Button type="button" variant="outline" size="default" onClick={() => variantsFA.append({ attributeId: 0, valuesText: "" })}
                            className="text-xs h-8 text-muted-foreground hover:text-foreground hover:bg-surface-hover border-border/60 rounded-[2px]">
                                <PlusIcon className="w-3 h-3 mr-1"/> Thêm dòng thuộc tính
                            </Button>
                        </div>

                        <div className="bg-surface/30 rounded-[2px] border border-border/60 p-4 space-y-3 min-h-[100px]">
                            {variantsFA.fields.length === 0 && <div className="text-xs text-muted-foreground italic text-center py-4">Chưa cấu hình ma trận thuộc tính nào.</div>}

                            {variantsFA.fields.map((f, idx) => (
                                <div key={f.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center animate-in slide-in-from-left-2 duration-200">
                                    <div className="md:col-span-4">
                                        <ReactSelect
                                            value={variantAttrOptions.find(opt => String(opt.value) === String(matrixForm.watch(`variants.${idx}.attributeId`) || ""))}
                                            onChange={(val: unknown) => {
                                                const opt = val as AttrOption | null;
                                                matrixForm.setValue(`variants.${idx}.attributeId`, Number(opt?.value));
                                            }}
                                            options={variantAttrOptions}
                                            styles={compactSelectStyles}
                                            placeholder="Chọn thuộc tính..."
                                        />
                                    </div>
                                    <div className="md:col-span-7">
                                        <Input {...matrixForm.register(`variants.${idx}.valuesText` as const)} placeholder="Giá trị cách nhau bằng dấu phẩy (VD: S, M, L)" className="bg-card text-xs border-border/60 focus:border-foreground" />
                                    </div>
                                    <div className="md:col-span-1 flex justify-end">
                                        <Button type="button" variant="ghost" onClick={() => variantsFA.remove(idx)} className="h-8 w-8 p-0 text-muted-foreground hover:text-error hover:bg-error/10 rounded-[2px] transition-colors">
                                            <TrashIcon className="w-3.5 h-3.5 stroke-[1.25]" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Preview Table */}
                    <div className="rounded-[2px] border border-border/60 bg-muted/5 overflow-hidden p-4">
                        <div className="flex items-center justify-between px-4 py-2 bg-muted/10 border-b border-foreground/[0.04] dark:border-white/[0.05]">
                            <div className="text-xs font-bold font-display text-accent uppercase tracking-wider">Xem trước kết quả ({combos.length})</div>
                        </div>

                        {combos.length > 0 ? (
                            <div className="max-h-56 overflow-auto custom-scrollbar border-t border-border/60">
                                <AdminTable
                                    columns={matrixColumns}
                                    data={combos}
                                    rowKey={(c: any) => c.skuCode}
                                />
                            </div>
                        ) : (
                            <div className="p-4 text-center text-xs text-muted-foreground italic">
                                Cấu hình các thuộc tính ở trên để xem trước danh sách SKU được tạo tự động.
                            </div>
                        )}
                    </div>

                    {matrixErrors.length > 0 && (
                        <div className="flex flex-col gap-1 text-xs text-error mt-2">
                            {unique(matrixErrors).map((m, i) => (<span key={i}>⚠️ {m}</span>))}
                        </div>
                    )}

                    <div className="pt-2 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={onClose} className="h-10 text-xs font-medium hover:bg-muted/10 border border-border/60 rounded-[2px] px-4">Hủy</Button>
                        <Button type="submit" disabled={createSku.isPending || matrixErrors.length > 0 || combos.length === 0} variant="default" className="h-10 px-6 font-medium hover:bg-primary/95 transition-all rounded-[2px] text-xs font-semibold">
                            {createSku.isPending ? "Đang tạo..." : `Tạo ${combos.length} SKU`}
                        </Button>
                    </div>
                </form>
            )}
            </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}





