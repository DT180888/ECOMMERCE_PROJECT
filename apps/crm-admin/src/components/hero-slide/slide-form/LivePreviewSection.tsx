import { useState } from "react";
import { HeroSlideFormData } from "@my-project/api";
import { SparklesIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Tabs, TabsList, TabsTrigger } from "@my-project/ui";

interface LivePreviewSectionProps {
  formData: HeroSlideFormData;
  previews: Record<string, string>;
}

export function LivePreviewSection({ formData, previews }: LivePreviewSectionProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [isBanner, setIsBanner] = useState<boolean>(false);

  const activeAssetPreview = isBanner
    ? viewMode === "desktop"
      ? previews.bannerDesktop
      : previews.bannerMobile
    : viewMode === "desktop"
    ? previews.fullscreenDesktop
    : previews.fullscreenMobile;

  const isVideo = activeAssetPreview?.endsWith(".mp4") || formData.assets.fullscreenDesktop?.type === "video";

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header controls */}
      <div className="flex items-center justify-between mb-3 select-none">
        <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-foreground">
          Trực Quan Hoá (Live Preview)
        </h3>
        <div className="flex gap-2 items-center">
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "desktop" | "mobile")}
            mode="tabs"
          >
            <TabsList className="h-7 p-0.5">
              <TabsTrigger value="desktop" className="h-6 px-2 text-[11px]">
                Desktop
              </TabsTrigger>
              <TabsTrigger value="mobile" className="h-6 px-2 text-[11px]">
                Mobile
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs
            value={isBanner ? "banner" : "fullscreen"}
            onValueChange={(v) => setIsBanner(v === "banner")}
            mode="tabs"
          >
            <TabsList className="h-7 p-0.5">
              <TabsTrigger value="fullscreen" className="h-6 px-2 text-[11px]">
                Fullscreen
              </TabsTrigger>
              <TabsTrigger value="banner" className="h-6 px-2 text-[11px]">
                Banner
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Preview viewport */}
      <div className="flex-1 bg-surface border border-border/60 rounded-[2px] flex items-center justify-center overflow-hidden relative p-4 shadow-none">
        {/* Aspect Ratio Container */}
        <div
          className={`relative bg-[#121212] border border-[#2A2A2A] transition-all duration-300 overflow-hidden rounded-[2px] select-none ${
            viewMode === "desktop"
              ? isBanner
                ? "w-full aspect-[32/9]"
                : "w-full aspect-[16/9]"
              : isBanner
              ? "h-[85%] aspect-[4/5]"
              : "h-[92%] aspect-[9/16]"
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
              <span>
                Chưa có media cho {viewMode === "desktop" ? "Desktop" : "Mobile"} ({isBanner ? "Banner" : "Fullscreen"})
              </span>
            </div>
          )}

          {/* Editorial Scrim Overlay */}
          {isBanner ? (
            <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/90 via-[#121212]/50 to-transparent pointer-events-none z-10" />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/85 via-[#121212]/45 to-transparent pointer-events-none z-10 hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/95 via-[#121212]/50 to-transparent pointer-events-none z-10 md:hidden" />
            </>
          )}

          {/* Overlay Content */}
          <div className="absolute inset-0 z-20 flex items-end md:items-center px-5 sm:px-8 py-6">
            <div
              className={`w-full max-w-lg text-[#F3F3F0] space-y-2.5 ${
                viewMode === "mobile"
                  ? "text-center items-center flex flex-col justify-end h-full pb-2"
                  : "text-left"
              }`}
            >
              {/* Brand & Tag Meta Chips */}
              <div
                className={`flex flex-wrap items-center gap-2 ${
                  viewMode === "mobile" ? "justify-center" : "justify-start"
                }`}
              >
                {formData.brandText && (
                  <span className="font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-[#F3F3F0] bg-[#1A1A1A]/80 border border-[#2A2A2A] px-2 py-0.5 rounded-[2px] backdrop-blur-md">
                    {formData.brandText}
                  </span>
                )}
                {formData.tagText && (
                  <span className="font-mono text-[9px] font-medium uppercase tracking-[0.1em] text-[#8E8E8E] bg-[#121212]/60 border border-[#2A2A2A] px-2 py-0.5 rounded-[2px] backdrop-blur-md flex items-center gap-1">
                    <SparklesIcon className="w-2.5 h-2.5 text-[#F3F3F0] stroke-[1.25]" />
                    {formData.tagText}
                  </span>
                )}
              </div>

              {/* Display Headline */}
              <h1
                className={`font-display uppercase font-extrabold leading-[1.08] tracking-[-0.035em] text-[#F3F3F0] drop-shadow-sm ${
                  viewMode === "desktop"
                    ? isBanner
                      ? "text-xl lg:text-2xl"
                      : "text-2xl lg:text-4xl"
                    : isBanner
                    ? "text-base"
                    : "text-xl"
                }`}
              >
                {formData.titleText || "TIÊU ĐỀ SLIDE"}
              </h1>

              {/* Price Meta */}
              {formData.priceText && (
                <div
                  className={`flex items-center gap-1 font-mono ${
                    viewMode === "mobile" ? "justify-center" : "justify-start"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-[0.1em] text-[#8E8E8E]">Giá khởi điểm:</span>
                  <span className="text-xs font-semibold text-[#F3F3F0]">{formData.priceText}</span>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-1">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F3F3F0] text-[#161616] font-medium text-[10px] uppercase tracking-[0.15em] rounded-[2px] border border-[#F3F3F0]">
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
