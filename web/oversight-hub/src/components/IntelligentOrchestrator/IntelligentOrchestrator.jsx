/**
 * IntelligentOrchestratorPanel.jsx
 *
 * Main component for the intelligent orchestrator UI
 * Combines:
 * - Natural language input form
 * - Real-time execution monitor
 * - Approval panel for results
 * - Training data management
 */

import React, { useState, useEffect, useCallback } from 'react';
import useStore from '../../store/useStore';
import {
  processOrchestratorRequest,
  getOrchestratorStatus,
  getOrchestratorApproval,
  approveOrchestratorResult,
  getOrchestratorTools,
} from '../../services/cofounderAgentClient';
import NaturalLanguageInput from './NaturalLanguageInput';
import ExecutionMonitor from './ExecutionMonitor';
import ApprovalPanel from './ApprovalPanel';
import TrainingDataManager from './TrainingDataManager';
import './IntelligentOrchestrator.css';

function IntelligentOrchestratorPanel() {
  const { orchestrator, setOrchestratorState, resetOrchestrator } = useStore();

  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('input'); // input, monitor, approval, training

  // Fetch available tools on mount
  useEffect(() => {
    fetchTools();
  }, []);

  // Poll for status updates when task is active
  useEffect(() => {
    if (
      !orchestrator.taskId ||
      orchestrator.status === 'completed' ||
      orchestrator.status === 'failed'
    ) {
      return;
    }

    const interval = setInterval(() => {
      pollStatus();
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
     
  }, [orchestrator.taskId, orchestrator.status]);

  const fetchTools = async () => {
    try {
      const response = await getOrchestratorTools();
      setTools(response.tools || []);
    } catch (err) {
      console.error('Error fetching tools:', err);
      setError('Failed to load available tools');
    }
  };

  const pollStatus = useCallback(async () => {
    if (!orchestrator.taskId) return;

    try {
      const status = await getOrchestratorStatus(orchestrator.taskId);
      setOrchestratorState({
        status: status.status,
        phase: status.current_phase,
        progress: status.progress_percentage || 0,
      });

      // When pending approval, fetch approval details
      if (status.status === 'pending_approval') {
        const approval = await getOrchestratorApproval(orchestrator.taskId);
        setOrchestratorState({
          outputs: approval.outputs || {},
          qualityScore: approval.quality_assessment?.score || 0,
        });
        setActiveTab('approval');
      }
    } catch (err) {
      console.error('Error polling status:', err);
    }
  }, [orchestrator.taskId, setOrchestratorState]);

  const handleSubmitRequest = async (request, businessMetrics, preferences) => {
    try {
      setLoading(true);
      setError(null);
      resetOrchestrator();

      const response = await processOrchestratorRequest(
        request,
        businessMetrics,
        preferences
      );

      if (response.task_id) {
        setOrchestratorState({
          taskId: response.task_id,
          status: 'processing',
          currentRequest: request,
          phase: 'planning',
          progress: 0,
        });
        setActiveTab('monitor');
      } else {
        setError('No task ID returned from server');
      }
    } catch (err) {
      console.error('Error submitting request:', err);
      setError(err.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (approved, feedback) => {
    if (!orchestrator.taskId) return;

    try {
      setLoading(true);
      await approveOrchestratorResult(orchestrator.taskId, approved, feedback);

      setOrchestratorState({
        status: approved ? 'publishing' : 'rejected',
      });

      if (approved) {
        setTimeout(() => setActiveTab('training'), 2000);
      }
    } catch (err) {
      console.error('Error approving result:', err);
      setError(err.message || 'Failed to process approval');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    resetOrchestrator();
    setActiveTab('input');
    setError(null);
  };

  return (
    <div className="intelligent-orchestrator-container">
      {/* Header */}
      <div className="orchestrator-header">
        <h1 className="orchestrator-title">🧠 Intelligent Orchestrator</h1>
        <p className="orchestrator-subtitle">
          Transform business objectives into executed workflows with AI-powered
          reasoning
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span className="error-text">{error}</span>
          <button onClick={() => setError(null)} className="error-close">
            ✕
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tabs-navigation">
        <button
          className={`tab-button ${activeTab === 'input' ? 'active' : ''}`}
          onClick={() => setActiveTab('input')}
          disabled={loading}
        >
          📝 Request
        </button>
        <button
          className={`tab-button ${activeTab === 'monitor' ? 'active' : ''}`}
          onClick={() => setActiveTab('monitor')}
          disabled={!orchestrator.taskId || loading}
        >
          📊 Monitor
        </button>
        <button
          className={`tab-button ${activeTab === 'approval' ? 'active' : ''}`}
          onClick={() => setActiveTab('approval')}
          disabled={orchestrator.status !== 'pending_approval' || loading}
        >
          ✅ Approve
        </button>
        <button
          className={`tab-button ${activeTab === 'training' ? 'active' : ''}`}
          onClick={() => setActiveTab('training')}
          disabled={!orchestrator.taskId || loading}
        >
          🎓 Training Data
        </button>
      </div>

      {/* Tab Content */}
      <div className="tabs-content">
        {/* Input Tab */}
        {activeTab === 'input' && (
          <NaturalLanguageInput
            onSubmit={handleSubmitRequest}
            loading={loading}
            tools={tools}
            onReset={handleReset}
          />
        )}

        {/* Monitor Tab */}
        {activeTab === 'monitor' && (
          <ExecutionMonitor
            taskId={orchestrator.taskId}
            phase={orchestrator.phase}
            progress={orchestrator.progress}
            status={orchestrator.status}
            request={orchestrator.currentRequest}
          />
        )}

        {/* Approval Tab */}
        {activeTab === 'approval' && (
          <ApprovalPanel
            taskId={orchestrator.taskId}
            outputs={orchestrator.outputs}
            qualityScore={orchestrator.qualityScore}
            onApprove={handleApprove}
            loading={loading}
          />
        )}

        {/* Training Data Tab */}
        {activeTab === 'training' && (
          <TrainingDataManager
            taskId={orchestrator.taskId}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

export default IntelligentOrchestratorPanel;
