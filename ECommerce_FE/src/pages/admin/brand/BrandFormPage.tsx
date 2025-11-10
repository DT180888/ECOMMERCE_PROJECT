import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useBrandDetail, useCreateBrand, useUpdateBrand } from "@entities/brand/hooks";
import type { BrandId } from "@entities/brand/types";
import { Input } from "@shared/ui/Input";
import { Button } from "@shared/ui/Button";

type FormValues = { name: string; slug: string };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function BrandFormPage() {
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
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: "", slug: "" },
  });

  // Auto slug khi tạo
  const nameVal = watch("name");
  useEffect(() => {
    if (isCreate) {
      reset((cur) => ({ ...cur, slug: slugify(nameVal || "") }));
    }
  }, [nameVal, isCreate, reset]);

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
    nav("/admin/brand");
  };

  if (!isCreate && isLoading) return <div className="p-4">Đang tải...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{isCreate ? "Tạo Brand" : "Sửa Brand"}</h1>
        <Link to="/admin/brand" className="underline">Quay lại</Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
        <div>
          <label className="text-sm text-gray-600">Tên</label>
          <Input
            {...register("name", { required: "Bắt buộc" })}
            placeholder="VD: Apple"
            error={!!errors.name}
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600">Slug</label>
          <Input
            {...register("slug", { required: "Bắt buộc" })}
            placeholder="vd: apple"
            error={!!errors.slug}
          />
          {errors.slug && <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>}
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting || isLoading}>
            {isCreate ? "Tạo" : "Lưu"}
          </Button>
          <Link to="/admin/brand">
            <Button type="button" variant="outline">Hủy</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
