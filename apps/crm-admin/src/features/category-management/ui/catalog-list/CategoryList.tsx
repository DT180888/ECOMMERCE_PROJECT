import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  useCategoryTree,
  useDeleteCategory,
  useToggleCategoryFeatured,
} from "@entities/category/hooks";
import type {
  CategoryNode,
  CategoryId,
  Category,
} from "@entities/category/types";
import { Button } from "@my-project/ui";
import { Switch } from "@my-project/ui";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon,
  FolderOpenIcon,
  ListBulletIcon,
  PhotoIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { buildImgSrc } from "@shared/lib/url";
import { DEFAULT_PRODUCT_IMAGE_URL } from "@shared/constants";
import { AdminPageShell, Guard } from "@shared/ui";
import usePermission from "@shared/hooks/usePermission";

// --- Types & Helper (Giữ nguyên) ---
type FlatNode = {
  node: CategoryNode;
  depth: number;
  path: number[];
};

function flattenTree(
  nodes: CategoryNode[],
  depth = 0,
  path: number[] = []
): FlatNode[] {
  const out: FlatNode[] = [];
  nodes.forEach((n, idx) => {
    const curPath = [...path, idx];
    out.push({ node: n, depth, path: curPath });
    if (n.children?.length) {
      out.push(...flattenTree(n.children, depth + 1, curPath));
    }
  });
  return out;
}

