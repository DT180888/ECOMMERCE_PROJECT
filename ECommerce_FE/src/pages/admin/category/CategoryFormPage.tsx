import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useCategoryOptions,
  useCategoryDetail,
  useCategoryTree,
  useCreateCategory,
  useUpdateCategory,
} from "@entities/category/hooks";
import type { CategoryId, CategoryNode } from "@entities/category/types";
import { Input } from "@shared/ui/Input";
import { Select } from "@shared/ui/Select";
import { Button } from "@shared/ui/Button";

type FormValues = { name: string; slug: string; parentId?: string };

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

export default function CategoryFormPage() {
  const nav = useNavigate();
  const { "*": idParam } = useParams(); // '/admin/category/new' or '/admin/category/:id'
  const isCreate = idParam === "new";
  const id = !isCreate ? (Number(idParam) as CategoryId) : undefined;

  const { data, isLoading } = useCategoryDetail(id, { enabled: !!id });
  const { data: tree } = useCategoryTree();
  const { options: categoryOptions } = useCategoryOptions();
  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { name: "", slug: "", parentId: "" } });

  // Disabled options = self + descendants
  const disabledIds = useMemo(() => {
    if (!id || !tree) return new Set<number>();
    const s = collectDescendantIds(tree, id);
    s.add(id);
    return s;
  }, [id, tree]);

  // Auto slug khi create
  const nameVal = watch("name");
  useEffect(() => {
    if (isCreate) reset((cur) => ({ ...cur, slug: slugify(nameVal || "") }));
  }, [nameVal, isCreate, reset]);

  // Reset khi update
  useEffect(() => {
    if (!isCreate && data) {
      reset({
        name: data.name,
        slug: data.slug,
        parentId: data.parentId ? String(data.parentId) : "",
      });
    }
  }, [isCreate, data, reset]);

  const onSubmit = async (v: FormValues) => {
    const payload = {
      name: v.name,
      slug: v.slug,
      parentId: v.parentId ? Number(v.parentId) : null,
    };
    if (isCreate) await createMut.mutateAsync(payload);
    else await updateMut.mutateAsync({ id: id!, payload });
    nav("/admin/category");
  };

  if (!isCreate && isLoading) return <div className="p-4">Đang tải...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{isCreate ? "Tạo Category" : "Sửa Category"}</h1>
        <Link to="/admin/category" className="underline">Quay lại</Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
        <div>
          <label className="text-sm text-gray-600">Tên</label>
          <Input
            {...register("name", { required: "Bắt buộc" })}
            placeholder="VD: Điện thoại"
            error={!!errors.name}
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600">Slug</label>
          <Input
            {...register("slug", { required: "Bắt buộc" })}
            placeholder="vd: dien-thoai"
            error={!!errors.slug}
          />
          {errors.slug && <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600">Parent</label>
          <Select
            value={watch("parentId")}
            onChange={(e) => setValue("parentId", e.target.value)}
          >
            <option value="">-- Không có --</option>
            {categoryOptions.map((o) => {
              const val = Number(o.value);
              const disabled = disabledIds.has(val);
              return (
                <option key={o.value} value={String(o.value)} disabled={disabled}>
                  {o.label}
                </option>
              );
            })}
          </Select>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting || isLoading}>
            {isCreate ? "Tạo" : "Lưu"}
          </Button>
          <Link to="/admin/category">
            <Button type="button" variant="outline">Hủy</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
