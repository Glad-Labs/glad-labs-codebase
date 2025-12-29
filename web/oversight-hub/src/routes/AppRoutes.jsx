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
import ExecutionHub from '../components/pages/ExecutionHub';
import ExecutiveDashboard from '../components/pages/ExecutiveDashboard';
import TrainingDataDashboard from '../pages/TrainingDataDashboard';
import LangGraphTestPage from '../pages/LangGraphTest';
import Login from '../pages/Login';
import AuthCallback from '../pages/AuthCallback';
import ProtectedRoute from '../components/ProtectedRoute';
import LayoutWrapper from '../components/LayoutWrapper';

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected Routes with Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <ExecutiveDashboard />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <TaskManagement />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/execution"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <ExecutionHub />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/models"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <ModelManagement />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/social"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <SocialMediaManagement />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/content"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Content />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Analytics />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/training"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <TrainingDataDashboard />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/langgraph-test"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <LangGraphTestPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <Settings />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/costs"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <CostMetricsDashboard />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
