import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import AppRoutes from './routes/AppRoutes';
import CommandPane from './components/common/CommandPane';
import useStore from './store/useStore';
import './OversightHub.css';

const App = () => {
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
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
    </Router>
  );
};

export default App;
