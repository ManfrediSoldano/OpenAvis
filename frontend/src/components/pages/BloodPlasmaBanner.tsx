import React from "react";
import "./BloodPlasmaBanner.css";

interface BloodPlasmaBannerProps {
  title?: string;
  description?: string;
}

const BloodPlasmaBanner: React.FC<BloodPlasmaBannerProps> = ({
  title = "Sangue e plasma: indispensabili fonti di vita",
  description = "Servono a curare numerose patologie e a garantire la sopravvivenza di molte persone. Ogni giorno." }) => (
  <div className="blood-plasma-banner">
    <h2 className="blood-plasma-title">{title}</h2>
    <p className="blood-plasma-description">{description}</p>
  </div>
);

export default BloodPlasmaBanner;
