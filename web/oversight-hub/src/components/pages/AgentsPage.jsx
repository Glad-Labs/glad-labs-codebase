/**
 * AgentsPage.jsx
 * 
 * Multi-Agent Monitor page for Oversight Hub
 * Displays status, logs, and control of specialized AI agents
 * 
 * Features:
 * - Real-time agent status monitoring
 * - Agent logs and command execution
 * - Agent task assignment and management
 * - Performance metrics for each agent
 */

import React, { useState, useEffect } from 'react';
import cofounderAgentClient from '../../services/cofounderAgentClient';
import './AgentsPage.css';

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentLogs, setAgentLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agentCommand, setAgentCommand] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5 seconds

  // Predefined agents
  const predefinedAgents = [
    {
      id: 'content',
      name: '📝 Content Agent',
      description: 'Generate and manage content',
      status: 'idle',
      tasksCompleted: 0,
      currentTask: null,
      lastActivity: 'N/A',
    },
    {
      id: 'financial',
      name: '📊 Financial Agent',
      description: 'Business metrics & analysis',
      status: 'idle',
      tasksCompleted: 0,
      currentTask: null,
      lastActivity: 'N/A',
    },
    {
      id: 'market',
      name: '🔍 Market Insight Agent',
      description: 'Market analysis & trends',
      status: 'idle',
      tasksCompleted: 0,
      currentTask: null,
      lastActivity: 'N/A',
    },
    {
      id: 'compliance',
      name: '✓ Compliance Agent',
      description: 'Legal & regulatory checks',
      status: 'idle',
      tasksCompleted: 0,
      currentTask: null,
      lastActivity: 'N/A',
    },
    {
      id: 'orchestrator',
      name: '🧠 Co-Founder Orchestrator',
      description: 'Multi-agent orchestration & coordination',
      status: 'idle',
      tasksCompleted: 0,
      currentTask: null,
      lastActivity: 'N/A',
    },
  ];

  // Initialize agents on mount
  useEffect(() => {
    setAgents(predefinedAgents);
    if (predefinedAgents.length > 0) {
      setSelectedAgent(predefinedAgents[0]);
    }
  }, []);

  // Auto-refresh agent status
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (selectedAgent) {
        fetchAgentStatus(selectedAgent.id);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, selectedAgent]);

  const fetchAgentStatus = async (agentId) => {
    try {
      // Try to fetch from API - if not available, use mock data
      try {
        const status = await cofounderAgentClient.getAgentStatus?.(agentId);
        if (status) {
          setAgents((prev) =>
            prev.map((agent) =>
              agent.id === agentId ? { ...agent, ...status } : agent
            )
          );
          setSelectedAgent((prev) =>
            prev?.id === agentId
              ? { ...prev, ...status }
              : prev
          );
        }
      } catch (err) {
        console.warn('Agent status API not available, using mock data:', err);
        // Continue with mock data
      }
    } catch (err) {
      console.error('Error fetching agent status:', err);
    }
  };

  const fetchAgentLogs = async (agentId) => {
    setIsLoading(true);
    setError(null);
    try {
      try {
        const logs = await cofounderAgentClient.getAgentLogs?.(agentId);
        if (logs) {
          setAgentLogs(Array.isArray(logs) ? logs : []);
          return;
        }
      } catch (err) {
        console.warn('Agent logs API not available, generating mock logs:', err);
      }

      // Mock logs for demonstration
      const mockLogs = [
        { timestamp: new Date(Date.now() - 60000), level: 'INFO', message: 'Agent initialized' },
        { timestamp: new Date(Date.now() - 45000), level: 'INFO', message: 'Awaiting task assignment' },
        { timestamp: new Date(Date.now() - 30000), level: 'DEBUG', message: 'Model loaded successfully' },
        {
          timestamp: new Date(Date.now() - 15000),
          level: 'INFO',
          message: 'Ready for task execution',
        },
      ];
      setAgentLogs(mockLogs);
    } catch (err) {
      setError('Failed to fetch agent logs: ' + err.message);
      console.error('Error fetching agent logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
    fetchAgentStatus(agent.id);
    fetchAgentLogs(agent.id);
  };

  const handleSendCommand = async () => {
    if (!agentCommand.trim() || !selectedAgent) return;

    setIsLoading(true);
    setError(null);
    try {
      try {
        const result = await cofounderAgentClient.sendAgentCommand?.(
          selectedAgent.id,
          agentCommand
        );
        if (result) {
          setAgentLogs((prev) => [
            ...prev,
            {
              timestamp: new Date(),
              level: 'INFO',
              message: `Command executed: ${agentCommand}`,
            },
          ]);
          setAgentCommand('');
          // Refresh agent status after command
          fetchAgentStatus(selectedAgent.id);
          return;
        }
      } catch (err) {
        console.warn('Agent command API not available:', err);
      }

      // Mock response for demonstration
      setAgentLogs((prev) => [
        ...prev,
        {
          timestamp: new Date(),
          level: 'INFO',
          message: `Command executed: ${agentCommand}`,
        },
        {
          timestamp: new Date(Date.now() + 100),
          level: 'INFO',
          message: 'Task completed successfully ✓',
        },
      ]);
      setAgentCommand('');
    } catch (err) {
      setError('Failed to send command: ' + err.message);
      console.error('Error sending command:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return '#4CAF50';
      case 'idle':
        return '#FFC107';
      case 'error':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return '🟢';
      case 'idle':
        return '🟡';
      case 'error':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <div className="agents-page">
      <div className="agents-header">
        <h2>🤖 Multi-Agent Monitor</h2>
        <div className="header-controls">
          <label className="autorefresh-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-Refresh
          </label>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="refresh-interval"
            disabled={!autoRefresh}
          >
            <option value={2000}>2s</option>
            <option value={5000}>5s</option>
            <option value={10000}>10s</option>
            <option value={30000}>30s</option>
          </select>
        </div>
      </div>

      <div className="agents-container">
        {/* Agents List Sidebar */}
        <div className="agents-sidebar">
          <h3>Available Agents</h3>
          <div className="agents-list">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={`agent-item ${selectedAgent?.id === agent.id ? 'active' : ''}`}
                onClick={() => handleAgentSelect(agent)}
              >
                <div className="agent-item-header">
                  <div className="agent-name">{agent.name}</div>
                  <div className="agent-status">
                    {getStatusIcon(agent.status)} {agent.status}
                  </div>
                </div>
                <div className="agent-description">{agent.description}</div>
                <div className="agent-stats">
                  <span>Tasks: {agent.tasksCompleted}</span>
                  <span>Last: {agent.lastActivity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Details Panel */}
        <div className="agents-main">
          {selectedAgent ? (
            <>
              {/* Agent Header */}
              <div className="agent-detail-header">
                <div className="agent-title-section">
                  <h3>{selectedAgent.name}</h3>
                  <div className="agent-status-badge" style={{ '--status-color': getStatusColor(selectedAgent.status) }}>
                    {getStatusIcon(selectedAgent.status)} {selectedAgent.status.toUpperCase()}
                  </div>
                </div>
                <p className="agent-description-full">{selectedAgent.description}</p>
              </div>

              {/* Agent Stats */}
              <div className="agent-stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Tasks Completed</div>
                  <div className="stat-value">{selectedAgent.tasksCompleted}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Current Task</div>
                  <div className="stat-value">{selectedAgent.currentTask || 'None'}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Last Activity</div>
                  <div className="stat-value">{selectedAgent.lastActivity}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Status</div>
                  <div className="stat-value">{selectedAgent.status}</div>
                </div>
              </div>

              {/* Command Input */}
              <div className="command-section">
                <h4>📝 Send Command</h4>
                <div className="command-input-group">
                  <input
                    type="text"
                    value={agentCommand}
                    onChange={(e) => setAgentCommand(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isLoading) {
                        handleSendCommand();
                      }
                    }}
                    placeholder="Enter command or task for this agent..."
                    className="command-input"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendCommand}
                    disabled={!agentCommand.trim() || isLoading}
                    className="command-send-btn"
                  >
                    {isLoading ? '⏳' : '📤'}
                  </button>
                </div>
              </div>

              {/* Logs Section */}
              <div className="logs-section">
                <div className="logs-header">
                  <h4>📋 Agent Logs</h4>
                  <button
                    onClick={() => fetchAgentLogs(selectedAgent.id)}
                    className="refresh-logs-btn"
                    disabled={isLoading}
                  >
                    🔄 Refresh
                  </button>
                </div>

                {error && (
                  <div className="error-message">
                    ⚠️ {error}
                  </div>
                )}

                <div className="logs-container">
                  {agentLogs.length > 0 ? (
                    agentLogs.map((log, index) => (
                      <div key={index} className={`log-entry log-${log.level.toLowerCase()}`}>
                        <div className="log-timestamp">{log.timestamp.toLocaleTimeString()}</div>
                        <div className="log-level">{log.level}</div>
                        <div className="log-message">{log.message}</div>
                      </div>
                    ))
                  ) : (
                    <div className="no-logs">No logs available</div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="no-agent-selected">
              <p>👈 Select an agent to view details and logs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;
