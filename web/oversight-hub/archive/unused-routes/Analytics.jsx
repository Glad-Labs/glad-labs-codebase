import React, { useState } from 'react';
import './Analytics.css';

function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');

  const metrics = [
    { label: 'Total Users', value: '12,458', change: '+8.2%', positive: true },
    {
      label: 'Conversion Rate',
      value: '3.24%',
      change: '+0.45%',
      positive: true,
    },
    {
      label: 'Avg Session Duration',
      value: '5m 32s',
      change: '-2.1s',
      positive: false,
    },
    { label: 'Bounce Rate', value: '24.8%', change: '-3.2%', positive: true },
  ];

  const chartData = [
    { name: 'Mon', users: 2400, engagement: 2210 },
    { name: 'Tue', users: 2210, engagement: 2290 },
    { name: 'Wed', users: 2290, engagement: 2000 },
    { name: 'Thu', users: 2000, engagement: 2181 },
    { name: 'Fri', users: 2181, engagement: 2500 },
    { name: 'Sat', users: 2500, engagement: 2100 },
    { name: 'Sun', users: 2100, engagement: 2800 },
  ];

  const topPages = [
    { path: '/dashboard', views: 4562, bounce: '18.2%', avgTime: '4m 32s' },
    { path: '/tasks', views: 3821, bounce: '22.5%', avgTime: '3m 14s' },
    { path: '/content', views: 2943, bounce: '28.1%', avgTime: '2m 48s' },
    { path: '/analytics', views: 2156, bounce: '31.2%', avgTime: '1m 52s' },
    { path: '/models', views: 1834, bounce: '25.6%', avgTime: '3m 21s' },
  ];

  const trafficSources = [
    { source: 'Direct', users: 4821, percentage: 38.7 },
    { source: 'Organic', users: 3920, percentage: 31.5 },
    { source: 'Referral', users: 2156, percentage: 17.3 },
    { source: 'Social', users: 1561, percentage: 12.5 },
  ];

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <div className="header-content">
          <h1 className="analytics-title">Analytics Dashboard</h1>
          <p className="analytics-subtitle">
            Monitor performance metrics and user insights
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="time-range-selector">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              className={`time-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        {metrics.map((metric, idx) => (
          <div key={idx} className="metric-card">
            <h3 className="metric-label">{metric.label}</h3>
            <p className="metric-value">{metric.value}</p>
            <p
              className={`metric-change ${metric.positive ? 'positive' : 'negative'}`}
            >
              {metric.positive ? '↑' : '↓'} {metric.change}
            </p>
          </div>
        ))}
      </div>

      {/* User Activity Chart */}
      <div className="chart-section">
        <h2 className="section-title">📊 User Activity (Last 7 Days)</h2>
        <div className="chart-container">
          <div className="simple-chart">
            <div className="chart-legend">
              <span className="legend-item users">
                <span className="legend-dot"></span> Users
              </span>
              <span className="legend-item engagement">
                <span className="legend-dot"></span> Engagement
              </span>
            </div>
            <div className="bar-chart">
              {chartData.map((data, idx) => (
                <div key={idx} className="chart-bar-group">
                  <div className="chart-bars">
                    <div
                      className="bar users-bar"
                      style={{ height: `${(data.users / 3000) * 100}%` }}
                      title={`${data.name}: ${data.users}`}
                    ></div>
                    <div
                      className="bar engagement-bar"
                      style={{ height: `${(data.engagement / 3000) * 100}%` }}
                      title={`${data.name}: ${data.engagement}`}
                    ></div>
                  </div>
                  <span className="bar-label">{data.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Pages Table */}
      <div className="table-section">
        <h2 className="section-title">🔥 Top Performing Pages</h2>
        <div className="table-wrapper">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Page Path</th>
                <th>Page Views</th>
                <th>Bounce Rate</th>
                <th>Avg. Time on Page</th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((page, idx) => (
                <tr key={idx}>
                  <td className="page-path">{page.path}</td>
                  <td className="page-views">
                    <span className="badge badge-info">
                      {page.views.toLocaleString()}
                    </span>
                  </td>
                  <td className="bounce-rate">{page.bounce}</td>
                  <td className="avg-time">{page.avgTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="traffic-section">
        <h2 className="section-title">🌐 Traffic Sources</h2>
        <div className="traffic-grid">
          {trafficSources.map((source, idx) => (
            <div key={idx} className="traffic-card">
              <div className="traffic-header">
                <h3 className="traffic-source">{source.source}</h3>
                <span className="traffic-percentage">{source.percentage}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${source.percentage}%` }}
                ></div>
              </div>
              <p className="traffic-users">
                {source.users.toLocaleString()} users
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-box">
          <div className="stat-number">89%</div>
          <p className="stat-text">Mobile Traffic</p>
        </div>
        <div className="stat-box">
          <div className="stat-number">4.2s</div>
          <p className="stat-text">Avg Load Time</p>
        </div>
        <div className="stat-box">
          <div className="stat-number">98.7%</div>
          <p className="stat-text">Uptime</p>
        </div>
        <div className="stat-box">
          <div className="stat-number">156</div>
          <p className="stat-text">Total Events</p>
        </div>
      </div>

      {/* Export Options */}
      <div className="export-section">
        <h3 className="export-title">Export Analytics</h3>
        <div className="export-buttons">
          <button className="export-btn">📊 Export as CSV</button>
          <button className="export-btn">📄 Generate PDF Report</button>
          <button className="export-btn">📧 Email Report</button>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
