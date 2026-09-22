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
import type { CategoryId, CategoryNode, Category } from "@entities/category/types";
import { Input, Button, Switch, reactSelectDarkStyles } from "@my-project/ui";
import CoverImageUploader from "@widgets/admin/Uploader/CoverImageUploader"; 
import ReactSelect from "react-select";

// ĐỊNH NGHĨA TYPES CHO FORM
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

export default function CategoryFormPage() {
    // ----------------------------------------------------
    // 1. GỌI TẤT CẢ CÁC HOOKS TRƯỚC (QUAN TRỌNG NHẤT)
    // ----------------------------------------------------
    const nav = useNavigate();
    const { "*": idParam } = useParams();
    const isCreate = idParam === "new";
    const id = !isCreate ? (Number(idParam) as CategoryId) : undefined;

    const { data, isLoading } = useCategoryDetail(id, { enabled: !!id }); 
    console.log(data);
    
    const { data: tree } = useCategoryTree();
    const { options: categoryOptions } = useCategoryOptions();
    
    // MUTATIONS
    const createMut = useCreateCategory();
    const updateMut = useUpdateCategory();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ 
        defaultValues: { 
            name: "", 
            slug: "", 
            parentId: "", 
            isFeatured: false, 
            imageUrl: null,
        } 
    });
    // ----------------------------------------------------
    // 2. LOGIC PHỨC TẠP VÀ HOOKS useEffect / useMemo
    // ----------------------------------------------------

    // Disabled options = self + descendants (useMemo)
    const disabledIds = useMemo(() => {
        if (!id || !tree) return new Set<number>();
        const s = collectDescendantIds(tree, id);
        s.add(id);
        return s;
    }, [id, tree]);

    // Auto slug (useEffect)
    const nameVal = watch("name");
    useEffect(() => {
        if (isCreate) setValue("slug", slugify(nameVal || ""), { shouldDirty: true });
    }, [nameVal, isCreate, setValue]);

    // Load dữ liệu khi update (useEffect)
    useEffect(() => {
        if (!isCreate && data) {
            reset({
                name: data.name,
                slug: data.slug,
                parentId: data.parentId ? String(data.parentId) : "",
                isFeatured: data.isFeatured,
                imageUrl: data.img,
            });
        }
    }, [isCreate, data, reset]);

    const onSubmit = async (v: FormValues) => {
        const payload = {
            name: v.name,
            slug: v.slug,
            parentId: v.parentId ? Number(v.parentId) : null,
            isFeatured: v.isFeatured,
            img: v.imageUrl,
        };
        
        if (isCreate) await createMut.mutateAsync(payload);
        else await updateMut.mutateAsync({ id: id!, payload });
        
        nav("/admin/catalog-settings");
    };

    const parentOptions = useMemo(() => {
        return [
            { label: "-- Không có --", value: "" },
            ...categoryOptions.map(opt => ({ label: opt.label, value: String(opt.value) }))
        ];
    }, [categoryOptions]);
    
    // ----------------------------------------------------
    // 3. EARLY RETURN
    // ----------------------------------------------------
    if (!isCreate && isLoading) return <div className="p-4 text-foreground">Đang tải...</div>;

    // ----------------------------------------------------
    // 4. JSX RENDER
    // ----------------------------------------------------
    return (
        <div
            className="mx-auto p-3 bg-card border border-foreground/[0.04] dark:border-white/[0.05] shadow-neo-sm h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth 
                      [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] rounded-card"
        >
            <div className="p-3 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl text-foreground font-semibold">{isCreate ? "Tạo Category" : "Sửa Category"}</h1>
                    <Link to="/admin/category" className="underline text-muted hover:text-foreground text-base transition-colors">Quay lại</Link>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
                    {/* Tên & Slug & Parent inputs giữ nguyên */}
                    <div className="flex items-center gap-3">
                        <label className="text-base text-foreground w-24 shrink-0">Tên</label>
                        <div className="w-full">
                            <Input
                            {...register("name", { required: "Bắt buộc" })}
                            placeholder="VD: Điện thoại"
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
                            placeholder="vd: dien-thoai"
                            error={!!errors.slug}
                            />
                            {errors.slug && <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-base text-foreground w-24 shrink-0">Parent</label>
                        <div className="w-full">
                            <ReactSelect
                                value={parentOptions.find(o => o.value === watch("parentId"))}
                                onChange={(val: any) => setValue("parentId", val?.value)}
                                options={parentOptions}
                                menuPortalTarget={document.body}
                                placeholder="Chọn danh mục cha"
                                isOptionDisabled={(option) => disabledIds.has(Number(option.value))}
                                styles={reactSelectDarkStyles}
                            />
                        </div>
                    </div>

                    {/* Ảnh bìa (ImageUrl) - Sử dụng CoverImageUploader */}
                    <div className="flex items-start gap-3 pt-4 border-t border-foreground/[0.04] dark:border-white/[0.05]">
                        <label className="text-base text-foreground w-24 shrink-0 pt-2">Ảnh bìa</label>
                        <div className="w-full">
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
                            <p className="text-xs text-muted mt-1">Ảnh này sẽ được dùng cho slider trang chủ. Max 500KB.</p>
                        </div>
                    </div>

                    {/* Nổi bật (IsFeatured) - Sử dụng Switch */}
                    <div className="flex items-center gap-3">
                        <label className="text-base text-foreground w-24 shrink-0">Nổi bật</label>
                        <div className="w-full flex items-center pt-2">
                            <Switch
                                checked={watch("isFeatured")}
                                onCheckedChange={(checked) => setValue("isFeatured", checked, { shouldDirty: true })}
                                disabled={isSubmitting}
                                className="scale-90"
                            />
                            <span className="ml-3 text-sm text-muted">
                                {watch("isFeatured") ? "Đang hiển thị trên trang chủ" : "Không hiển thị trên trang chủ"}
                            </span>
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