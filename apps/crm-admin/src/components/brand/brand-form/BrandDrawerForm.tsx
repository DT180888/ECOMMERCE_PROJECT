import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useBrandDetail, useCreateBrand, useUpdateBrand } from "@hooks/useBrand";
import type { BrandId } from "@my-project/api";
import {
  Button,
  Input,
  Label,
} from "@my-project/ui";
import { SplitPaneInspector } from "@components/common/SplitPaneInspector";

type FormValues = { name: string; slug: string };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

interface BrandDrawerFormProps {
  open: boolean;
  brandId: BrandId | null;
  onClose: () => void;
}

export function BrandDrawerForm({ open, brandId, onClose }: BrandDrawerFormProps) {
  const isCreate = brandId === null;
  const { data, isLoading } = useBrandDetail(brandId ?? undefined, {
    enabled: !!brandId,
  });

  const createMut = useCreateBrand();
  const updateMut = useUpdateBrand();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: "", slug: "" },
  });

  // Auto-generate slug when creating
  const nameVal = watch("name");
  useEffect(() => {
    if (isCreate) {
      setValue("slug", slugify(nameVal || ""), { shouldDirty: true });
    }
  }, [nameVal, isCreate, setValue]);

  // Load brand details when editing
  useEffect(() => {
    if (!isCreate && data) {
      reset({ name: data.name, slug: data.slug });
    } else if (isCreate) {
      reset({ name: "", slug: "" });
    }
  }, [isCreate, data, reset]);

  const onSubmit = async (v: FormValues) => {
    try {
      if (isCreate) {
        await createMut.mutateAsync({ name: v.name, slug: v.slug });
      } else {
        await updateMut.mutateAsync({
          id: brandId!,
          payload: { name: v.name, slug: v.slug },
        });
      }
      onClose();
    } catch (err) {
      console.error("Lỗi lưu thương hiệu:", err);
    }
  };

  const isSaving = isSubmitting || createMut.isPending || updateMut.isPending;

  return (
    <SplitPaneInspector
      open={open}
      onClose={onClose}
      title={isCreate ? "Thêm Thương Hiệu" : `Chỉnh Sửa Thương Hiệu #${brandId}`}
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
            form="brand-split-form"
            variant="default"
            isLoading={isSaving}
            loadingText="Đang lưu..."
            fullWidthOnSm
          >
            {isCreate ? "Tạo thương hiệu" : "Lưu thay đổi"}
          </Button>
        </>
      }
    >
      {!isCreate && isLoading ? (
        <div className="py-12 text-center text-xs text-muted-foreground animate-pulse font-mono">
          Đang tải dữ liệu thương hiệu...
        </div>
      ) : (
        <form id="brand-split-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Tên thương hiệu */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="brand-name" className="text-xs font-medium text-foreground">
              Tên thương hiệu <span className="text-destructive">*</span>
            </Label>
            <Input
              id="brand-name"
              {...register("name", { required: "Vui lòng nhập tên thương hiệu" })}
              placeholder="VD: Apple, Nike, Samsung..."
              className="h-8 text-xs rounded-[2px] border-border/60"
              autoFocus
            />
            {errors.name && (
              <p className="text-[11px] text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="brand-slug" className="text-xs font-medium text-foreground">
              Đường dẫn (Slug) <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center bg-surface/50 border border-border/60 rounded-[2px] h-8 text-muted-foreground text-xs overflow-hidden focus-within:border-foreground transition-colors">
              <span className="pl-2.5 select-none text-muted-foreground pr-2 bg-surface h-full flex items-center font-mono text-xs shrink-0">
                /brand/
              </span>
              <Input
                id="brand-slug"
                {...register("slug", { required: "Vui lòng nhập slug" })}
                className="border-0 focus:border-0 rounded-none h-full shadow-none bg-transparent outline-none text-foreground flex-1 pr-2.5 placeholder-muted-foreground/50 font-mono text-xs"
                placeholder="apple"
              />
            </div>
            {errors.slug && (
              <p className="text-[11px] text-destructive mt-1">{errors.slug.message}</p>
            )}
          </div>
        </form>
      )}
    </SplitPaneInspector>
  );
}
