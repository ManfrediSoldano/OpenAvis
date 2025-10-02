import React from 'react';
import BannerCarousel from '../banner/BannerCarousel';
import { BannerData } from '../../../types/Banner';

const bannersData: BannerData[] = [
  {
    id: '1',
    type: 'video',
    videoSrc: '/videos/avisNazionale-adv.mp4',
    fallbackImageSrc: 'https://via.placeholder.com/1920x1080?text=Video+Banner',
    texts: ['fa bene a te', 'fa bene agli altri', 'fa bene alla comunità'],
    startTime: 5,
    endTime: 15,
    descriptionText: "Donare il sangue"
  },
  {
    id: '2',
    type: 'image',
    imageSrc: '/images/adv.PNG',
    texts: [],
    descriptionText: "",
    enableAnimation: false
  }
];

const AvisStaticBanner: React.FC = () => {
  return (
    <BannerCarousel banners={bannersData} interval={25000} />
  );
};

export default AvisStaticBanner;
