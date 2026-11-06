import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  useCategoryOptions,
  useCategoryDetail,
  useCategoryTree,
  useCreateCategory,
  useUpdateCategory,
} from "@hooks/useCategory";
import type { CategoryId, CategoryNode } from "@my-project/api";
import {
  Button,
  Input,
  Label,
  Switch,
  reactSelectDarkStyles,
} from "@my-project/ui";
import { SplitPaneInspector } from "@components/common/SplitPaneInspector";
import CoverImageUploader from "@components/common/CoverImageUploader";
import ReactSelect from "react-select";

type FormValues = {
  name: string;
  slug: string;
  parentId?: string;
  isFeatured: boolean;
  imageUrl?: string | null;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

function collectDescendantIds(nodes: CategoryNode[], targetId: number): Set<number> {
  const out = new Set<number>();
  const dfs = (arr: CategoryNode[]) => {
    for (const n of arr) {
      if (n.categoryId === targetId) {
        const walk = (ns: CategoryNode[]) => {
          for (const c of ns) {
            out.add(c.categoryId);
            if (c.children?.length) walk(c.children);
          }
        };
        walk(n.children ?? []);
      } else if (n.children?.length) {
        dfs(n.children);
      }
    }
  };
  dfs(nodes);
  return out;
}

interface CategoryDrawerFormProps {
  open: boolean;
  categoryId: CategoryId | null;
  onClose: () => void;
}

export function CategoryDrawerForm({ open, categoryId, onClose }: CategoryDrawerFormProps) {
  const isCreate = categoryId === null;
  const { data: detailData, isLoading: loadingDetail } = useCategoryDetail(
    categoryId ?? undefined,
    { enabled: !!categoryId }
  );
  const { data: tree } = useCategoryTree();
  const { options: categoryOptions } = useCategoryOptions();

  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory();

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
      parentId: undefined,
      isFeatured: false,
      imageUrl: null,
    },
  });

  // Calculate disabled parent IDs to avoid cycles
  const disabledIds = useMemo(() => {
    if (isCreate || !categoryId || !tree) return new Set<number>();
    const descendants = collectDescendantIds(tree, Number(categoryId));
    descendants.add(Number(categoryId));
    return descendants;
  }, [isCreate, categoryId, tree]);

  // Options for parent category dropdown
  const parentOptions = useMemo(() => {
    const list = [{ value: "", label: "-- Không có (Danh mục gốc) --" }];
    categoryOptions.forEach((opt) => {
      list.push({
        value: String(opt.value),
        label: opt.label,
      });
    });
    return list;
  }, [categoryOptions]);

  // Auto-generate slug when creating
  const nameVal = watch("name");
  useEffect(() => {
    if (isCreate) {
      setValue("slug", slugify(nameVal || ""), { shouldDirty: true });
    }
  }, [nameVal, isCreate, setValue]);

  // Load details when editing
  useEffect(() => {
    if (!isCreate && detailData) {
      reset({
        name: detailData.name,
        slug: detailData.slug,
        parentId: detailData.parentId ? String(detailData.parentId) : "",
        isFeatured: detailData.isFeatured ?? false,
        imageUrl: detailData.imageUrl ?? null,
      });
    } else if (isCreate) {
      reset({
        name: "",
        slug: "",
        parentId: "",
        isFeatured: false,
        imageUrl: null,
      });
    }
  }, [isCreate, detailData, reset]);

  const onSubmit = async (v: FormValues) => {
    try {
      const parentIdNum = v.parentId ? Number(v.parentId) : undefined;
      if (isCreate) {
        await createMut.mutateAsync({
          name: v.name,
          slug: v.slug,
          parentId: parentIdNum,
          imageUrl: v.imageUrl ?? null,
          isFeatured: v.isFeatured,
        });
      } else {
        await updateMut.mutateAsync({
          id: categoryId!,
          payload: {
            name: v.name,
            slug: v.slug,
            parentId: parentIdNum,
            imageUrl: v.imageUrl ?? null,
            isFeatured: v.isFeatured,
          },
        });
      }
      onClose();
    } catch (err) {
      console.error("Lỗi lưu danh mục:", err);
    }
  };

  const isSaving = isSubmitting || createMut.isPending || updateMut.isPending;

  return (
    <SplitPaneInspector
      open={open}
      onClose={onClose}
      title={isCreate ? "Thêm Danh Mục" : `Chỉnh Sửa Danh Mục #${categoryId}`}
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
            form="category-split-form"
            variant="default"
            isLoading={isSaving}
            loadingText="Đang lưu..."
            fullWidthOnSm
          >
            {isCreate ? "Tạo danh mục" : "Lưu thay đổi"}
          </Button>
        </>
      }
    >
      {!isCreate && loadingDetail ? (
        <div className="py-12 text-center text-xs text-muted-foreground animate-pulse font-mono">
          Đang tải dữ liệu danh mục...
        </div>
      ) : (
        <form id="category-split-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Tên danh mục */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="cat-name" className="text-xs font-medium text-foreground">
              Tên danh mục <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cat-name"
              {...register("name", { required: "Vui lòng nhập tên danh mục" })}
              placeholder="VD: Áo Nam, Điện thoại..."
              className="h-8 text-xs rounded-[2px] border-border/60"
              autoFocus
            />
            {errors.name && (
              <p className="text-[11px] text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="cat-slug" className="text-xs font-medium text-foreground">
              Đường dẫn (Slug) <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center bg-surface/50 border border-border/60 rounded-[2px] h-8 text-muted-foreground text-xs overflow-hidden focus-within:border-foreground transition-colors">
              <span className="pl-2.5 select-none text-muted-foreground pr-2 bg-surface h-full flex items-center font-mono text-xs shrink-0">
                /category/
              </span>
              <Input
                id="cat-slug"
                {...register("slug", { required: "Vui lòng nhập slug" })}
                className="border-0 focus:border-0 rounded-none h-full shadow-none bg-transparent outline-none text-foreground flex-1 pr-2.5 placeholder-muted-foreground/50 font-mono text-xs"
                placeholder="ao-nam"
              />
            </div>
            {errors.slug && (
              <p className="text-[11px] text-destructive mt-1">{errors.slug.message}</p>
            )}
          </div>

          {/* Danh mục cha */}
          <div className="flex flex-col gap-1">
            <Label className="text-xs font-medium text-foreground">
              Danh mục cha
            </Label>
            <ReactSelect
              value={parentOptions.find((o) => o.value === (watch("parentId") ?? ""))}
              onChange={(val: any) => setValue("parentId", val?.value)}
              options={parentOptions}
              menuPortalTarget={document.body}
              placeholder="Chọn danh mục cha..."
              isOptionDisabled={(opt) => disabledIds.has(Number(opt.value))}
              styles={reactSelectDarkStyles}
            />
          </div>

          {/* Ảnh bìa */}
          <div className="flex flex-col gap-1 pt-2 border-t border-border/60">
            <Label className="text-xs font-medium text-foreground">Ảnh bìa</Label>
            <CoverImageUploader
              img={watch("imageUrl") ?? undefined}
              folder="tmp/categories"
              onUploadSuccess={(url) => {
                setValue("imageUrl", url, { shouldDirty: true });
              }}
              onRemove={() => {
                setValue("imageUrl", null, { shouldDirty: true });
              }}
              maxFileSize={500}
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              Được dùng cho slider và đại diện danh mục. Tối đa 500KB.
            </p>
          </div>

          {/* Nổi bật */}
          <div className="flex items-center justify-between p-3 rounded-[2px] border border-border/60 bg-surface/30">
            <div className="flex flex-col gap-1">
              <Label className="text-xs font-medium text-foreground">Hiển thị nổi bật</Label>
              <p className="text-[10px] text-muted-foreground">
                {watch("isFeatured")
                  ? "Hiển thị tại trang chủ / banner"
                  : "Không hiển thị trên trang chủ"}
              </p>
            </div>
            <Switch
              checked={watch("isFeatured")}
              onCheckedChange={(checked) =>
                setValue("isFeatured", checked, { shouldDirty: true })
              }
              disabled={isSubmitting}
            />
          </div>
        </form>
      )}
    </SplitPaneInspector>
  );
}
