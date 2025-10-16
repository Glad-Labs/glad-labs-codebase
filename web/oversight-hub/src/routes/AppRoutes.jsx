import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Content, Analytics, Settings } from './index';
import SystemHealthDashboard from '../components/dashboard/SystemHealthDashboard';
import CostMetricsDashboard from '../components/CostMetricsDashboard';
import TaskManagement from '../components/tasks/TaskManagement';
import ModelManagement from '../components/models/ModelManagement';
import SocialMediaManagement from '../components/social/SocialMediaManagement';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SystemHealthDashboard />} />
      <Route path="/tasks" element={<TaskManagement />} />
      <Route path="/models" element={<ModelManagement />} />
      <Route path="/social" element={<SocialMediaManagement />} />
      <Route path="/content" element={<Content />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/cost-metrics" element={<CostMetricsDashboard />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default AppRoutes;
