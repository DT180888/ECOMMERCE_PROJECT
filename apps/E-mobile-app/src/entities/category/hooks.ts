// src/entities/category/hooks.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  listCategories,
  getCategoryById,
  getCategoryTree,
  getCategoryBreadcrumb,
  createCategory,
  updateCategory,
  deleteCategory,
  moveCategory,
  toggleCategoryFeatured,
  listFeaturedCategories,
} from "./api";
import type {
  Category,
  CategoryListParams,
  PageRes,
  CategoryNode,
  BreadcrumbRes,
  CategoryId,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "./types";

// --------------------
// Query Keys
// --------------------
export const categoryKeys = {
  all: ["categories"] as const,
  list: (params?: CategoryListParams) => ["categories", "list", params] as const,
  detail: (id: CategoryId) => ["categories", "detail", id] as const,
  tree: () => ["categories", "tree"] as const,
  breadcrumb: (id: CategoryId) => ["categories", "breadcrumb", id] as const,
  featured: () => ["categories", "featured"] as const,
};

type CategoryListKey = ReturnType<typeof categoryKeys.list>;
type CategoryDetailKey = ReturnType<typeof categoryKeys.detail>;
type CategoryTreeKey = ReturnType<typeof categoryKeys.tree>;
type CategoryBreadcrumbKey = ReturnType<typeof categoryKeys.breadcrumb>;
type FeaturedCategoriesKey = ReturnType<typeof categoryKeys.featured>;

// --------------------
// Queries
// --------------------
export function useCategoryList<TData = PageRes<Category>>(
  params?: CategoryListParams,
  options?: Partial<UseQueryOptions<PageRes<Category>, unknown, TData, CategoryListKey>>
) {
  return useQuery<PageRes<Category>, unknown, TData, CategoryListKey>({
    queryKey: categoryKeys.list(params),
    queryFn: () => listCategories(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
    ...(options as any),
  });
}

export function useCategoryDetail<TData = Category>(
  id: CategoryId | undefined,
  options?: Partial<UseQueryOptions<Category, unknown, TData, CategoryDetailKey>>
) {
  return useQuery<Category, unknown, TData, CategoryDetailKey>({
    queryKey: categoryKeys.detail((id ?? 0) as CategoryId),
    queryFn: () => getCategoryById(id as CategoryId),
    enabled: !!id,
    staleTime: 30_000,
    ...(options as any),
  });
}

export function useCategoryTree<TData = CategoryNode[]>(
  options?: Partial<UseQueryOptions<CategoryNode[], unknown, TData, CategoryTreeKey>>
) {
  return useQuery<CategoryNode[], unknown, TData, CategoryTreeKey>({
    queryKey: categoryKeys.tree(),
    queryFn: () => getCategoryTree(),
    staleTime: 5 * 60_000,
    ...(options as any),
  });
}

export function useCategoryBreadcrumb<TData = BreadcrumbRes>(
  id: CategoryId | undefined,
  options?: Partial<UseQueryOptions<BreadcrumbRes, unknown, TData, CategoryBreadcrumbKey>>
) {
  return useQuery<BreadcrumbRes, unknown, TData, CategoryBreadcrumbKey>({
    queryKey: categoryKeys.breadcrumb((id ?? 0) as CategoryId),
    queryFn: () => getCategoryBreadcrumb(id as CategoryId),
    enabled: !!id,
    staleTime: 5 * 60_000,
    ...(options as any),
  });
}

// --------------------
// Mutations
// --------------------
export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.list() });
      qc.invalidateQueries({ queryKey: categoryKeys.tree() });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: CategoryId; payload: UpdateCategoryPayload }) =>
      updateCategory(id, payload),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: categoryKeys.detail(id) });
      qc.invalidateQueries({ queryKey: categoryKeys.list() });
      qc.invalidateQueries({ queryKey: categoryKeys.tree() });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: CategoryId) => deleteCategory(id),
    onSuccess: (_d, id) => {
      qc.removeQueries({ queryKey: categoryKeys.detail(id) });
      qc.invalidateQueries({ queryKey: categoryKeys.list() });
      qc.invalidateQueries({ queryKey: categoryKeys.tree() });
    },
  });
}

export function useMoveCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newParentId }: { id: CategoryId; newParentId?: number | null }) =>
      moveCategory(id, newParentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.tree() });
      qc.invalidateQueries({ queryKey: categoryKeys.list() });
    },
  });
}

