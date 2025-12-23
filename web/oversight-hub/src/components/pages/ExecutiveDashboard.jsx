/**
 * ExecutiveDashboard.jsx
 *
 * Executive KPI Overview - Command Center Dashboard
 * Displays business metrics, trends, and quick actions
 *
 * Different from TaskManagement dashboard - focuses on business KPIs
 * rather than task queue
 *
 * Includes:
 * - KPI Cards (Revenue, Content, Tasks, Savings)
 * - Trend Charts (Publishing, Engagement)
 * - Quick Action Buttons
 * - System Status Summary
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExecutiveDashboard.css';
import CreateTaskModal from '../tasks/CreateTaskModal';

const ExecutiveDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30days');
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');

        const response = await fetch(
          `http://localhost:8000/api/analytics/kpis?range=${timeRange}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError(err.message);
        // Set mock data for development
        setDashboardData(getMockDashboardData());
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  const getMockDashboardData = () => ({
    kpis: {
      revenue: {
        current: 24500,
        previous: 21300,
        change: 15,
        currency: 'USD',
        icon: '📈',
      },
      contentPublished: {
        current: 156,
        previous: 107,
        change: 45,
        unit: 'posts',
        icon: '📝',
      },
      tasksCompleted: {
        current: 234,
        previous: 130,
        change: 80,
        unit: 'tasks',
        icon: '✅',
      },
      aiSavings: {
        current: 4200,
        previous: 2800,
        change: 50,
        currency: 'USD',
        icon: '💰',
      },
      engagementRate: {
        current: 4.8,
        previous: 3.2,
        change: 50,
        unit: '%',
        icon: '📊',
      },
      agentUptime: {
        current: 99.8,
        previous: 99.2,
        change: 0.6,
        unit: '%',
        icon: '✓',
      },
    },
    trends: {
      publishing: {
        title: 'Publishing Trend (30 days)',
        data: [
          1, 2, 3, 5, 4, 6, 7, 8, 9, 8, 10, 11, 12, 10, 9, 8, 7, 6, 8, 9, 10,
          11, 12, 11, 10, 9, 8, 10, 12, 14,
        ],
        avg: 5.2,
        peak: 14,
        low: 1,
        unit: 'posts/day',
      },
      engagement: {
        title: 'Engagement Metrics (30 days)',
        data: [
          2.1, 2.3, 2.5, 3.2, 3.5, 3.8, 4.0, 4.2, 4.5, 4.3, 4.6, 4.8, 5.0, 4.9,
          4.7, 4.5, 4.8, 5.1, 5.3, 5.2, 5.4, 5.6, 5.8, 5.7, 5.5, 5.4, 5.2, 5.0,
          5.1, 5.3,
        ],
        avg: 4.6,
        peak: 5.8,
        low: 2.1,
        unit: '%',
      },
    },
    systemStatus: {
      agentsActive: 2,
      agentsTotal: 5,
      tasksQueued: 12,
      tasksFailed: 1,
      uptime: 99.8,
      lastSync: '2 minutes ago',
    },
    quickStats: {
      thisMonth: {
        postsCreated: 156,
        tasksCompleted: 234,
        automationRate: 87,
        costSaved: 4200,
      },
      thisYear: {
        postsCreated: 2340,
        tasksCompleted: 5670,
        automationRate: 84,
        costSaved: 48500,
      },
    },
  });

  const getTrendChart = (data, max = null) => {
    const maxValue = max || Math.max(...data);
    const height = 60;
    const width = 100 / data.length;

    return data.map((value, index) => ({
      height: (value / maxValue) * height,
      value,
      x: width * index,
    }));
  };

  const formatCurrency = (value) => `$${(value / 1000).toFixed(1)}K`;
  const formatNumber = (value) => {
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value.toString();
  };

  if (loading) {
    return (
      <div className="executive-dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="executive-dashboard">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  const data = dashboardData || {};
  const kpis = data.kpis || {};
  const trends = data.trends || {};
  const systemStatus = data.systemStatus || {};
  const quickStats = data.quickStats || {};

  return (
    <div className="executive-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🎛️ Executive Dashboard</h1>
          <p>AI-Powered Business Management System - Real-time KPI Overview</p>
        </div>
        <div className="time-range-selector">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards - Main Metrics */}
      <div className="kpi-section">
        <h2>Key Performance Indicators</h2>
        <div className="kpi-grid">
          {/* Revenue */}
          {kpis.revenue && (
            <div className="kpi-card revenue-card">
              <div className="kpi-header">
                <div className="kpi-icon">{kpis.revenue.icon}</div>
                <div className="kpi-title">Revenue</div>
              </div>
              <div className="kpi-value">
                {formatCurrency(kpis.revenue.current)}
              </div>
              <div
                className={`kpi-change ${kpis.revenue.change >= 0 ? 'positive' : 'negative'}`}
              >
                {kpis.revenue.change >= 0 ? '↑' : '↓'}{' '}
                {Math.abs(kpis.revenue.change)}% MoM
              </div>
              <div className="kpi-previous">
                vs {formatCurrency(kpis.revenue.previous)} last month
              </div>
            </div>
          )}

          {/* Content Published */}
          {kpis.contentPublished && (
            <div className="kpi-card content-card">
              <div className="kpi-header">
                <div className="kpi-icon">{kpis.contentPublished.icon}</div>
                <div className="kpi-title">Content Published</div>
              </div>
              <div className="kpi-value">
                {formatNumber(kpis.contentPublished.current)}
              </div>
              <div
                className={`kpi-change ${kpis.contentPublished.change >= 0 ? 'positive' : 'negative'}`}
              >
                {kpis.contentPublished.change >= 0 ? '↑' : '↓'}{' '}
                {Math.abs(kpis.contentPublished.change)}% MoM
              </div>
              <div className="kpi-previous">
                {kpis.contentPublished.unit} published
              </div>
            </div>
          )}

          {/* Tasks Completed */}
          {kpis.tasksCompleted && (
            <div className="kpi-card tasks-card">
              <div className="kpi-header">
                <div className="kpi-icon">{kpis.tasksCompleted.icon}</div>
                <div className="kpi-title">Tasks Completed</div>
              </div>
              <div className="kpi-value">
                {formatNumber(kpis.tasksCompleted.current)}
              </div>
              <div
                className={`kpi-change ${kpis.tasksCompleted.change >= 0 ? 'positive' : 'negative'}`}
              >
                {kpis.tasksCompleted.change >= 0 ? '↑' : '↓'}{' '}
                {Math.abs(kpis.tasksCompleted.change)}% MoM
              </div>
              <div className="kpi-previous">
                {kpis.tasksCompleted.unit} automated
              </div>
            </div>
          )}

          {/* AI Savings */}
          {kpis.aiSavings && (
            <div className="kpi-card savings-card">
              <div className="kpi-header">
                <div className="kpi-icon">{kpis.aiSavings.icon}</div>
                <div className="kpi-title">AI Savings</div>
              </div>
              <div className="kpi-value">
                {formatCurrency(kpis.aiSavings.current)}
              </div>
              <div
                className={`kpi-change ${kpis.aiSavings.change >= 0 ? 'positive' : 'negative'}`}
              >
                {kpis.aiSavings.change >= 0 ? '↑' : '↓'}{' '}
                {Math.abs(kpis.aiSavings.change)}% MoM
              </div>
              <div className="kpi-previous">this month vs last</div>
            </div>
          )}
        </div>
      </div>

      {/* Trend Charts */}
      <div className="trends-section">
        <div className="trend-row">
          {/* Publishing Trend */}
          {trends.publishing && (
            <div className="trend-card">
              <h3>{trends.publishing.title}</h3>
              <div className="chart-container">
                <div className="mini-bar-chart">
                  {trends.publishing.data.map((value, idx) => {
                    const maxVal = Math.max(...trends.publishing.data);
                    const height = (value / maxVal) * 100;
                    return (
                      <div
                        key={idx}
                        className="bar"
                        style={{ height: `${height}%` }}
                        title={`Day ${idx + 1}: ${value} posts`}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="trend-stats">
                <div className="stat">
                  <span className="label">Average:</span>
                  <span className="value">{trends.publishing.avg}/day</span>
                </div>
                <div className="stat">
                  <span className="label">Peak:</span>
                  <span className="value">{trends.publishing.peak}</span>
                </div>
                <div className="stat">
                  <span className="label">Low:</span>
                  <span className="value">{trends.publishing.low}</span>
                </div>
              </div>
            </div>
          )}

          {/* Engagement Trend */}
          {trends.engagement && (
            <div className="trend-card">
              <h3>{trends.engagement.title}</h3>
              <div className="chart-container">
                <div className="mini-bar-chart">
                  {trends.engagement.data.map((value, idx) => {
                    const maxVal = Math.max(...trends.engagement.data);
                    const height = (value / maxVal) * 100;
                    return (
                      <div
                        key={idx}
                        className="bar engagement-bar"
                        style={{ height: `${height}%` }}
                        title={`Day ${idx + 1}: ${value.toFixed(1)}%`}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="trend-stats">
                <div className="stat">
                  <span className="label">Average:</span>
                  <span className="value">
                    {trends.engagement.avg.toFixed(1)}%
                  </span>
                </div>
                <div className="stat">
                  <span className="label">Peak:</span>
                  <span className="value">
                    {trends.engagement.peak.toFixed(1)}%
                  </span>
                </div>
                <div className="stat">
                  <span className="label">Low:</span>
                  <span className="value">
                    {trends.engagement.low.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* System Status & Quick Actions */}
      <div className="status-actions-section">
        <div className="system-status">
          <h3>🔧 System Status</h3>
          <div className="status-grid">
            <div className="status-item">
              <div className="status-icon">🤖</div>
              <div className="status-info">
                <div className="status-label">Agents Active</div>
                <div className="status-value">
                  {systemStatus.agentsActive} / {systemStatus.agentsTotal}
                </div>
              </div>
            </div>
            <div className="status-item">
              <div className="status-icon">📤</div>
              <div className="status-info">
                <div className="status-label">Tasks Queued</div>
                <div className="status-value">{systemStatus.tasksQueued}</div>
              </div>
            </div>
            <div className="status-item">
              <div className="status-icon">⚠️</div>
              <div className="status-info">
                <div className="status-label">Tasks Failed</div>
                <div className="status-value">{systemStatus.tasksFailed}</div>
              </div>
            </div>
            <div className="status-item">
              <div className="status-icon">✓</div>
              <div className="status-info">
                <div className="status-label">System Uptime</div>
                <div className="status-value">{systemStatus.uptime}%</div>
              </div>
            </div>
            <div className="status-item full-width">
              <div className="status-icon">🔄</div>
              <div className="status-info">
                <div className="status-label">Last Sync</div>
                <div className="status-value">{systemStatus.lastSync}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h3>⚡ Quick Actions</h3>
          <div className="actions-grid">
            <button
              className="action-button create-button"
              onClick={() => setTaskModalOpen(true)}
            >
              <span className="action-icon">➕</span>
              <span className="action-label">Create Task</span>
            </button>
            <button
              className="action-button review-button"
              onClick={() => navigate('/tasks')}
            >
              <span className="action-icon">👁️</span>
              <span className="action-label">Review Queue</span>
            </button>
            <button
              className="action-button publish-button"
              onClick={() => navigate('/content')}
            >
              <span className="action-icon">🚀</span>
              <span className="action-label">Publish Now</span>
            </button>
            <button
              className="action-button reports-button"
              onClick={() => navigate('/analytics')}
            >
              <span className="action-icon">📊</span>
              <span className="action-label">View Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      {quickStats.thisMonth && (
        <div className="quick-stats-section">
          <h2>Monthly & Yearly Overview</h2>
          <div className="stats-comparison">
            <div className="stats-card this-month">
              <h4>This Month</h4>
              <div className="stat-row">
                <span className="stat-name">Posts Created:</span>
                <span className="stat-number">
                  {formatNumber(quickStats.thisMonth.postsCreated)}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-name">Tasks Completed:</span>
                <span className="stat-number">
                  {formatNumber(quickStats.thisMonth.tasksCompleted)}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-name">Automation Rate:</span>
                <span className="stat-number">
                  {quickStats.thisMonth.automationRate}%
                </span>
              </div>
              <div className="stat-row cost-saved">
                <span className="stat-name">Cost Saved:</span>
                <span className="stat-number">
                  {formatCurrency(quickStats.thisMonth.costSaved)}
                </span>
              </div>
            </div>
            {quickStats.thisYear && (
              <div className="stats-card this-year">
                <h4>This Year</h4>
                <div className="stat-row">
                  <span className="stat-name">Posts Created:</span>
                  <span className="stat-number">
                    {formatNumber(quickStats.thisYear.postsCreated)}
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-name">Tasks Completed:</span>
                  <span className="stat-number">
                    {formatNumber(quickStats.thisYear.tasksCompleted)}
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-name">Automation Rate:</span>
                  <span className="stat-number">
                    {quickStats.thisYear.automationRate}%
                  </span>
                </div>
                <div className="stat-row cost-saved">
                  <span className="stat-name">Cost Saved:</span>
                  <span className="stat-number">
                    {formatCurrency(quickStats.thisYear.costSaved)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task Creation Modal */}
      <CreateTaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onTaskCreated={(task) => {
          setTaskModalOpen(false);
          // Optionally refresh dashboard data
          console.log('Task created:', task);
        }}
      />
    </div>
  );
};

export default ExecutiveDashboard;
