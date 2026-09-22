// src/entities/collection/types.ts
export type CollectionId = number;

export interface CollectionDto {
  id: CollectionId;
  name: string;
  slug: string;
  description?: string;
  coverImageUrl?: string | null;
  isActive: boolean;
  createdAt?: string; // Optional if returned by BE
  updatedAt?: string; // Optional if returned by BE
}

export interface CollectionFormData {
  name: string;
  slug: string;
  description?: string;
  coverImageUrl?: string | null;
  isActive: boolean;
}

export interface CollectionListParams {
  keyword?: string;
  isActive?: boolean;
  page?: number;
  size?: number;
  sortBy?: 'name' | 'id' | 'isActive' | 'createdAt' | null;
  sortDirection?: 'asc' | 'desc' | null;
}

export interface PageRes<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}
