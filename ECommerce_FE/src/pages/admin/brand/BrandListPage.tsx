import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useBrandList, useDeleteBrand } from "@entities/brand/hooks";
import type { BrandListParams } from "@entities/brand/types";
import { Button } from "@shared/ui/Button";
import { Input } from "@shared/ui/Input";

export default function BrandListPage() {
  const [sp, setSp] = useSearchParams();
  const [q, setQ] = useState(sp.get("keyword") ?? "");
  const page = Number(sp.get("page") ?? "1");
  const size = Number(sp.get("size") ?? "10");

  const params: BrandListParams = useMemo(
    () => ({ keyword: sp.get("keyword") ?? undefined, page, size }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sp]
  );

  const { data, isLoading } = useBrandList(params);
  const delMut = useDeleteBrand();

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / size));

  const applySearch = () => {
    const next = new URLSearchParams(sp);
    if (q) next.set("keyword", q);
    else next.delete("keyword");
    next.set("page", "1");
    setSp(next);
  };

  const goPage = (p: number) => {
    const next = new URLSearchParams(sp);
    next.set("page", String(p));
    next.set("size", String(size));
    setSp(next);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Brands</h1>
        <Link to="/admin/brand/new">
          <Button className="rounded-xl px-4 py-2">+ Tạo Brand</Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm theo tên..."
          className="max-w-xs"
        />
        <Button onClick={applySearch} variant="outline" className="rounded-xl px-4">
          Tìm
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Slug</th>
              <th className="px-3 py-2 text-left">Created</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-500">Đang tải...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-500">Không có dữ liệu</td></tr>
            ) : (
              items.map((b) => (
                <tr key={b.brandId} className="border-t">
                  <td className="px-3 py-2">{b.brandId}</td>
                  <td className="px-3 py-2">{b.name}</td>
                  <td className="px-3 py-2 text-gray-500">{b.slug}</td>
                  <td className="px-3 py-2">{new Date(b.createdAt).toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">
                    <Link to={`/admin/brand/${b.brandId}`} className="mr-2 underline">Sửa</Link>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => {
                        if (confirm(`Xóa brand "${b.name}"?`)) delMut.mutate(b.brandId);
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" disabled={page <= 1} onClick={() => goPage(page - 1)}>
          Trước
        </Button>
        <span className="text-sm text-gray-600">Trang {page}/{totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => goPage(page + 1)}>
          Sau
        </Button>
      </div>
    </div>
  );
}
