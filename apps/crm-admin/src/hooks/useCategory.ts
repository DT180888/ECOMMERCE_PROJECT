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
} from "@my-project/api";
import type {
  Category,
  CategoryListParams,
  PageRes,
  CategoryNode,
  BreadcrumbRes,
  CategoryId,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@my-project/api";

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

export function useCategoryList<TData = PageRes<Category>>(
  params?: CategoryListParams,
  options?: Partial<UseQueryOptions<PageRes<Category>, unknown, TData, CategoryListKey>>
) {
  return useQuery<PageRes<Category>, unknown, TData, CategoryListKey>({
    queryKey: categoryKeys.list(params),
    queryFn: () => listCategories(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
    ...(options as Record<string, unknown>),
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
    ...(options as Record<string, unknown>),
  });
}

export function useCategoryTree<TData = CategoryNode[]>(
  options?: Partial<UseQueryOptions<CategoryNode[], unknown, TData, CategoryTreeKey>>
) {
  return useQuery<CategoryNode[], unknown, TData, CategoryTreeKey>({
    queryKey: categoryKeys.tree(),
    queryFn: () => getCategoryTree(),
    staleTime: 5 * 60_000,
    ...(options as Record<string, unknown>),
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
    ...(options as Record<string, unknown>),
  });
}

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

export interface Option {
  label: string;
  value: string | number;
}

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
    if (node.categoryId === targetId) {
      return { ...node, isFeatured: newStatus };
    }
    
    if (node.children && node.children.length > 0) {
      const newChildren = updateTreeNodeStatus(node.children, targetId, newStatus);
      if (newChildren !== node.children) {
        return { ...node, children: newChildren };
      }
    }
    
    return node;
  });
}

export function useToggleCategoryFeatured() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: CategoryId; isFeatured: boolean }) =>
      toggleCategoryFeatured(id, isFeatured),

    onMutate: async ({ id, isFeatured }) => {
      await qc.cancelQueries({ queryKey: categoryKeys.tree() });
      const previousTree = qc.getQueryData<CategoryNode[]>(categoryKeys.tree());

      qc.setQueryData(categoryKeys.tree(), (old: CategoryNode[] | undefined) => {
        if (!old) return [];
        return updateTreeNodeStatus(old, id, isFeatured);
      });

      return { previousTree };
    },

    onError: (err: any, _newTodo, context) => {
      if (context?.previousTree) {
        qc.setQueryData(categoryKeys.tree(), context.previousTree);
      }
      alert(err?.message || "Có lỗi xảy ra, không thể cập nhật trạng thái!");
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.list() });
      qc.invalidateQueries({ queryKey: categoryKeys.featured() });
    },
  });
}

export function useFeaturedCategories<TData = Category[]>(
  options?: Partial<UseQueryOptions<Category[], unknown, TData, FeaturedCategoriesKey>>
) {
  return useQuery<Category[], unknown, TData, FeaturedCategoriesKey>({
    queryKey: categoryKeys.featured(), 
    queryFn: () => listFeaturedCategories(),
    staleTime: 5 * 60_000, 
    enabled: true, 
    ...(options as Record<string, unknown>),
  });
}
