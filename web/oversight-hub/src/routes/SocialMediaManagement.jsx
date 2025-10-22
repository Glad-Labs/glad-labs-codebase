import React, { useState } from 'react';
import './SocialMediaManagement.css';

function SocialMediaManagement() {
  const [campaigns] = useState([
    {
      id: 1,
      name: 'Q4 Launch Campaign',
      platform: 'Twitter',
      status: 'Active',
      reach: 125400,
      engagement: 8234,
      engagementRate: 6.6,
    },
    {
      id: 2,
      name: 'Product Demo Series',
      platform: 'LinkedIn',
      status: 'Active',
      reach: 89230,
      engagement: 5621,
      engagementRate: 6.3,
    },
    {
      id: 3,
      name: 'User Testimonials',
      platform: 'Instagram',
      status: 'Scheduled',
      reach: 0,
      engagement: 0,
      engagementRate: 0,
    },
    {
      id: 4,
      name: 'Behind the Scenes',
      platform: 'TikTok',
      status: 'Draft',
      reach: 0,
      engagement: 0,
      engagementRate: 0,
    },
  ]);

  const [socialMetrics] = useState([
    {
      platform: 'Twitter',
      followers: 45200,
      newFollowers: 1234,
      engagement: 8.2,
    },
    {
      platform: 'LinkedIn',
      followers: 78900,
      newFollowers: 456,
      engagement: 4.5,
    },
    {
      platform: 'Instagram',
      followers: 34500,
      newFollowers: 890,
      engagement: 12.1,
    },
    {
      platform: 'TikTok',
      followers: 23400,
      newFollowers: 2345,
      engagement: 15.8,
    },
  ]);

  return (
    <div className="social-management-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Social Media Management</h1>
        <p className="dashboard-subtitle">
          Manage campaigns and monitor social presence
        </p>
      </div>

      {/* Platform Overview */}
      <div className="platform-overview">
        <div className="overview-grid">
          {socialMetrics.map((platform, idx) => (
            <div key={idx} className="platform-card">
              <div className="platform-header">
                <h3 className="platform-name">{platform.platform}</h3>
                <span className="platform-icon">
                  {platform.platform === 'Twitter' && '𝕏'}
                  {platform.platform === 'LinkedIn' && 'in'}
                  {platform.platform === 'Instagram' && '📸'}
                  {platform.platform === 'TikTok' && '🎵'}
                </span>
              </div>

              <div className="metric-item">
                <span className="metric-name">Followers</span>
                <span className="metric-val">
                  {platform.followers.toLocaleString()}
                </span>
              </div>

              <div className="metric-item">
                <span className="metric-name">New This Month</span>
                <span className="metric-val positive">
                  +{platform.newFollowers}
                </span>
              </div>

              <div className="metric-item">
                <span className="metric-name">Engagement Rate</span>
                <span className="metric-val">{platform.engagement}%</span>
              </div>

              <button className="btn-manage">Manage</button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="campaigns-section">
        <h2 className="section-title">📢 Active Campaigns</h2>
        <div className="campaigns-grid">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="campaign-card">
              <div className="campaign-header">
                <h3 className="campaign-name">{campaign.name}</h3>
                <span
                  className={`campaign-status status-${campaign.status.toLowerCase()}`}
                >
                  {campaign.status}
                </span>
              </div>

              <div className="campaign-platform">
                <span className="platform-badge">{campaign.platform}</span>
              </div>

              {campaign.status === 'Active' && (
                <>
                  <div className="campaign-metric">
                    <span className="campaign-label">Reach</span>
                    <span className="campaign-value">
                      {(campaign.reach / 1000).toFixed(1)}K
                    </span>
                  </div>

                  <div className="campaign-metric">
                    <span className="campaign-label">Engagement</span>
                    <span className="campaign-value">
                      {campaign.engagement.toLocaleString()}
                    </span>
                  </div>

                  <div className="engagement-rate">
                    <span className="rate-label">
                      Rate: {campaign.engagementRate}%
                    </span>
                    <div className="rate-bar">
                      <div
                        className="rate-fill"
                        style={{ width: `${campaign.engagementRate * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              )}

              <div className="campaign-actions">
                <button className="btn-action">View</button>
                <button className="btn-action">Edit</button>
                <button className="btn-action">Analyze</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Chart */}
      <div className="performance-chart">
        <h2 className="section-title">📊 Weekly Performance</h2>
        <div className="chart-area">
          <div className="chart-legend">
            <span className="legend-item">
              <span
                className="legend-dot"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              ></span>
              Reach
            </span>
            <span className="legend-item">
              <span
                className="legend-dot"
                style={{ backgroundColor: '#9c27b0' }}
              ></span>
              Engagement
            </span>
          </div>
          <div className="simple-bar-chart">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
              (day, idx) => (
                <div key={idx} className="chart-bar-group">
                  <div className="bars-container">
                    <div
                      className="bar reach-bar"
                      style={{ height: `${30 + Math.random() * 50}%` }}
                    ></div>
                    <div
                      className="bar engagement-bar"
                      style={{ height: `${20 + Math.random() * 40}%` }}
                    ></div>
                  </div>
                  <span className="bar-label">{day}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Content Calendar */}
      <div className="content-calendar">
        <h2 className="section-title">📅 Content Calendar</h2>
        <div className="calendar-grid">
          {Array.from({ length: 28 }).map((_, idx) => (
            <div
              key={idx}
              className={`calendar-day ${idx % 3 === 0 ? 'has-content' : ''}`}
            >
              <div className="day-num">{idx + 1}</div>
              {idx % 3 === 0 && <span className="content-indicator">•</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="section-title">⚡ Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card">
            <span className="action-icon">📝</span>
            <span className="action-text">Create Post</span>
          </button>
          <button className="action-card">
            <span className="action-icon">📊</span>
            <span className="action-text">View Analytics</span>
          </button>
          <button className="action-card">
            <span className="action-icon">⏰</span>
            <span className="action-text">Schedule Content</span>
          </button>
          <button className="action-card">
            <span className="action-icon">💬</span>
            <span className="action-text">Monitor Mentions</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SocialMediaManagement;
