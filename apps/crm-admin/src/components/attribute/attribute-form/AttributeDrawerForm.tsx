import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useAttributeDetail,
  useCreateAttribute,
  useUpdateAttribute,
  DATA_TYPE_OPTIONS,
  toBEDataType,
  fromBEDataType,
} from "@hooks/useAttribute";
import type { AttributeId } from "@my-project/api";
import {
  Input,
  Button,
  Label,
  reactSelectDarkStyles,
} from "@my-project/ui";
import { SplitPaneInspector } from "@components/common/SplitPaneInspector";
import ReactSelect from "react-select";

type FormValues = {
  name: string;
  slug: string;
  dataTypeKey: "Text" | "Number" | "Bool" | "Date" | "Select" | "Multiselect";
  unit?: string;
  isFilterable: boolean;
  isVariant: boolean;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

interface AttributeDrawerFormProps {
  open: boolean;
  attributeId: AttributeId | null;
  onClose: () => void;
}

export function AttributeDrawerForm({ open, attributeId, onClose }: AttributeDrawerFormProps) {
  const isCreate = attributeId === null;
  const { data, isLoading } = useAttributeDetail(attributeId ?? undefined, {
    enabled: !!attributeId,
  });

  const createMut = useCreateAttribute();
  const updateMut = useUpdateAttribute();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
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

  // Auto-generate slug when creating
  const nameVal = watch("name");
  useEffect(() => {
    if (isCreate) {
      setValue("slug", slugify(nameVal || ""), { shouldDirty: true });
    }
  }, [nameVal, isCreate, setValue]);

  // Load details when editing
  useEffect(() => {
    if (!isCreate && data) {
      reset({
        name: data.name,
        slug: data.slug,
        dataTypeKey: fromBEDataType(data.dataType),
        unit: data.unit ?? "",
        isFilterable: data.isFilterable,
        isVariant: data.isVariant,
      });
    } else if (isCreate) {
      reset({
        name: "",
        slug: "",
        dataTypeKey: "Text",
        unit: "",
        isFilterable: true,
        isVariant: false,
      });
    }
  }, [isCreate, data, reset]);

  const onSubmit = async (v: FormValues) => {
    try {
      const payload = {
        name: v.name.trim(),
        slug: v.slug.trim(),
        dataType: toBEDataType(v.dataTypeKey),
        unit: v.unit?.trim() || null,
        isFilterable: v.isFilterable,
        isVariant: v.isVariant,
      };

      if (isCreate) {
        await createMut.mutateAsync(payload);
      } else {
        await updateMut.mutateAsync({ id: attributeId!, payload });
      }
      onClose();
    } catch (err) {
      console.error("Lỗi lưu thuộc tính:", err);
    }
  };

  const isSaving = isSubmitting || createMut.isPending || updateMut.isPending;
  const dt = watch("dataTypeKey");
  const showUnit = dt === "Number" || dt === "Select" || dt === "Multiselect";

  return (
    <SplitPaneInspector
      open={open}
      onClose={onClose}
      title={isCreate ? "Thêm Thuộc Tính" : `Chỉnh Sửa Thuộc Tính #${attributeId}`}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSaving}
            fullWidthOnSm
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="attribute-split-form"
            variant="default"
            isLoading={isSaving}
            loadingText="Đang lưu..."
            fullWidthOnSm
          >
            {isCreate ? "Tạo thuộc tính" : "Lưu thay đổi"}
          </Button>
        </>
      }
    >
      {!isCreate && isLoading ? (
        <div className="py-12 text-center text-xs text-muted-foreground animate-pulse font-mono">
          Đang tải dữ liệu thuộc tính...
        </div>
      ) : (
        <form id="attribute-split-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Tên */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="attr-name" className="text-xs font-medium text-foreground">
              Tên thuộc tính <span className="text-destructive">*</span>
            </Label>
            <Input
              id="attr-name"
              {...register("name", { required: "Vui lòng nhập tên thuộc tính" })}
              placeholder="VD: Màu sắc, Kích cỡ, Dung lượng..."
              className="h-8 text-xs rounded-[2px] border-border/60"
              autoFocus
            />
            {errors.name && (
              <p className="text-[11px] text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="attr-slug" className="text-xs font-medium text-foreground">
              Đường dẫn (Slug) <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center bg-surface/50 border border-border/60 rounded-[2px] h-8 text-muted-foreground text-xs overflow-hidden focus-within:border-foreground transition-colors">
              <span className="pl-2.5 select-none text-muted-foreground pr-2 bg-surface h-full flex items-center font-mono text-xs shrink-0">
                /attr/
              </span>
              <Input
                id="attr-slug"
                {...register("slug", { required: "Vui lòng nhập slug" })}
                className="border-0 focus:border-0 rounded-none h-full shadow-none bg-transparent outline-none text-foreground flex-1 pr-2.5 placeholder-muted-foreground/50 font-mono text-xs"
                placeholder="mau-sac"
              />
            </div>
            {errors.slug && (
              <p className="text-[11px] text-destructive mt-1">{errors.slug.message}</p>
            )}
          </div>

          {/* Kiểu dữ liệu */}
          <div className="flex flex-col gap-1">
            <Label className="text-xs font-medium text-foreground">
              Kiểu dữ liệu <span className="text-destructive">*</span>
            </Label>
            <ReactSelect
              value={DATA_TYPE_OPTIONS.find((o) => o.value === watch("dataTypeKey"))}
              onChange={(val: any) => setValue("dataTypeKey", val?.value)}
              options={DATA_TYPE_OPTIONS}
              styles={reactSelectDarkStyles}
              menuPortalTarget={document.body}
              placeholder="Chọn kiểu dữ liệu..."
            />
          </div>

          {/* Đơn vị */}
          {showUnit && (
            <div className="flex flex-col gap-1">
              <Label htmlFor="attr-unit" className="text-xs font-medium text-foreground">
                Đơn vị đo lường
              </Label>
              <Input
                id="attr-unit"
                {...register("unit")}
                placeholder="VD: GB, cm, kg, ml..."
                className="h-8 text-xs rounded-[2px] border-border/60"
              />
            </div>
          )}

          {/* Tùy chọn cấu hình */}
          <div className="flex flex-col gap-3 pt-2 border-t border-border/60">
            <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                {...register("isFilterable")}
                className="w-4 h-4 rounded-[2px] border-border/60 text-foreground accent-foreground"
              />
              <span>Dùng làm bộ lọc tìm kiếm sản phẩm</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                {...register("isVariant")}
                className="w-4 h-4 rounded-[2px] border-border/60 text-foreground accent-foreground"
              />
              <span>Dùng để phân loại biến thể SKU (Variant)</span>
            </label>
          </div>
        </form>
      )}
    </SplitPaneInspector>
  );
}
