import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProductList, useDeleteProduct } from "@entities/product/hooks";
import type { ProductListParams } from "@entities/product/types";
import { useBrandOptions } from "@entities/brand/hooks";
import { useCategoryOptions } from "@entities/category/hooks";
import { Button } from "@shared/ui/Button";
import { Input } from "@shared/ui/Input";
import { Select } from "@shared/ui/Select";

const formatVND = (minor: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((minor ?? 0));

export default function ProductListPage() {
  const [sp, setSp] = useSearchParams();

  const [keyword, setKeyword] = useState(sp.get("keyword") ?? "");
  const [brandId, setBrandId] = useState(sp.get("brandId") ?? "");
  const [categoryId, setCategoryId] = useState(sp.get("categoryId") ?? "");
  const [sort, setSort] = useState(sp.get("sort") ?? "");

  const page = Number(sp.get("page") ?? "1");
  const size = Number(sp.get("size") ?? "12");

  const params: ProductListParams = useMemo(
    () => ({
      keyword: sp.get("keyword") || undefined,
      brandId: sp.get("brandId") ? Number(sp.get("brandId")) : undefined,
      categoryId: sp.get("categoryId") ? Number(sp.get("categoryId")) : undefined,
      sort: sp.get("sort") || undefined,
      page,
      size,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sp]
  );

  const { options: brandOptions } = useBrandOptions();
  const { options: categoryOptions } = useCategoryOptions();

  const { data, isLoading } = useProductList(params);
  const delMut = useDeleteProduct();

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / size));

  const apply = () => {
    const next = new URLSearchParams(sp);
    const patch = (k: string, v?: string) => v ? next.set(k, v) : next.delete(k);
    patch("keyword", keyword || undefined);
    patch("brandId", brandId || undefined);
    patch("categoryId", categoryId || undefined);
    patch("sort", sort || undefined);
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
        <h1 className="text-xl font-semibold">Products</h1>
        <Link to="/admin/product/new">
          <Button className="rounded-xl px-4 py-2">+ Tạo Product</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Từ khóa"
        />
        <Select value={brandId} onChange={(e) => setBrandId(e.target.value)}>
          <option value="">-- Brand --</option>
          {brandOptions.map((o) => (
            <option key={o.value} value={String(o.value)}>{o.label}</option>
          ))}
        </Select>
        <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">-- Category --</option>
          {categoryOptions.map((o) => (
            <option key={o.value} value={String(o.value)}>{o.label}</option>
          ))}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Mặc định</option>
          <option value="price_asc">Giá ↑</option>
          <option value="price_desc">Giá ↓</option>
          <option value="created_desc">Mới nhất</option>
          <option value="created_asc">Cũ hơn</option>
        </Select>
      </div>
      <div>
        <Button variant="outline" onClick={apply} className="rounded-xl px-4">Áp dụng</Button>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Tên</th>
              <th className="px-3 py-2 text-left">Slug</th>
              <th className="px-3 py-2 text-left">Brand</th>
              <th className="px-3 py-2 text-left">Giá tối thiểu</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">Đang tải...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">Không có dữ liệu</td></tr>
            ) : (
              items.map((p) => (
                <tr key={p.productId} className="border-t">
                  <td className="px-3 py-2">{p.productId}</td>
                  <td className="px-3 py-2">{p.name}</td>
                  <td className="px-3 py-2 text-gray-500">{p.slug}</td>
                  <td className="px-3 py-2">{p.brandId ?? "-"}</td>
                  <td className="px-3 py-2">{formatVND(p.minPriceMinor)}</td>
                  <td className="px-3 py-2 text-right">
                    <Link to={`/admin/product/${p.productId}`} className="mr-2 underline">Sửa</Link>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => {
                        if (confirm(`Xóa product "${p.name}"?`)) delMut.mutate(p.productId);
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
