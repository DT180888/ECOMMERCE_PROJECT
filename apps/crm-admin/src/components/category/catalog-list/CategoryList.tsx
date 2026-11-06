import { useMemo, useState, useCallback } from "react";
import {
  useCategoryTree,
  useDeleteCategory,
  useToggleCategoryFeatured,
} from "@hooks/useCategory";
import type {
  CategoryNode,
  CategoryId,
  Category,
} from "@my-project/api";
import { Button, Switch, cn } from "@my-project/ui";
import {
  PencilSquareIcon,
  TrashIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  FolderOpenIcon,
  PhotoIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { buildImgSrc, DEFAULT_PRODUCT_IMAGE_URL } from "@my-project/shared-utils";
import { Guard, AdminPageShell, AdminTable, type AdminTableColumn } from "@shared/ui";
import usePermission from "@hooks/usePermission";
import { useDrawerSearchParams } from "@hooks/useDrawerSearchParams";
import { CategoryDrawerForm } from "../category-form/CategoryDrawerForm";

// --- Types & Helper ---
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

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function CategoryList() {
  const { hasPermission } = usePermission();
  const hasEdit = hasPermission("Permissions.Products.Edit");
  const hasDelete = hasPermission("Permissions.Products.Delete");
  const canPerformActions = hasEdit || hasDelete;

  const { data: tree, isLoading } = useCategoryTree();
  const delMut = useDeleteCategory();
  const toggleFeaturedMut = useToggleCategoryFeatured();
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());

  const isVisible = useCallback((path: number[]) => {
    if (path.length <= 1) return true;
    for (let i = 1; i < path.length; i++) {
      const ancestorPath = path.slice(0, i).join(",");
      if (!openSet.has(ancestorPath)) return false;
    }
    return true;
  }, [openSet]);

  const toggleOpen = useCallback((path: number[]) => {
    const key = path.join(",");
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const handleToggleFeatured = useCallback((id: CategoryId, isFeatured: boolean) => {
    toggleFeaturedMut.mutate({ id, isFeatured });
  }, [toggleFeaturedMut]);

  const handleDelete = useCallback((name: string, id: CategoryId) => {
    if (confirm(`Bạn có chắc muốn xóa vĩnh viễn danh mục "${name}"?`)) {
      delMut.mutate(id);
    }
  }, [delMut]);

  const {
    isOpen: isDrawerOpen,
    editingId,
    openCreate,
    openEdit,
    closeDrawer,
  } = useDrawerSearchParams();

  const flat = useMemo(() => flattenTree(tree ?? []), [tree]);

  const visibleNodes = useMemo(() => {
    return flat.filter(({ path }) => isVisible(path));
  }, [flat, isVisible]);

  const columns = useMemo<AdminTableColumn<FlatNode>[]>(
    () => [
      {
        key: "name",
        label: "Tên danh mục",
        isMain: true,
        render: ({ node, depth, path }) => {
          const key = path.join(",");
          const hasChildren = Boolean(node.children?.length);
          const isOpen = openSet.has(key);
          const category = node as Category;

          return (
            <div
              className="flex items-center overflow-hidden py-1"
              style={{ paddingLeft: depth * 22 }}
            >
              {/* Expand / Collapse Toggle Button */}
              {hasChildren ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOpen(path);
                  }}
                  className="mr-1.5 h-5 w-5 p-0 text-muted-foreground hover:text-foreground hover:bg-foreground/10 border-0 shadow-none shrink-0"
                  aria-label={isOpen ? "Thu gọn danh mục" : "Mở rộng danh mục"}
                  icon={
                    isOpen ? (
                      <ChevronDownIcon className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRightIcon className="w-3.5 h-3.5" />
                    )
                  }
                />
              ) : (
                <span className="w-5 mr-1.5 shrink-0" />
              )}

              {/* Thumbnail Image */}
              <div className="w-7 h-7 rounded-[2px] bg-surface border border-border mr-2.5 shrink-0 flex items-center justify-center overflow-hidden">
                {category.imageUrl || category.img ? (
                  <img
                    src={buildImgSrc(category.imageUrl || category.img!)}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_PRODUCT_IMAGE_URL;
                      e.currentTarget.onerror = null;
                    }}
                  />
                ) : (
                  <PhotoIcon className="w-3.5 h-3.5 text-muted-foreground stroke-[1.25]" />
                )}
              </div>

              {/* Category Name */}
              <div className="flex flex-col min-w-0">
                <span
                  className={cn(
                    "text-xs truncate transition-colors",
                    depth === 0
                      ? "text-foreground font-medium"
                      : "text-muted-foreground group-hover:text-foreground font-normal"
                  )}
                >
                  {node.name}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        key: "createdAt",
        label: "Ngày tạo",
        width: "140px",
        isSub: true,
        render: ({ node }) => {
          const category = node as Category;
          return (
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1 font-mono tabular-nums">
              <CalendarDaysIcon className="w-3.5 h-3.5 text-muted-foreground/60 stroke-[1.25]" />
              {formatDate(category.createdAt)}
            </span>
          );
        },
      },
      {
        key: "productCount",
        label: "Sản phẩm",
        align: "center",
        width: "90px",
        render: ({ node }) => {
          const category = node as Category;
          return (
            <span className="text-[11px] font-mono tabular-nums text-foreground px-2 py-0.5 rounded-[2px] bg-surface">
              {category.productCount ?? 0}
            </span>
          );
        },
      },
      {
        key: "isFeatured",
        label: "Nổi bật",
        align: "center",
        width: "90px",
        render: ({ node }) => {
          const category = node as Category;
          return (
            <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
              <Switch
                checked={category.isFeatured}
                onCheckedChange={(checked) =>
                  handleToggleFeatured(category.categoryId, checked)
                }
                disabled={toggleFeaturedMut.isPending}
                className="data-[state=checked]:bg-foreground"
              />
            </div>
          );
        },
      },
      {
        key: "actions",
        label: "Thao tác",
        align: "right",
        isAction: true,
        width: "80px",
        render: ({ node }) => {
          if (!canPerformActions) return null;
          return (
            <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
              <Guard permission="Permissions.Products.Edit">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-info hover:text-info hover:bg-info/10 rounded-[2px]"
                  title="Chỉnh sửa"
                  onClick={() => openEdit(node.categoryId)}
                >
                  <PencilSquareIcon className="w-3.5 h-3.5 stroke-[1.25]" />
                </Button>
              </Guard>
              <Guard permission="Permissions.Products.Delete">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-error hover:text-error hover:bg-error/10 rounded-[2px]"
                  title="Xóa danh mục"
                  onClick={() => handleDelete(node.name, node.categoryId)}
                  disabled={delMut.isPending}
                >
                  <TrashIcon className="w-3.5 h-3.5 stroke-[1.25]" />
                </Button>
              </Guard>
            </div>
          );
        },
      },
    ],
    [openSet, toggleOpen, canPerformActions, delMut.isPending, toggleFeaturedMut.isPending, handleToggleFeatured, handleDelete, openEdit]
  );

  return (
    <AdminPageShell>
      <AdminPageShell.Header
        title="Danh mục sản phẩm"
        badge={`${flat.length} danh mục`}
        createAction={{
          onClick: openCreate,
          label: "Thêm danh mục",
          canCreate: hasPermission("Permissions.Products.Create"),
        }}
      />
      <AdminPageShell.Body>
        <AdminTable<FlatNode>
          columns={columns}
          data={visibleNodes}
          isLoading={isLoading}
          rowKey={(item) => item.path.join(",")}
          isRowActive={(item) => editingId !== null && item.node.categoryId === Number(editingId)}
          emptyText="Chưa có danh mục nào được tạo."
          emptyIcon={FolderOpenIcon}
          className="border-0 rounded-none"
        />
      </AdminPageShell.Body>
      <AdminPageShell.Inspector>
        <CategoryDrawerForm
          open={isDrawerOpen}
          categoryId={typeof editingId === "number" ? (editingId as CategoryId) : null}
          onClose={closeDrawer}
        />
      </AdminPageShell.Inspector>
    </AdminPageShell>
  );
}
