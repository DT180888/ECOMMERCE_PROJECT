import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useHeroSlides } from "@hooks/useHero";
import { buildImgSrc } from "@my-project/shared-utils";
import type { HeroSlideDto, AssetDetail } from "@my-project/api";
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";

interface HeroProps {
  variant?: "fullscreen" | "banner" | "aspect16x9";
  autoPlayInterval?: number;
}

const DEFAULT_EDITORIAL_SLIDES: HeroSlideDto[] = [
  {
    id: 101,
    titleText: "MINIMALISM / CAPSULE 2026",
    brandText: "STUDIO DROP",
    tagText: "Bộ Sưu Tập Giới Hạn",
    priceText: "Từ 890.000₫",
    actionUrl: "/catalog",
    sortOrder: 0,
    isActive: true,
    assets: {
      fullscreenDesktop: {
        type: "image",
        url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920&auto=format&fit=crop",
      },
      fullscreenMobile: {
        type: "image",
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      },
      bannerDesktop: {
        type: "image",
        url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920&auto=format&fit=crop",
      },
      bannerMobile: {
        type: "image",
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      },
    },
  },
  {
    id: 102,
    titleText: "TACTILE TEXTURES & FORM",
    brandText: "QUIET LUXURY",
    tagText: "Chất Liệu Tự Nhiên",
    priceText: "Từ 1.250.000₫",
    actionUrl: "/catalog",
    sortOrder: 1,
    isActive: true,
    assets: {
      fullscreenDesktop: {
        type: "image",
        url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1920&auto=format&fit=crop",
      },
      fullscreenMobile: {
        type: "image",
        url: "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?q=80&w=800&auto=format&fit=crop",
      },
      bannerDesktop: {
        type: "image",
        url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1920&auto=format&fit=crop",
      },
      bannerMobile: {
        type: "image",
        url: "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?q=80&w=800&auto=format&fit=crop",
      },
    },
  }
];

function resolveSlideAssets(
  slide: HeroSlideDto, 
  variant: "fullscreen" | "banner" | "aspect16x9"
): { desktop: AssetDetail; mobile: AssetDetail } {
  const isBanner = variant === "banner";

  // Desktop asset resolution
  let desktop = isBanner ? slide.assets?.bannerDesktop : slide.assets?.fullscreenDesktop;
  if (!desktop?.url) {
    desktop = isBanner ? slide.assets?.fullscreenDesktop : slide.assets?.bannerDesktop;
  }

  // Mobile asset resolution
  let mobile = isBanner ? slide.assets?.bannerMobile : slide.assets?.fullscreenMobile;
  if (!mobile?.url) {
    mobile = isBanner ? slide.assets?.fullscreenMobile : slide.assets?.bannerMobile;
  }
  if (!mobile?.url) {
    mobile = desktop; // fallback to desktop asset if mobile asset is missing
  }

  return {
    desktop: desktop || { type: "image", url: "" },
    mobile: mobile || { type: "image", url: "" },
  };
}

