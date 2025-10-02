import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import HomePage from './components/pages/HomePage';
import ProspectiveDonorsPage from './components/pages/ProspectiveDonorsPage';
import NotFoundPage from './components/pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <div className="app-content-wrapper">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/aspiranti" element={<ProspectiveDonorsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;