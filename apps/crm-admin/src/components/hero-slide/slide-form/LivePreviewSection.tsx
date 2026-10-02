import { useState } from "react";
import { HeroSlideFormData } from "@my-project/api";
import { SparklesIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

interface LivePreviewSectionProps {
  formData: HeroSlideFormData;
  previews: Record<string, string>;
}

export function LivePreviewSection({ formData, previews }: LivePreviewSectionProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [isBanner, setIsBanner] = useState<boolean>(false);

  const activeAssetPreview = isBanner
    ? viewMode === "desktop" ? previews.bannerDesktop : previews.bannerMobile
    : viewMode === "desktop" ? previews.fullscreenDesktop : previews.fullscreenMobile;

  const isVideo = activeAssetPreview?.endsWith(".mp4") || formData.assets.fullscreenDesktop?.type === "video";

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header controls */}
      <div className="flex items-center justify-between mb-4 bg-card p-3 rounded-card border border-border shadow-neo-sm">
        <h3 className="text-sm font-semibold">Live Preview</h3>
        <div className="flex gap-2 text-xs">
          <div className="flex bg-muted rounded-[2px] p-1 border border-border">
            <button
              type="button"
              onClick={() => setViewMode("desktop")}
              className={`px-3 py-1 rounded-[2px] transition-colors ${viewMode === "desktop" ? "bg-background shadow-sm font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Desktop (16:9)
            </button>
            <button
              type="button"
              onClick={() => setViewMode("mobile")}
              className={`px-3 py-1 rounded-[2px] transition-colors ${viewMode === "mobile" ? "bg-background shadow-sm font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Mobile (9:16)
            </button>
          </div>
          <div className="flex bg-muted rounded-[2px] p-1 border border-border">
            <button
              type="button"
              onClick={() => setIsBanner(false)}
              className={`px-3 py-1 rounded-[2px] transition-colors ${!isBanner ? "bg-background shadow-sm font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Fullscreen
            </button>
            <button
              type="button"
              onClick={() => setIsBanner(true)}
              className={`px-3 py-1 rounded-[2px] transition-colors ${isBanner ? "bg-background shadow-sm font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Banner
            </button>
          </div>
        </div>
      </div>

      {/* Preview viewport */}
      <div className="flex-1 bg-muted border border-border rounded-card flex items-center justify-center overflow-hidden relative p-4">
        {/* Aspect Ratio Container */}
        <div 
          className={`relative bg-[#121212] border border-[#2A2A2A] transition-all duration-300 overflow-hidden rounded-[2px] select-none ${
            viewMode === "desktop" 
              ? isBanner ? "w-full aspect-[32/9]" : "w-full aspect-[16/9]"
              : isBanner ? "h-[85%] aspect-[4/5]" : "h-[92%] aspect-[9/16]"
          }`}
        >
          {/* Background Asset */}
          {activeAssetPreview ? (
            isVideo ? (
              <video src={activeAssetPreview} className="w-full h-full object-cover" autoPlay muted loop />
            ) : (
              <img src={activeAssetPreview} className="w-full h-full object-cover" alt="Preview" />
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#8E8E8E] font-mono text-[11px] text-center p-4">
              <span>Chưa có media cho {viewMode === "desktop" ? "Desktop" : "Mobile"} ({isBanner ? "Banner" : "Fullscreen"})</span>
            </div>
          )}

          {/* Editorial Scrim Overlay (Zero Pure Blacks) */}
          {isBanner ? (
            <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/90 via-[#121212]/50 to-transparent pointer-events-none z-10" />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/85 via-[#121212]/45 to-transparent pointer-events-none z-10 hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/95 via-[#121212]/50 to-transparent pointer-events-none z-10 md:hidden" />
            </>
          )}

          {/* Overlay Content (Pure Editorial Minimalism) */}
          <div className="absolute inset-0 z-20 flex items-end md:items-center px-5 sm:px-8 py-6">
            <div className={`w-full max-w-lg text-[#F3F3F0] space-y-2.5 ${viewMode === "mobile" ? "text-center items-center flex flex-col justify-end h-full pb-2" : "text-left"}`}>
              
              {/* Brand & Tag Meta Chips */}
              <div className={`flex flex-wrap items-center gap-1.5 ${viewMode === "mobile" ? "justify-center" : "justify-start"}`}>
                {formData.brandText && (
                  <span className="font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-[#F3F3F0] bg-[#1A1A1A]/80 border border-[#2A2A2A] px-2.5 py-0.5 rounded-[2px] backdrop-blur-md">
                    {formData.brandText}
                  </span>
                )}
                {formData.tagText && (
                  <span className="font-mono text-[9px] font-medium uppercase tracking-[0.1em] text-[#8E8E8E] bg-[#121212]/60 border border-[#2A2A2A] px-2.5 py-0.5 rounded-[2px] backdrop-blur-md flex items-center gap-1">
                    <SparklesIcon className="w-2.5 h-2.5 text-[#F3F3F0] stroke-[1.25]" />
                    {formData.tagText}
                  </span>
                )}
              </div>

              {/* Display Headline */}
              <h1 className={`font-display uppercase font-extrabold leading-[1.08] tracking-[-0.035em] text-[#F3F3F0] drop-shadow-sm ${
                viewMode === "desktop" 
                  ? isBanner ? "text-xl lg:text-2xl" : "text-2xl lg:text-4xl" 
                  : isBanner ? "text-base" : "text-xl"
              }`}>
                {formData.titleText || "TIÊU ĐỀ SLIDE"}
              </h1>

              {/* Price Meta */}
              {formData.priceText && (
                <div className={`flex items-center gap-1.5 font-mono ${viewMode === "mobile" ? "justify-center" : "justify-start"}`}>
                  <span className="text-[10px] uppercase tracking-[0.1em] text-[#8E8E8E]">Giá khởi điểm:</span>
                  <span className="text-xs font-semibold text-[#F3F3F0]">
                    {formData.priceText}
                  </span>
                </div>
              )}

              {/* Action Button (Pure Flat Cream Surface, rounded-[2px]) */}
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#F3F3F0] text-[#161616] font-medium text-[10px] uppercase tracking-[0.15em] rounded-[2px] border border-[#F3F3F0]">
                  Khám phá ngay
                  <ArrowRightIcon className="w-3 h-3 stroke-[1.25]" />
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




