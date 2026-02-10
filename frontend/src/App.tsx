import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import HomePage from './components/pages/HomePage';
import ProspectiveDonorsPage from './components/pages/ProspectiveDonorsPage';
import NotFoundPage from './components/pages/NotFoundPage';
import DonorSignup from './components/pages/DonorSignup';
import NewsPage from './components/news/NewsPage';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import ScrollToTop from './components/common/ScrollToTop';

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <div className="app-content-wrapper">
          <PrimeReactProvider>
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/aspiranti" element={<ProspectiveDonorsPage />} />
                <Route path="/diventa-donatore" element={<DonorSignup />} />
                <Route path="/news/:id" element={<NewsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </PrimeReactProvider>
        </div>
      </div>
    </Router>
  );
}

export default App;