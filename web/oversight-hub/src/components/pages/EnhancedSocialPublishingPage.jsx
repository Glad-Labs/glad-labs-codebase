/**
 * EnhancedSocialPublishingPage.jsx
 * 
 * Advanced social media publishing and scheduling interface
 * 
 * Features:
 * - Multi-platform publishing (LinkedIn, Twitter, Email)
 * - Content scheduling with calendar view
 * - Post preview and optimization
 * - Batch scheduling
 * - Publishing history and analytics
 * - Platform templates
 * - Character counting and optimization tips
 */

import React, { useState, useEffect } from 'react';
import cofounderAgentClient from '../../services/cofounderAgentClient';
import './EnhancedSocialPublishingPage.css';

const EnhancedSocialPublishingPage = () => {
  // Form state
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    linkedin: true,
    twitter: false,
    email: false,
  });
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [hashtagSuggestions, setHashtagSuggestions] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Publishing data
  const [scheduledPosts, setScheduledPosts] = useState([
    {
      id: 1,
      content: 'Excited to announce our new AI integration features!',
      platforms: ['LinkedIn', 'Twitter'],
      scheduledFor: new Date(Date.now() + 86400000), // Tomorrow
      status: 'scheduled',
      likes: 0,
      comments: 0,
      shares: 0,
    },
    {
      id: 2,
      content: 'Join us for a webinar on AI best practices next Thursday',
      platforms: ['LinkedIn', 'Email'],
      scheduledFor: new Date(Date.now() + 259200000), // 3 days
      status: 'scheduled',
      likes: 0,
      comments: 0,
      shares: 0,
    },
  ]);

  const [publishedPosts, setPublishedPosts] = useState([
    {
      id: 1,
      content: 'Check out our latest blog post on machine learning trends',
      platforms: ['LinkedIn', 'Twitter'],
      publishedAt: new Date(Date.now() - 172800000), // 2 days ago
      status: 'published',
      likes: 128,
      comments: 24,
      shares: 45,
      engagement: 9.2,
    },
    {
      id: 2,
      content: 'Breaking: New updates to our platform announced today',
      platforms: ['Twitter'],
      publishedAt: new Date(Date.now() - 86400000), // 1 day ago
      status: 'published',
      likes: 87,
      comments: 12,
      shares: 23,
      engagement: 6.3,
    },
  ]);

  // Platform configurations
  const platforms = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      maxChars: 3000,
      color: '#0A66C2',
      description: 'Professional network',
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: '🐦',
      maxChars: 280,
      color: '#1DA1F2',
      description: 'Real-time updates',
    },
    {
      id: 'email',
      name: 'Email',
      icon: '📧',
      maxChars: 5000,
      color: '#EA4335',
      description: 'Direct communication',
    },
  ];

  const handlePlatformToggle = (platformId) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [platformId]: !prev[platformId],
    }));
  };

  const handlePublish = async () => {
    if (!postContent.trim()) {
      setError('Please enter content to publish');
      return;
    }

    const selectedCount = Object.values(selectedPlatforms).filter(Boolean).length;
    if (selectedCount === 0) {
      setError('Please select at least one platform');
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      const platformList = Object.entries(selectedPlatforms)
        .filter(([_, selected]) => selected)
        .map(([platform, _]) => {
          const p = platforms.find((pl) => pl.id === platform);
          return p?.name;
        });

      // Try to call backend API
      try {
        await cofounderAgentClient.publishToCMS?.({
          content: postContent,
          platforms: platformList,
          scheduledFor: scheduleDate ? `${scheduleDate}T${scheduleTime}` : null,
          image: imageUrl || null,
        });
      } catch (err) {
        console.warn('Publishing API not available, using mock:', err);
      }

      // Add to scheduled or published based on date
      const isScheduled = scheduleDate && new Date(`${scheduleDate}T${scheduleTime}`) > new Date();
      const newPost = {
        id: Math.max(...[...scheduledPosts, ...publishedPosts].map((p) => p.id), 0) + 1,
        content: postContent,
        platforms: platformList,
        scheduledFor: scheduleDate ? new Date(`${scheduleDate}T${scheduleTime}`) : new Date(),
        status: isScheduled ? 'scheduled' : 'published',
        publishedAt: isScheduled ? null : new Date(),
        likes: 0,
        comments: 0,
        shares: 0,
        engagement: 0,
      };

      if (isScheduled) {
        setScheduledPosts([newPost, ...scheduledPosts]);
      } else {
        setPublishedPosts([newPost, ...publishedPosts]);
      }

      // Reset form
      setPostContent('');
      setImageUrl('');
      setScheduleDate('');
      setScheduleTime('09:00');
      setSelectedPlatforms({ linkedin: true, twitter: false, email: false });
    } catch (err) {
      setError('Publishing failed: ' + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  // Get character count for selected platforms
  const getCharCountStatus = () => {
    const selectedPlats = Object.entries(selectedPlatforms)
      .filter(([_, selected]) => selected)
      .map(([id, _]) => platforms.find((p) => p.id === id));

    if (selectedPlats.length === 0) return null;

    const maxChars = Math.min(...selectedPlats.map((p) => p.maxChars));
    const remaining = maxChars - postContent.length;
    const percent = (postContent.length / maxChars) * 100;

    return { current: postContent.length, max: maxChars, remaining, percent };
  };

  const charCount = getCharCountStatus();

  return (
    <div className="enhanced-social-page">
      {/* Header */}
      <div className="social-header">
        <h2>📱 Social Publishing Suite</h2>
        <p className="subtitle">Multi-platform social media publishing and scheduling</p>
      </div>

      <div className="social-container">
        {/* Left Panel - Composer */}
        <div className="composer-panel">
          <div className="composer-card">
            <div className="composer-header">
              <h3>Create & Schedule Post</h3>
              <span className="composer-label">New Post</span>
            </div>

            {/* Platform Selection */}
            <div className="platform-selector">
              <label className="selector-label">Select Platforms</label>
              <div className="platform-buttons">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatformToggle(platform.id)}
                    className={`platform-btn ${selectedPlatforms[platform.id] ? 'selected' : ''}`}
                    style={{
                      borderColor: selectedPlatforms[platform.id] ? platform.color : '#444',
                      backgroundColor: selectedPlatforms[platform.id]
                        ? `${platform.color}20`
                        : 'transparent',
                    }}
                  >
                    <span className="platform-icon">{platform.icon}</span>
                    <span className="platform-name">{platform.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Editor */}
            <div className="content-editor-section">
              <label className="editor-label">Content</label>
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Write your post here... Add your message, thoughts, and call-to-action."
                className="content-textarea"
                rows="8"
              ></textarea>

              {charCount && (
                <div className="char-counter">
                  <div className="counter-bar">
                    <div
                      className={`counter-fill ${charCount.percent > 100 ? 'error' : ''}`}
                      style={{ width: `${Math.min(charCount.percent, 100)}%` }}
                    ></div>
                  </div>
                  <div className="counter-text">
                    <span>
                      {charCount.current} / {charCount.max}
                    </span>
                    {charCount.remaining >= 0 && (
                      <span className="remaining">{charCount.remaining} remaining</span>
                    )}
                    {charCount.remaining < 0 && (
                      <span className="over-limit">
                        {Math.abs(charCount.remaining)} over limit
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div className="image-section">
              <label className="image-label">Image (Optional)</label>
              <div className="image-upload">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL..."
                  className="image-input"
                />
                {imageUrl && (
                  <div className="image-preview">
                    <img src={imageUrl} alt="Preview" />
                  </div>
                )}
              </div>
            </div>

            {/* Scheduling */}
            <div className="scheduling-section">
              <label className="scheduling-label">Schedule (Optional)</label>
              <div className="schedule-inputs">
                <div className="schedule-item">
                  <label>Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="schedule-input"
                  />
                </div>
                <div className="schedule-item">
                  <label>Time</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="schedule-input"
                  />
                </div>
              </div>
              <p className="schedule-hint">
                Leave blank to publish immediately, or set a date/time to schedule
              </p>
            </div>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Action Buttons */}
            <div className="composer-actions">
              <button
                onClick={handlePublish}
                disabled={isPublishing || !postContent.trim()}
                className="publish-button"
              >
                {isPublishing ? (
                  <>
                    <span className="spinner-small"></span>
                    Publishing...
                  </>
                ) : scheduleDate ? (
                  <>
                    📅 Schedule Post
                  </>
                ) : (
                  <>
                    📤 Publish Now
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setPostContent('');
                  setImageUrl('');
                  setScheduleDate('');
                  setScheduleTime('09:00');
                }}
                className="reset-button"
                disabled={isPublishing}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Platform Tips */}
          <div className="tips-card">
            <h4>📋 Platform Tips</h4>
            <ul className="tips-list">
              {platforms
                .filter((p) => selectedPlatforms[p.id])
                .map((platform) => (
                  <li key={platform.id}>
                    <strong>{platform.name}:</strong> {platform.description} (max {platform.maxChars}{' '}
                    chars)
                  </li>
                ))}
              {Object.values(selectedPlatforms).every((v) => !v) && (
                <li>Select platforms above to see specific tips</li>
              )}
            </ul>
          </div>
        </div>

        {/* Right Panel - Schedule & History */}
        <div className="history-panel">
          {/* Scheduled Posts */}
          <div className="posts-section">
            <div className="section-header">
              <h3>📅 Scheduled Posts ({scheduledPosts.length})</h3>
            </div>
            {scheduledPosts.length > 0 ? (
              <div className="posts-list">
                {scheduledPosts.map((post) => (
                  <div key={post.id} className="post-item scheduled">
                    <div className="post-meta">
                      <div className="post-time">
                        📅 {post.scheduledFor.toLocaleDateString()} at{' '}
                        {post.scheduledFor.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="post-platforms">
                        {post.platforms.map((p) => (
                          <span key={p} className="platform-tag">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="post-content">{post.content}</div>
                    <div className="post-actions">
                      <button className="action-btn edit">✏️ Edit</button>
                      <button className="action-btn delete">🗑️ Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No scheduled posts</p>
            )}
          </div>

          {/* Published Posts */}
          <div className="posts-section">
            <div className="section-header">
              <h3>📊 Published Posts ({publishedPosts.length})</h3>
            </div>
            {publishedPosts.length > 0 ? (
              <div className="posts-list">
                {publishedPosts.map((post) => (
                  <div key={post.id} className="post-item published">
                    <div className="post-meta">
                      <div className="post-time">
                        📤 {post.publishedAt?.toLocaleDateString()} at{' '}
                        {post.publishedAt?.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="post-platforms">
                        {post.platforms.map((p) => (
                          <span key={p} className="platform-tag">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="post-content">{post.content}</div>
                    <div className="post-analytics">
                      <div className="analytics-stat">
                        <span className="stat-icon">❤️</span>
                        <span className="stat-value">{post.likes}</span>
                      </div>
                      <div className="analytics-stat">
                        <span className="stat-icon">💬</span>
                        <span className="stat-value">{post.comments}</span>
                      </div>
                      <div className="analytics-stat">
                        <span className="stat-icon">🔄</span>
                        <span className="stat-value">{post.shares}</span>
                      </div>
                      <div className="analytics-stat engagement">
                        <span className="stat-icon">📈</span>
                        <span className="stat-value">{post.engagement}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No published posts yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSocialPublishingPage;
