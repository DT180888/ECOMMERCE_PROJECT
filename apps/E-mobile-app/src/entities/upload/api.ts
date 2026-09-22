// src/entities/upload/api.ts
import {axiosClient} from "@shared/api/axiosClient";
import type { UploadTempRes } from "./types";

export async function uploadTemp(files: File[]): Promise<UploadTempRes[]> {
  const form = new FormData();
  // KEY phải là "files" (danh sách) đúng như UploadsController
  files.forEach((f) => form.append("files", f));
  const { data } = await axiosClient.post<UploadTempRes[]>("/api/v1/uploads/tmp", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
