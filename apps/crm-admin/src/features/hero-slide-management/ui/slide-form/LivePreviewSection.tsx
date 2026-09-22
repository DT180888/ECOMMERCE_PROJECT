import { useState } from "react";
import { HeroSlideFormData } from "@entities/hero-slide/types";

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
      <div className="flex items-center justify-between mb-4 bg-card p-3 rounded-xl border border-border shadow-neo-sm">
        <h3 className="text-sm font-semibold">Live Preview</h3>
        <div className="flex gap-2 text-xs">
          <div className="flex bg-muted rounded-md p-1 border border-border">
            <button
              type="button"
              onClick={() => setViewMode("desktop")}
              className={`px-3 py-1 rounded-sm transition-colors ${viewMode === "desktop" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Desktop (16:9)
            </button>
            <button
              type="button"
              onClick={() => setViewMode("mobile")}
              className={`px-3 py-1 rounded-sm transition-colors ${viewMode === "mobile" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Mobile (9:16)
            </button>
          </div>
          <div className="flex bg-muted rounded-md p-1 border border-border">
            <button
              type="button"
              onClick={() => setIsBanner(false)}
              className={`px-3 py-1 rounded-sm transition-colors ${!isBanner ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Fullscreen
            </button>
            <button
              type="button"
              onClick={() => setIsBanner(true)}
              className={`px-3 py-1 rounded-sm transition-colors ${isBanner ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Banner
            </button>
          </div>
        </div>
      </div>

      <div className={`flex-1 bg-muted border border-border rounded-xl shadow-neo-inset flex items-center justify-center overflow-hidden relative`}>
        {/* Aspect Ratio Container */}
        <div 
          className={`relative bg-black shadow-2xl transition-all duration-300 overflow-hidden ${
            viewMode === "desktop" 
              ? isBanner ? "w-full aspect-[32/5]" : "w-full aspect-[16/9]"
              : isBanner ? "h-[80%] aspect-[4/5]" : "h-[90%] aspect-[9/16]"
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
            <div className="w-full h-full flex flex-col items-center justify-center text-white/30 text-sm">
              <span>Chưa có ảnh/video cho {viewMode === "desktop" ? "Desktop" : "Mobile"}</span>
            </div>
          )}

          {/* Scrims */}
          {isBanner ? (
             <div className="absolute bottom-0 left-0 right-0 h-full w-[60%] bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none" />
          ) : (
             <>
               <div className="absolute top-0 left-0 right-0 h-[15%] bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
               <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none" />
             </>
          )}

          {/* Overlay Content */}
          <div className="absolute inset-0 z-20 flex items-end">
             {viewMode === "desktop" ? (
               <div className={`flex flex-col items-start absolute left-8 ${isBanner ? "bottom-6" : "bottom-12"}`}>
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 mb-3">
                   {formData.brandText || "BRAND TEXT"}
                 </span>
                 <h1 className={`text-white font-serif uppercase leading-[1.1] ${isBanner ? "text-2xl" : "text-4xl"} mb-3`}>
                   {formData.titleText || "TITLE TEXT"}
                 </h1>
                 {!isBanner && (
                    <p className="text-white/80 text-xs max-w-sm mb-4">
                      Đây là đoạn text mô phỏng nội dung mô tả của Hero Slide.
                    </p>
                 )}
                 <div className="text-xs font-bold uppercase tracking-[0.1em] text-white border-b border-white pb-0.5">
                   Khám phá ngay
                 </div>
               </div>
             ) : (
               <div className={`flex flex-col items-center justify-center absolute left-4 right-4 text-center ${isBanner ? "bottom-4" : "bottom-12"}`}>
                 <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/80 mb-2">
                   {formData.brandText || "BRAND TEXT"}
                 </span>
                 <h1 className={`text-white font-serif uppercase leading-[1.1] ${isBanner ? "text-xl" : "text-2xl"} mb-3`}>
                   {formData.titleText || "TITLE TEXT"}
                 </h1>
                 {!isBanner && (
                    <p className="text-white/80 text-[10px] max-w-[200px] mb-4">
                      Đây là đoạn text mô phỏng nội dung mô tả của Hero Slide.
                    </p>
                 )}
                 <div className={`w-[80%] max-w-[160px] bg-white text-black py-2 rounded-sm text-[10px] font-bold uppercase tracking-[0.1em] ${isBanner ? "mt-2" : ""}`}>
                   Mua ngay
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

