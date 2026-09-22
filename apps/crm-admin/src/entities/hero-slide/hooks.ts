import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide, toggleHeroSlideStatus } from "./api";
import type { HeroSlideFormData } from "./types";

export const heroSlideKeys = {
  all: ["admin", "hero-slides"] as const,
  lists: () => [...heroSlideKeys.all, "list"] as const,
  list: (params: any) => [...heroSlideKeys.lists(), params] as const,
};

export function useHeroSlides(params: { isActive?: boolean; page: number; size: number }) {
  return useQuery({
    queryKey: heroSlideKeys.list(params),
    queryFn: () => getHeroSlides(params),
    placeholderData: (prev) => prev,
  });
}

export function useCreateHeroSlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHeroSlide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: heroSlideKeys.lists() });
    },
  });
}

export function useUpdateHeroSlide(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: HeroSlideFormData) => updateHeroSlide(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: heroSlideKeys.lists() });
    },
  });
}

export function useDeleteHeroSlide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHeroSlide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: heroSlideKeys.lists() });
    },
  });
}

export function useToggleHeroSlideStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleHeroSlideStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: heroSlideKeys.lists() });
    },
  });
}
