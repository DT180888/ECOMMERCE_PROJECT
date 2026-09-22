import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useBrandDetail, useCreateBrand, useUpdateBrand } from "@entities/brand/hooks";
import type { BrandId } from "@entities/brand/types";
import { Input, Button } from "@my-project/ui";

type FormValues = { name: string; slug: string };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export function BrandForm() {
  const nav = useNavigate();
  const { "*": idParam } = useParams(); // '/admin/brand/new' hoặc '/admin/brand/:id'
  const isCreate = idParam === "new";
  const id = !isCreate ? (Number(idParam) as BrandId) : undefined;

  const { data, isLoading } = useBrandDetail(id, { enabled: !!id });
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

  // Auto slug khi tạo
  const nameVal = watch("name");
  useEffect(() => {
    if (isCreate) {
      setValue("slug", slugify(nameVal || ""), { shouldDirty: true });
    }
  }, [nameVal, isCreate, setValue]);

  // Nạp dữ liệu khi update
  useEffect(() => {
    if (!isCreate && data) {
      reset({ name: data.name, slug: data.slug });
    }
  }, [isCreate, data, reset]);

  const onSubmit = async (v: FormValues) => {
    if (isCreate) {
      await createMut.mutateAsync({ name: v.name, slug: v.slug });
    } else {
      await updateMut.mutateAsync({ id: id!, payload: { name: v.name, slug: v.slug } });
    }
    nav("/admin/catalog-settings");
  };

  if (!isCreate && isLoading) return <div className="p-4 text-foreground">Đang tải...</div>;

  return (
        <div
      className="mx-auto p-3 bg-card border border-foreground/[0.04] dark:border-white/[0.05] shadow-neo-sm h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth 
                  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] rounded-card"
      >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl text-foreground font-semibold">{isCreate ? "Tạo Brand" : "Sửa Brand"}</h1>
          <Link to="/admin/catalog-settings" className="underline text-muted hover:text-foreground text-base transition-colors">Quay lại</Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-base text-foreground w-24 shrink-0">Tên</label>
            <div className="w-full">
              <Input
                {...register("name", { required: "Bắt buộc" })}
                placeholder="VD: Apple"
                error={!!errors.name}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-base text-foreground w-24 shrink-0">Slug</label>
            <div className="w-full">
              <Input
                {...register("slug", { required: "Bắt buộc" })}
                placeholder="vd: apple"
                error={!!errors.slug}
              />
              {errors.slug && <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="flex gap-2 ml-24 pt-4">
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

