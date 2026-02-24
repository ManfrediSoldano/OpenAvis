import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import HomePage from './components/pages/HomePage';
import ProspectiveDonorsPage from './components/pages/ProspectiveDonorsPage';
import NotFoundPage from './components/pages/NotFoundPage';
import DonorSignup from './components/pages/DonorSignup';
import NewsPage from './components/news/NewsPage';
import NewsListPage from './components/news/NewsListPage';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import ReservedDashboard from './components/reserved/ReservedDashboard';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { ProgressSpinner } from 'primereact/progressspinner';
import ScrollToTop from './components/common/ScrollToTop';

const LoginPageRedirect: React.FC = () => {
  React.useEffect(() => {
    window.location.replace("/.auth/login/aad");
  }, []);
  return (
    <div className="flex align-items-center justify-content-center h-screen">
      <ProgressSpinner />
    </div>
  );
}

const AppContent: React.FC = () => {
  const location = useLocation();
  const isReservedArea = location.pathname.startsWith('/reserved');

  return (
    <div className="App">
      <div className="app-content-wrapper">
        <PrimeReactProvider>
          {!isReservedArea && <Header />}
          <main className={!isReservedArea ? "main-content" : ""}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/Assemblea2026" element={<Navigate to="/news/assemblea-comunale-2026" replace />} />
              <Route path="/AssembleaOrdinaria" element={<Navigate to="/news/assemblea-comunale-2026" replace />} />
              <Route path="/aspiranti" element={<ProspectiveDonorsPage />} />
              <Route path="/diventa-donatore" element={<DonorSignup />} />
              <Route path="/news" element={<NewsListPage />} />
              <Route path="/news/:id" element={<NewsPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/reserved" element={<ReservedDashboard />} />
              <Route path="/login" element={<LoginPageRedirect />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          {!isReservedArea && <Footer />}
        </PrimeReactProvider>
      </div>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
