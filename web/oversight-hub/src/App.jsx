import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import DataPane from './components/common/DataPane';
import CommandPane from './components/common/CommandPane';
import './OversightHub.css';

const App = () => (
  <Router>
    <div className="oversight-hub-layout">
      <Sidebar />
      <main className="main-content">
        <DataPane />
        <CommandPane />
      </main>
    </div>
  </Router>
);

export default App;
