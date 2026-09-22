import { useState, useEffect, useRef } from "react";
import { useSmartCart } from "@features/client/cart/useSmartCart";
import { getProductById } from "@entities/product/api";
import { useToast } from "@my-project/ui";
import { InViewAnimate } from "@my-project/ui";
import { ShoppingBag, ChevronLeft, ChevronRight, Plus, Loader2, X } from "lucide-react";

const formatVND = (minor: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(minor);

interface WardrobeItem {
  id: number;
  name: string;
  priceMinor: number;
  thumbnail: string;
  skuCode: string;
  productId: number;
}

interface HotspotConfig {
  x: number; // percentage left
  y: number; // percentage top
  itemId: number;
}

interface StyledLook {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  mainImage: string;
  hotspots: HotspotConfig[];
  items: WardrobeItem[];
}

const CURATED_LOOKS: StyledLook[] = [
  {
    id: "LOOK-01",
    title: "THE MONOLITH",
    subtitle: "MINIMALIST NOIR",
    description: "Sắc đen tuyền tối giản, chú trọng vào cấu trúc cắt may sắc sảo. Tôn vinh hình học và không gian.",
    mainImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop",
    hotspots: [
      { x: 42, y: 35, itemId: 101 },
      { x: 50, y: 70, itemId: 104 },
    ],
    items: [
      { id: 101, productId: 101, name: "Structured Noir Blazer", priceMinor: 2450000, thumbnail: "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?q=80&w=150&auto=format&fit=crop", skuCode: "LOOK1-TOP" },
      { id: 104, productId: 104, name: "Wide-Leg Drape Trousers", priceMinor: 1250000, thumbnail: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=150&auto=format&fit=crop", skuCode: "LOOK1-BOT" },
    ]
  },
  {
    id: "LOOK-02",
    title: "URBAN NOMAD",
    subtitle: "EARTHEN UTILITY",
    description: "Kết hợp giữa tính thực dụng và chất liệu thô mộc. Tone màu đất tự nhiên mang lại vẻ phóng khoáng.",
    mainImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
    hotspots: [
      { x: 52, y: 28, itemId: 107 },
      { x: 45, y: 40, itemId: 102 },
      { x: 48, y: 75, itemId: 106 },
    ],
    items: [
      { id: 107, productId: 107, name: "Oversized Canvas Trench", priceMinor: 2850000, thumbnail: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=150&auto=format&fit=crop", skuCode: "LOOK2-OUT" },
      { id: 102, productId: 102, name: "Silk Knit Tee", priceMinor: 820000, thumbnail: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=150&auto=format&fit=crop", skuCode: "LOOK2-TOP" },
      { id: 106, productId: 106, name: "Minimalist Pleated Skirt", priceMinor: 1100000, thumbnail: "https://images.unsplash.com/photo-1582142306909-195724d33ab5?q=80&w=150&auto=format&fit=crop", skuCode: "LOOK2-BOT" },
    ]
  },
  {
    id: "LOOK-03",
    title: "MIDNIGHT GALA",
    subtitle: "ASYMMETRIC ELEGANCE",
    description: "Sang trọng, quyến rũ với lụa satin mượt mà và những đường cắt bất đối xứng đầy nghệ thuật.",
    mainImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1600&auto=format&fit=crop",
    hotspots: [
      { x: 40, y: 38, itemId: 103 },
      { x: 52, y: 65, itemId: 105 },
    ],
    items: [
      { id: 103, productId: 103, name: "Asymmetric Drape Top", priceMinor: 1150000, thumbnail: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=150&auto=format&fit=crop", skuCode: "LOOK3-TOP" },
      { id: 105, productId: 105, name: "Tailored Wool Shorts", priceMinor: 950000, thumbnail: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=150&auto=format&fit=crop", skuCode: "LOOK3-BOT" },
    ]
  }
];

export default function VirtualStylingLounge() {
  const { addToCart, isActionPending } = useSmartCart();
  const toast = useToast();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [purchasingLookId, setPurchasingLookId] = useState<string | null>(null);
  const [activeHotspotId, setActiveHotspotId] = useState<number | null>(null);
  const hotspotContainerRef = useRef<HTMLDivElement>(null);

  const currentLook = CURATED_LOOKS[activeIndex];
  const activeItem = currentLook.items.find(i => i.id === activeHotspotId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (hotspotContainerRef.current && !hotspotContainerRef.current.contains(e.target as Node)) {
        setActiveHotspotId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveHotspotId(null);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % CURATED_LOOKS.length);
      setIsTransitioning(false);
    }, 400);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveHotspotId(null);
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + CURATED_LOOKS.length) % CURATED_LOOKS.length);
      setIsTransitioning(false);
    }, 400);
  };

  const handleSelectLook = (idx: number) => {
    if (isTransitioning || idx === activeIndex) return;
    setIsTransitioning(true);
    setActiveHotspotId(null);
    setTimeout(() => {
      setActiveIndex(idx);
      setIsTransitioning(false);
    }, 400);
  };

  const toggleHotspot = (itemId: number) => {
    setActiveHotspotId(prev => prev === itemId ? null : itemId);
  };

  const addItemsToCart = async (items: WardrobeItem[]) => {
    let addedCount = 0;
    try {
      for (const item of items) {
        let finalSkuId = item.productId;
        let finalSkuCode = item.skuCode;
        let finalPrice = item.priceMinor;

        try {
          const detail = await getProductById(item.productId);
          const activeSku = detail.skus?.find((s) => s.isActive) || detail.skus?.[0];
          if (activeSku) {
            finalSkuId = activeSku.skuId;
            finalSkuCode = activeSku.skuCode;
            finalPrice = activeSku.priceMinor;
          }
        } catch (e) {}

        await addToCart({
          skuId: finalSkuId,
          productId: item.productId,
          name: item.name,
          skuCode: finalSkuCode,
          priceMinor: finalPrice,
          quantity: 1,
          primaryImageUrl: item.thumbnail,
        });
        addedCount++;
      }
      return addedCount;
    } catch (err) {
      console.error("Cart error:", err);
      throw err;
    }
  };

  const handleBuySingleItem = async (item: WardrobeItem) => {
    setPurchasingLookId(`item-${item.id}`);
    try {
      await addItemsToCart([item]);
      toast.success(`Đã thêm ${item.name} vào giỏ hàng!`);
    } catch (error: any) {
            toast.error(error?.message || "Không thể thêm vào giỏ hàng.");
          } finally {
      setPurchasingLookId(null);
    }
  };

  const handleBuyEntireLook = async () => {
    setPurchasingLookId(currentLook.id);
    try {
      const count = await addItemsToCart(currentLook.items);
      toast.success(`Đã thêm trọn bộ ${count} sản phẩm vào giỏ!`);
    } catch (error: any) {
            toast.error(error?.message || "Không thể mua trọn bộ lúc này.");
          } finally {
      setPurchasingLookId(null);
    }
  };

  const isAnyPurchasing = purchasingLookId !== null || isActionPending;

  return (
    <section className="w-full bg-background overflow-hidden">
      <InViewAnimate>
        <div className="client-page-container">
          <div className="flex flex-col md:flex-row justify-between items-start mb-4 md:mb-8 gap-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-muted tracking-[0.3em] uppercase block font-medium">
                03 / STUDIO / CURATED LOOKS
              </span>
              <h2 className="responsive-h2 text-foreground uppercase shadow-none font-serif tracking-[-0.02em] leading-[1.1]">
                THE EDITORIAL
                <span className="italic font-light text-muted"> LOOKBOOK</span>
              </h2>
            </div>
          </div>

          <div className="relative w-full flex flex-col lg:block bg-background">
            <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[75vh] lg:min-h-[600px] lg:max-h-[900px] overflow-hidden rounded-gallery lg:bg-muted/10">
              <div className="absolute inset-0 bg-background">
                {CURATED_LOOKS.map((look, idx) => (
                  <img
                    key={look.id}
                    src={look.mainImage}
                    alt={look.title}
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                      ${activeIndex === idx && !isTransitioning 
                        ? 'opacity-100 scale-100 blur-0' 
                        : 'opacity-0 scale-105 blur-[4px] pointer-events-none'
                      }
                    `}
                  />
                ))}
              </div>

              <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-background/100 via-background/20 to-transparent pointer-events-none" />

              <div ref={hotspotContainerRef} className={`absolute inset-0 transition-opacity duration-700 delay-300 ${isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {currentLook.hotspots.map((spot) => {
                  const item = currentLook.items.find(i => i.id === spot.itemId);
                  if (!item) return null;
                  const isActive = activeHotspotId === item.id;
                  
                  return (
                    <div 
                      key={spot.itemId}
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                      className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
                    >
                      <button 
                        onClick={() => toggleHotspot(item.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-neo-sm transition-all duration-300 outline-none
                          ${isActive ? 'bg-background scale-110 border border-foreground/30' : 'bg-background/40 backdrop-blur-md border border-foreground/20 hover:scale-110 hover:bg-background/80'}
                        `}
                      >
                        {isActive ? (
                          <X className="w-3.5 h-3.5 text-foreground" />
                        ) : (
                          <div className="w-2 h-2 bg-foreground rounded-full animate-pulse" />
                        )}
                      </button>
                      
                      <div className={`hidden md:flex absolute lg:top-1/2 lg:-translate-y-1/2 lg:left-full lg:mt-0 lg:ml-4 w-64 glass-panel-strong p-3 rounded-card shadow-neo items-center gap-4 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
                        ${isActive ? 'opacity-100 translate-y-0 lg:translate-x-0 pointer-events-auto' : 'opacity-0 -translate-y-4 lg:translate-y-0 lg:-translate-x-4 pointer-events-none'}
                      `}>
                        <img src={item.thumbnail} alt={item.name} loading="lazy" decoding="async" className="w-16 h-16 object-cover rounded-gallery" />
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-xs font-bold font-body text-foreground truncate">{item.name}</span>
                          <span className="text-[10px] font-mono text-muted mt-1">{formatVND(item.priceMinor)}</span>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleBuySingleItem(item); }}
                          disabled={isAnyPurchasing}
                          className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-button bg-foreground text-background hover:-translate-y-[1px] hover:shadow-neo-hover active:translate-y-[0.5px] active:shadow-neo-inset-sm transition-all disabled:opacity-50"
                          title="Thêm vào giỏ"
                        >
                          {purchasingLookId === `item-${item.id}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3 md:w-4 md:h-4" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile-only Floating Hotspot Detail Card */}
              {activeItem && (
                <div 
                  className="absolute bottom-4 left-4 right-4 z-30 glass-panel-strong p-3.5 rounded-card flex items-center gap-4 md:hidden shadow-neo transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] animate-[reveal-fade-up_0.4s_ease-out_both]"
                >
                  <img src={activeItem.thumbnail} alt={activeItem.name} loading="lazy" decoding="async" className="w-14 h-14 object-cover rounded-gallery shrink-0" />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-xs font-bold font-body text-foreground truncate">{activeItem.name}</span>
                    <span className="text-[10px] font-mono text-muted mt-1">{formatVND(activeItem.priceMinor)}</span>
                  </div>
                  <div className="flex gap-2 items-center shrink-0">
                    <button 
                      onClick={() => handleBuySingleItem(activeItem)}
                      disabled={isAnyPurchasing}
                      className="w-9 h-9 flex items-center justify-center rounded-button bg-foreground text-background hover:bg-foreground/90 transition-all disabled:opacity-50"
                      title="Thêm vào giỏ"
                    >
                      {purchasingLookId === `item-${activeItem.id}` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingBag className="w-3 h-3 md:w-4 md:h-4" />}
                    </button>
                    <button 
                      onClick={() => setActiveHotspotId(null)}
                      className="w-9 h-9 flex items-center justify-center rounded-button bg-background border border-foreground/10 text-foreground hover:bg-foreground/5 transition-all"
                      title="Đóng"
                    >
                      <X className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="hidden lg:flex absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background via-background/30 to-transparent items-end px-16 pb-8 pointer-events-none">
                <div className="pointer-events-auto flex justify-between items-end gap-6 w-full">
                  <div className="flex gap-4 w-full max-w-md">
                    {CURATED_LOOKS.map((look, idx) => (
                      <button
                        key={look.id}
                        onClick={() => handleSelectLook(idx)}
                        className="flex-1 flex flex-col gap-2 group cursor-pointer"
                      >
                        <div className="w-full h-1 bg-foreground/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-foreground transition-all duration-500 ease-out ${activeIndex === idx ? 'w-full' : 'w-0 group-hover:w-full group-hover:opacity-40'}`} 
                          />
                        </div>
                        <span className={`text-[10px] font-mono tracking-widest text-left transition-colors duration-300 ${activeIndex === idx ? 'text-foreground font-bold' : 'text-muted'}`}>
                          0{idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex gap-3 shrink-0">
                    <button onClick={handlePrev} className="w-12 h-12 flex items-center justify-center rounded-button bg-background/50 backdrop-blur-md border border-foreground/10 hover:bg-background hover:border-foreground/20 hover:shadow-neo-sm active:shadow-neo-inset-sm transition-all duration-300 ease-out text-foreground">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={handleNext} className="w-12 h-12 flex items-center justify-center rounded-button bg-background/50 backdrop-blur-md border border-foreground/10 hover:bg-background hover:border-foreground/20 hover:shadow-neo-sm active:shadow-neo-inset-sm transition-all duration-300 ease-out text-foreground">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={`
              lg:absolute lg:inset-y-0 lg:left-0 lg:w-[45%] 
              flex flex-col justify-center pt-4 md:pt-8 pb-2 md:pb-4 px-2 lg:px-16 lg:py-0
              pointer-events-none transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100
              ${isTransitioning ? 'opacity-0 translate-y-4 lg:translate-y-8' : 'opacity-100 translate-y-0'}
            `}>
              <div className="pointer-events-auto flex flex-col items-start max-w-xl">
                <span className="px-3 py-1 bg-foreground text-background text-[10px] font-mono tracking-widest font-bold mb-2 md:mb-4 lg:mb-6 rounded-sm">
                  {currentLook.id}
                </span>
                
                <h3 className="responsive-h1 text-foreground font-serif font-light tracking-[-0.03em] leading-[1.1] mb-3 lg:mb-4">
                  {currentLook.title}
                </h3>
                
                <p className="text-xs lg:text-sm font-mono text-muted tracking-[0.15em] mb-4 lg:mb-6 border-l-2 border-foreground/20 pl-4 py-1">
                  {currentLook.subtitle}
                </p>
                
                <p className="text-sm font-body text-foreground/80 leading-relaxed mb-4 md:mb-8 lg:mb-10 max-w-md">
                  {currentLook.description}
                </p>

                <button
                  onClick={handleBuyEntireLook}
                  disabled={isAnyPurchasing}
                  className={`bg-background border border-foreground/10 text-foreground rounded-button font-body font-bold py-4 px-6 lg:px-8 flex items-center justify-center gap-3 text-[10px] lg:text-xs tracking-[0.2em] uppercase transition-all duration-300 ease-out outline-none w-full lg:w-auto
                    ${
                      isAnyPurchasing
                        ? "opacity-60 cursor-not-allowed shadow-none"
                        : "shadow-neo-sm hover:bg-foreground hover:text-background hover:-translate-y-[1px] hover:shadow-neo-hover active:translate-y-[0.5px] active:shadow-neo-inset-sm"
                    }`}
                >
                  {purchasingLookId === currentLook.id ? (
                    <>
                      <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                      ĐANG XỬ LÝ...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3 h-3 md:w-4 md:h-4" />
                      MUA TRỌN BỘ LOOK NÀY
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex lg:hidden justify-between items-center px-2 py-6 border-t border-foreground/5 mt-4">
              <div className="flex gap-2 w-full max-w-[200px]">
                {CURATED_LOOKS.map((look, idx) => (
                  <button
                    key={look.id}
                    onClick={() => handleSelectLook(idx)}
                    className="flex-1 h-1 bg-foreground/10 rounded-full overflow-hidden"
                  >
                    <div 
                      className={`h-full bg-foreground transition-all duration-500 ease-out ${activeIndex === idx ? 'w-full' : 'w-0'}`} 
                    />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={handlePrev} className="w-10 h-10 flex items-center justify-center rounded-button bg-background border border-foreground/10 shadow-neo-sm active:shadow-neo-inset-sm text-foreground">
                  <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
                </button>
                <button onClick={handleNext} className="w-10 h-10 flex items-center justify-center rounded-button bg-background border border-foreground/10 shadow-neo-sm active:shadow-neo-inset-sm text-foreground">
                  <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </InViewAnimate>
    </section>
  );
}