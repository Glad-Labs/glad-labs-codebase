import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  Dashboard,
  Content,
  Analytics,
  Settings,
  TaskManagement,
  ModelManagement,
  SocialMediaManagement,
  CostMetricsDashboard,
} from './index';
import Login from '../pages/Login';
import AuthCallback from '../pages/AuthCallback';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/tasks" element={<TaskManagement />} />
      <Route path="/models" element={<ModelManagement />} />
      <Route path="/social" element={<SocialMediaManagement />} />
      <Route path="/content" element={<Content />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/cost-metrics" element={<CostMetricsDashboard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
