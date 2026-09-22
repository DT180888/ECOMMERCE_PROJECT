// src/entities/category/hooks.ts
import {
  useQuery,
  UseQueryOptions,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  listCategories,
  getCategoryById,
  getCategoryTree,
  getCategoryBreadcrumb,
  listFeaturedCategories,
  getCategoryBySlug,
} from "./api";
import type {
  Category,
  CategoryListParams,
  PageRes,
  CategoryNode,
  BreadcrumbRes,
  CategoryId,
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
  detailBySlug: (slug: string) => ["categories", "detailBySlug", slug] as const,
};

type CategoryListKey = ReturnType<typeof categoryKeys.list>;
type CategoryDetailKey = ReturnType<typeof categoryKeys.detail>;
type CategoryTreeKey = ReturnType<typeof categoryKeys.tree>;
type CategoryBreadcrumbKey = ReturnType<typeof categoryKeys.breadcrumb>;
type FeaturedCategoriesKey = ReturnType<typeof categoryKeys.featured>;
type CategoryDetailBySlugKey = ReturnType<typeof categoryKeys.detailBySlug>;

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

export function useCategoryBySlug<TData = Category>(
  slug: string | undefined,
  options?: Partial<UseQueryOptions<Category, unknown, TData, CategoryDetailBySlugKey>>
) {
  return useQuery<Category, unknown, TData, CategoryDetailBySlugKey>({
    queryKey: categoryKeys.detailBySlug(slug ?? ""),
    queryFn: () => getCategoryBySlug(slug as string),
    enabled: !!slug,
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
// Helpers for filters
// --------------------
export interface Option {
  label: string;
  value: string | number;
  slug?: string;
}

/** Flatten tree -> options, prefix tÃªn theo depth báº±ng "â€” " */
export function flattenCategoryOptions(tree: CategoryNode[]): Option[] {
  const out: Option[] = [];
  const walk = (nodes: CategoryNode[], depth = 0) => {
    const prefix = depth > 0 ? "â€” ".repeat(depth) : "";
    for (const n of nodes) {
      out.push({ label: `${prefix}${n.name}`, value: n.categoryId, slug: n.slug });
      if (n.children?.length) walk(n.children, depth + 1);
    }
  };
  walk(tree, 0);
  return out;
}

/** Hook tráº£ vá»  {label,value}[] cho Select trong Catalog/Admin Form */
export function useCategoryOptions() {
  const { data, isLoading } = useCategoryTree();
  const options = data ? flattenCategoryOptions(data) : [];
  return { options, isLoading };
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

