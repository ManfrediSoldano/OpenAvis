import React from "react";
import "./InfoBlock.css";

interface InfoBlockProps {
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ image, title, subtitle, description }) => (
  <div className="info-block">
    <div className="info-block-image-wrapper">
      <img src={image} alt={title} className="info-block-image" />
    </div>
    <div className="info-block-content">
      <h3 className="info-block-title">{title}</h3>
      <div className="info-block-subtitle">{subtitle}</div>
      <div className="info-block-description">{description}</div>
    </div>
  </div>
);

export default InfoBlock;
