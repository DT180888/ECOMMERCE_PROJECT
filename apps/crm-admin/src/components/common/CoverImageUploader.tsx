import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@my-project/ui';
import ImageUploader from './ImageUploader';
import { buildImgSrc } from '@my-project/shared-utils';
import { DEFAULT_PRODUCT_IMAGE_URL } from "@my-project/shared-utils";

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
  if (img) {
    return (
      <div className="relative h-36 w-full rounded-[2px] border border-border/60 overflow-hidden">
        <img 
          src={buildImgSrc(img)} 
          alt="Cover Preview" 
          className="w-full h-full object-cover" 
          onError={(e) => { e.currentTarget.src = DEFAULT_PRODUCT_IMAGE_URL; }} 
        />
        <Button 
          type="button"
          variant="destructive"
          size="icon-xs"
          onClick={onRemove}
          className="absolute top-1 right-1 shadow-none"
          title="Xóa ảnh bìa"
          icon={<TrashIcon className="w-3 h-3" />}
        />
      </div>
    );
  }

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
