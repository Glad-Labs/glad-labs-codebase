import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Dashboard, Content, Analytics, Settings } from './index';
import CostMetricsDashboard from '../components/CostMetricsDashboard';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/content" element={<Content />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/cost-metrics" element={<CostMetricsDashboard />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default AppRoutes;