// Hàm format ngày tháng (đơn giản)
const formatDate = (dateStr?: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function CategoryList({ isNested = false }: { isNested?: boolean }) {
  const { hasPermission } = usePermission();
  const hasEdit = hasPermission("Permissions.Products.Edit");
  const hasDelete = hasPermission("Permissions.Products.Delete");
  const canPerformActions = hasEdit || hasDelete;

  const { data: tree, isLoading } = useCategoryTree();
  const delMut = useDeleteCategory();
  const toggleFeaturedMut = useToggleCategoryFeatured();
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());

  const isVisible = (path: number[]) => {
    if (path.length <= 1) return true;
    for (let i = 1; i < path.length; i++) {
      const ancestorPath = path.slice(0, i).join(",");
      if (!openSet.has(ancestorPath)) return false;
    }
    return true;
  };

  const toggleOpen = (path: number[]) => {
    const key = path.join(",");
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleToggleFeatured = (id: CategoryId, isFeatured: boolean) => {
    toggleFeaturedMut.mutate({ id, isFeatured });
  };

  const handleDelete = (name: string, id: CategoryId) => {
    if (confirm(`Bạn có chắc muốn xóa vĩnh viễn danh mục "${name}"?`)) {
      delMut.mutate(id);
    }
  };

  const flat = useMemo(() => flattenTree(tree ?? []), [tree]);

  const nameColClass = canPerformActions
    ? "col-span-6 lg:col-span-5"
    : "col-span-10 md:col-span-8 lg:col-span-7";

  return (
    <AdminPageShell
      icon={ListBulletIcon}
      title="Danh mục sản phẩm"
      badge="Tree View"
      isNested={isNested}
      actions={
        <Link to="/admin/category/new">
          <Button variant="default">
            <PlusIcon className="w-3 h-3 md:w-4 md:h-4 mr-1.5" /> Thêm danh mục
          </Button>
        </Link>
      }
      noCard
    >
      {/* --- TREE TABLE SECTION --- */}
      <div className="flex-1 rounded-card flex flex-col overflow-hidden relative border border-foreground/5 bg-card">
        {/* Sticky Header (Đã chỉnh lại Grid) */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 md:px-6 md:py-5 bg-secondary/10 text-xs text-muted-foreground font-semibold tracking-wider sticky top-0 z-20 uppercase border-b border-border/10">
          {/* Cột Tên mở rộng: 5 phần */}
          <div className={`${nameColClass} pl-2`}>Tên danh mục</div>

          {/* Cột Ngày tạo (Mới): 2 phần - Ẩn trên Mobile */}
          <div className="col-span-2 hidden lg:block pl-2">Ngày tạo</div>

          {/* Cột Thống kê: 1 phần - Ẩn trên Mobile */}
          <div className="col-span-1 hidden md:block text-center">SP</div>

          {/* Cột Nổi bật: 2 phần */}
          <div className="col-span-2 text-center">Nổi bật</div>

          {/* Cột Thao tác: 2 phần */}
          {canPerformActions && (
            <div className="col-span-4 md:col-span-2 text-right pr-2">
              Thao tác
            </div>
          )}
        </div>

        {/* Scrollable List */}
        <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground animate-pulse">
              <FolderIcon className="w-10 h-10 opacity-50" />
              <span>Đang tải cấu trúc cây...</span>
            </div>
          ) : !flat.length ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
              <FolderOpenIcon className="w-12 h-12 opacity-20" />
              <span className="italic">Chưa có danh mục nào được tạo.</span>
            </div>
          ) : (
            <ul className="space-y-1 pb-10">
              {flat.map(({ node, depth, path }) => {
                const key = path.join(",");
                const category = node as Category; // Đảm bảo type Category có imageUrl, createdAt
                const hasChildren = !!node.children?.length;
                const isOpen = openSet.has(key);

                if (!isVisible(path)) return null;

                return (
                  <li
                    key={key}
                    className="grid grid-cols-12 gap-4 px-3 py-2.5 rounded-button hover:bg-foreground/5 transition-colors items-center group border border-transparent hover:border-foreground/5"
                  >
                    {/* 1. Name Column + Image + Tree Indentation */}
                    <div
                      className={`${nameColClass} flex items-center overflow-hidden`}
                      style={{ paddingLeft: depth * 24 }}
                    >
                      {/* Toggle Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          hasChildren && toggleOpen(path);
                        }}
                        disabled={!hasChildren}
                        className={`mr-1 p-1 rounded-inner transition-all shrink-0 ${
                          hasChildren
                            ? "hover:bg-foreground/10 text-muted-foreground hover:text-foreground cursor-pointer"
                            : "opacity-0 pointer-events-none w-6"
                        }`}
                      >
                        {isOpen ? (
                          <ChevronDownIcon className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRightIcon className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* --- MỚI: Thumbnail Image --- */}
                      <div className="w-8 h-8 rounded-inner bg-secondary/10 border border-border/10 mr-3 shrink-0 flex items-center justify-center overflow-hidden relative">
                        {category.img ? (
                          <img
                            // 1. Dùng buildImgSrc để xử lý đường dẫn (thêm base URL nếu cần)
                            src={buildImgSrc(category.img)}
                            alt={category.name}
                            className="w-full h-full object-cover"
                            // 2. (Quan trọng) Xử lý fallback nếu ảnh bị lỗi 404
                            onError={(e) => {
                              e.currentTarget.src = DEFAULT_PRODUCT_IMAGE_URL;
                              // Hoặc nếu bạn muốn ẩn ảnh đi để hiện PhotoIcon phía sau (nếu có logic state),
                              // nhưng gán ảnh default là cách nhanh nhất.
                              e.currentTarget.onerror = null; // Tránh loop vô hạn nếu ảnh default cũng lỗi
                            }}
                          />
                        ) : (
                          <PhotoIcon className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                        )}
                      </div>

                      {/* Category Name & Slug */}
                      <div className="flex flex-col min-w-0">
                        <span
                          className={`font-medium text-sm truncate ${
                            depth === 0
                              ? "text-foreground font-semibold"
                              : "text-muted-foreground group-hover:text-foreground transition-colors"
                          }`}
                        >
                          {node.name}
                        </span>
                        {/* Mobile only stats */}
                        <div className="md:hidden flex gap-2 text-[10px] text-muted-foreground">
                          <span>{category.productCount ?? 0} SP</span>
                          {hasChildren && (
                            <span>• {node.children?.length} con</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 2. MỚI: Created Date Column */}
                    <div className="col-span-2 hidden lg:flex items-center text-xs text-muted-foreground pl-2">
                      <CalendarDaysIcon className="w-3.5 h-3.5 mr-1.5 opacity-50" />
                      {formatDate(category.createdAt)}
                    </div>

                    {/* 3. Stats Column (Desktop only) */}
                    <div className="col-span-1 hidden md:flex flex-col items-center justify-center text-xs">
                      <span className="bg-secondary/10 text-foreground px-2 py-0.5 rounded border border-border/10 min-w-[30px] text-center">
                        {category.productCount ?? 0}
                      </span>
                    </div>

                    {/* 4. Featured Switch */}
                    <div className="col-span-2 flex justify-center">
                      <Switch
                        checked={category.isFeatured}
                        onCheckedChange={(checked) =>
                          handleToggleFeatured(category.categoryId, checked)
                        }
                        disabled={toggleFeaturedMut.isPending}
                        className="data-[state=checked]:bg-accent bg-secondary/20"
                      />
                    </div>

                    {/* 5. Actions */}
                    {canPerformActions && (
                      <div className="col-span-4 md:col-span-2 flex justify-end items-center gap-1 md:gap-2">
                        <div className="flex items-center bg-secondary/10 rounded-button p-0.5 border border-border/10 group-hover:border-border/20 transition-colors">
                          <Guard permission="Permissions.Products.Edit">
                            <Link to={`/admin/category/${node.categoryId}`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-accent hover:bg-accent/10"
                                title="Chỉnh sửa"
                              >
                                <PencilSquareIcon className="w-3 h-3 md:w-4 md:h-4" />
                              </Button>
                            </Link>
                          </Guard>

                          <Guard permission="Permissions.Products.Edit">
                            <Guard permission="Permissions.Products.Delete">
                              <div className="w-[1px] h-4 bg-border/20 mx-0.5"></div>
                            </Guard>
                          </Guard>

                          <Guard permission="Permissions.Products.Delete">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                              title="Xóa danh mục"
                              onClick={() =>
                                handleDelete(node.name, node.categoryId)
                              }
                              disabled={delMut.isPending}
                            >
                              <TrashIcon className="w-3 h-3 md:w-4 md:h-4" />
                            </Button>
                          </Guard>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </AdminPageShell>
  );
}