export default function Hero({ variant = "fullscreen", autoPlayInterval = 6000 }: HeroProps) {
  const { data: slidesData, isLoading } = useHeroSlides();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const rawSlides = Array.isArray(slidesData) ? slidesData : slidesData?.items || [];

  const slides = useMemo(() => {
    const validSlides = [...rawSlides]
      .filter((s) => s.isActive !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    
    // Nếu API trả về rỗng, dùng default editorial slides để tránh sập layout
    return validSlides.length > 0 ? validSlides : DEFAULT_EDITORIAL_SLIDES;
  }, [rawSlides]);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || isHovered) return;
    timerRef.current = setInterval(nextSlide, autoPlayInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, isHovered, autoPlayInterval, nextSlide]);

  useEffect(() => {
    if (currentIndex >= slides.length && slides.length > 0) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  // Loading state với theme-aware Skeleton
  if (isLoading) {
    return (
      <div className="w-full aspect-[4/3] sm:aspect-[16/9] min-h-[400px] max-h-[90vh] bg-surface/50 border-b border-border/60 animate-pulse flex items-center justify-center select-none">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-8 h-8 rounded-none border border-muted-foreground/30 border-t-foreground animate-spin" />
          <span className="text-[11px] font-display uppercase tracking-[0.2em] text-muted-foreground">
            Đang tải bộ sưu tập...
          </span>
        </div>
      </div>
    );
  }

  const isBanner = variant === "banner";

  return (
    <div
      className={`w-full relative overflow-hidden bg-background select-none group ${
        isBanner 
          ? "h-[45vh] min-h-[320px] max-h-[520px]" 
          : "w-full aspect-[4/3] sm:aspect-[16/9] min-h-[400px] max-h-[90vh]"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes editorialKenburns {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.03) translate(-0.2%, -0.1%); }
        }
        .animate-editorial-kenburns {
          animation: editorialKenburns 12s cubic-bezier(0.16, 1, 0.3, 1) infinite alternate;
        }
      `}} />

      {/* Render All Slides for Smooth Fade Transitions */}
      {slides.map((slide, idx) => {
        const isActive = idx === currentIndex;
        const { desktop, mobile } = resolveSlideAssets(slide, variant);

        return (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Media - Desktop */}
            <div className="hidden md:block absolute inset-0 w-full h-full overflow-hidden">
              {desktop.type === "video" ? (
                <video
                  src={buildImgSrc(desktop.url)}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={`absolute inset-0 w-full h-full object-cover object-center ${isActive ? "animate-editorial-kenburns" : ""}`}
                />
              ) : (
                <img
                  src={buildImgSrc(desktop.url)}
                  alt={slide.titleText || "Hero Editorial Banner"}
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className={`absolute inset-0 w-full h-full object-cover object-center ${isActive ? "animate-editorial-kenburns" : ""}`}
                />
              )}
            </div>

            {/* Background Media - Mobile */}
            <div className="block md:hidden absolute inset-0 w-full h-full overflow-hidden">
              {mobile.type === "video" ? (
                <video
                  src={buildImgSrc(mobile.url)}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={`absolute inset-0 w-full h-full object-cover object-center ${isActive ? "animate-editorial-kenburns" : ""}`}
                />
              ) : (
                <img
                  src={buildImgSrc(mobile.url)}
                  alt={slide.titleText || "Hero Editorial Banner"}
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className={`absolute inset-0 w-full h-full object-cover object-center ${isActive ? "animate-editorial-kenburns" : ""}`}
                />
              )}
            </div>

            {/* Ambient Bottom-Up Gradient (Chuẩn hóa Tailwind semantic tokens, bảo vệ độ tương phản) */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent pointer-events-none z-10" />

            {/* Content & Typography Overlay */}
            <div className="absolute inset-0 z-20 flex items-end justify-start px-4 sm:px-8 lg:px-12 2xl:px-16 pb-8 sm:pb-12 lg:pb-14">
              <div className="w-full max-w-2xl text-left flex flex-col items-start space-y-3 sm:space-y-4">
                
                {/* Brand & Tag Meta Chips */}
                <div className="flex flex-wrap items-center justify-start gap-2">
                  {slide.brandText && (
                    <span className="font-display text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium text-foreground bg-surface/80 border border-border/80 px-2.5 sm:px-3 py-1 rounded-[2px] backdrop-blur-md">
                      {slide.brandText}
                    </span>
                  )}
                  {slide.tagText && (
                    <span className="font-display text-[10px] sm:text-[11px] uppercase tracking-[0.1em] text-muted-foreground bg-surface/60 border border-border/60 px-2.5 sm:px-3 py-1 rounded-[2px] backdrop-blur-md flex items-center gap-1.5">
                      <SparklesIcon className="w-3 h-3 text-foreground stroke-[1.25]" />
                      {slide.tagText}
                    </span>
                  )}
                </div>

                {/* Main Display Headline (100% Plus Jakarta Sans) */}
                {slide.titleText && (
                  <h1 className={`font-display font-medium normal-case leading-[1.08] tracking-tight text-foreground ${
                    isBanner
                      ? "text-2xl sm:text-4xl lg:text-5xl"
                      : "text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
                  }`}>
                    {slide.titleText}
                  </h1>
                )}

                {/* Price Tag */}
                {slide.priceText && (
                  <div className="flex items-center justify-start gap-2 pt-0.5 font-display">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Giá khởi điểm:</span>
                    <span className="text-base sm:text-lg font-medium text-foreground tabular-nums">
                      {slide.priceText}
                    </span>
                  </div>
                )}

                {/* Editorial Dual CTA Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-start gap-3">
                  <Link
                    to={slide.actionUrl || "/catalog"}
                    className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 bg-foreground text-background font-medium text-xs font-display uppercase tracking-[0.15em] rounded-[2px] transition-all duration-200 shadow-none border border-foreground hover:opacity-90 group/btn"
                  >
                    Khám phá ngay
                    <ArrowRightIcon className="w-4 h-4 stroke-[1.25] transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </Link>

                  <Link
                    to="/catalog"
                    className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 sm:py-3.5 bg-surface/80 hover:bg-surface text-foreground font-medium text-xs font-display uppercase tracking-[0.15em] rounded-[2px] transition-all duration-200 shadow-none border border-border/80 hover:border-foreground backdrop-blur-md"
                  >
                    Xem Lookbook
                  </Link>
                </div>

              </div>
            </div>
          </div>
        );
      })}

      {/* Slide Navigation Controls & Interactive Indicator Bar */}
      {slides.length > 1 && (
        <>
          {/* Bottom Right Floating Minimalist Slide Counter & Controls */}
          <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-30 hidden sm:flex items-center gap-1 bg-background/80 backdrop-blur-md border border-border/80 p-1 rounded-[2px]">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="p-1.5 text-foreground hover:text-muted-foreground transition-colors focus:outline-none"
            >
              <ChevronLeftIcon className="w-4 h-4 stroke-[1.25]" />
            </button>
            <span className="text-[11px] font-display font-medium px-2 tabular-nums text-foreground">
              {currentIndex + 1} / {slides.length}
            </span>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="p-1.5 text-foreground hover:text-muted-foreground transition-colors focus:outline-none"
            >
              <ChevronRightIcon className="w-4 h-4 stroke-[1.25]" />
            </button>
          </div>

          {/* Indicators Bar at Bottom (Touch Target >= 28px trên Mobile) */}
          <div className="absolute bottom-0 inset-x-0 z-30 flex items-center px-4 sm:px-8">
            <div className="flex items-center w-full gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Chuyển đến slide ${idx + 1}`}
                  className="group/indicator flex-1 py-3 px-0.5 focus:outline-none cursor-pointer"
                >
                  <span
                    className={`block h-[2px] w-full transition-all duration-300 ${
                      idx === currentIndex
                        ? "bg-foreground"
                        : "bg-foreground/20 group-hover/indicator:bg-foreground/50"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
