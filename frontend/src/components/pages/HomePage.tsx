import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AvisStaticBanner from '../header/staticbanner/AvisStaticBanner';
import BloodPlasmaBanner from './BloodPlasmaBanner';
import InfoBlock from './InfoBlock';
import NewsSection from '../news/NewsSection';
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
      <NewsSection />
      <hr style={{ maxWidth: '1100px', margin: '3rem auto', border: 'none', borderTop: '1px solid #e0e0e0' }} />
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <InfoBlock
          image="https://openavismeratestorage.blob.core.windows.net/public-assets/ate.png"
          title="Fa bene a te"
          subtitle="Donare il sangue fa bene anche a chi dona"
          description={
            <>
              Donare il sangue garantisce un <strong>monitoraggio costante</strong> della salute con esami gratuiti, protegge <strong>cuore e fegato</strong> riducendo il ferro in eccesso e abbassa il rischio di <strong>diabete</strong>. Inoltre, incentiva uno <strong>stile di vita sano</strong> e regala un profondo <strong>benessere psicologico</strong> derivante dal gesto di solidarietà.
            </>
          }
          citation={{
            text: "AVIS Provinciale Brescia",
            link: "https://avisprovincialebrescia.it/donare-il-sangue-fa-bene-anche-al-donatore-5-benefici-per-chi-dona/"
          }} />
        <InfoBlock
          image="https://openavismeratestorage.blob.core.windows.net/public-assets/altri.png"
          title="Fa bene agli altri"
          subtitle="Il sangue e il plasma salvano vite ogni giorno"
          description="Il sangue donato viene utilizzato per trasfusioni, interventi chirurgici, terapie oncologiche e per la produzione di farmaci plasmaderivati. In Italia ogni anno vengono effettuate oltre 3 milioni di trasfusioni e più di 800.000 pazienti beneficiano delle donazioni. Il plasma è fondamentale per produrre immunoglobuline, albumina e altri farmaci salvavita." />
        <InfoBlock
          image="https://openavismeratestorage.blob.core.windows.net/public-assets/comunit%C3%A0.png"
          title="Fa bene alla comunità"
          subtitle="L'impatto di AVIS Merate per il territorio"
          description="AVIS Merate sostiene concretamente il territorio attraverso importanti donazioni, come una nuova ambulanza alla Croce Bianca e attrezzature mediche avanzate per l'Ospedale Mandic. L'impegno dell'associazione si estende anche all'installazione di defibrillatori e alla promozione di progetti di prevenzione e formazione nelle scuole, rafforzando costantemente la rete di solidarietà locale." />
      </section>
    </main>
  );
};

export default HomePage;