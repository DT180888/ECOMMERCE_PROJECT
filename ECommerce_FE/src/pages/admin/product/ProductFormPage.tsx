import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProductDetail, useCreateProduct, useUpdateProduct } from "@entities/product/hooks";
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
import { Input } from "@shared/ui/Input";
import { Select } from "@shared/ui/Select";
import { TextArea } from "@shared/ui/TextArea";
import { Button } from "@shared/ui/Button";
import ImageUploader from "@widgets/Uploader/ImageUploader";

type BasicForm = {
  name: string;
  slug: string;
  description?: string;
  status: ProductStatus;
  brandId?: string;
  categoryIds: string[]; // checkbox list
};

type SkuRow = { skuId?: number; skuCode: string; priceMinor: number; isActive: boolean };
type ImageRow = { url: string; isPrimary?: boolean; sortOrder?: number };
type AttrRow = { attributeId: number; valueText?: string; valueNumber?: number; valueBool?: boolean };

type FormValues = BasicForm & {
  skus: SkuRow[];
  images: ImageRow[];
  attributes: AttrRow[];
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const BASE_URL = "https://localhost:7051";
const buildImgSrc = (u: string) => (u?.startsWith("http") ? u : `${BASE_URL}${u}`);

export default function ProductFormPage() {
  const nav = useNavigate();
  const { "*": idParam } = useParams(); // '/admin/product/new' or '/admin/product/:id'
  const isCreate = idParam === "new";
  const id = !isCreate ? (Number(idParam) as Id) : undefined;

  const { options: brandOptions } = useBrandOptions();
  const { options: categoryOptions } = useCategoryOptions();

  const { data, isLoading } = useProductDetail(id, { enabled: !!id });
  const createMut = useCreateProduct();
  const updateMut = useUpdateProduct();

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      status: 1,
      brandId: "",
      categoryIds: [],
      skus: [{ skuCode: "", priceMinor: 0, isActive: true }],
      images: [], // không có ảnh mẫu
      attributes: [],
    },
  });

  // Field arrays
  const skusFA = useFieldArray({ control, name: "skus" });
  const imagesFA = useFieldArray({ control, name: "images" });
  const attrsFA = useFieldArray({ control, name: "attributes" });

  // Auto slug khi tạo
  useEffect(() => {
    if (isCreate) {
      const subscription = watch((v, { name }) => {
        if (name === "name") {
          reset((cur) => ({ ...cur, slug: slugify(v.name || "") }));
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [isCreate, reset, watch]);

  // Nạp dữ liệu khi update bằng reset()
  useEffect(() => {
    if (!isCreate && data) {
      const mapped: FormValues = {
        name: data.name,
        slug: data.slug,
        description: data.description ?? "",
        status: data.status,
        brandId: data.brandId ? String(data.brandId) : "",
        categoryIds: data.categoryIds.map(String),
        skus: data.skus.map((s) => ({
          skuId: s.skuId,
          skuCode: s.skuCode,
          priceMinor: s.priceMinor,
          isActive: s.isActive,
        })),
        images: data.images
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((i, idx) => ({
            url: i.url,
            isPrimary: i.isPrimary,
            sortOrder: i.sortOrder ?? idx + 1,
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

  // Callback: thêm ảnh sau upload (không còn ảnh mẫu)
  const onImagesUploaded = (items: { url: string }[]) => {
    const hadImages = imagesFA.fields.length > 0;
    const baseIndex = imagesFA.fields.length;
    items.forEach((it, i) => {
      const index = baseIndex + i;
      imagesFA.append({
        url: it.url,
        isPrimary: hadImages ? false : i === 0,
        sortOrder: index + 1,
      });
    });
  };

  const onSubmit = async (v: FormValues) => {
    const categoryIds = (v.categoryIds || []).map((x) => Number(x));

    const images: ProductImageUpsert[] = (v.images || []).map((i, idx) => ({
      url: i.url,
      isPrimary: i.isPrimary ?? false,
      sortOrder: i.sortOrder ?? idx + 1,
    }));
    // Fallback: nếu không có ảnh nào primary, gán ảnh đầu
    if (images.length > 0 && !images.some((x) => x.isPrimary)) {
      images[0].isPrimary = true;
    }

    const attributes: ProductAttributeUpsert[] = (v.attributes || []).map((a) => ({
      attributeId: Number(a.attributeId),
      valueText: a.valueText ?? null,
      valueNumber: a.valueNumber ?? null,
      valueBool: typeof a.valueBool === "boolean" ? a.valueBool : null,
    }));

    if (isCreate) {
      const skus: ProductSkuCreate[] = (v.skus || []).map((s) => ({
        skuCode: s.skuCode,
        priceMinor: Number(s.priceMinor),
        isActive: !!s.isActive,
      }));
      await createMut.mutateAsync({
        name: v.name,
        slug: v.slug,
        description: v.description ?? "",
        status: v.status,
        brandId: v.brandId ? Number(v.brandId) : null,
        skus,
        images,
        categoryIds,
        attributes,
      });
    } else {
      const skus: ProductSkuUpdate[] = (v.skus || []).map((s) => ({
        skuId: Number(s.skuId),
        skuCode: s.skuCode,
        priceMinor: Number(s.priceMinor),
        isActive: !!s.isActive,
      }));
      await updateMut.mutateAsync({
        id: id!,
        payload: {
          name: v.name,
          slug: v.slug,
          description: v.description ?? "",
          status: v.status,
          brandId: v.brandId ? Number(v.brandId) : null,
          skus,
          images,
          categoryIds,
          attributes,
        },
      });
    }
    nav("/admin/product");
  };

  if (!isCreate && isLoading) return <div className="p-4">Đang tải...</div>;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{isCreate ? "Tạo Product" : "Sửa Product"}</h1>
        <Link to="/admin/product" className="underline">Quay lại</Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Cơ bản */}
        <section className="space-y-4">
          <h2 className="font-medium text-lg">Thông tin cơ bản</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Tên</label>
              <Input
                {...register("name", { required: "Bắt buộc" })}
                placeholder="VD: iPhone 15"
                error={!!errors.name}
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600">Slug</label>
              <Input
                {...register("slug", { required: "Bắt buộc" })}
                placeholder="vd: iphone-15"
                error={!!errors.slug}
              />
              {errors.slug && <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600">Trạng thái</label>
              <Select {...register("status" as any)}>
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Brand</label>
              <Select {...register("brandId")}>
                <option value="">-- Chọn brand --</option>
                {brandOptions.map((o) => (
                  <option key={o.value} value={String(o.value)}>{o.label}</option>
                ))}
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Mô tả</label>
              <TextArea {...register("description")} rows={5} placeholder="Mô tả ngắn..." />
            </div>
          </div>
        </section>

        {/* Category (multi) */}
        <section className="space-y-2">
          <h2 className="font-medium text-lg">Danh mục</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-3 rounded-xl border">
            {categoryOptions.map((o) => {
              const val = String(o.value);
              const checked = watch("categoryIds").includes(val);
              return (
                <label key={val} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const cur = new Set(watch("categoryIds"));
                      if (e.target.checked) cur.add(val);
                      else cur.delete(val);
                      setValue("categoryIds", Array.from(cur));
                    }}
                  />
                  <span>{o.label}</span>
                </label>
              );
            })}
          </div>
        </section>

        {/* SKUs */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-lg">SKUs</h2>
            <Button
              type="button"
              variant="outline"
              onClick={() => skusFA.append({ skuCode: "", priceMinor: 0, isActive: true })}
            >
              + Thêm SKU
            </Button>
          </div>
          <div className="space-y-3">
            {skusFA.fields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 rounded-xl border">
                {!isCreate && (
                  <div>
                    <label className="text-sm text-gray-600">SKU ID</label>
                    <Input {...register(`skus.${idx}.skuId` as const)} readOnly placeholder="-" />
                  </div>
                )}
                <div>
                  <label className="text-sm text-gray-600">SKU code</label>
                  <Input
                    {...register(`skus.${idx}.skuCode` as const, { required: "Bắt buộc" })}
                    placeholder="VD: IP15-128"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Giá (minor)</label>
                  <Input
                    type="number"
                    min={0}
                    {...register(`skus.${idx}.priceMinor` as const, { valueAsNumber: true })}
                    placeholder="VD: 2999000000"
                  />
                </div>
                <div className="flex items-end justify-between gap-2">
                  <label className="text-sm text-gray-600 flex items-center gap-2">
                    <input type="checkbox" {...register(`skus.${idx}.isActive` as const)} />
                    Active
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => skusFA.remove(idx)}
                    disabled={skusFA.fields.length <= 1}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Images + Uploader (preview only) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-lg">Hình ảnh</h2>
          </div>

          <ImageUploader onUploaded={(items) => {
            const hadImages = imagesFA.fields.length > 0;
            const baseIndex = imagesFA.fields.length;
            items.forEach((it, i) => {
              const index = baseIndex + i;
              imagesFA.append({
                url: it.url,
                isPrimary: hadImages ? false : i === 0,
                sortOrder: index + 1,
              });
            });
          }} />

          {imagesFA.fields.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600">
              Chưa có ảnh — hãy kéo & thả hoặc bấm để upload.
            </div>
          )}

          {imagesFA.fields.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {imagesFA.fields.map((field, idx) => {
                const isPrimary = watch(`images.${idx}.isPrimary`);
                const url = watch(`images.${idx}.url`);
                return (
                  <div
                    key={field.id}
                    className={`relative group border rounded-xl overflow-hidden ${
                      isPrimary ? "ring-2 ring-purple-500" : "hover:ring-1 hover:ring-gray-400"
                    }`}
                  >
                    <img
                      src={buildImgSrc(url)}
                      alt={`Ảnh ${idx + 1}`}
                      className="object-cover w-full aspect-square"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }}
                    />

                    <div className="absolute inset-0 flex items-end justify-between opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/40 via-black/10 to-transparent p-2">
                      <button
                        type="button"
                        className={`px-2 py-1 text-xs rounded-md ${
                          isPrimary ? "bg-purple-600 text-white" : "bg-white/80 text-gray-800 hover:bg-white"
                        }`}
                        onClick={() => {
                          imagesFA.fields.forEach((_, j) =>
                            setValue(`images.${j}.isPrimary`, j === idx)
                          );
                        }}
                      >
                        {isPrimary ? "Primary" : "Đặt làm chính"}
                      </button>

                      <button
                        type="button"
                        className="px-2 py-1 text-xs bg-white/80 text-red-600 rounded-md hover:bg-white"
                        onClick={() => imagesFA.remove(idx)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Attributes */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-lg">Thuộc tính</h2>
            <Button
              type="button"
              variant="outline"
              onClick={() => attrsFA.append({ attributeId: 0, valueText: "" })}
            >
              + Thêm thuộc tính
            </Button>
          </div>
          <div className="space-y-3">
            {attrsFA.fields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 rounded-xl border">
                <div>
                  <label className="text-sm text-gray-600">Attribute ID</label>
                  <Input
                    type="number"
                    min={1}
                    {...register(`attributes.${idx}.attributeId` as const, { valueAsNumber: true })}
                    placeholder="VD: 101"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Text</label>
                  <Input {...register(`attributes.${idx}.valueText` as const)} placeholder="VD: Màu đen" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Number</label>
                  <Input
                    type="number"
                    {...register(`attributes.${idx}.valueNumber` as const, { valueAsNumber: true })}
                    placeholder="VD: 128"
                  />
                </div>
                <div className="flex items-end justify-between">
                  <label className="text-sm text-gray-600 flex items-center gap-2">
                    <input type="checkbox" {...register(`attributes.${idx}.valueBool` as const)} />
                    Bool
                  </label>
                  <Button type="button" variant="outline" onClick={() => attrsFA.remove(idx)}>
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting || isLoading}>
            {isCreate ? "Tạo" : "Lưu"}
          </Button>
          <Link to="/admin/product">
            <Button type="button" variant="outline">Hủy</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
