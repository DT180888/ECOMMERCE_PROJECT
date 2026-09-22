import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  PlayIcon, 
  PauseIcon 
} from '@heroicons/react/24/outline';

import { useHeroSlides } from "@entities/hero/hooks";
import { buildImgSrc } from "@shared/lib/url";

interface HeroProps {
  variant?: "fullscreen" | "banner";
}

export default function Hero({ variant = "fullscreen" }: HeroProps) {
  const { data: slides, isLoading } = useHeroSlides();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const hasSlides = slides && slides.length > 0;

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || !hasSlides) return;
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, hasSlides, slides?.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!hasSlides) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 75) {
      handleNext();
    } else if (diff < -75) {
      handlePrev();
    }
  };

  const handlePrev = () => {
    if (!hasSlides) return;
    setActiveImageIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    if (!hasSlides) return;
    setActiveImageIndex((prev) => (prev + 1) % slides.length);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  if (isLoading) {
    return <div className="w-full h-full bg-muted/20 animate-pulse"></div>;
  }

  if (!hasSlides) {
    return null;
  }

  const activeSlide = slides[activeImageIndex];
  const isBanner = variant === "banner";

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full h-full relative overflow-hidden bg-black select-none"
    >
      {/* Google Fonts and CSS Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes kenburns {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.03) translate(-0.3%, -0.2%); }
        }

        .animate-ken-burns {
          animation: kenburns 8s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite alternate;
        }

        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }

        .active-progress-line {
          animation: progressFill 5000ms linear forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cta-underline {
          position: relative;
        }

        .cta-underline::after {
          content: '';
          position: absolute;
          width: 100%;
          transform: scaleX(0);
          height: 1px;
          bottom: -4px;
          left: 0;
          background-color: currentColor;
          transform-origin: bottom left;
          transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .cta-underline:hover::after {
          transform: scaleX(1);
        }
      `}} />
      
{variant === "banner" ? (
  /* --- Thẻ hiển thị ở Trang Chủ (Top Scrim) --- */
  <div className="absolute bottom-0 left-0 right-0 h-[100%] w-[60%] bg-gradient-to-r from-background via-background/60 to-transparent pointer-events-none z-[15]" />
) : (
  /* --- Sử dụng Fragment <> </> để bọc 2 thẻ kề nhau --- */
  <>
    {/* Top Scrim */}
    <div className="absolute top-0 left-0 right-0 h-[15%] bg-gradient-to-b from-background/40 to-transparent z-[15] pointer-events-none" />
    
    {/* Bottom Scrim */}
    <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none z-[15]" />
  </>
)}

      {/* BACKGROUND CINEMATIC ASSETS */}
      {slides.map((slide, idx) => {
        const isActive = idx === activeImageIndex;
        const isNext = idx === (activeImageIndex + 1) % slides.length;
        // Only render asset if it is active, next, or the first slide (LCP)
        const shouldMount = isActive || isNext || idx === 0;

        const currentDesktopAsset = isBanner && slide.assets.bannerDesktop ? slide.assets.bannerDesktop : slide.assets.fullscreenDesktop;
        const currentMobileAsset = isBanner && slide.assets.bannerMobile ? slide.assets.bannerMobile : slide.assets.fullscreenMobile;

        return (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 w-full h-full transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
              isActive 
                ? "opacity-100 scale-100 z-10" 
                : "opacity-0 scale-[1.05] z-0 pointer-events-none"
            }`}
          >
            {/* Desktop View */}
            <div className="hidden md:block w-full h-full overflow-hidden">
              {shouldMount && (
                currentDesktopAsset.type === "video" ? (
                  <video
                    src={buildImgSrc(currentDesktopAsset.url)}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={`w-full h-full object-contain ${isActive ? "animate-ken-burns" : ""}`}
                  />
                ) : (
                  <img
                    src={buildImgSrc(currentDesktopAsset.url)}
                    alt={slide.titleText}
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={idx === 0 ? "high" : "auto"}
                    className={`w-full h-full object-contain ${isActive ? "animate-ken-burns" : ""}`}
                  />
                )
              )}
            </div>

            {/* Mobile View */}
            <div className="block md:hidden w-full h-full overflow-hidden">
              {shouldMount && (
                currentMobileAsset.type === "video" ? (
                  <video
                    src={buildImgSrc(currentMobileAsset.url)}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={`w-full h-full object-contain ${isActive ? "animate-ken-burns" : ""}`}
                  />
                ) : (
                  <img
                    src={buildImgSrc(currentMobileAsset.url)}
                    alt={slide.titleText}
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={idx === 0 ? "high" : "auto"}
                    className={`w-full h-full object-contain ${isActive ? "animate-ken-burns" : ""}`}
                  />
                )
              )}
            </div>
          </div>
        );
      })}

      {/* EDITORIAL CONTENT OVERLAY */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-end">
        {/* Desktop Layout */}
        <div className={`hidden md:flex flex-col items-start absolute left-12 lg:left-24 pointer-events-auto ${isBanner ? "bottom-12" : "bottom-24"}`}>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-foreground  mb-5 animate-[fadeIn_0.8s_ease-out_both] font-body">
            {activeSlide.brandText}
          </span>
          <h1 
            className={`text-foreground font-serif font-light uppercase tracking-[-0.03em] leading-[1.1] mb-5 animate-[fadeIn_1s_ease-out_both] ${isBanner ? "responsive-h2" : "responsive-h1"}`}
          >
            {activeSlide.titleText}
          </h1>
          <p className="text-foreground text-sm font-body tracking-wide leading-relaxed mb-5 animate-[fadeIn_1.2s_ease-out_both] max-w-lg">
            Khám phá tinh thần tối giản đương đại kết hợp tinh tế cùng kỹ nghệ may đo thủ công sang trọng.
          </p>
          <Link 
            to={activeSlide.actionUrl}
            className="cta-underline text-xs font-bold uppercase tracking-[0.2em] text-foreground  py-1 flex items-center gap-2 group animate-[fadeIn_1.4s_ease-out_both]"
          >
            <span>Khám phá ngay</span>
            <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </Link>
        </div>

        {/* Mobile Layout */}
        <div className={`flex md:hidden flex-col items-center justify-center absolute left-6 right-6 text-center pointer-events-auto ${isBanner ? "bottom-8" : "bottom-24"}`}>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/80 mb-2 font-body">
            {activeSlide.brandText}
          </span>
          <h1 
            className={`text-foreground font-serif font-light uppercase tracking-[-0.03em] leading-[1.1] mb-3 ${isBanner ? "text-2xl sm:text-3xl" : "responsive-h2"}`}
          >
            {activeSlide.titleText}
          </h1>
          {!isBanner && (
            <p className="text-foreground text-xs font-body leading-relaxed mb-5 max-w-xs">
              Thời trang tối giản nâng tầm phong cách sống.
            </p>
          )}
          <Link 
            to={activeSlide.actionUrl}
            className={`w-full max-w-[200px] bg-white text-black py-3 rounded-button text-xs font-bold uppercase tracking-[0.15em] opacity-90 hover:opacity-100 hover:bg-white/90 active:translate-y-[1px] transition-all shadow-neo block ${isBanner ? "mt-2" : ""}`}
          >
            Mua ngay
          </Link>
        </div>
      </div>

      {/* TACTILE MINIMALISM GLASS CONTROLLER CARD (Fullscreen only) */}
      {!isBanner && (
        <div 
          className="absolute bottom-24 right-24 z-30 hidden md:flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 shadow-neo rounded-card p-2.5"
        >
        {/* Previous Button */}
        <button
          aria-label="Slide trước"
          onClick={handlePrev}
          className="w-9 h-9 rounded-button flex items-center justify-center bg-white/10 border border-white/10 text-white shadow-neo-sm hover:-translate-y-[1px] hover:bg-white/20 active:translate-y-[0.5px] outline-none transition-all duration-300"
        >
          <ChevronLeftIcon className="w-3 h-3 md:w-4 md:h-4" />
        </button>

        {/* Play/Pause Button */}
        <button
          aria-label={isPlaying ? "Tạm dừng autoplay" : "Bắt đầu autoplay"}
          onClick={handleTogglePlay}
          className="w-9 h-9 rounded-button flex items-center justify-center bg-white/10 border border-white/10 text-white shadow-neo-sm hover:-translate-y-[1px] hover:bg-white/20 active:translate-y-[0.5px] outline-none transition-all duration-300"
        >
          {isPlaying ? <PauseIcon className="w-3 h-3 md:w-4 md:h-4" /> : <PlayIcon className="w-3 h-3 md:w-4 md:h-4" />}
        </button>

        {/* Next Button */}
        <button
          aria-label="Slide tiếp theo"
          onClick={handleNext}
          className="w-9 h-9 rounded-button flex items-center justify-center bg-white/10 border border-white/10 text-white shadow-neo-sm hover:-translate-y-[1px] hover:bg-white/20 active:translate-y-[0.5px] outline-none transition-all duration-300"
        >
          <ChevronRightIcon className="w-3 h-3 md:w-4 md:h-4" />
        </button>
        </div>
      )}

      {/* TIMELINE-BASED SLIDE INDICATOR (Instagram Story Style) */}
      <div className={`absolute left-6 right-6 md:left-12 lg:left-24 lg:right-24 z-30 flex gap-2 md:gap-4 pointer-events-auto ${isBanner ? "bottom-4" : "bottom-10"}`}>
        {slides.map((_, idx) => {
          const isActive = idx === activeImageIndex;
          return (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className="flex-1 h-[10px] bg-transparent relative overflow-hidden focus:outline-none group py-4"
              aria-label={`Hiển thị slide ${idx + 1}`}
            >
              {/* Background rail */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[1.5px] bg-foreground/20 group-hover:bg-foreground/35 transition-colors" />
              {/* Progress bar */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 left-0 h-[1.5px] bg-foreground transition-all ${
                  idx < activeImageIndex 
                    ? "w-full" 
                    : idx > activeImageIndex 
                      ? "w-0" 
                      : isPlaying 
                        ? "active-progress-line" 
                        : "w-0 bg-white/60"
                }`}
                style={{
                  animationPlayState: isPlaying && isActive ? "running" : "paused"
                }}
                key={idx + "-" + isPlaying}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}