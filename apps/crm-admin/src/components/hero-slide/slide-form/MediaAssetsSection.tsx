import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { Label } from "@my-project/ui";

interface MediaAssetsSectionProps {
  files: Record<string, File | null>;
  previews: Record<string, string>;
  handleFileChange: (key: string, file: File | null) => void;
  mobileErrorKey?: string;
}

const ASSET_KEYS = ["fullscreenDesktop", "fullscreenMobile", "bannerDesktop", "bannerMobile"] as const;

export function MediaAssetsSection({ files, previews, handleFileChange, mobileErrorKey }: MediaAssetsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="border-b border-border/60 pb-1.5">
        <h3 className="text-xs font-bold uppercase tracking-wider font-display text-foreground">
          Hình ảnh / Video (Media Assets)
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {ASSET_KEYS.map((key) => {
          const preview = previews[key];
          const isVideo = preview.endsWith(".mp4") || files[key]?.type.startsWith("video/");

          const titleMap: Record<string, string> = {
            fullscreenDesktop: "Fullscreen Desktop (16:9)",
            fullscreenMobile: "Fullscreen Mobile (9:16) *",
            bannerDesktop: "Banner Desktop (Panorama)",
            bannerMobile: "Banner Mobile (1:1) *",
          };

          const isMobileError = (key === "fullscreenMobile" || key === "bannerMobile") && key === mobileErrorKey;

          return (
            <div
              key={key}
              className={`space-y-2 border p-3.5 rounded-[2px] bg-card ${
                isMobileError ? "border-destructive bg-destructive/5" : "border-border/60"
              }`}
            >
              <Label className={`text-xs font-medium ${isMobileError ? "text-destructive" : "text-foreground"}`}>
                {titleMap[key]}
              </Label>
              <div
                className={`mt-1.5 relative rounded-[2px] overflow-hidden bg-surface flex items-center justify-center aspect-video group border border-dashed ${
                  isMobileError ? "border-destructive" : "border-border/60"
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileChange(key, e.dataTransfer.files[0]);
                  }
                }}
              >
                {preview ? (
                  isVideo ? (
                    <video src={preview} className="w-full h-full object-contain" autoPlay muted loop />
                  ) : (
                    <img src={preview} className="w-full h-full object-contain" alt="" />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground p-3 text-center">
                    <ArrowUpTrayIcon className="w-6 h-6 mb-1 text-muted-foreground" />
                    <span className="text-xs">Kéo thả file hoặc click để tải lên</span>
                    <span className="text-[10px] mt-0.5 font-mono text-muted-foreground">JPG, PNG, MP4</span>
                  </div>
                )}
                <label className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-background z-10">
                  <span className="bg-background text-foreground border border-border/60 px-2.5 py-1 rounded-[2px] text-xs font-medium flex items-center gap-1 shadow-none">
                    <ArrowUpTrayIcon className="w-3.5 h-3.5" /> Thay đổi
                  </span>
                  <input
                    type="file"
                    accept="image/*,video/mp4"
                    className="hidden"
                    onChange={(e) => handleFileChange(key, e.target.files?.[0] || null)}
                  />
                </label>
              </div>
              {isMobileError && (
                <p className="text-[11px] text-destructive mt-1 font-mono">
                  Vui lòng tải lên tài nguyên định dạng Mobile
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
