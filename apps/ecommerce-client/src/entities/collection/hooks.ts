import { useQuery } from "@tanstack/react-query";
import { collectionClientApi } from "./api";

export const useCollectionOptions = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["collections", "options"],
    queryFn: collectionClientApi.getCollections,
  });

  const options = (data || []).map((c) => ({
    label: c.name,
    value: c.slug,
  }));

  return { options, isLoading };
};

export const useCollectionBySlug = (slug?: string) => {
  return useQuery({
    queryKey: ["collection", slug],
    queryFn: () => collectionClientApi.getCollectionBySlug(slug!),
    enabled: !!slug,
  });
};
