import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useProductDetail } from "@entities/product/hooks";
import { useSmartCart } from "@features/client/cart/useSmartCart";
import { buildImgSrc } from "@shared/lib/url";
import SkuSelector from "@widgets/client/Product/SkuSelector";
import { DEFAULT_PRODUCT_IMAGE_URL } from "@shared/constants";
import { useToast } from "@my-project/ui";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@my-project/ui";
import { useInView } from "react-intersection-observer";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@my-project/ui";

const formatVND = (minor: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(minor);

function parseIdFromSlugId(slugId?: string): number | undefined {
  if (!slugId) return;
  const m = slugId.match(/-(\d+)$/);
  if (!m) return;
  return Number(m[1]);
}

export default function ProductDetailPage() {
  const { slug: slugId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const id = parseIdFromSlugId(slugId);
  const { data: p, isLoading, isError } = useProductDetail(id, { enabled: !!id });

  const [selectedSkuId, setSelectedSkuId] = useState<number | null>(null);
  const [selectedSkuPrice, setSelectedSkuPrice] = useState<number | undefined>(undefined);
  const [selectedSkuCode, setSelectedSkuCode] = useState<string | undefined>(undefined);
  const [activeImageId, setActiveImageId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "specs">("description");

  const { addToCart, isActionPending } = useSmartCart();

  const { ref: mainBtnRef, inView: mainBtnInView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    setActiveImageId(null);
    setSelectedSkuId(null);
    setSelectedSkuPrice(undefined);
    setSelectedSkuCode(undefined);
    setActiveTab("description");
  }, [p?.productId]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const currentImgElement = e.currentTarget as HTMLImageElement;
    if (currentImgElement.src !== DEFAULT_PRODUCT_IMAGE_URL) {
      currentImgElement.src = DEFAULT_PRODUCT_IMAGE_URL;
    }
  };

  const displayImageUrl = useMemo(() => {
    if (!p?.images?.length) return DEFAULT_PRODUCT_IMAGE_URL;
    if (activeImageId != null) {
      const chosen = p.images.find((i) => i.imageId === activeImageId);
      if (chosen) return buildImgSrc(chosen.url);
    }
    const prim = p.images.find((i) => i.isPrimary) ?? p.images[0];
    return buildImgSrc(prim?.url) || DEFAULT_PRODUCT_IMAGE_URL;
  }, [p, activeImageId]);

  const priceFrom = useMemo(() => {
    if (!p?.skus?.length) return 0;
    const actives = p.skus.filter((s) => s.isActive);
    if (!actives.length) return 0;
    return Math.min(...actives.map((s) => s.priceMinor));
  }, [p]);

  const handleSkuChange = useCallback(
    (skuId: number | null, priceMinor?: number, skuCode?: string) => {
      setSelectedSkuId(skuId);
      setSelectedSkuPrice(priceMinor);
      setSelectedSkuCode(skuCode);
    },
    []
  );

  const handleAddToCart = async () => {
    if (!selectedSkuId || selectedSkuPrice === undefined || !selectedSkuCode || !p) return;
    try {
      await addToCart({
        skuId: selectedSkuId,
        quantity: 1,
        name: p.name,
        skuCode: selectedSkuCode,
        priceMinor: selectedSkuPrice,
        primaryImageUrl: displayImageUrl,
      });
      toast.success("ÄÃ£ thÃªm sáº£n pháº©m vÃ o giá» hÃ ng");
    } catch (error: any) {
            toast.error(error?.message || "Lá»—i khi thÃªm vÃ o giá» hÃ ng");
          }
  };

  const handleBuyNow = async () => {
    if (!selectedSkuId) {
      toast.info("Vui lÃ²ng chá»n phÃ¢n loáº¡i hÃ ng");
      return;
    }
    await handleAddToCart();
    navigate("/cart");
  };

  if (!id) return <div className="container mx-auto p-6 text-center mt-10 text-gray-400">URL khÃ´ng há»£p lá»‡.</div>;

  if (isLoading) {
    return (
      <div className="client-page-container space-y-8 mt-4">
        <div className="h-4 w-40 bg-muted/20 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 aspect-square bg-muted/20 rounded-card animate-pulse max-w-[480px] w-full mx-auto" />
          <div className="lg:col-span-7 space-y-4">
            <div className="h-10 w-3/4 bg-muted/20 rounded animate-pulse" />
            <div className="h-6 w-1/4 bg-muted/20 rounded animate-pulse" />
            <div className="h-32 w-full bg-muted/20 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !p) {
    return <div className="container mx-auto p-6 text-center mt-10 text-red-400">KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m.</div>;
  }

  return (
    <div className="w-full animate-in fade-in duration-700 pb-20">
      <div className="client-page-container pt-6 md:pt-10">
        
        <nav className="text-xs font-bold text-muted flex flex-wrap items-center gap-x-2 gap-y-1.5 mb-6 md:mb-8 uppercase tracking-widest">
          <Link to="/" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Home</Link>
          <ChevronRightIcon className="w-3 h-3 shrink-0" />
          <Link to="/catalog" className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Shop</Link>
          <ChevronRightIcon className="w-3 h-3 shrink-0" />
          <span className="text-foreground truncate max-w-[120px] sm:max-w-[250px] md:max-w-[350px]">{p.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          <section className="w-full lg:col-span-5 lg:sticky lg:top-24 self-start space-y-4">
            <div className="aspect-square w-full max-w-[480px] mx-auto rounded-card overflow-hidden bg-background shadow-neo-sm p-6 flex items-center justify-center">
              <img
                src={displayImageUrl}
                alt={p.name}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                onError={handleImageError}
              />
            </div>
            
            {p.images && p.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-2 justify-center max-w-[480px] mx-auto px-2 custom-scrollbar">
                {p.images.map((img, idx) => {
                  const isActive = activeImageId === img.imageId || (activeImageId == null && img.isPrimary);
                  const thumbSrc = buildImgSrc(img.url) || DEFAULT_PRODUCT_IMAGE_URL;
                  return (
                    <button
                      key={img.imageId}
                      onClick={() => setActiveImageId(img.imageId)}
                      className={`w-16 h-16 shrink-0 rounded-inner p-1 bg-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        isActive ? "shadow-neo-inset-sm" : "shadow-neo-sm hover:shadow-neo-hover"
                      }`}
                      aria-label={`Xem hÃ¬nh áº£nh ${idx + 1}`}
                    >
                      <div className="w-full h-full overflow-hidden rounded-gallery bg-background flex items-center justify-center p-1">
                        <img
                          src={thumbSrc}
                          alt={`${p.name} thumbnail ${idx + 1}`}
                          className="w-full h-full object-contain"
                          onError={handleImageError}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="w-full lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
                {p.brandName || "Premium Collection"}
              </div>
              <h1 className="responsive-h3 text-foreground leading-tight tracking-tight">
                {p.name}
              </h1>
              
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl lg:text-3xl font-bold text-foreground">
                  {selectedSkuPrice !== undefined ? formatVND(selectedSkuPrice) : (
                    p.skus?.length ? formatVND(priceFrom) : "LiÃªn há»‡"
                  )}
                </span>
                {!selectedSkuPrice && p.skus?.length > 0 && (
                  <span className="text-[10px] font-bold text-muted uppercase tracking-[0.15em]">GiÃ¡ tá»«</span>
                )}
              </div>
            </div>

            {p.productId && (
              <div className="py-2">
                <SkuSelector
                  key={p.productId} 
                  productId={p.productId}
                  onChange={handleSkuChange}
                />
              </div>
            )}

            <div ref={mainBtnRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Button
                className="h-12 rounded-button font-bold text-sm w-full"
                disabled={!selectedSkuId || isActionPending}
                onClick={handleAddToCart}
              >
                {isActionPending ? "Chá»..." : "ThÃªm vÃ o giá»"}
              </Button>
 
              <Button
                variant="outline"
                className="h-12 rounded-button font-bold text-sm w-full"
                disabled={isActionPending}
                onClick={handleBuyNow}
              >
                Mua ngay
              </Button>
            </div>

            <div className="pt-6">
              <div className="h-[3px] w-full rounded-full bg-background shadow-neo-inset-sm mb-6" />
              <div className="flex flex-wrap gap-x-8 gap-y-4 text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="w-4.5 h-4.5 text-muted shrink-0" strokeWidth={1.5} />
                  <div>
                    <span className="font-bold text-foreground">Freeship</span>{" "}
                    <span className="text-muted">tá»« 1.000.000Ä‘</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4.5 h-4.5 text-muted shrink-0" strokeWidth={1.5} />
                  <div>
                    <span className="font-bold text-foreground">Äá»•i tráº£</span>{" "}
                    <span className="text-muted">trong 30 ngÃ y</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-muted shrink-0" strokeWidth={1.5} />
                  <div>
                    <span className="font-bold text-foreground">Báº£o máº­t</span>{" "}
                    <span className="text-muted">thanh toÃ¡n an toÃ n</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="w-full mt-16 pt-10">
          <div className="h-[3px] w-full rounded-full bg-background shadow-neo-inset-sm mb-10" />
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "description" | "specs")}>
            <TabsList className="mb-8">
              <TabsTrigger value="description">MÃ´ táº£ sáº£n pháº©m</TabsTrigger>
              <TabsTrigger value="specs">ThÃ´ng sá»‘ ká»¹ thuáº­t</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="animate-in fade-in duration-300">
              {p.description ? (
                <p className="text-muted leading-relaxed whitespace-pre-line text-sm max-w-3xl">
                  {p.description}
                </p>
              ) : (
                <p className="text-muted italic text-sm">ChÆ°a cÃ³ mÃ´ táº£ cho sáº£n pháº©m nÃ y.</p>
              )}
            </TabsContent>

            <TabsContent value="specs" className="animate-in fade-in duration-300">
              {p.attributes && p.attributes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                  {p.attributes.map((a) => (
                    <div key={a.attributeId} className="flex justify-between py-3 px-4 bg-background shadow-neo-inset-sm rounded-inner text-xs">
                      <span className="text-muted font-medium">{a.attributeName}</span>
                      <span className="text-foreground font-bold">{a.valueText ?? a.valueNumber ?? (a.valueBool ? "CÃ³" : "KhÃ´ng")}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted italic text-sm">ChÆ°a cÃ³ thÃ´ng sá»‘ ká»¹ thuáº­t cho sáº£n pháº©m nÃ y.</p>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 glass-panel shadow-neo py-3 px-4 transition-transform duration-300 ${
          !mainBtnInView && p && !isLoading ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="client-page-container flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-inner overflow-hidden bg-background shadow-neo-inset-sm p-1 flex items-center justify-center shrink-0">
              <img
                src={displayImageUrl}
                alt={p.name}
                className="w-full h-full object-contain"
                onError={handleImageError}
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-foreground truncate max-w-[200px] sm:max-w-[400px]">
                {p.name}
              </h4>
              <p className="text-xs font-bold text-foreground">
                {selectedSkuPrice !== undefined ? formatVND(selectedSkuPrice) : (
                  p.skus?.length ? formatVND(priceFrom) : "LiÃªn há»‡"
                )}
              </p>
            </div>
          </div>
          
          <div>
            <Button
              className="h-10 px-4 rounded-button font-bold text-xs shrink-0"
              disabled={!selectedSkuId || isActionPending}
              onClick={handleAddToCart}
            >
              {isActionPending ? "Chá»..." : "ThÃªm vÃ o giá»"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

