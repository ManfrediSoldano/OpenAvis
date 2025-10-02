import React from 'react';
import { ImageBanner as ImageBannerProps } from '../../../../types/Banner';
import AnimatedTitle from '../../../animatedtitle/AnimatedTitle';
import './ImageBanner.css'; 

const ImageBanner: React.FC<ImageBannerProps> = ({ imageSrc, texts, descriptionText, enableAnimation = true }) => {
  return (
    <div className="banner-container">
      <div className="image-background">
        <img src={imageSrc} alt="Banner background" className="image-element" />
      </div>
      <div className="banner-content">
        <AnimatedTitle
          descriptionText={descriptionText || ""}
          animatedTexts={texts}
          enableAnimation={enableAnimation}
        />
      </div>
    </div>
  );
};

export default ImageBanner;