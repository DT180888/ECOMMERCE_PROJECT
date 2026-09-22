export interface CollectionDto {
  collectionId: number;
  slug: string;
  name: string;
  description: string | null;
  heroBannerUrl: string | null;
  squareImageUrl: string | null;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
}
