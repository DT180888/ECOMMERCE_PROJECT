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
      <h3 className="text-lg font-semibold border-b pb-2">Hình ảnh / Video (Media Assets)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            <div key={key} className={`space-y-2 border p-4 rounded-md ${isMobileError ? 'border-red-500' : 'border-border'}`}>
              <Label className={isMobileError ? 'text-red-500' : ''}>{titleMap[key]}</Label>
              <div 
                className={`mt-2 relative rounded-md overflow-hidden bg-muted flex items-center justify-center aspect-video group border-2 border-dashed ${isMobileError ? 'border-red-500' : 'border-border'}`}
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
                  <div className="flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                    <ArrowUpTrayIcon className="w-8 h-8 mb-2" />
                    <span className="text-xs">Kéo thả file hoặc click để tải lên</span>
                    <span className="text-[10px] mt-1 opacity-70">Hỗ trợ JPG, PNG, MP4</span>
                  </div>
                )}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white z-10">
                  <span className="bg-background/20 backdrop-blur-sm px-3 py-1.5 rounded-button text-sm flex items-center gap-2">
                    <ArrowUpTrayIcon className="w-4 h-4" /> Thay đổi
                  </span>
                  <input 
                    type="file" 
                    accept="image/*,video/mp4" 
                    className="hidden" 
                    onChange={(e) => handleFileChange(key, e.target.files?.[0] || null)}
                  />
                </label>
              </div>
              {isMobileError && <p className="text-xs text-red-500 mt-1">Vui lòng tải lên ảnh Mobile</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

