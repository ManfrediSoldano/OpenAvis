import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AvisStaticBanner from '../header/staticbanner/AvisStaticBanner';
import BloodPlasmaBanner from './BloodPlasmaBanner';
import InfoBlock from './InfoBlock';
import './HomePage.css';

interface AppConfig {
  associationName: string;
  location: string;
  contactEmail: string;
  domain: string;
}

const HomePage: React.FC = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate();
  return (
    <main>
      <AvisStaticBanner />
      <BloodPlasmaBanner />
      <div className="homepage-donator-btn">
        <button onClick={() => navigate('/diventa-donatore')}>Diventa donatore</button>
      </div>
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <InfoBlock
          image={process.env.PUBLIC_URL + '/images/ate.png'}
          title="Fa bene a te"
          subtitle="Donare il sangue fa bene anche a chi dona"
          description="Donare il sangue stimola la produzione di nuove cellule, aiuta a monitorare regolarmente la propria salute grazie ai controlli periodici e offre una gratificazione personale per il gesto solidale. Diversi studi dimostrano che i donatori regolari hanno una migliore salute cardiovascolare e un rischio ridotto di alcune patologie." />
        <InfoBlock
          image={process.env.PUBLIC_URL + '/images/altri.png'}
          title="Fa bene agli altri"
          subtitle="Il sangue e il plasma salvano vite ogni giorno"
          description="Il sangue donato viene utilizzato per trasfusioni, interventi chirurgici, terapie oncologiche e per la produzione di farmaci plasmaderivati. In Italia ogni anno vengono effettuate oltre 3 milioni di trasfusioni e più di 800.000 pazienti beneficiano delle donazioni. Il plasma è fondamentale per produrre immunoglobuline, albumina e altri farmaci salvavita." />
        <InfoBlock
          image={process.env.PUBLIC_URL + '/images/comunità.png'}
          title="Fa bene alla comunità"
          subtitle="L'impatto di AVIS Merate per il territorio"
          description="AVIS Merate ha donato negli anni un ambulanza, defibrillatori e attrezzature mediche agli ospedali e alle associazioni locali. Tra le donazioni più recenti: ambulanza alla Croce Bianca di Merate, apparecchiature per l’Ospedale Mandic, sostegno a progetti di prevenzione e formazione nelle scuole. Ogni donazione rafforza la rete di solidarietà e aiuta tutta la comunità." />
      </section>
    </main>
  );
};

export default HomePage;