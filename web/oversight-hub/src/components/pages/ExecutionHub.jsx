/**
 * ExecutionHub.jsx
 *
 * Unified real-time execution monitoring component
 * Combines: Active Agent Status + Command Queue + Workflow History
 *
 * Tabs:
 * 1. Active Execution - Real-time agent status, resource usage, current tasks
 * 2. Command Queue - Poindexter pending commands and multi-step workflows
 * 3. History - Completed tasks, performance metrics, execution timeline
 */

import React, { useState, useEffect } from 'react';
import './ExecutionHub.css';

const ExecutionHub = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [executionData, setExecutionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAgent, setExpandedAgent] = useState(null);
  const [expandedCommand, setExpandedCommand] = useState(null);

  // Fetch execution data from API
  useEffect(() => {
    const fetchExecutionData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');

        // Parallel fetch: active agents, command queue, history
        const [activeRes, queueRes, historyRes] = await Promise.all([
          fetch('http://localhost:8000/api/execution/active', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:8000/api/execution/queue', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:8000/api/execution/history', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!activeRes.ok || !queueRes.ok || !historyRes.ok) {
          throw new Error('Failed to fetch execution data');
        }

        const [activeData, queueData, historyData] = await Promise.all([
          activeRes.json(),
          queueRes.json(),
          historyRes.json(),
        ]);

        setExecutionData({
          active: activeData,
          queue: queueData,
          history: historyData,
        });
        setError(null);
      } catch (err) {
        console.error('Execution data fetch error:', err);
        setError(err.message);
        // Set mock data for development
        setExecutionData(getMockExecutionData());
      } finally {
        setLoading(false);
      }
    };

    fetchExecutionData();

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchExecutionData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getMockExecutionData = () => ({
    active: {
      agents: [
        {
          id: 'content-001',
          name: 'Content Agent',
          status: 'running',
          progress: 85,
          currentTask: 'Generating blog post: "AI Trends 2025"',
          tokensUsed: 2500,
          tokensLimit: 4000,
          startTime: new Date(Date.now() - 225000).toISOString(),
          estimatedEnd: new Date(Date.now() + 135000).toISOString(),
        },
        {
          id: 'financial-001',
          name: 'Financial Agent',
          status: 'running',
          progress: 50,
          currentTask: 'Analyzing Q4 2024 Financial Metrics',
          tokensUsed: 1200,
          tokensLimit: 3000,
          startTime: new Date(Date.now() - 320000).toISOString(),
          estimatedEnd: new Date(Date.now() + 340000).toISOString(),
        },
        {
          id: 'market-001',
          name: 'Market Insight Agent',
          status: 'idle',
          progress: 0,
          currentTask: 'Waiting for next task',
          tokensUsed: 0,
          tokensLimit: 3000,
          startTime: null,
          estimatedEnd: null,
        },
      ],
      systemMetrics: {
        tasksRunning: 2,
        tasksQueued: 12,
        avgResponseTime: '4m 12s',
        successRate: 94.2,
        tokensUsedToday: 45000,
        tokensDailyLimit: 100000,
        estimatedCostPerDay: 1.25,
      },
    },
    queue: {
      commands: [
        {
          id: 'cmd-abc-001',
          status: 'processing',
          progress: 40,
          command: 'Create 5 blog posts about AI',
          submittedBy: 'poindexter',
          submittedAt: new Date(Date.now() - 900000).toISOString(),
          breakdown: [
            { step: 1, task: 'Generate blog outlines', status: 'completed' },
            { step: 2, task: 'Write full articles', status: 'running' },
            { step: 3, task: 'Generate featured images', status: 'pending' },
            { step: 4, task: 'Create social teasers', status: 'pending' },
            { step: 5, task: 'Schedule publication', status: 'pending' },
          ],
        },
        {
          id: 'cmd-xyz-002',
          status: 'queued',
          progress: 0,
          command: 'Analyze competitor social strategy',
          submittedBy: 'poindexter',
          submittedAt: new Date(Date.now() - 120000).toISOString(),
          breakdown: [
            { step: 1, task: 'Fetch competitor data', status: 'pending' },
            { step: 2, task: 'Analyze engagement metrics', status: 'pending' },
            { step: 3, task: 'Generate report', status: 'pending' },
          ],
        },
      ],
    },
    history: {
      recent: [
        {
          id: 'hist-001',
          name: 'Blog Post: Top 10 AI Tools',
          type: 'content_generation',
          status: 'success',
          completedAt: new Date(Date.now() - 86400000).toISOString(),
          duration: '8m 45s',
        },
        {
          id: 'hist-002',
          name: 'Social Thread: Twitter AI Tips',
          type: 'social_content',
          status: 'success',
          completedAt: new Date(Date.now() - 51000000).toISOString(),
          duration: '3m 22s',
        },
        {
          id: 'hist-003',
          name: 'Financial Report: Q3 Analysis',
          type: 'financial_analysis',
          status: 'success',
          completedAt: new Date(Date.now() - 28800000).toISOString(),
          duration: '12m 15s',
        },
        {
          id: 'hist-004',
          name: 'Email Campaign: Monthly Newsletter',
          type: 'email_campaign',
          status: 'success',
          completedAt: new Date(Date.now() - 14400000).toISOString(),
          duration: '5m 8s',
        },
        {
          id: 'hist-005',
          name: 'Video Script: Marketing',
          type: 'video_script',
          status: 'failed',
          completedAt: new Date(Date.now() - 7200000).toISOString(),
          duration: '6m 30s',
          error: 'Insufficient context for video generation',
        },
      ],
      stats: {
        totalCompleted: 156,
        successRate: 94.2,
        avgDuration: '7m 30s',
        totalTokensUsed: 45000,
      },
    },
  });

  const formatDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    const diff = new Date(end) - new Date(start);
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#4caf50';
    if (progress >= 50) return '#2196f3';
    if (progress >= 25) return '#ff9800';
    return '#f44336';
  };

  const getStatusBadge = (status) => {
    const badges = {
      running: { bg: '#e3f2fd', color: '#1976d2', text: 'Running' },
      idle: { bg: '#f5f5f5', color: '#666', text: 'Idle' },
      completed: { bg: '#e8f5e9', color: '#388e3c', text: 'Completed' },
      queued: { bg: '#f3e5f5', color: '#7b1fa2', text: 'Queued' },
      processing: { bg: '#fff3e0', color: '#e65100', text: 'Processing' },
      success: { bg: '#e8f5e9', color: '#388e3c', text: '✓ Success' },
      failed: { bg: '#ffebee', color: '#c62828', text: '✗ Failed' },
      pending: { bg: '#f5f5f5', color: '#666', text: 'Pending' },
    };
    return badges[status] || badges.idle;
  };

  if (loading) {
    return (
      <div className="execution-hub">
        <div className="loading">Loading execution data...</div>
      </div>
    );
  }

  if (error && !executionData) {
    return (
      <div className="execution-hub">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  const active = executionData?.active || {};
  const queue = executionData?.queue || {};
  const history = executionData?.history || {};

  return (
    <div className="execution-hub">
      <div className="execution-header">
        <h1>⚙️ Execution Hub</h1>
        <p>Real-time multi-agent orchestration and workflow monitoring</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          🤖 Active Execution {active.agents && `(${active.agents.filter(a => a.status === 'running').length})`}
        </button>
        <button
          className={`tab ${activeTab === 'queue' ? 'active' : ''}`}
          onClick={() => setActiveTab('queue')}
        >
          📤 Command Queue {queue.commands && `(${queue.commands.length})`}
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📊 History
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* TAB 1: ACTIVE EXECUTION */}
        {activeTab === 'active' && (
          <div className="tab-pane">
            {/* Agent Status Cards */}
            <div className="section">
              <h2>🤖 Agent Status</h2>
              <div className="agents-grid">
                {active.agents &&
                  active.agents.map((agent) => {
                    const badge = getStatusBadge(agent.status);
                    return (
                      <div
                        key={agent.id}
                        className="agent-card"
                        onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
                      >
                        <div className="agent-header">
                          <div className="agent-name">{agent.name}</div>
                          <div
                            className="agent-status"
                            style={{
                              backgroundColor: badge.bg,
                              color: badge.color,
                            }}
                          >
                            {badge.text}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {agent.progress > 0 && (
                          <div className="progress-container">
                            <div className="progress-bar">
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${agent.progress}%`,
                                  backgroundColor: getProgressColor(agent.progress),
                                }}
                              />
                            </div>
                            <div className="progress-text">{agent.progress}%</div>
                          </div>
                        )}

                        {/* Current Task */}
                        <div className="agent-task">{agent.currentTask}</div>

                        {/* Token Usage */}
                        <div className="token-usage">
                          <div className="token-bar">
                            <div
                              className="token-fill"
                              style={{
                                width: `${(agent.tokensUsed / agent.tokensLimit) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="token-text">
                            {agent.tokensUsed} / {agent.tokensLimit} tokens
                          </div>
                        </div>

                        {/* Time Info */}
                        {agent.status === 'running' && (
                          <div className="time-info">
                            <div>Elapsed: {formatDuration(agent.startTime, new Date())}</div>
                            <div>Est. Remaining: {formatDuration(new Date(), agent.estimatedEnd)}</div>
                          </div>
                        )}

                        {/* Expandable Details */}
                        {expandedAgent === agent.id && (
                          <div className="agent-details">
                            <hr />
                            <div className="detail-item">
                              <span>Agent ID:</span> {agent.id}
                            </div>
                            <div className="detail-item">
                              <span>Start Time:</span> {new Date(agent.startTime).toLocaleTimeString()}
                            </div>
                            {agent.estimatedEnd && (
                              <div className="detail-item">
                                <span>Est. End:</span> {new Date(agent.estimatedEnd).toLocaleTimeString()}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* System Metrics */}
            {active.systemMetrics && (
              <div className="section">
                <h2>📊 System Metrics</h2>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-label">Tasks Running</div>
                    <div className="metric-value">{active.systemMetrics.tasksRunning}</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Tasks Queued</div>
                    <div className="metric-value">{active.systemMetrics.tasksQueued}</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Avg Response Time</div>
                    <div className="metric-value">{active.systemMetrics.avgResponseTime}</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Success Rate</div>
                    <div className="metric-value">{active.systemMetrics.successRate}%</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Tokens Used Today</div>
                    <div className="metric-value">
                      {active.systemMetrics.tokensUsedToday} /{' '}
                      {active.systemMetrics.tokensDailyLimit}
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Est. Cost/Day</div>
                    <div className="metric-value">${active.systemMetrics.estimatedCostPerDay}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMMAND QUEUE */}
        {activeTab === 'queue' && (
          <div className="tab-pane">
            <div className="section">
              <h2>📤 Poindexter Command Queue</h2>
              <div className="commands-list">
                {queue.commands &&
                  queue.commands.map((cmd) => {
                    const badge = getStatusBadge(cmd.status);
                    return (
                      <div
                        key={cmd.id}
                        className="command-item"
                        onClick={() => setExpandedCommand(expandedCommand === cmd.id ? null : cmd.id)}
                      >
                        <div className="command-header">
                          <div className="command-info">
                            <div className="command-title">{cmd.command}</div>
                            <div className="command-meta">
                              Submitted: {new Date(cmd.submittedAt).toLocaleString()}
                            </div>
                          </div>
                          <div
                            className="command-status"
                            style={{
                              backgroundColor: badge.bg,
                              color: badge.color,
                            }}
                          >
                            {badge.text}
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${cmd.progress}%`,
                                backgroundColor: getProgressColor(cmd.progress),
                              }}
                            />
                          </div>
                          <div className="progress-text">{cmd.progress}%</div>
                        </div>

                        {/* Breakdown Steps */}
                        {expandedCommand === cmd.id && cmd.breakdown && (
                          <div className="command-breakdown">
                            <h4>Execution Breakdown:</h4>
                            {cmd.breakdown.map((step) => {
                              const stepBadge = getStatusBadge(step.status);
                              return (
                                <div key={step.step} className="breakdown-step">
                                  <div className="step-number">Step {step.step}</div>
                                  <div className="step-task">{step.task}</div>
                                  <div
                                    className="step-status"
                                    style={{
                                      backgroundColor: stepBadge.bg,
                                      color: stepBadge.color,
                                    }}
                                  >
                                    {stepBadge.text}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HISTORY */}
        {activeTab === 'history' && (
          <div className="tab-pane">
            {/* Statistics */}
            {history.stats && (
              <div className="section">
                <h2>📈 Performance Statistics</h2>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-label">Total Completed</div>
                    <div className="metric-value">{history.stats.totalCompleted}</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Success Rate</div>
                    <div className="metric-value">{history.stats.successRate}%</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Avg Duration</div>
                    <div className="metric-value">{history.stats.avgDuration}</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Tokens Used</div>
                    <div className="metric-value">{history.stats.totalTokensUsed.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Executions */}
            <div className="section">
              <h2>🕐 Recent Executions</h2>
              <div className="history-list">
                {history.recent &&
                  history.recent.map((item) => {
                    const badge = getStatusBadge(item.status);
                    return (
                      <div key={item.id} className="history-item">
                        <div className="history-status" style={{ backgroundColor: badge.bg }}>
                          {badge.text}
                        </div>
                        <div className="history-info">
                          <div className="history-name">{item.name}</div>
                          <div className="history-meta">
                            {item.type} • {item.duration} • {new Date(item.completedAt).toLocaleString()}
                          </div>
                          {item.error && (
                            <div className="history-error">Error: {item.error}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionHub;
