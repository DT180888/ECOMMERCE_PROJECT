import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useAttributeDetail,
  useCreateAttribute,
  useUpdateAttribute,
} from "@entities/attribute/hooks";
import type { AttributeId } from "@entities/attribute/types";
import { DATA_TYPE_OPTIONS, toBEDataType, fromBEDataType } from "@entities/attribute/adapter";
import { Input, Button } from "@my-project/ui";

// 1. Import ReactSelect và Style chung
import ReactSelect from "react-select";
import { reactSelectDarkStyles } from "@my-project/ui";

type FormValues = {
  name: string;
  slug: string;
  dataTypeKey: "Text" | "Number" | "Bool" | "Date" | "Select" | "Multiselect"; // ⬅️ key FE
  unit?: string;
  isFilterable: boolean;
  isVariant: boolean;
};

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
   .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

export function AttributeForm() {
  const nav = useNavigate();
  const { "*": idParam } = useParams();
  const isCreate = idParam === "new";
  const id = !isCreate ? (Number(idParam) as AttributeId) : undefined;

  const { data, isLoading } = useAttributeDetail(id, { enabled: !!id });
  const createMut = useCreateAttribute();
  const updateMut = useUpdateAttribute();

  // 2. Thêm setValue để xử lý ReactSelect
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      name: "",
      slug: "",
      dataTypeKey: "Text",
      unit: "",
      isFilterable: true,
      isVariant: false,
    },
    mode: "onBlur",
  });

  // Auto slug khi tạo
  const nameVal = watch("name");
  useEffect(() => {
    if (isCreate) setValue("slug", slugify(nameVal || ""), { shouldDirty: true });
  }, [nameVal, isCreate, setValue]);

  // Nạp dữ liệu khi update
  useEffect(() => {
    if (!isCreate && data) {
      reset({
        name: data.name,
        slug: data.slug,
        dataTypeKey: fromBEDataType(data.dataType), // ⬅️ map số → key
        unit: data.unit ?? "",
        isFilterable: data.isFilterable,
        isVariant: data.isVariant,
      });
    }
  }, [isCreate, data, reset]);

  const onSubmit = async (v: FormValues) => {
    const payload = {
      name: v.name.trim(),
      slug: v.slug.trim(),
      dataType: toBEDataType(v.dataTypeKey), // ⬅️ map key → số
      unit: v.unit?.trim() || null,
      isFilterable: v.isFilterable,
      isVariant: v.isVariant,
    };
    if (isCreate) {
      await createMut.mutateAsync(payload);
    } else {
      await updateMut.mutateAsync({ id: id!, payload });
    }
    nav("/admin/catalog-settings");
  };

  if (!isCreate && isLoading) return <div className="p-4 text-foreground">Đang tải…</div>;

  // Ẩn/hiện unit theo dataType (gợi ý UX)
  const dt = watch("dataTypeKey");
  const showUnit = dt === "Number" || dt === "Select" || dt === "Multiselect";

  return (
     <div
      className="mx-auto p-3 bg-card border border-foreground/[0.04] dark:border-white/[0.05] shadow-neo-sm h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth 
                  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] rounded-card"
      >

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl text-foreground font-semibold">{isCreate ? "Tạo Attribute" : "Sửa Attribute"}</h1>
          <Link to="/admin/catalog-settings" className="underline text-muted hover:text-foreground text-base transition-colors">Quay lại</Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-4">
          <div className="flex flex-col gap-4 space-y-4">
            <div className="flex items-center gap-3">
              <label className="text-base text-foreground w-24 shrink-0">Tên</label>
              <div className="w-full">
                <Input {...register("name", { required: "Bắt buộc" })} placeholder="VD: Màu sắc" error={!!errors.name}/>
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-base text-foreground w-24 shrink-0">Slug</label>
              <div className="w-full">
                <Input {...register("slug", { required: "Bắt buộc" })} placeholder="vd: mau-sac" error={!!errors.slug}/>
                {errors.slug && <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>}
              </div>
            </div>

             <div className="flex items-center gap-3">
              <label className="text-base text-foreground w-24 shrink-0">Kiểu dữ liệu</label>
              <div className="w-full">
                {/* 3. Sử dụng ReactSelect thay vì Select native */}
                <ReactSelect 
                    value={DATA_TYPE_OPTIONS.find(o => o.value === watch("dataTypeKey"))}
                    onChange={(val: any) => setValue("dataTypeKey", val?.value)}
                    options={DATA_TYPE_OPTIONS}
                    styles={reactSelectDarkStyles} // Áp dụng Style chung
                    menuPortalTarget={document.body}
                    placeholder="Chọn kiểu dữ liệu"
                />
              </div>
            </div>

            {showUnit && (
              <div className="flex items-center gap-3">
                <label className="text-base text-foreground w-24 shrink-0">Đơn vị</label>
                <Input {...register("unit")} placeholder="vd: GB, cm, kg…" className="w-full"/>
              </div>
            )}

            <div className="flex flex-col gap-2 ml-24 pt-2">
                <label className="flex items-center gap-2 text-foreground cursor-pointer">
                <input type="checkbox" {...register("isFilterable")} className="w-3 h-3 md:w-4 md:h-4 rounded border-foreground/[0.08] dark:border-white/[0.08] text-accent focus:ring-accent/30 bg-transparent" />
                <span>Có dùng làm bộ lọc</span>
                </label>

                <label className="flex items-center gap-2 text-foreground cursor-pointer">
                <input type="checkbox" {...register("isVariant")} className="w-3 h-3 md:w-4 md:h-4 rounded border-foreground/[0.08] dark:border-white/[0.08] text-accent focus:ring-accent/30 bg-transparent" />
                <span>Dùng để phân loại (variant)</span>
                </label>
            </div>
          </div>

          <div className="flex gap-2 pt-4 ml-24">
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isCreate ? "Tạo và Lưu" : "Lưu Thay Đổi"}
            </Button>
            <Link to="/admin/catalog-settings">
              <Button type="button" variant="outline" className="bg-transparent text-foreground border-foreground/[0.08] dark:border-white/[0.08] hover:bg-foreground/5">Hủy</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
