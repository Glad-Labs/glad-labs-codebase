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
import AgentsPage from '../components/pages/AgentsPage';
import WorkflowHistoryPage from '../components/pages/WorkflowHistoryPage';
import ApprovalQueue from '../components/ApprovalQueue';
import TrainingDataDashboard from '../pages/TrainingDataDashboard';
import CommandQueuePage from '../pages/CommandQueuePage';
import OrchestratorPage from '../pages/OrchestratorPage';
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
              <Dashboard />
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
        path="/cost-metrics"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <CostMetricsDashboard />
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
        path="/agents"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <AgentsPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/workflow"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <WorkflowHistoryPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/approvals"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <ApprovalQueue />
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
        path="/queue"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <CommandQueuePage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orchestrator"
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <OrchestratorPage />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
