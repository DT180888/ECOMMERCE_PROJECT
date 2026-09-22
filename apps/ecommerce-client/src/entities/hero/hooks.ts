// src/entities/hero/hooks.ts
import { useQuery } from "@tanstack/react-query";
import { getHeroSlides } from "./api";

export const heroKeys = {
  all: ["client", "hero-slides"] as const,
};

export function useHeroSlides() {
  return useQuery({
    queryKey: heroKeys.all,
    queryFn: getHeroSlides,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}
