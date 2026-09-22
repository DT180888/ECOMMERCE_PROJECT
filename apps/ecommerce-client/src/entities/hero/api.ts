// src/entities/hero/api.ts
import { axiosClient } from "@my-project/shared-utils";
import type { HeroSlideDto } from "./types";

const BASE_URL = "/api/v1/hero-slides";

export async function getHeroSlides(): Promise<HeroSlideDto[]> {
  const { data } = await axiosClient.get<any>(BASE_URL);
  // Support both array and paginated format
  return Array.isArray(data) ? data : data.items || [];
}
