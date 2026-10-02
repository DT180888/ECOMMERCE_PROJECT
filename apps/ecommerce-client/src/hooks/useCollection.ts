import { useQuery } from "@tanstack/react-query";
import { collectionClientApi } from "@my-project/api";

export const useCollectionOptions = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["collections", "options"],
    queryFn: collectionClientApi.getCollections,
  });

  const list = Array.isArray(data) ? data : (data as any)?.items ?? [];

  const options = list.map((c: any) => ({
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
