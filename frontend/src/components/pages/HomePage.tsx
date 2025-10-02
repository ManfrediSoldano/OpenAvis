import React, { useState, useEffect } from 'react';
import AvisStaticBanner from '../header/staticbanner/AvisStaticBanner';
import BloodPlasmaBanner from './BloodPlasmaBanner';

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

  return (
    <main>
      <AvisStaticBanner />
      <BloodPlasmaBanner />
    </main>
  );
};

export default HomePage;