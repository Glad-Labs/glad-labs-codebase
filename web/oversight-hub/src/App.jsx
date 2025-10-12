import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import AppRoutes from './routes/AppRoutes';
import CommandPane from './components/common/CommandPane';
import './OversightHub.css';

const App = () => (
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

export default App;