// --------------------
// Helpers for filters
// --------------------
export interface Option {
  label: string;
  value: string | number;
}

/** Flatten tree -> options, prefix tên theo depth bằng "— " */
export function flattenCategoryOptions(tree: CategoryNode[]): Option[] {
  const out: Option[] = [];
  const walk = (nodes: CategoryNode[], depth = 0) => {
    const prefix = depth > 0 ? "— ".repeat(depth) : "";
    for (const n of nodes) {
      out.push({ label: `${prefix}${n.name}`, value: n.categoryId });
      if (n.children?.length) walk(n.children, depth + 1);
    }
  };
  walk(tree, 0);
  return out;
}

/** Hook trả về {label,value}[] cho Select trong Catalog/Admin Form */
export function useCategoryOptions() {
  const { data, isLoading } = useCategoryTree();
  const options = data ? flattenCategoryOptions(data) : [];
  return { options, isLoading };
}

export function updateTreeNodeStatus(
  nodes: CategoryNode[], 
  targetId: number, 
  newStatus: boolean
): CategoryNode[] {
  return nodes.map((node) => {
    // 1. Tìm thấy: Trả về object mới với status mới
    if (node.categoryId === targetId) {
      return { ...node, isFeatured: newStatus };
    }
    
    // 2. Nếu có con: Đệ quy xuống con
    if (node.children && node.children.length > 0) {
      const newChildren = updateTreeNodeStatus(node.children, targetId, newStatus);
      // Chỉ tạo object mới nếu con thực sự thay đổi (tối ưu performance)
      if (newChildren !== node.children) {
        return { ...node, children: newChildren };
      }
    }
    
    // 3. Không liên quan: Giữ nguyên node cũ
    return node;
  });
}

export function useToggleCategoryFeatured() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: CategoryId; isFeatured: boolean }) =>
      toggleCategoryFeatured(id, isFeatured),

    // --- 1. OPTIMISTIC UPDATE (Xảy ra TRƯỚC khi API chạy) ---
    onMutate: async ({ id, isFeatured }) => {
      // A. Hủy các query đang chạy dở để tránh ghi đè dữ liệu
      await qc.cancelQueries({ queryKey: categoryKeys.tree() });

      // B. Lưu lại dữ liệu cũ (Snapshot) để phòng trường hợp lỗi thì rollback
      const previousTree = qc.getQueryData<CategoryNode[]>(categoryKeys.tree());

      // C. Cập nhật cache NGAY LẬP TỨC
      qc.setQueryData(categoryKeys.tree(), (old: CategoryNode[] | undefined) => {
        if (!old) return [];
        return updateTreeNodeStatus(old, id, isFeatured);
      });

      // D. Trả về context để dùng cho onError
      return { previousTree };
    },

    // --- 2. NẾU LỖI (Rollback) ---
    onError: (err, newTodo, context) => {
      // Khôi phục lại dữ liệu cũ từ snapshot
      if (context?.previousTree) {
        qc.setQueryData(categoryKeys.tree(), context.previousTree);
      }
      alert("Có lỗi xảy ra, không thể cập nhật trạng thái!");
    },

    // --- 3. KHI XONG (Thành công hoặc Thất bại đều chạy) ---
    onSettled: () => {
      // (Tuỳ chọn) Invalidate để đảm bảo dữ liệu đồng bộ hoàn toàn với server
      // Thường thì với Toggle ta không cần cái này nếu tin tưởng logic update ở client
      // qc.invalidateQueries({ queryKey: categoryKeys.tree() }); 
      
      // Nhưng vẫn nên invalidate các list khác
      qc.invalidateQueries({ queryKey: categoryKeys.list() });
      qc.invalidateQueries({ queryKey: categoryKeys.featured() });
    },
  });
}

export function useFeaturedCategories<TData = Category[]>(
    options?: Partial<UseQueryOptions<Category[], unknown, TData, FeaturedCategoriesKey>>
) {
    return useQuery<Category[], unknown, TData, FeaturedCategoriesKey>({
        // CẦN GỌI HÀM: categoryKeys.featured()
        queryKey: categoryKeys.featured(), 
        queryFn: () => listFeaturedCategories(),
        staleTime: 5 * 60_000, 
        enabled: true, 
        ...(options as any),
    });
}
