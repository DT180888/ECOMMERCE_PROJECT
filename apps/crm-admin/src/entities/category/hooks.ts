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

/** Flatten tree -> options, prefix tÃªn theo depth báº±ng "â€” " */
export function flattenCategoryOptions(tree: CategoryNode[]): Option[] {
  const out: Option[] = [];
  const walk = (nodes: CategoryNode[], depth = 0) => {
    const prefix = depth > 0 ? "â€” ".repeat(depth) : "";
    for (const n of nodes) {
      out.push({ label: `${prefix}${n.name}`, value: n.categoryId });
      if (n.children?.length) walk(n.children, depth + 1);
    }
  };
  walk(tree, 0);
  return out;
}

/** Hook tráº£ vá» {label,value}[] cho Select trong Catalog/Admin Form */
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
    // 1. TÃ¬m tháº¥y: Tráº£ vá» object má»›i vá»›i status má»›i
    if (node.categoryId === targetId) {
      return { ...node, isFeatured: newStatus };
    }
    
    // 2. Náº¿u cÃ³ con: Äá»‡ quy xuá»‘ng con
    if (node.children && node.children.length > 0) {
      const newChildren = updateTreeNodeStatus(node.children, targetId, newStatus);
      // Chá»‰ táº¡o object má»›i náº¿u con thá»±c sá»± thay Ä‘á»•i (tá»‘i Æ°u performance)
      if (newChildren !== node.children) {
        return { ...node, children: newChildren };
      }
    }
    
    // 3. KhÃ´ng liÃªn quan: Giá»¯ nguyÃªn node cÅ©
    return node;
  });
}

export function useToggleCategoryFeatured() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: CategoryId; isFeatured: boolean }) =>
      toggleCategoryFeatured(id, isFeatured),

    // --- 1. OPTIMISTIC UPDATE (Xáº£y ra TRÆ¯á»šC khi API cháº¡y) ---
    onMutate: async ({ id, isFeatured }) => {
      // A. Há»§y cÃ¡c query Ä‘ang cháº¡y dá»Ÿ Ä‘á»ƒ trÃ¡nh ghi Ä‘Ã¨ dá»¯ liá»‡u
      await qc.cancelQueries({ queryKey: categoryKeys.tree() });

      // B. LÆ°u láº¡i dá»¯ liá»‡u cÅ© (Snapshot) Ä‘á»ƒ phÃ²ng trÆ°á»ng há»£p lá»—i thÃ¬ rollback
      const previousTree = qc.getQueryData<CategoryNode[]>(categoryKeys.tree());

      // C. Cáº­p nháº­t cache NGAY Láº¬P Tá»¨C
      qc.setQueryData(categoryKeys.tree(), (old: CategoryNode[] | undefined) => {
        if (!old) return [];
        return updateTreeNodeStatus(old, id, isFeatured);
      });

      // D. Tráº£ vá» context Ä‘á»ƒ dÃ¹ng cho onError
      return { previousTree };
    },

    // --- 2. Náº¾U Lá»–I (Rollback) ---
    onError: (err, newTodo, context) => {
      // KhÃ´i phá»¥c láº¡i dá»¯ liá»‡u cÅ© tá»« snapshot
      if (context?.previousTree) {
        qc.setQueryData(categoryKeys.tree(), context.previousTree);
      }
      alert(err?.message || "CÃ³ lá»—i xáº£y ra, khÃ´ng thá»ƒ cáº­p nháº­t tráº¡ng thÃ¡i!");
    },

    // --- 3. KHI XONG (ThÃ nh cÃ´ng hoáº·c Tháº¥t báº¡i Ä‘á»u cháº¡y) ---
    onSettled: () => {
      // (Tuá»³ chá»n) Invalidate Ä‘á»ƒ Ä‘áº£m báº£o dá»¯ liá»‡u Ä‘á»“ng bá»™ hoÃ n toÃ n vá»›i server
      // ThÆ°á»ng thÃ¬ vá»›i Toggle ta khÃ´ng cáº§n cÃ¡i nÃ y náº¿u tin tÆ°á»Ÿng logic update á»Ÿ client
      // qc.invalidateQueries({ queryKey: categoryKeys.tree() }); 
      
      // NhÆ°ng váº«n nÃªn invalidate cÃ¡c list khÃ¡c
      qc.invalidateQueries({ queryKey: categoryKeys.list() });
      qc.invalidateQueries({ queryKey: categoryKeys.featured() });
    },
  });
}

export function useFeaturedCategories<TData = Category[]>(
  options?: Partial<UseQueryOptions<Category[], unknown, TData, FeaturedCategoriesKey>>
) {
  return useQuery<Category[], unknown, TData, FeaturedCategoriesKey>({
    // Cáº¦N Gá»ŒI HÃ€M: categoryKeys.featured()
    queryKey: categoryKeys.featured(), 
    queryFn: () => listFeaturedCategories(),
    staleTime: 5 * 60_000, 
    enabled: true, 
    ...(options as Record<string, unknown>),
  });
}

