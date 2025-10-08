import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => (
  <nav className="sidebar">
    <h2>Glad Labs</h2>
    <ul>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Dashboard
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/content"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Content
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/analytics"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Analytics
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/settings"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Settings
        </NavLink>
      </li>
    </ul>
  </nav>
);

export default Sidebar;
