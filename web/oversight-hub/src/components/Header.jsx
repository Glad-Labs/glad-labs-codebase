import React from 'react';
import './Header.css';

const Header = ({ onNewTask, onIntervene }) => (
  <header className="hub-header">
    <h1>Content Agent Oversight Hub</h1>
    <div className="header-actions">
      <button onClick={onNewTask} className="new-task-btn">
        Create New Task
      </button>
      <button
        onClick={() => onIntervene('PAUSE_AGENT')}
        className="intervene-btn pause-btn"
      >
        Pause Agent
      </button>
      <button
        onClick={() => onIntervene('RESUME_AGENT')}
        className="intervene-btn resume-btn"
      >
        Resume Agent
      </button>
    </div>
  </header>
);

export default Header;
