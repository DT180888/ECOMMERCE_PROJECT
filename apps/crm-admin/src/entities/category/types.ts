// src/entities/category/types.ts
export type CategoryId = number;

// ===================================
// 1. CẬP NHẬT: Category (Model Chính)
// ===================================
export interface Category {
  categoryId: CategoryId;
  name: string;
  slug: string;
  parentId?: CategoryId | null;
  createdAt: string; // ISO 8601

  // --- BỔ SUNG TRƯỜNG MỚI (9 trường) ---
  isFeatured: boolean;
  img?: string | null; // URL ảnh bìa
  productCount: number;    // Số lượng sản phẩm trực tiếp
  childCount: number;      // Số lượng danh mục con trực tiếp
  // ------------------------------------
}

// ===================================
// 2. CẬP NHẬT: CategoryListParams (Cho Sắp xếp động)
// ===================================
export interface CategoryListParams {
  keyword?: string;
  // page và size đã có giá trị mặc định ở BE, nhưng vẫn nên khai báo ở FE
  page?: number;
  size?: number;

  // --- BỔ SUNG TRƯỜNG SẮP XẾP ---
  sortBy?: 'name' | 'categoryId' | 'isFeatured' | 'createdAt' | null; // Các trường BE hỗ trợ
  sortDirection?: 'asc' | 'desc' | null;
  // -----------------------------
}

export interface PageRes<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

// ---- Tree ----
// (CategoryNode không cần thay đổi nếu nó chỉ dùng cho cấu trúc menu, không cần count/image)
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

// ---- Breadcrumb ----
export interface BreadcrumbItem {
  categoryId: CategoryId;
  name: string;
  slug: string;
}
export interface BreadcrumbRes {
  items: BreadcrumbItem[];
}

// ===================================
// 3. CẬP NHẬT: Payloads (Cho Admin Write Commands)
// ===================================

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  parentId?: number | null;

  // --- BỔ SUNG ---
  isFeatured: boolean;
  img?: string | null; // URL TẠM THỜI (tmp/...)
  // ---------------
}

export interface UpdateCategoryPayload {
  name: string;
  slug: string;
  parentId?: number | null;

  // --- BỔ SUNG ---
  isFeatured: boolean;
  img?: string | null; // URL TẠM THỜI/MỚI
  // ---------------
}

export interface CreateCategoryRes {
  categoryId: number;
}