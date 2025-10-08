import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import ContentQueue from './ContentQueue';
import StrapiPosts from './StrapiPosts';
import Financials from './Financials';
import Marketing from './Marketing';
import './DataPane.css';

const DataPane = () => (
  <div className="data-pane">
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/content-queue" element={<ContentQueue />} />
      <Route path="/strapi-posts" element={<StrapiPosts />} />
      <Route path="/financials" element={<Financials />} />
      <Route path="/marketing" element={<Marketing />} />
    </Routes>
  </div>
);

export default DataPane;
