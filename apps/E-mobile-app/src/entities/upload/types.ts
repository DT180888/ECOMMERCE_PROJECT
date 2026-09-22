// src/entities/upload/types.ts
export interface UploadTempRes {
  url: string;         // BE trả đường dẫn dùng để hiển thị/lưu vào product.images
  path: string;        // đường dẫn vật lý nội bộ (FE không cần gửi lên)
  contentType: string;
  sizeBytes: number;
}
