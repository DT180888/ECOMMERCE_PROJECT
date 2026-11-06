import { useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useProductList } from "@hooks/useProduct";
import type { ProductListParams, ProductCard } from "@my-project/api";
import { useBrandOptions } from "@hooks/useBrand";
import { useCategoryOptions } from "@hooks/useCategory";
import { CubeIcon, ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import { AdminPageShell, AdminDataView } from "@shared/ui";
import { useProductColumns } from "./useProductColumns";
import { ProductSearchActions, ProductAdvancedPanel } from "./ProductToolbar";

const SORT_OPTIONS = [
  { value: "", label: "Mặc định" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
  { value: "created_desc", label: "Mới nhất" },
  { value: "created_asc", label: "Cũ hơn" },
];

export function ProductList() {
  const [sp, setSp] = useSearchParams();

  const [keyword, setKeyword] = useState(sp.get("keyword") ?? "");
  const [brandId, setBrandId] = useState(sp.get("brandId") ?? "");
  const [categoryId, setCategoryId] = useState(sp.get("categoryId") ?? "");
  const [sort, setSort] = useState(sp.get("sort") ?? "");
  
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

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
    [sp, page, size]
  );

  const { options: brandOptions } = useBrandOptions();
  const { options: categoryOptions } = useCategoryOptions();
  const { data, isLoading } = useProductList(params);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const brandName = useCallback(
    (bid?: number | null) =>
      bid ? (brandOptions.find((b) => Number(b.value) === bid)?.label ?? String(bid)) : "—",
    [brandOptions]
  );

  const apply = useCallback(() => {
    const next = new URLSearchParams(sp);
    const patch = (k: string, v?: string) => (v ? next.set(k, v) : next.delete(k));
    patch("keyword", keyword || undefined);
    patch("brandId", brandId || undefined);
    patch("categoryId", categoryId || undefined);
    patch("sort", sort || undefined);
    next.set("page", "1");
    setSp(next);
  }, [keyword, brandId, categoryId, sort, sp, setSp]);

  const clearFilters = useCallback(() => {
    setKeyword("");
    setBrandId("");
    setCategoryId("");
    setSort("");
    const next = new URLSearchParams(sp);
    ["keyword", "brandId", "categoryId", "sort"].forEach((k) => next.delete(k));
    next.set("page", "1");
    setSp(next);
  }, [sp, setSp]);

  const goPage = useCallback(
    (p: number) => {
      const next = new URLSearchParams(sp);
      next.set("page", String(p));
      next.set("size", String(size));
      setSp(next);
    },
    [sp, size, setSp]
  );

  const columns = useProductColumns({ brandName });

  const toolbarProps = {
    keyword, setKeyword,
    brandId, setBrandId,
    categoryId, setCategoryId,
    sort, setSort,
    brandOptions, categoryOptions, SORT_OPTIONS,
    apply, clearFilters,
    isAdvancedOpen, setIsAdvancedOpen
  };

  return (
    <AdminPageShell>
      <AdminPageShell.Header
        icon={CubeIcon}
        title="Quản lý Sản phẩm"
        badge={`${total} sản phẩm`}
      />
      <AdminPageShell.Body>
        <AdminDataView<ProductCard>
          columns={columns}
          data={items}
          isLoading={isLoading}
          rowKey="productId"
          enableCardView={true}
          storageKey="crm_product_view"
          defaultViewMode="table"
          actions={<ProductSearchActions {...toolbarProps} />}
          expandedFilter={<ProductAdvancedPanel {...toolbarProps} />}
          pagination={{
            page,
            total,
            pageSize: size,
            onPageChange: goPage,
          }}
          emptyText="Không tìm thấy sản phẩm"
          emptyIcon={ArchiveBoxXMarkIcon}
          className="border-0 shadow-none rounded-none bg-transparent flex-1"
        />
      </AdminPageShell.Body>
    </AdminPageShell>
  );
}
