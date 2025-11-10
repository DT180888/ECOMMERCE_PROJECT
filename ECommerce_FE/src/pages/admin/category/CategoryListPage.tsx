import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCategoryTree, useDeleteCategory } from "@entities/category/hooks";
import type { CategoryNode } from "@entities/category/types";
import { Button } from "@shared/ui/Button";

type FlatNode = {
  node: CategoryNode;
  depth: number;
  path: number[]; // để xác định unique path trong cây
};

function flattenTree(nodes: CategoryNode[], depth = 0, path: number[] = []): FlatNode[] {
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

function caret(isOpen: boolean, hasChildren: boolean) {
  if (!hasChildren) return <span className="inline-block w-4" />;
  return (
    <span className="inline-block w-4 transform transition-transform" style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>
      ▶
    </span>
  );
}

export default function CategoryListPage() {
  const { data: tree, isLoading } = useCategoryTree();
  const delMut = useDeleteCategory();

  // Set lưu các "đường dẫn" node đang mở (stringified path, vd "0,2,1")
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());

  const flat = useMemo(() => flattenTree(tree ?? []), [tree]);

  // Quyết định một node có hiển thị không dựa theo openSet của tổ tiên
  const isVisible = (path: number[]) => {
    // gốc luôn thấy
    if (path.length <= 1) return true;
    // duyệt tất cả ancestor (trừ bản thân), ancestor phải open
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

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categories (Tree)</h1>
        <Link to="/admin/category/new">
          <Button className="rounded-xl px-4 py-2">+ Tạo Category</Button>
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-t-xl">
          <div className="col-span-6">Tên (cấp bậc)</div>
          <div className="col-span-3">Slug</div>
          {/* <div className="col-span-2">ParentId</div> */}
          <div className="col-span-3 text-right">Actions</div>
        </div>

        {isLoading ? (
          <div className="px-3 py-6 text-center text-gray-500">Đang tải...</div>
        ) : !flat.length ? (
          <div className="px-3 py-6 text-center text-gray-500">Chưa có category</div>
        ) : (
          <ul>
            {flat.map(({ node, depth, path }) => {
              const key = path.join(",");
              const hasChildren = !!node.children?.length;
              const open = openSet.has(key);
              if (!isVisible(path)) return null;

              return (
                <li key={key} className="grid grid-cols-12 gap-2 px-3 py-2 border-t">
                  <div className="col-span-6 flex items-center">
                    <button
                      type="button"
                      className="mr-2 text-gray-700"
                      onClick={() => hasChildren && toggleOpen(path)}
                      aria-label="toggle children"
                      disabled={!hasChildren}
                      title={hasChildren ? (open ? "Thu gọn" : "Mở rộng") : "Không có danh mục con"}
                    >
                      {caret(open, hasChildren)}
                    </button>

                    <div
                      className="truncate"
                      style={{ marginLeft: depth * 16 /* 16px mỗi cấp */ }}
                    >
                      {node.name}
                    </div>
                  </div>

                  <div className="col-span-3 truncate text-gray-600">{node.slug}</div>
                  {/* <div className="col-span-2">{node.parentId ?? "-"}</div> */}

                  <div className="col-span-3 text-right">
                    <Link to={`/admin/category/${node.categoryId}`} className="mr-3 underline">Sửa</Link>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => {
                        if (confirm(`Xóa category "${node.name}"?`)) {
                          delMut.mutate(node.categoryId);
                        }
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
