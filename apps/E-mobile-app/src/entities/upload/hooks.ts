// src/entities/upload/hooks.ts
import { useMutation } from "@tanstack/react-query";
import { uploadTemp } from "./api";
import type { UploadTempRes } from "./types";

export function useUploadTemp() {
  return useMutation<UploadTempRes[], unknown, File[]>({
    mutationFn: (files) => uploadTemp(files),
  });
}
