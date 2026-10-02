import { useMutation } from "@tanstack/react-query";
import { uploadTemp } from "@my-project/api";
import type { UploadTempRes } from "@my-project/api";

export function useUploadTemp() {
  return useMutation<UploadTempRes[], unknown, File[]>({
    mutationFn: (files) => uploadTemp(files),
  });
}
