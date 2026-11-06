export interface UploadTempRes {
  url: string;
  path?: string;
  contentType?: string;
  sizeBytes?: number;
  /** @deprecated use sizeBytes */
  size?: number;
  originalName?: string;
}

