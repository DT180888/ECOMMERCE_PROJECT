export type CategoryId = number;

export interface Category {
  categoryId: CategoryId;
  name: string;
  slug: string;
  parentId?: CategoryId | null;
  createdAt: string;
  isFeatured: boolean;
  img?: string | null;
  productCount: number;
  childCount: number;
}

export interface CategoryListParams {
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: 'name' | 'categoryId' | 'isFeatured' | 'createdAt' | null;
  sortDirection?: 'asc' | 'desc' | null;
}

export interface CategoryNode {
  categoryId: CategoryId;
  name: string;
  slug: string;
  parentId?: CategoryId | null;
  createdAt: string;
  isFeatured: boolean;
  img?: string | null;
  productCount: number;
  childCount: number;
  children: CategoryNode[];
}

export interface BreadcrumbItem {
  categoryId: CategoryId;
  name: string;
  slug: string;
}

export interface BreadcrumbRes {
  items: BreadcrumbItem[];
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  parentId?: number | null;
  isFeatured: boolean;
  img?: string | null;
}

export interface UpdateCategoryPayload {
  name: string;
  slug: string;
  parentId?: number | null;
  isFeatured: boolean;
  img?: string | null;
}

export interface CreateCategoryRes {
  categoryId: number;
}
