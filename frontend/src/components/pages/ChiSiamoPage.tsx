import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TabView, TabPanel } from 'primereact/tabview';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import BloodPlasmaBanner from './BloodPlasmaBanner';
import './ChiSiamoPage.css';

interface TimelineEvent {
  year: string;
  title: string;
  icon: string;
  color: string;
  description: string;
}

const ChiSiamoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Sync route with active tab
  let activeIndex = 0;
  if (location.pathname === '/organi') {
    activeIndex = 1;
  } else if (location.pathname === '/convenzioni') {
    activeIndex = 2;
  }

  const handleTabChange = (e: { index: number }) => {
    if (e.index === 0) {
      navigate('/storia');
    } else if (e.index === 1) {
      navigate('/organi');
    } else if (e.index === 2) {
      navigate('/convenzioni');
    }
  };

  const timelineEvents: TimelineEvent[] = [
    {
      year: '1952',
      title: 'La Fondazione',
      icon: 'pi pi-flag',
      color: '#e30613',
      description: 'Nasce l\'AVIS Comunale di Merate per iniziativa del fondatore Giuseppe Ravasi, dando inizio a un cammino di solidarietà e di sensibilizzazione al dono del sangue sul territorio.'
    },
    {
      year: '1977',
      title: 'Centro Trasfusionale & 25° Anniversario',
      icon: 'pi pi-heart',
      color: '#0075be',
      description: 'Inaugurazione del centro trasfusionale all\'Ospedale Mandic di Merate, intitolato al fondatore Giuseppe Ravasi. L\'associazione celebra con orgoglio i suoi primi 25 anni di fondazione.'
    },
    {
      year: 'Anni \'80',
      title: 'L\'Era delle Autoemoteche',
      icon: 'pi pi-truck',
      color: '#e30613',
      description: 'Per invogliare le persone a donare, la domenica mattina presto arriva in piazza l\'autoemoteca mobile per le raccolte straordinarie. Emergono l\'instancabile opera di selezione di Marisa Ravasi e la guida stimata del presidente Alessandro Argenti.'
    },
    {
      year: '2001',
      title: 'Nuova Sede "Marisa Ravasi"',
      icon: 'pi pi-home',
      color: '#0075be',
      description: 'A seguito della dolorosa e improvvisa scomparsa di Marisa Ravasi, pilastro dell\'associazione succeduta al padre nella gestione, le viene intitolata la sede sociale nei locali comunali restaurati, sotto la presidenza di Luigi Panzeri.'
    },
    {
      year: '2004',
      title: 'Monumento ai Donatori',
      icon: 'pi pi-map-marker',
      color: '#e30613',
      description: 'Inaugurazione del monumento dedicato a tutti i donatori di sangue presso il cimitero di Merate, un simbolo tangibile del dono anonimo e gratuito, promosso da Luigi Panzeri e Battista Maggioni.'
    },
    {
      year: '2005 - 2008',
      title: 'La Presidenza di Vico Fresia',
      icon: 'pi pi-star',
      color: '#0075be',
      description: 'L\'avvocato Vico Fresia, segretario generale della FIODS (Federazione Internazionale delle Organizzazioni di Donatori di Sangue), guida con passione e autorevolezza la sezione meratese fino alla sua improvvisa scomparsa nel 2008.'
    }
  ];

  const customizedMarker = (item: TimelineEvent) => {
    return (
      <span className="timeline-marker" style={{ backgroundColor: item.color }}>
        <i className={item.icon}></i>
      </span>
    );
  };

  const customizedContent = (item: TimelineEvent) => {
    return (
      <div className="timeline-card">
        <div className="timeline-card-header">
          <span className="timeline-year">{item.year}</span>
          <h4 className="timeline-title" style={{ margin: 0 }}>{item.title}</h4>
        </div>
        <p className="timeline-desc">{item.description}</p>
      </div>
    );
  };

  return (
    <div className="chisiamo-page">
      <BloodPlasmaBanner
        title="Chi Siamo"
        description="Scopri la nostra storia, la struttura associativa e le convenzioni per i donatori."
      />
      <div className="chisiamo-container">
        <TabView
          activeIndex={activeIndex}
          onTabChange={handleTabChange}
          className="chisiamo-tabs"
        >
          <TabPanel header="La nostra Storia">
            <h2 className="timeline-section-title">Una storia di solidarietà dal 1952</h2>
            <p className="timeline-section-subtitle">
              Oltre mezzo secolo di impegno costante a favore del territorio, dei donatori e di chi ha bisogno di sangue.
              Ecco i momenti salienti della storia di AVIS Merate.
            </p>
            <Timeline
              value={timelineEvents}
              align="alternate"
              className="chisiamo-timeline"
              marker={customizedMarker}
              content={customizedContent}
            />
          </TabPanel>

          <TabPanel header="Organi Associativi">
            <h2 className="timeline-section-title" style={{ marginBottom: '1.5rem' }}>La struttura e i dati di AVIS Merate</h2>
            <p className="timeline-section-subtitle">
              I dati dei donatori e donazioni sono relativi al 2025.
            </p>

            {/* Statistiche dell'Ente */}
            <div className="runts-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              <div className="runt-stat-card">
                <div className="runt-stat-number">2.692</div>
                <div className="runt-stat-label">Donatori Attivi</div>
              </div>
              <div className="runt-stat-card">
                <div className="runt-stat-number">18</div>
                <div className="runt-stat-label">Donatori Collaboratori</div>
              </div>
              <div className="runt-stat-card">
                <div className="runt-stat-number">4.108</div>
                <div className="runt-stat-label">Donazioni Sangue Intero</div>
              </div>
              <div className="runt-stat-card">
                <div className="runt-stat-number">1.074</div>
                <div className="runt-stat-label">Donazioni Plasma</div>
              </div>
              <div className="runt-stat-card" style={{ borderTopColor: '#e30613' }}>
                <div className="runt-stat-number">5.182</div>
                <div className="runt-stat-label font-bold" style={{ color: '#e30613' }}>Totale Donazioni</div>
              </div>
            </div>

            <div className="organs-grid">
              {/* Comitato Esecutivo */}
              <div className="organ-card highlighted">
                <div className="organ-header">
                  <div className="organ-icon">
                    <i className="pi pi-briefcase"></i>
                  </div>
                  <h3 className="organ-title">Comitato Esecutivo</h3>
                </div>
                <p className="organ-desc">
                  Membri con cariche di amministrazione esecutiva e di rappresentanza dell'ente.
                </p>
                <div className="organ-members">
                  <div className="members-title">Cariche Istituzionali</div>
                  <ul className="members-list">
                    <li><strong>Presidente:</strong> Emanuele Greco</li>
                    <li><strong>Vicepresidente Vicario:</strong> Stefanino Barelli</li>
                    <li><strong>Vicepresidente:</strong> Antonio Gerosa</li>
                    <li><strong>Segretario:</strong> Cristian Scaccabarozzi</li>
                    <li><strong>Amministratrice:</strong> Piera Maria Valnegri</li>
                  </ul>
                </div>
              </div>

              {/* Consiglio Direttivo */}
              <div className="organ-card">
                <div className="organ-header">
                  <div className="organ-icon">
                    <i className="pi pi-users"></i>
                  </div>
                  <h3 className="organ-title">Organo di Amministrazione</h3>
                </div>
                <p className="organ-desc">
                  I 20 membri componenti dell'Organo di Amministrazione (Consiglio Direttivo) eletti per guidare e coordinare l'associazione.
                </p>
                <div className="organ-members">
                  <div className="members-title">Componenti dell'Organo (Consiglieri)</div>
                  <ul className="members-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.4rem 1rem' }}>
                    <li>Giuseppe Arlati</li>
                    <li>Sergio Bonalume</li>
                    <li>Alberto Brivio</li>
                    <li>Silvia Crippa</li>
                    <li>Cristian Colnaghi</li>
                    <li>Maurizio Comi</li>
                    <li>Edoardo Demontis</li>
                    <li>Daniele Fumagalli</li>
                    <li>Giorgio Fumagalli</li>
                    <li>Salvatore Galbusera</li>
                    <li>Angelo Gesti</li>
                    <li><strong>Emanuele Greco (Presidente)</strong></li>
                    <li>Massimo Isetti</li>
                    <li>Cristian Scaccabarozzi</li>
                    <li>Manfredi Soldano</li>
                    <li>Alessandro Stucchi</li>
                    <li>Armando Valagussa</li>
                    <li>Piera Maria Valnegri</li>
                    <li>Antonio Varra'</li>
                  </ul>
                </div>
              </div>

              {/* Collaboratori e Capigruppo Territoriali */}
              <div className="organ-card">
                <div className="organ-header">
                  <div className="organ-icon">
                    <i className="pi pi-map-marker"></i>
                  </div>
                  <h3 className="organ-title">Capigruppo &amp; Collaboratori</h3>
                </div>
                <p className="organ-desc">
                  Referenti operativi dei vari gruppi comunali locali e collaboratori per la gestione delle attività sul territorio.
                </p>
                <div className="organ-members">
                  <div className="members-title">Referenti di Gruppo &amp; Staff</div>
                  <ul className="members-list">
                    <li><strong>Capogruppo Osnago:</strong> Giuseppe Arlati</li>
                    <li><strong>Capogruppo Calco:</strong> Luigi Panariello</li>
                    <li><strong>Capogruppo Cernusco Lombardone:</strong> Aldo Conti</li>
                    <li><strong>Capogruppo Santa Maria Hoè:</strong> Adelio Colombo</li>
                    <li><strong>Collaboratori di Staff:</strong> Giuseppe Crippa</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Convenzioni">
            <div className="convenzioni-alert">
              <i className="pi pi-info-circle convenzioni-alert-icon"></i>
              <div className="convenzioni-alert-content">
                <h4>Sezione in allestimento</h4>
                <p>
                  Stiamo definendo nuove collaborazioni commerciali e convenzioni dedicate esclusivamente ai nostri soci donatori.
                  Presto potrai trovare qui l'elenco dei partner aderenti sul territorio meratese che offriranno sconti e agevolazioni esibendo il tesserino AVIS.
                </p>
              </div>
            </div>

            <div className="convenzioni-preview">
              <div className="convenzione-preview-card">
                <span className="convenzione-preview-icon">
                  <i className="pi pi-heart-fill"></i>
                </span>
                <h5>Salute &amp; Prevenzione</h5>
                <p>Agevolazioni per visite specialistiche, esami clinici e trattamenti fisioterapici presso studi medici convenzionati.</p>
              </div>

              <div className="convenzione-preview-card">
                <span className="convenzione-preview-icon">
                  <i className="pi pi-shopping-bag"></i>
                </span>
                <h5>Commercio Locale</h5>
                <p>Sconti riservati presso negozi di abbigliamento, ottica, librerie e alimentari della zona di Merate.</p>
              </div>

              <div className="convenzione-preview-card">
                <span className="convenzione-preview-icon">
                  <i className="pi pi-ticket"></i>
                </span>
                <h5>Tempo Libero &amp; Sport</h5>
                <p>Sconti e ingressi ridotti per palestre, centri sportivi, cinema e teatri del territorio provinciale.</p>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default ChiSiamoPage;
