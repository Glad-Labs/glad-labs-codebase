import React, { useState } from 'react';
import './CostMetricsDashboard.css';

function CostMetricsDashboard() {
  const [costMetrics] = useState([
    { label: 'Total Spend', value: '$12,450', change: '+12.5%', positive: false },
    { label: 'API Calls', value: '1.2M', change: '+8.2%', positive: false },
    { label: 'Cost per Call', value: '$0.0104', change: '-2.1%', positive: true },
    { label: 'Monthly Budget', value: '$15,000', change: '83% used', positive: false },
  ]);

  const [costBreakdown] = useState([
    { service: 'AI Models', cost: 5240, percentage: 42 },
    { service: 'Storage', cost: 2156, percentage: 17 },
    { service: 'Compute', cost: 3120, percentage: 25 },
    { service: 'Network', cost: 1240, percentage: 10 },
    { service: 'Other', cost: 694, percentage: 6 },
  ]);

  const [costTrend] = useState([
    { month: 'Jul', cost: 8500 },
    { month: 'Aug', cost: 9200 },
    { month: 'Sep', cost: 10800 },
    { month: 'Oct', cost: 12450 },
  ]);

  return (
    <div className="cost-metrics-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Cost Metrics Dashboard</h1>
        <p className="dashboard-subtitle">Monitor and optimize your resource spending</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        {costMetrics.map((metric, idx) => (
          <div key={idx} className="metric-card">
            <h3 className="metric-label">{metric.label}</h3>
            <p className="metric-value">{metric.value}</p>
            <p className={`metric-change ${metric.positive ? 'positive' : 'negative'}`}>
              {metric.positive ? '📉' : '📈'} {metric.change}
            </p>
          </div>
        ))}
      </div>

      {/* Budget Overview */}
      <div className="budget-section">
        <h2 className="section-title">💰 Monthly Budget Overview</h2>
        <div className="budget-card">
          <div className="budget-header">
            <span className="budget-label">Current Spend</span>
            <span className="budget-value">$12,450 / $15,000</span>
          </div>
          <div className="budget-bar">
            <div className="budget-fill" style={{ width: '83%' }}>
              <span className="budget-percent">83%</span>
            </div>
          </div>
          <div className="budget-info">
            <span className="budget-remaining">💵 $2,550 remaining</span>
            <span className="budget-days">📅 6 days left in cycle</span>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="breakdown-section">
        <h2 className="section-title">📊 Cost Breakdown by Service</h2>
        <div className="breakdown-grid">
          <div className="breakdown-chart">
            <div className="pie-chart">
              <svg viewBox="0 0 100 100" style={{ width: '200px', height: '200px' }}>
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="var(--accent-primary)"
                  strokeWidth="30"
                  strokeDasharray={`${42 * 2.83} 283`}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#2196f3"
                  strokeWidth="30"
                  strokeDasharray={`${25 * 2.83} 283`}
                  strokeDashoffset={`-${42 * 2.83}`}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
                />
                <text x="50" y="55" textAnchor="middle" fill="var(--text-primary)" fontSize="16">
                  100%
                </text>
              </svg>
            </div>
          </div>

          <div className="breakdown-list">
            {costBreakdown.map((item, idx) => (
              <div key={idx} className="breakdown-item">
                <div className="item-header">
                  <span className="item-name">{item.service}</span>
                  <span className="item-percentage">{item.percentage}%</span>
                </div>
                <div className="item-bar">
                  <div
                    className="item-fill"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: [
                        'var(--accent-primary)',
                        '#2196f3',
                        '#9c27b0',
                        '#ff9800',
                        '#4caf50',
                      ][idx],
                    }}
                  ></div>
                </div>
                <span className="item-cost">${item.cost.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Trend */}
      <div className="trend-section">
        <h2 className="section-title">📈 Cost Trend (Last 4 Months)</h2>
        <div className="trend-chart">
          <div className="trend-graph">
            {costTrend.map((data, idx) => (
              <div key={idx} className="trend-item">
                <div className="trend-bar" style={{ height: `${(data.cost / 13000) * 100}%` }}>
                  <span className="trend-tooltip">${data.cost.toLocaleString()}</span>
                </div>
                <span className="trend-label">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Recommendations */}
      <div className="recommendations-section">
        <h2 className="section-title">💡 Cost Optimization Recommendations</h2>
        <div className="recommendations-list">
          <div className="recommendation">
            <span className="rec-icon">✓</span>
            <div className="rec-content">
              <h3 className="rec-title">Increase Batch Size</h3>
              <p className="rec-desc">Processing requests in larger batches could reduce API call costs by 15%</p>
            </div>
            <button className="rec-action">Implement</button>
          </div>

          <div className="recommendation">
            <span className="rec-icon">⚡</span>
            <div className="rec-content">
              <h3 className="rec-title">Enable Caching</h3>
              <p className="rec-desc">Implement response caching to avoid redundant API calls and save 8-10% monthly</p>
            </div>
            <button className="rec-action">Setup</button>
          </div>

          <div className="recommendation">
            <span className="rec-icon">📊</span>
            <div className="rec-content">
              <h3 className="rec-title">Optimize Peak Hours</h3>
              <p className="rec-desc">Distribute workload evenly across hours to qualify for volume discounts</p>
            </div>
            <button className="rec-action">Configure</button>
          </div>

          <div className="recommendation">
            <span className="rec-icon">🎯</span>
            <div className="rec-content">
              <h3 className="rec-title">Model Selection</h3>
              <p className="rec-desc">Use smaller models for simpler tasks to reduce compute costs by 20%</p>
            </div>
            <button className="rec-action">Review</button>
          </div>
        </div>
      </div>

      {/* Usage Alerts */}
      <div className="alerts-section">
        <h2 className="section-title">⚠️ Budget Alerts</h2>
        <div className="alerts-list">
          <div className="alert alert-warning">
            <span className="alert-icon">⚠️</span>
            <div className="alert-content">
              <h4 className="alert-title">High API Usage</h4>
              <p className="alert-message">API calls increased 25% this week. Consider optimizing your queries.</p>
            </div>
          </div>

          <div className="alert alert-info">
            <span className="alert-icon">ℹ️</span>
            <div className="alert-content">
              <h4 className="alert-title">Budget at 83%</h4>
              <p className="alert-message">You are approaching your monthly budget limit. 6 days remaining.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CostMetricsDashboard;
