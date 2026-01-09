import React from "react";
import "./InfoBlock.css";

interface InfoBlockProps {
  image: string;
  title: string;
  subtitle: string;
  description: React.ReactNode;
  citation?: {
    text: string;
    link: string;
  };
}

const InfoBlock: React.FC<InfoBlockProps> = ({ image, title, subtitle, description, citation }) => (
  <div className="info-block">
    <div className="info-block-image-wrapper">
      <img src={image} alt={title} className="info-block-image" />
    </div>
    <div className="info-block-content">
      <h3 className="info-block-title">{title}</h3>
      <div className="info-block-subtitle">{subtitle}</div>
      <div className="info-block-description">{description}</div>
      {citation && (
        <div className="info-block-citation">
          Fonte: <a href={citation.link} target="_blank" rel="noopener noreferrer">{citation.text}</a>
        </div>
      )}
    </div>
  </div>
);

export default InfoBlock;
