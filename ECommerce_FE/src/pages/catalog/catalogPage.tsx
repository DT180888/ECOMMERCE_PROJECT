import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import CatalogFilters from "@widgets/CatalogFilters/CatalogFilters";
import ProductGrid from "@widgets/Product/ProductGrid";
import { useProductList } from "@entities/product/hooks";
import type { ProductListParams } from "@entities/product/types";
import { Button } from "@shared/ui/Button";
import { useBrandOptions } from "@entities/brand/hooks";
import { useCategoryOptions } from "@entities/category/hooks";

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

  const { options: brandOptions } = useBrandOptions(sp.get("brand") ?? "");
  const { options: categoryOptions } = useCategoryOptions(); 

  return (
    <div
          className="flex gap-3 mx-auto w-full max-w-[1600px]"
          style={{ height: "calc(100dvh - var(--hdr,0px) - var(--ftr,0px))" }}
        >

          <aside className="">
                <CatalogFilters brandOptions={brandOptions} categoryOptions={categoryOptions} />
            {/* <CatalogFilters /> */}
          </aside>

          <div className="w-full max-w-[1576px] py-3 h-[100%]"
           style={{ height: "calc(100dvh - var(--hdr,0px) - var(--ftr,0px))" }}
          >
            <div className=" w-full h-full overflow-y-hiden snap-y snap-mandatory scroll-smooth 
                      [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                      style={{ height: "calc(100dvh - var(--hdr,0px) - var(--ftr,0px) - 48px)" }}
            >
                <div className="flex flex-col gap-4 h-full overflow-y-hiden">

                  <main className="space-y-4 h-full">
                    <div className="h-full overflow-y-auto
                                    [&::-webkit-scrollbar]:w-2
                                    [&::-webkit-scrollbar-track]:bg-transparent
                                  [&::-webkit-scrollbar-thumb]:bg-white/30
                                    [&::-webkit-scrollbar-thumb]:rounded-full
                                  hover:[&::-webkit-scrollbar-thumb]:bg-white/50
                                    [scrollbar-width:thin]
                                    [scrollbar-color:theme(colors.white/30)_transparent]"
                        style={{ height: "calc(100dvh - var(--hdr,0px) - var(--ftr,0px) - 98px)" }}
                    >
                      <ProductGrid items={items} isLoading={isLoading} />
                      
                    </div>

                    

                    <div className="background-glass rounded-[12px] flex items-center py-2 px-3 text-color text-[16px]">
                    {/* Pagination */}
                      <div className="flex flex-1 items-center justify-between">
                        <div className="">
                          {isLoading ? "Đang tải..." : `Tìm thấy ${total} sản phẩm`}
                        </div>
                      </div>
                      <div className="flex flex-1 items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          disabled={page <= 1}
                          onClick={() => goPage(page - 1)}
                          className="rounded-xl px-4 py-2"
                        >
                          Trước
                        </Button>
                        <span className="">
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
                      <div className="flex flex-1">

                      </div>
                    </div>
               
                  </main>
                </div>
              </div>
          </div>
             
    </div>
   
    
  );
}
