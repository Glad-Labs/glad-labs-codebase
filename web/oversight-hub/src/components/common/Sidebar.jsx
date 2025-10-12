import React, { useRef, useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const sidebarRef = useRef(null);
  const isResizing = useRef(false);
  const [isCompressed, setIsCompressed] = useState(false);

  // Ensure layout is properly initialized
  useEffect(() => {
    // Just ensure CSS variables are set, let CSS handle the layout
    const sidebarWidth = getComputedStyle(document.documentElement)
      .getPropertyValue('--sidebar-width')
      .trim();

    if (!sidebarWidth || sidebarWidth === '') {
      document.documentElement.style.setProperty('--sidebar-width', '250px');
    }
  }, []);
  const startResize = useCallback((e) => {
    isResizing.current = true;
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleResize = useCallback((e) => {
    if (!isResizing.current) return;

    const newWidth = e.clientX;
    if (newWidth >= 200 && newWidth <= 400) {
      document.documentElement.style.setProperty(
        '--sidebar-width',
        `${newWidth}px`
      );
    }
  }, []);

  const stopResize = useCallback(() => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleResize]);

  return (
    <nav
      className={`sidebar ${isCompressed ? 'compressed' : ''}`}
      ref={sidebarRef}
    >
      <div className="sidebar-header">
        <h2 className="sidebar-title">{isCompressed ? 'GL' : 'Glad Labs'}</h2>
        <button
          className="sidebar-toggle-btn"
          onClick={() => setIsCompressed(!isCompressed)}
          title={isCompressed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCompressed ? '→' : '←'}
        </button>
      </div>
      <div className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span className="sidebar-icon">📊</span>
              <span className="sidebar-label">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/content"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span className="sidebar-icon">📝</span>
              <span className="sidebar-label">Content</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/analytics"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span className="sidebar-icon">📈</span>
              <span className="sidebar-label">Analytics</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span className="sidebar-icon">⚙️</span>
              <span className="sidebar-label">Settings</span>
            </NavLink>
          </li>
        </ul>
      </div>
      <div
        className="resize-handle sidebar-resize-handle"
        onMouseDown={startResize}
      />
    </nav>
  );
};

export default Sidebar;
