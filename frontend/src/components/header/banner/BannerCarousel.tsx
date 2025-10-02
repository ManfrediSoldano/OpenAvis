import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { BannerData } from '../../../types/Banner';
import VideoBanner from './video/VideoBanner';
import ImageBanner from './image/ImageBanner';
import './BannerCarousel.css'; // Import specific CSS for this component

interface BannerCarouselProps {
  banners: BannerData[];
  interval: number;
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners, interval }) => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, interval);

    return () => clearInterval(timer);
  }, [banners.length, interval]);

  const currentBanner = banners[currentBannerIndex];

  const variants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: '0%',
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: { duration: 0.5, ease: 'easeIn' },
    }),
  };

  const renderBanner = (banner: BannerData) => {
    switch (banner.type) {
      case 'video':
        return <VideoBanner {...banner} />;
      case 'image':
        return <ImageBanner {...banner} />;
      default:
        return null;
    }
  };

  return (
    <div className="carousel-container">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentBanner.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="carousel-item-wrapper"
        >
          {renderBanner(currentBanner)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BannerCarousel;