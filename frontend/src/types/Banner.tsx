export type BannerType = 'video' | 'image';

export interface BaseBanner {
  id: string;
  type: BannerType;
}

export interface VideoBanner extends BaseBanner {
  type: 'video';
  videoSrc: string;
  fallbackImageSrc: string;
  startTime?: number;
  endTime?: number;
  texts: string[];
  descriptionText?: string;
  enableAnimation?: boolean;
}

export interface ImageBanner extends BaseBanner {
  type: 'image';
  imageSrc: string;
  texts: string[];
  descriptionText?: string;
  enableAnimation?: boolean;
}

export type BannerData = VideoBanner | ImageBanner;