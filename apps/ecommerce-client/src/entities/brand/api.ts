
import {axiosClient} from "@my-project/shared-utils";
import type { Brand, BrandListParams, PageRes, BrandId } from "./types";

const BASE_URL = "/api/v1/brands";

const buildQuery = (params?: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );

export async function listBrands(params?: BrandListParams): Promise<PageRes<Brand>> {
  const { data } = await axiosClient.get<PageRes<Brand>>(BASE_URL, {
    params: buildQuery(params),
  });
  return data;
}

export async function getBrandById(id: BrandId): Promise<Brand> {
  const { data } = await axiosClient.get<Brand>(`${BASE_URL}/${id}`);
  return data;
}

export async function getBrandBySlug(slug: string): Promise<Brand> {
  const { data } = await axiosClient.get<Brand>(`${BASE_URL}/slug/${slug}`);
  return data;
}

