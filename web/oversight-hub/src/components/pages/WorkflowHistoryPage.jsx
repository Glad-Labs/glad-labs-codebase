/**
 * WorkflowHistoryPage.jsx
 * 
 * Workflow Execution History page for Oversight Hub
 * Displays detailed history of all workflow executions, orchestration results, and task outputs
 * 
 * Features:
 * - Execution history with filtering and sorting
 * - Detailed execution information
 * - Task output viewing
 * - Retry and rerun capabilities
 * - Export/reporting
 */

import React, { useState, useEffect } from 'react';
import * as cofounderAgentClient from '../../services/cofounderAgentClient';
import './WorkflowHistoryPage.css';

const WorkflowHistoryPage = () => {
  const [executions, setExecutions] = useState([]);
  const [selectedExecution, setSelectedExecution] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'completed', 'failed', 'running'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'status', 'duration'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedExecutionId, setExpandedExecutionId] = useState(null);

  // Mock execution data for demonstration
  const mockExecutions = [
    {
      id: 'exec-001',
      workflowName: 'Content Generation Pipeline',
      status: 'completed',
      startTime: new Date(Date.now() - 3600000), // 1 hour ago
      endTime: new Date(Date.now() - 3500000),
      duration: 100,
      agentsInvolved: ['content', 'financial'],
      tasksCompleted: 8,
      tasksFailed: 0,
      output: 'Generated 5 blog posts, 3 social media posts',
      result: 'success',
    },
    {
      id: 'exec-002',
      workflowName: 'Market Analysis & Report',
      status: 'completed',
      startTime: new Date(Date.now() - 7200000), // 2 hours ago
      endTime: new Date(Date.now() - 6900000),
      duration: 300,
      agentsInvolved: ['market', 'financial', 'compliance'],
      tasksCompleted: 12,
      tasksFailed: 0,
      output: 'Generated comprehensive market analysis report with 15 charts',
      result: 'success',
    },
    {
      id: 'exec-003',
      workflowName: 'Compliance Review',
      status: 'failed',
      startTime: new Date(Date.now() - 10800000), // 3 hours ago
      endTime: new Date(Date.now() - 10700000),
      duration: 100,
      agentsInvolved: ['compliance'],
      tasksCompleted: 3,
      tasksFailed: 1,
      output: 'Failed to retrieve compliance documentation',
      result: 'error',
      errorMessage: 'Unable to access external compliance database',
    },
    {
      id: 'exec-004',
      workflowName: 'Multi-Agent Orchestration',
      status: 'running',
      startTime: new Date(Date.now() - 1800000), // 30 minutes ago
      endTime: null,
      duration: null,
      agentsInvolved: ['orchestrator', 'content', 'market', 'financial'],
      tasksCompleted: 5,
      tasksFailed: 0,
      output: 'In progress: Processing market data and generating insights',
      result: 'in_progress',
    },
    {
      id: 'exec-005',
      workflowName: 'Content Generation Pipeline',
      status: 'completed',
      startTime: new Date(Date.now() - 21600000), // 6 hours ago
      endTime: new Date(Date.now() - 21500000),
      duration: 100,
      agentsInvolved: ['content'],
      tasksCompleted: 10,
      tasksFailed: 0,
      output: 'Generated 8 blog posts and email templates',
      result: 'success',
    },
  ];

  // Initialize with mock data
  useEffect(() => {
    setExecutions(mockExecutions);
  }, []);

  // Filter and sort executions
  const getFilteredAndSortedExecutions = () => {
    let filtered = [...executions];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((exec) => exec.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((exec) =>
        exec.workflowName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exec.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'date':
          aValue = a.startTime.getTime();
          bValue = b.startTime.getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'duration':
          aValue = a.duration || 0;
          bValue = b.duration || 0;
          break;
        default:
          aValue = a.startTime.getTime();
          bValue = b.startTime.getTime();
      }

      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });

    return filtered;
  };

  const handleRetryExecution = async (executionId) => {
    if (!window.confirm('Retry this execution?')) return;

    setIsLoading(true);
    setError(null);
    try {
      try {
        await cofounderAgentClient.retryExecution?.(executionId);
        // Refresh execution list
        fetchWorkflowHistory();
      } catch (err) {
        console.warn('Retry execution API not available:', err);
        // Mock retry
        alert('Execution retry initiated (mock)');
      }
    } catch (err) {
      setError('Failed to retry execution: ' + err.message);
      console.error('Error retrying execution:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWorkflowHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      try {
        const history = await cofounderAgentClient.getWorkflowHistory?.();
        if (history) {
          setExecutions(Array.isArray(history) ? history : history.executions || []);
          return;
        }
      } catch (err) {
        console.warn('Workflow history API not available, using mock data:', err);
      }
      // Continue with mock data
    } catch (err) {
      setError('Failed to fetch workflow history: ' + err.message);
      console.error('Error fetching workflow history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'running':
        return '#FFC107';
      case 'failed':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'running':
        return '⏳';
      case 'failed':
        return '❌';
      default:
        return '⚪';
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const filteredExecutions = getFilteredAndSortedExecutions();

  return (
    <div className="workflow-history-page">
      <div className="workflow-header">
        <h2>📋 Workflow History</h2>
        <button onClick={fetchWorkflowHistory} className="refresh-btn" disabled={isLoading}>
          {isLoading ? '⏳ Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Controls */}
      <div className="workflow-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-sort-controls">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="running">Running</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="status">Sort by Status</option>
            <option value="duration">Sort by Duration</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
            title={`${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            {sortOrder === 'asc' ? '⬆️' : '⬇️'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* Execution List */}
      <div className="executions-container">
        {filteredExecutions.length > 0 ? (
          <div className="executions-list">
            {filteredExecutions.map((execution) => (
              <div key={execution.id} className="execution-card">
                <div
                  className="execution-header"
                  onClick={() =>
                    setExpandedExecutionId(
                      expandedExecutionId === execution.id ? null : execution.id
                    )
                  }
                >
                  <div className="execution-info">
                    <div className="execution-name">{execution.workflowName}</div>
                    <div className="execution-id">{execution.id}</div>
                  </div>

                  <div className="execution-status-badge" style={{ '--status-color': getStatusColor(execution.status) }}>
                    {getStatusIcon(execution.status)} {execution.status.toUpperCase()}
                  </div>

                  <div className="execution-meta">
                    <div className="execution-time">
                      {execution.startTime.toLocaleString()}
                    </div>
                    <div className="execution-duration">
                      {formatDuration(execution.duration)}
                    </div>
                  </div>

                  <button className="expand-btn">
                    {expandedExecutionId === execution.id ? '▼' : '▶'}
                  </button>
                </div>

                {/* Expanded Details */}
                {expandedExecutionId === execution.id && (
                  <div className="execution-details">
                    <div className="details-grid">
                      <div className="detail-item">
                        <div className="detail-label">Agents</div>
                        <div className="detail-value">
                          {execution.agentsInvolved.join(', ')}
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Tasks</div>
                        <div className="detail-value">
                          ✅ {execution.tasksCompleted}
                          {execution.tasksFailed > 0 && ` / ❌ ${execution.tasksFailed}`}
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-label">Started</div>
                        <div className="detail-value">
                          {execution.startTime.toLocaleString()}
                        </div>
                      </div>
                      {execution.endTime && (
                        <div className="detail-item">
                          <div className="detail-label">Completed</div>
                          <div className="detail-value">
                            {execution.endTime.toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="output-section">
                      <h4>📤 Output & Results</h4>
                      <div className="output-box">
                        <p>{execution.output}</p>
                      </div>
                    </div>

                    {execution.errorMessage && (
                      <div className="error-section">
                        <h4>⚠️ Error</h4>
                        <div className="error-box">
                          <p>{execution.errorMessage}</p>
                        </div>
                      </div>
                    )}

                    <div className="action-buttons">
                      {execution.status === 'failed' && (
                        <button
                          onClick={() => handleRetryExecution(execution.id)}
                          className="retry-btn"
                          disabled={isLoading}
                        >
                          🔄 Retry
                        </button>
                      )}
                      <button className="export-btn">📥 Export</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-executions">
            <p>📋 No executions found. Create a workflow to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowHistoryPage;
