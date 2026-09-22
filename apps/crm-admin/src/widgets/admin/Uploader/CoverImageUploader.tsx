import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import ImageUploader from './ImageUploader';
import { buildImgSrc } from '@shared/lib/url';
import { DEFAULT_PRODUCT_IMAGE_URL } from "@shared/constants"; // <-- ĐÃ THÊM IMPORT

// Định nghĩa Props chuyên biệt cho chế độ 1 file
type CoverImageUploaderProps = {
  img?: string | null;           
  onUploadSuccess: (url: string) => void; 
  onRemove: () => void;                  
  folder: string;                       
  maxFileSize?: number;                  
};

const CoverImageUploader: React.FC<CoverImageUploaderProps> = ({
  img,
  onUploadSuccess,
  onRemove,
}) => {
  // Chế độ Preview (Khi đã có URL)
  if (img) {
    return (
      <div className="relative h-36 w-full rounded-card overflow-hidden ">
        <img 
          src={buildImgSrc(img)} 
          alt="Cover Preview" 
          className="w-full h-full object-cover" 
          onError={(e) => { e.currentTarget.src = DEFAULT_PRODUCT_IMAGE_URL; }} 
        />
        <button 
          type="button"
          onClick={onRemove}
          className="absolute top-1 right-1 bg-error/80 p-1.5 rounded-full text-error-foreground hover:bg-error transition-all duration-200 shadow-soft hover:scale-[1.05] active:scale-[0.95]"
          title="Xóa ảnh bìa"
        >
          <TrashIcon className="w-3 h-3 md:w-4 md:h-4" />
        </button>
      </div>
    );
  }

  // Chế độ Upload (Khi chưa có URL)
  return (
    <ImageUploader
      multiple={false} 
      maxFiles={1}
      onUploaded={(items) => {
        if (items.length > 0) {
          onUploadSuccess(items[0].url);
        }
      }}
      accept="image/jpeg, image/png, image/webp"
    />
  );
};

export default CoverImageUploader;