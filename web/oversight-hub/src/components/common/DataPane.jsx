import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import ContentQueue from '../content-queue/ContentQueue';
import StrapiPosts from '../strapi-posts/StrapiPosts';
import Financials from '../financials/Financials';
import Marketing from '../marketing/Marketing';
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
