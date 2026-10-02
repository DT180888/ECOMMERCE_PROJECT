import { axiosClient } from "@my-project/shared-utils";
import type { UploadTempRes } from "./types";

export async function uploadTemp(files: File[]): Promise<UploadTempRes[]> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const { data } = await axiosClient.post<UploadTempRes[]>("/api/v1/uploads/tmp", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
