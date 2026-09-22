import { axiosClient } from "@my-project/shared-utils";
import type { CollectionDto } from "./types";

export const collectionClientApi = {
  getCollections: async () => {
    const { data } = await axiosClient.get<any>("/api/v1/collections?isActive=true&size=100");
    return data.items as CollectionDto[];
  },
  getCollectionBySlug: async (slug: string): Promise<CollectionDto> => {
    const { data } = await axiosClient.get<CollectionDto>(`/api/v1/collections/slug/${slug}`);
    return data;
  }
};
