import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import AppRoutes from './routes/AppRoutes';
import CommandPane from './components/common/CommandPane';
import ProtectedRoute from './components/ProtectedRoute';
import useStore from './store/useStore';
import useAuth from './hooks/useAuth';
import './OversightHub.css';

const AppContent = () => {
  const theme = useStore((state) => state.theme);
  const { loading } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          color: '#666',
        }}
      >
        <div>Initializing...</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="oversight-hub-layout">
        <Sidebar />
        <div className="main-content">
          <div className="content-area">
            <AppRoutes />
          </div>
          <div className="command-pane-container">
            <CommandPane />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
