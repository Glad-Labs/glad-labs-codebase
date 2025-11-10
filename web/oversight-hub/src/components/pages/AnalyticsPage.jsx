import React, { useState, useEffect } from 'react';

/**
 * Analytics Dashboard Page
 * Display traffic metrics, engagement analytics, user insights, and performance trends
 */
const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [analytics, setAnalytics] = useState({
    pageViews: 12450,
    uniqueVisitors: 5320,
    bounceRate: 42.5,
    avgSessionDuration: 3.45,
    conversionRate: 2.8,
  });
  const [topPages, setTopPages] = useState([
    { title: 'Home', views: 4200, visitors: 2100 },
    { title: 'Blog', views: 3800, visitors: 1950 },
    { title: 'Products', views: 2450, visitors: 1270 },
    { title: 'About', views: 1200, visitors: 850 },
  ]);
  const [trafficSources, setTrafficSources] = useState([
    { name: 'Organic', percentage: 45, visitors: 2394 },
    { name: 'Direct', percentage: 28, visitors: 1490 },
    { name: 'Social', percentage: 18, visitors: 957 },
    { name: 'Referral', percentage: 9, visitors: 479 },
  ]);

  useEffect(() => {
    // Simulate different data based on time range
    let multiplier = 1;
    if (timeRange === '30days') multiplier = 4;
    if (timeRange === '90days') multiplier = 12;
    if (timeRange === 'all') multiplier = 24;

    setAnalytics({
      pageViews: Math.round(12450 * multiplier),
      uniqueVisitors: Math.round(5320 * multiplier),
      bounceRate: 42.5 + Math.random() * 5,
      avgSessionDuration: 3.45 + Math.random() * 1.5,
      conversionRate: 2.8 + Math.random() * 1.2,
    });
  }, [timeRange]);

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>📈 Analytics Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Track website traffic, engagement, and user behavior
          </p>
        </div>

        <div>
          <label
            style={{
              fontSize: '0.9rem',
              marginRight: '0.75rem',
              color: 'var(--text-secondary)',
            }}
          >
            Time Range:
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid var(--border-secondary)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {[
          {
            label: 'Page Views',
            value: analytics.pageViews.toLocaleString(),
            icon: '👁️',
            change: '+12.5%',
            positive: true,
          },
          {
            label: 'Unique Visitors',
            value: analytics.uniqueVisitors.toLocaleString(),
            icon: '👥',
            change: '+8.2%',
            positive: true,
          },
          {
            label: 'Bounce Rate',
            value: `${analytics.bounceRate.toFixed(1)}%`,
            icon: '📉',
            change: '-2.1%',
            positive: true,
          },
          {
            label: 'Avg. Session Time',
            value: `${analytics.avgSessionDuration.toFixed(2)}m`,
            icon: '⏱️',
            change: '+0.5m',
            positive: true,
          },
          {
            label: 'Conversion Rate',
            value: `${analytics.conversionRate.toFixed(2)}%`,
            icon: '🎯',
            change: '+0.6%',
            positive: true,
          },
        ].map((metric, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-secondary)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ fontSize: '1.5rem' }}>{metric.icon}</div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: metric.positive ? '#00d926' : '#ff6464',
                  fontWeight: 'bold',
                }}
              >
                {metric.change}
              </div>
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
              }}
            >
              {metric.label}
            </div>
            <div
              style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: 'var(--accent-primary)',
              }}
            >
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem',
          marginBottom: '2rem',
        }}
      >
        {/* Top Pages */}
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--border-secondary)',
          }}
        >
          <h3 style={{ marginBottom: '1rem' }}>Top Pages</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {topPages.map((page, idx) => (
              <div key={idx}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.95rem',
                      color: 'var(--text-primary)',
                      fontWeight: '500',
                    }}
                  >
                    {page.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {page.views.toLocaleString()} views
                  </div>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: 'var(--accent-primary)',
                      width: `${(page.views / 4200) * 100}%`,
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--border-secondary)',
          }}
        >
          <h3 style={{ marginBottom: '1rem' }}>Traffic Sources</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {trafficSources.map((source, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: '0.375rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: [
                        'var(--accent-primary)',
                        'var(--accent-success)',
                        'var(--accent-warning)',
                        'var(--accent-danger)',
                      ][idx],
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {source.name}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    color: 'var(--accent-primary)',
                  }}
                >
                  {source.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          border: '1px solid var(--border-secondary)',
        }}
      >
        <h3 style={{ marginBottom: '1rem' }}>Engagement Metrics</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            { metric: 'Social Shares', value: 234, trend: '+18%' },
            { metric: 'Comments', value: 456, trend: '+32%' },
            { metric: 'Shares', value: 789, trend: '+15%' },
            { metric: 'Downloads', value: 123, trend: '+8%' },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-primary)',
                padding: '1rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--border-secondary)',
              }}
            >
              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem',
                }}
              >
                {item.metric}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'var(--accent-primary)',
                  }}
                >
                  {item.value}
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: '#00d926',
                    fontWeight: 'bold',
                  }}
                >
                  {item.trend}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          gap: '1rem',
        }}
      >
        <button
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--accent-primary)',
            backgroundColor: 'transparent',
            color: 'var(--accent-primary)',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '0.95rem',
          }}
        >
          📊 Export as CSV
        </button>
        <button
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--accent-primary)',
            backgroundColor: 'transparent',
            color: 'var(--accent-primary)',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '0.95rem',
          }}
        >
          📈 Generate Report
        </button>
      </div>
    </div>
  );
};

export default AnalyticsPage;
