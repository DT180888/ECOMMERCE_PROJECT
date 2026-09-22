// src/entities/hero/types.ts

export interface AssetDetail {
  type: "image" | "video";
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
  tagText: string;       
  priceText: string;     
  actionUrl: string;     
  assets: HeroSlideAssets; 
}
