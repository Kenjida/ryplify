import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ArticlePage from './pages/ArticlePage';
import IpAnalyticsPage from './pages/IpAnalyticsPage';
import AnalyticsTracker from './components/AnalyticsTracker';
import ProjectPage from './pages/ProjectPage';
import AllArticlesPage from './pages/AllArticlesPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <AnalyticsTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/admin/ips" element={<ProtectedRoute><IpAnalyticsPage /></ProtectedRoute>} />
        <Route path="/clanek/:id" element={<ArticlePage />} />
        <Route path="/projekt" element={<ProjectPage />} />
        <Route path="/clanky" element={<AllArticlesPage />} />
      </Routes>
    </Router>
  );
};

export default App;