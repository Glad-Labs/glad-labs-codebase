import React, { useState, useEffect } from 'react';

/**
 * Social Content Management Page
 * Manages social media content across multiple platforms with scheduling and analytics
 */
const SocialContentPage = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('twitter');
  const [contentQueue, setContentQueue] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [engagementMetrics, setEngagementMetrics] = useState({
    twitter: { posts: 0, likes: 0, retweets: 0, followers: 0 },
    linkedin: { posts: 0, likes: 0, shares: 0, followers: 0 },
    instagram: { posts: 0, likes: 0, comments: 0, followers: 0 },
    tiktok: { posts: 0, views: 0, likes: 0, followers: 0 },
  });

  const platforms = [
    { id: 'twitter', name: 'Twitter/X', icon: '𝕏', color: '#000000' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0A66C2' },
    { id: 'instagram', name: 'Instagram', icon: '📷', color: '#E4405F' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#25F4EE' },
  ];

  // Load content queue on mount or platform change
  useEffect(() => {
    const mockQueue = [
      {
        id: 1,
        platform: selectedPlatform,
        content: 'Check out our latest AI insights!',
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        status: 'scheduled',
      },
      {
        id: 2,
        platform: selectedPlatform,
        content: 'Join us for an upcoming webinar on machine learning',
        scheduledAt: new Date(Date.now() + 172800000).toISOString(),
        status: 'scheduled',
      },
    ];
    setContentQueue(
      mockQueue.filter((item) => item.platform === selectedPlatform)
    );
  }, [selectedPlatform]);

  const handleAddContent = async () => {
    if (!newContent.trim()) {
      setError('Please enter content');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const scheduleDateTime =
        scheduledDate && scheduledTime
          ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
          : new Date().toISOString();

      const newPost = {
        id: contentQueue.length + 1,
        platform: selectedPlatform,
        content: newContent,
        scheduledAt: scheduleDateTime,
        status: scheduledDate ? 'scheduled' : 'posted',
      };

      setContentQueue([...contentQueue, newPost]);
      setNewContent('');
      setScheduledDate('');
      setScheduledTime('');
    } catch (err) {
      setError('Failed to add content: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = (id) => {
    setContentQueue(contentQueue.filter((item) => item.id !== id));
  };

  const handlePublishNow = async (id) => {
    try {
      setLoading(true);
      const updated = contentQueue.map((item) =>
        item.id === id ? { ...item, status: 'posted' } : item
      );
      setContentQueue(updated);
    } catch (err) {
      setError('Failed to publish: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPlatformMetrics = () => {
    return engagementMetrics[selectedPlatform] || {};
  };

  const metrics = getCurrentPlatformMetrics();

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>📱 Social Media Management</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Create, schedule, and manage content across multiple social media
          platforms
        </p>
      </div>

      {/* Platform Selection */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => setSelectedPlatform(platform.id)}
            style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              border:
                selectedPlatform === platform.id
                  ? '2px solid var(--accent-primary)'
                  : '1px solid var(--border-secondary)',
              backgroundColor:
                selectedPlatform === platform.id
                  ? 'rgba(255, 0, 110, 0.1)'
                  : 'var(--bg-secondary)',
              color:
                selectedPlatform === platform.id
                  ? 'var(--accent-primary)'
                  : 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: selectedPlatform === platform.id ? 'bold' : 'normal',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              {platform.icon}
            </div>
            <div style={{ fontSize: '0.9rem' }}>{platform.name}</div>
          </button>
        ))}
      </div>

      {/* Engagement Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '0.5rem',
          border: '1px solid var(--border-secondary)',
        }}
      >
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key}>
            <div
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                textTransform: 'capitalize',
                marginBottom: '0.5rem',
              }}
            >
              {key}
            </div>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--accent-primary)',
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            backgroundColor: 'rgba(255, 100, 100, 0.2)',
            border: '1px solid #ff6464',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1rem',
            color: '#ff6464',
          }}
        >
          {error}
        </div>
      )}

      {/* New Content Form */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          border: '1px solid var(--border-secondary)',
          marginBottom: '2rem',
        }}
      >
        <h3 style={{ marginBottom: '1rem' }}>Create New Post</h3>

        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder={`What's on your mind for ${
            platforms.find((p) => p.id === selectedPlatform)?.name
          }?`}
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--border-secondary)',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            fontFamily: 'inherit',
            marginBottom: '1rem',
            resize: 'vertical',
          }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
                color: 'var(--text-secondary)',
              }}
            >
              Schedule Date (optional)
            </label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--border-secondary)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.9rem',
                marginBottom: '0.5rem',
                color: 'var(--text-secondary)',
              }}
            >
              Schedule Time (optional)
            </label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--border-secondary)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
              }}
            />
          </div>
        </div>

        <button
          onClick={handleAddContent}
          disabled={loading || !newContent.trim()}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            border: 'none',
            backgroundColor: newContent.trim()
              ? 'var(--accent-primary)'
              : 'var(--border-secondary)',
            color: 'white',
            fontWeight: 'bold',
            cursor: newContent.trim() ? 'pointer' : 'not-allowed',
            fontSize: '0.95rem',
            transition: 'all 0.2s',
          }}
        >
          {loading ? 'Adding...' : 'Add to Queue'}
        </button>
      </div>

      {/* Content Queue */}
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Content Queue</h3>
        {contentQueue.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            }}
          >
            {contentQueue.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '1rem',
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
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      backgroundColor:
                        item.status === 'posted'
                          ? 'rgba(0, 217, 38, 0.2)'
                          : 'rgba(255, 200, 0, 0.2)',
                      color: item.status === 'posted' ? '#00d926' : '#ffc800',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                    }}
                  >
                    {item.status}
                  </span>
                  <button
                    onClick={() => handleDeleteContent(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff6464',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      padding: 0,
                    }}
                  >
                    ✕
                  </button>
                </div>

                <p
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    marginBottom: '0.75rem',
                  }}
                >
                  {item.content}
                </p>

                <div
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.75rem',
                  }}
                >
                  📅 {new Date(item.scheduledAt).toLocaleString()}
                </div>

                {item.status === 'scheduled' && (
                  <button
                    onClick={() => handlePublishNow(item.id)}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      backgroundColor: 'var(--accent-success)',
                      color: 'white',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    Publish Now
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--text-tertiary)',
              padding: '2rem',
            }}
          >
            No content scheduled yet. Create your first post above!
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialContentPage;
