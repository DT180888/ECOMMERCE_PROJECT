import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductDetail } from "@entities/product/hooks";
import type { Id, Sku } from "@entities/product/types";
import FullscreenSection from "@shared/ui/FullscreenSection";

const formatVND = (minor: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(minor);

function parseIdFromSlugId(slugId?: string): Id | undefined {
  if (!slugId) return;
  const m = slugId.match(/-(\d+)$/);
  if (!m) return;
  return Number(m[1]);
}

export default function ProductDetailPage() {
  const { slug: slugId } = useParams();
  const id = parseIdFromSlugId(slugId);
  const { data: p, isLoading, isError } = useProductDetail(id, { enabled: !!id });

  const [selectedSku, setSelectedSku] = useState<Sku | null>(null);

  // ⬇️ state giữ ảnh đang hiển thị (chỉ trên FE, không đụng DB)
  const [activeImageId, setActiveImageId] = useState<number | null>(null);
  const baseUrl = "https://localhost:7051";

  // Reset ảnh đang chọn khi product đổi
  useEffect(() => {
    setActiveImageId(null);
  }, [p?.productId]);

  const displayImageUrl = useMemo(() => {
    if (!p?.images?.length) return "/placeholder.svg";

    if (activeImageId != null) {
      const chosen = p.images.find((i) => i.imageId === activeImageId);
      if (chosen) return chosen.url;
    }
    const prim = p.images.find((i) => i.isPrimary) ?? p.images[0];
    return prim.url;
  }, [p, activeImageId]);

  const priceFrom = useMemo(() => {
    if (!p?.skus?.length) return 0;
    return Math.min(...p.skus.filter((s) => s.isActive).map((s) => s.priceMinor));
  }, [p]);

  if (!id) {
    return <div className="container mx-auto p-6">URL không hợp lệ.</div>;
  }
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1600px]"
          style={{ height: "calc(100dvh - var(--hdr,0px) - var(--ftr,0px))" }}
      >
        <FullscreenSection center className="bg-transparent">
          <div className=" w-full overflow-y-auto snap-y snap-mandatory scroll-smooth 
                      [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                      style={{ height: "calc(100dvh - var(--hdr,0px) - var(--ftr,0px) - 48px)" }}
              >
              <div className="container mx-auto p-6 space-y-4">
                <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
                    <div className="space-y-3">
                      <div className="h-6 w-2/3 bg-gray-100 rounded animate-pulse" />
                      <div className="h-6 w-1/3 bg-gray-100 rounded animate-pulse" />
                      <div className="h-24 w-full bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
          </div>
        
        </FullscreenSection>
      </div>
     
    );
  }
  if (isError || !p) {
    
    return (
        <div className="mx-auto w-full max-w-[1600px]"
          style={{ height: "calc(100dvh - var(--hdr,0px) - var(--ftr,0px))" }}
      >
        <FullscreenSection center className="bg-transparent">
          <div className=" w-full overflow-y-auto snap-y snap-mandatory scroll-smooth 
                      [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                      style={{ height: "calc(100dvh - var(--hdr,0px) - var(--ftr,0px) - 48px)" }}
              >
              <div className="container mx-auto p-6">Không tìm thấy sản phẩm.</div>
          </div>
        </FullscreenSection>
      </div>
      
    );
  }

  return (
    <div className="ProductDetailPage">
      <div className="mx-auto w-full max-w-[1600px]"
          style={{ height: "calc(100dvh - var(--hdr,0px) - var(--ftr,0px))" }}
      >
        <FullscreenSection center className="bg-transparent">
          <div className=" w-full overflow-y-auto snap-y snap-mandatory scroll-smooth 
                      [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                      style={{ height: "calc(100dvh - var(--hdr,0px) - var(--ftr,0px) - 48px)" }}
              >
                 <nav className="text-sm text-color mb-3">
          <Link to="/catalog" className="hover:underline">Danh mục</Link>
          <span className="mx-2">/</span>
          <span className="text-color">{p.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gallery */}
          <section>
            <div className="max-w-[500px] aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
              <img
                src={`${baseUrl}${displayImageUrl}`}
                alt={`Ảnh sản phẩm ${p.name}`}
                className="max-w-[500px] max-h-[500px] object-contain"
              />
            </div>

            {p.images?.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {p.images.map((img) => {
                  const isActive = activeImageId === img.imageId ||
                    (activeImageId == null && img.isPrimary);
                  return (
                    <button
                      key={img.imageId}
                      onClick={() => setActiveImageId(img.imageId)}
                      className={`aspect-square rounded-xl overflow-hidden border transition ${
                        isActive ? "border-gray-900 ring-1 ring-gray-900"
                                 : "border-gray-200 hover:border-gray-300"
                      }`}
                      aria-label="Chọn ảnh"
                    >
                      <img
                        src={`${baseUrl}${img.url}`}
                        alt=""
                        className="h-full w-full object-cover 
                                    transform transition duration-300 ease-in-out
                                    hover:scale-110"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Info */}
          <section className="space-y-4">
            <h1 className="text-2xl text-color font-semibold leading-tight">{p.name}</h1>

            <div className="text-xl font-bold text-color">
              {p.skus?.length ? (
                selectedSku
                  ? formatVND(selectedSku.priceMinor)
                  : <>Từ {formatVND(priceFrom)}</>
              ) : (
                "Liên hệ"
              )}
            </div>

            {/* SKU selector */}
            {p.skus && p.skus.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm text-color">Phân loại</div>
                <div className="flex flex-wrap gap-2">
                  {p.skus
                    .filter((s) => s.isActive)
                    .map((s) => {
                      const active = selectedSku?.skuId === s.skuId;
                      return (
                        <button
                          key={s.skuId}
                          onClick={() => setSelectedSku(s)}
                          className={`rounded-xl border px-3 py-1.5 text-sm ${
                            active
                              ? "border-gray-900 bg-gray-900 text-color"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                          title={s.skuCode}
                        >
                          {s.skuCode}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button className="rounded-xl bg-gray-900 text-color px-5 py-3 hover:opacity-80 active:scale-[0.99]">
                Thêm vào giỏ
              </button>
              <button className="rounded-xl border text-color px-5 py-3 hover:bg-gray-900 hover:text-color">
                Mua ngay
              </button>
            </div>

            {/* Attributes */}
            {p.attributes?.length > 0 && (
              <div className="pt-2">
                <h2 className="font-medium mb-2 text-color">Thông tin</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {p.attributes.map((a) => (
                    <div key={a.attributeId} className="flex justify-between gap-6">
                      <span className="text-color">#{a.attributeId}</span>
                      <span className="text-color">
                        {a.valueText ?? a.valueNumber ?? (a.valueBool ? "Có" : "Không")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {p.description && (
              <div className="prose max-w-none">
                <h2 className="font-medium mb-2 text-color">Mô tả</h2>
                <p className="text-color whitespace-pre-line">{p.description}</p>
              </div>
            )}
          </section>
        </div>
          </div>
        
        </FullscreenSection>
      </div>
    </div>
  );
}
