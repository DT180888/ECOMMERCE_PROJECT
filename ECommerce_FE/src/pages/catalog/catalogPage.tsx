import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import CatalogFilters from "@widgets/CatalogFilters/CatalogFilters";
import ProductGrid from "@widgets/Product/ProductGrid";
import { useProductList } from "@entities/product/hooks";
import type { ProductListParams } from "@entities/product/types";
import { Button } from "@shared/ui/Button";

const parseIntOrUndef = (v: string | null) => (v ? parseInt(v, 10) : undefined);

export default function CatalogPage() {
  const [sp, setSp] = useSearchParams();

  const page = parseInt(sp.get("page") || "1", 10);
  const size = parseInt(sp.get("size") || "12", 10);

  const params: ProductListParams = useMemo(
    () => ({
      keyword: sp.get("keyword") || undefined,
      brandId: parseIntOrUndef(sp.get("brandId")),
      categoryId: parseIntOrUndef(sp.get("categoryId")),
      priceMin: parseIntOrUndef(sp.get("priceMin")),
      priceMax: parseIntOrUndef(sp.get("priceMax")),
      sort: sp.get("sort") || undefined,
      page,
      size,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sp]
  );

  const { data, isLoading } = useProductList(params);
  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const totalPages = Math.max(1, Math.ceil(total / size));

  const goPage = (p: number) => {
    const next = new URLSearchParams(sp);
    next.set("page", String(p));
    next.set("size", String(size));
    setSp(next);
  };

  // const brandOptions = [];    // TODO: đổ từ API brand khi có
  // const categoryOptions = []; // TODO: đổ từ API category khi có

  return (
    <div className="page ">
      <div className="background-glass rounded-[16px] w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <aside className="md:col-span-3">
          {/* <CatalogFilters brandOptions={brandOptions} categoryOptions={categoryOptions} /> */}
          <CatalogFilters />

        </aside>

        <main className="md:col-span-9 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {isLoading ? "Đang tải..." : `Tìm thấy ${total} sản phẩm`}
            </div>
          </div>

          <ProductGrid items={items} isLoading={isLoading} />

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => goPage(page - 1)}
              className="rounded-xl px-4 py-2"
            >
              Trước
            </Button>
            <span className="text-sm text-gray-600">
              Trang {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => goPage(page + 1)}
              className="rounded-xl px-4 py-2"
            >
              Sau
            </Button>
          </div>
        </main>
      </div>
    </div>
    </div>
    
  );
}
