import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => (
  <nav className="sidebar">
    <h2>Glad Labs</h2>
    <ul>
      <li>
        <NavLink to="/" exact activeClassName="active">
          Dashboard
        </NavLink>
      </li>
      <li>
        <NavLink to="/content-queue" activeClassName="active">
          Content Queue
        </NavLink>
      </li>
      <li>
        <NavLink to="/strapi-posts" activeClassName="active">
          Strapi Posts
        </NavLink>
      </li>
      <li>
        <NavLink to="/financials" activeClassName="active">
          Financials
        </NavLink>
      </li>
      {/* Future sections */}
      <li>
        <NavLink
          to="/marketing"
          activeClassName="active"
          className="disabled-link"
        >
          Marketing
        </NavLink>
      </li>
    </ul>
  </nav>
);

export default Sidebar;
