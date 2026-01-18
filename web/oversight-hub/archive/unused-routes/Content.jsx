import React, { useState } from 'react';
import './Content.css';

function Content() {
  const [contentItems] = useState([
    {
      id: 1,
      title: 'Q4 Product Roadmap',
      type: 'Document',
      status: 'Published',
      lastUpdated: '2025-10-20',
      author: 'Sarah Chen',
    },
    {
      id: 2,
      title: 'Market Analysis Report',
      type: 'Report',
      status: 'Draft',
      lastUpdated: '2025-10-19',
      author: 'Marcus Johnson',
    },
    {
      id: 3,
      title: 'Customer Success Case Study',
      type: 'Case Study',
      status: 'In Review',
      lastUpdated: '2025-10-18',
      author: 'Emily Rodriguez',
    },
  ]);

  const [selectedTab, setSelectedTab] = useState('all');

  const filteredContent = contentItems.filter((item) => {
    if (selectedTab === 'all') return true;
    return item.status.toLowerCase() === selectedTab;
  });

  return (
    <div className="content-container">
      {/* Header */}
      <div className="dashboard-header" style={{ marginTop: '40px' }}>
        <h1 className="dashboard-title">Content Library</h1>
        <p className="dashboard-subtitle">
          Manage and organize all your published content
        </p>
      </div>

      {/* Action Buttons */}
      <div className="content-actions">
        <button className="btn btn-primary">➕ Create New Content</button>
        <button className="btn btn-secondary">📤 Upload Files</button>
        <button className="btn btn-secondary">⚙️ Content Settings</button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3 className="stat-value">24</h3>
            <p className="stat-label">Total Content</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3 className="stat-value">18</h3>
            <p className="stat-label">Published</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3 className="stat-value">5</h3>
            <p className="stat-label">In Draft</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <h3 className="stat-value">1,248</h3>
            <p className="stat-label">Total Views</p>
          </div>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="content-filters">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${selectedTab === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedTab('all')}
          >
            All Items
          </button>
          <button
            className={`filter-tab ${selectedTab === 'published' ? 'active' : ''}`}
            onClick={() => setSelectedTab('published')}
          >
            Published
          </button>
          <button
            className={`filter-tab ${selectedTab === 'draft' ? 'active' : ''}`}
            onClick={() => setSelectedTab('draft')}
          >
            Drafts
          </button>
          <button
            className={`filter-tab ${selectedTab === 'in review' ? 'active' : ''}`}
            onClick={() => setSelectedTab('in review')}
          >
            In Review
          </button>
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search content..."
            className="search-input"
          />
        </div>
      </div>

      {/* Content Table */}
      <div className="content-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContent.length > 0 ? (
              filteredContent.map((item) => (
                <tr key={item.id}>
                  <td className="content-title">
                    <span className="content-icon">📄</span>
                    {item.title}
                  </td>
                  <td className="content-type">{item.type}</td>
                  <td>
                    <span
                      className={`status-badge status-${item.status
                        .toLowerCase()
                        .replace(' ', '-')}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="content-date">{item.lastUpdated}</td>
                  <td className="content-author">{item.author}</td>
                  <td className="content-actions">
                    <button className="action-btn" title="Edit">
                      ✏️
                    </button>
                    <button className="action-btn" title="View">
                      👁️
                    </button>
                    <button className="action-btn" title="More">
                      ⋯
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">
                  No content found. Create your first content to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Publishing Schedule */}
      <div className="publishing-schedule">
        <h2 className="section-title">📅 Publishing Schedule</h2>
        <div className="schedule-grid">
          <div className="schedule-item">
            <div className="schedule-date">Oct 25</div>
            <p className="schedule-content">Feature Release Announcement</p>
          </div>
          <div className="schedule-item">
            <div className="schedule-date">Oct 28</div>
            <p className="schedule-content">Monthly Newsletter</p>
          </div>
          <div className="schedule-item">
            <div className="schedule-date">Nov 1</div>
            <p className="schedule-content">Q4 Metrics Report</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="content-categories">
        <h2 className="section-title">📚 Content Categories</h2>
        <div className="category-grid">
          {[
            'Blog Posts',
            'Documentation',
            'Case Studies',
            'Whitepapers',
            'Videos',
            'Webinars',
          ].map((category, idx) => (
            <div key={idx} className="category-card">
              <span className="category-emoji">📁</span>
              <h3 className="category-name">{category}</h3>
              <p className="category-count">12 items</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Content;
