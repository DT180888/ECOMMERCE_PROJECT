import { axiosClient } from "@my-project/shared-utils";
import type { HeroSlideDto, HeroSlideFormData } from "./types";

const BASE_URL = "/api/v1/hero-slides";

export interface PageRes<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

export async function getHeroSlides(params?: { isActive?: boolean; page?: number; size?: number }): Promise<PageRes<HeroSlideDto>> {
  const { data } = await axiosClient.get<PageRes<HeroSlideDto>>(BASE_URL, { params });
  return data;
}

export async function createHeroSlide(payload: HeroSlideFormData): Promise<HeroSlideDto> {
  const { data } = await axiosClient.post<HeroSlideDto>(BASE_URL, payload);
  return data;
}

export async function updateHeroSlide(id: number, payload: HeroSlideFormData): Promise<void> {
  await axiosClient.put(`${BASE_URL}/${id}`, payload);
}

export async function deleteHeroSlide(id: number): Promise<void> {
  await axiosClient.delete(`${BASE_URL}/${id}`);
}

export async function toggleHeroSlideStatus(id: number): Promise<void> {
  await axiosClient.patch(`${BASE_URL}/${id}/toggle-status`);
}
