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
          to="/content-queue"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Content Queue
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/strapi-posts"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Strapi Posts
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/financials"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Financials
        </NavLink>
      </li>
      {/* Future sections */}
      <li>
        <NavLink
          to="/marketing"
          className={({ isActive }) =>
            isActive ? 'active disabled-link' : 'disabled-link'
          }
        >
          Marketing
        </NavLink>
      </li>
    </ul>
  </nav>
);

export default Sidebar;
