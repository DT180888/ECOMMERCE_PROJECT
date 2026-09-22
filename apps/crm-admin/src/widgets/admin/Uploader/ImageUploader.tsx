import { useCallback, useRef, useState } from "react";
import { useUploadTemp } from "@entities/upload/hooks";

type Props = {
  onUploaded: (items: { url: string }[]) => void; // callback tráº£ vá» danh sÃ¡ch áº£nh Ä‘Ã£ upload
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  compact?: boolean;
};

export default function ImageUploader({
  onUploaded,
  accept = "image/*",
  multiple = true,
  maxFiles = 10,
  compact = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOver, setIsOver] = useState(false);
  const uploadMut = useUploadTemp();

  const handleFiles = useCallback(
    (filesList: FileList | null) => {
      if (!filesList || filesList.length === 0) return;
      const files = Array.from(filesList).slice(0, maxFiles);
      uploadMut.mutate(files, {
        onSuccess: (res) => {
          onUploaded(res.map((x) => ({ url: x.url })));
        },
      });
    },
    [maxFiles, onUploaded, uploadMut]
  );

  return (
    <div
      className={`rounded-card border border-dashed text-center cursor-pointer transition-all duration-200
        ${compact ? "px-3 py-3" : "px-4 py-6"}
        ${isOver 
          ? "border-primary bg-primary/5" 
          : "bg-secondary/10 hover:bg-secondary/20 hover:border-foreground/30"
        }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      {uploadMut.isPending ? (
        <div className={`${compact ? "text-[10px]" : "text-sm"} text-muted-foreground animate-pulse font-medium`}>Đang upload...</div>
      ) : (
        <>
          <div className={`font-medium text-foreground ${compact ? "text-[11px]" : ""}`}>Kéo thả ảnh vào đây</div>
          <div className={`text-muted-foreground mt-1 ${compact ? "text-[9px]" : "text-xs"}`}>hoặc bấm để chọn (tối đa {maxFiles} ảnh/lần)</div>
        </>
      )}
    </div>
  );
}
