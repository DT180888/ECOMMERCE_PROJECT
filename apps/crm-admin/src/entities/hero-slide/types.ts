export interface AssetDetail {
  type: string;
  url: string;
}

export interface HeroSlideAssets {
  fullscreenDesktop: AssetDetail;
  fullscreenMobile: AssetDetail;
  bannerDesktop: AssetDetail;
  bannerMobile: AssetDetail;
}

export interface HeroSlideDto {
  id: number;
  brandText: string;
  titleText: string;
  tagText?: string;
  priceText?: string;
  actionUrl: string;
  sortOrder: number;
  isActive: boolean;
  assets: HeroSlideAssets;
}

export interface HeroSlideFormData {
  brandText: string;
  titleText: string;
  tagText?: string;
  priceText?: string;
  actionUrl: string;
  sortOrder: number;
  assets: HeroSlideAssets;
}
