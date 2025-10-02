import React, { useRef, useEffect } from "react";
import { VideoBanner as VideoBannerProps } from "../../../../types/Banner";
import AnimatedTitle from "../../../animatedtitle/AnimatedTitle";
import "./VideoBanner.css";

// Demo phrases (you can replace them with your own)
const bannerTexts = [
  "the community",
  "the city",
  "the school",
  "the environment",
  "you"
];

const VideoBanner: React.FC<VideoBannerProps> = ({
  videoSrc,
  fallbackImageSrc,
  startTime,
  endTime,
  descriptionText,
  texts = bannerTexts,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video loop logic (as before)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => {
      if (endTime && video.currentTime >= endTime) {
        video.currentTime = startTime || 0;
      }
    };
    if (startTime) {
      video.currentTime = startTime;
    }
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [startTime, endTime]);

  return (
    <div className="banner-container">
      <div className="video-background">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="video-element"
          poster={fallbackImageSrc}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="banner-content">
        <AnimatedTitle
          descriptionText={descriptionText || "AVIS"}
          animatedTexts={texts}
          enableAnimation={true}
        />
      </div>
    </div>
  );
};

export default VideoBanner;