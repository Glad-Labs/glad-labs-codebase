import React, { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/common/Sidebar';
import AppRoutes from './routes/AppRoutes';
import CommandPane from './components/common/CommandPane';
import useStore from './store/useStore';
import useAuth from './hooks/useAuth';
import './OversightHub.css';

const AppContent = () => {
  const theme = useStore((state) => state.theme);
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Check if user is on a public route (login, auth/callback)
  const isPublicRoute =
    location.pathname === '/login' || location.pathname.startsWith('/auth/');

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

  // Public routes (login, auth callback) don't need sidebar/command pane
  if (isPublicRoute) {
    return <AppRoutes />;
  }

  // Protected routes require authentication and show sidebar
  if (!isAuthenticated) {
    return <AppRoutes />;
  }

  return (
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
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
