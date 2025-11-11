import React, { useState, useEffect } from 'react';

/**
 * Content Management Page
 * Create, edit, optimize, and publish content with SEO tools
 */
const ContentManagementPage = () => {
  const [contentList, setContentList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [category, setCategory] = useState('technology');
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wordCount, setWordCount] = useState(0);

  const categories = [
    'technology',
    'business',
    'marketing',
    'ai',
    'analytics',
    'other',
  ];

  // Calculate word count
  useEffect(() => {
    setWordCount(content.split(/\s+/).filter((word) => word.length > 0).length);
  }, [content]);

  // Load mock content on mount
  useEffect(() => {
    const mockContent = [
      {
        id: 1,
        title: 'Introduction to AI',
        excerpt: 'Learn the basics of artificial intelligence...',
        status: 'published',
        category: 'ai',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        views: 1250,
      },
      {
        id: 2,
        title: 'Data Analytics Best Practices',
        excerpt: 'How to implement effective data analytics...',
        status: 'draft',
        category: 'analytics',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        views: 0,
      },
    ];
    setContentList(mockContent);
  }, []);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    if (seoTitle.length > 60) {
      setError('SEO title should be 60 characters or less');
      return;
    }

    if (seoDescription.length > 160) {
      setError('SEO description should be 160 characters or less');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (editingId) {
        // Update existing
        setContentList(
          contentList.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  title,
                  content,
                  category,
                  status,
                  seoTitle,
                  seoDescription,
                  seoKeywords,
                }
              : item
          )
        );
        setEditingId(null);
      } else {
        // Create new
        const newContent = {
          id: Math.max(...contentList.map((c) => c.id), 0) + 1,
          title,
          content,
          category,
          status,
          seoTitle,
          seoDescription,
          seoKeywords,
          excerpt: content.substring(0, 150) + '...',
          createdAt: new Date().toISOString(),
          views: 0,
        };
        setContentList([...contentList, newContent]);
      }

      // Reset form
      setTitle('');
      setContent('');
      setSeoTitle('');
      setSeoDescription('');
      setSeoKeywords('');
      setCategory('technology');
      setStatus('draft');
    } catch (err) {
      setError('Failed to save content: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setContent(item.content || '');
    setSeoTitle(item.seoTitle || item.title);
    setSeoDescription(item.seoDescription || item.excerpt);
    setSeoKeywords(item.seoKeywords || '');
    setCategory(item.category);
    setStatus(item.status);
  };

  const handleDelete = (id) => {
    setContentList(contentList.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      resetForm();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setSeoTitle('');
    setSeoDescription('');
    setSeoKeywords('');
    setCategory('technology');
    setStatus('draft');
  };

  const handlePublish = (id) => {
    setContentList(
      contentList.map((item) =>
        item.id === id ? { ...item, status: 'published' } : item
      )
    );
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>📝 Content Management</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Create, edit, optimize and publish content with SEO tools
        </p>
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
      {/* Content Mode: Manual Content Editor */}
      <>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '2rem',
          }}
        >
          {/* Editor Panel */}
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-secondary)',
            }}
          >
            <h3 style={{ marginBottom: '1rem' }}>
              {editingId ? 'Edit Content' : 'New Content'}
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                  color: 'var(--text-secondary)',
                }}
              >
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter content title"
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

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                  color: 'var(--text-secondary)',
                }}
              >
                Content * ({wordCount} words)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your content here..."
                style={{
                  width: '100%',
                  minHeight: '200px',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--border-secondary)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>

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
                    fontWeight: 'bold',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--border-secondary)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem',
                    fontWeight: 'bold',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--border-secondary)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                  }}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
              }}
            >
              {editingId && (
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--border-secondary)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={loading || !title.trim() || !content.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  backgroundColor:
                    title.trim() && content.trim()
                      ? 'var(--accent-primary)'
                      : 'var(--border-secondary)',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor:
                    title.trim() && content.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '0.95rem',
                }}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {/* SEO Panel */}
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-secondary)',
            }}
          >
            <h3 style={{ marginBottom: '1rem' }}>🔍 SEO Optimization</h3>

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                  color: 'var(--text-secondary)',
                }}
              >
                SEO Title ({seoTitle.length}/60)
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Optimized title for search engines"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${
                    seoTitle.length > 60 ? '#ff6464' : 'var(--border-secondary)'
                  }`,
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                }}
              />
              <div
                style={{
                  fontSize: '0.8rem',
                  color:
                    seoTitle.length > 60 ? '#ff6464' : 'var(--text-tertiary)',
                  marginTop: '0.25rem',
                }}
              >
                {seoTitle.length > 60 ? '❌ Too long' : '✓ Optimal length'}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                  color: 'var(--text-secondary)',
                }}
              >
                Meta Description ({seoDescription.length}/160)
              </label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Brief description for search results"
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${
                    seoDescription.length > 160
                      ? '#ff6464'
                      : 'var(--border-secondary)'
                  }`,
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
              <div
                style={{
                  fontSize: '0.8rem',
                  color:
                    seoDescription.length > 160
                      ? '#ff6464'
                      : 'var(--text-tertiary)',
                  marginTop: '0.25rem',
                }}
              >
                {seoDescription.length > 160
                  ? '❌ Too long'
                  : '✓ Optimal length'}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                  color: 'var(--text-secondary)',
                }}
              >
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
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

            {/* SEO Preview */}
            <div
              style={{
                backgroundColor: 'var(--bg-primary)',
                padding: '1rem',
                borderRadius: '0.375rem',
                marginTop: '1.5rem',
                border: '1px solid var(--border-secondary)',
              }}
            >
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: 'var(--text-secondary)',
                }}
              >
                Search Preview
              </div>
              <div style={{ fontSize: '0.85rem' }}>
                <div
                  style={{
                    color: '#1f90f0',
                    marginBottom: '0.25rem',
                    wordBreak: 'break-word',
                  }}
                >
                  {seoTitle || title || 'Your title'}
                </div>
                <div
                  style={{
                    color: 'var(--text-tertiary)',
                    fontSize: '0.8rem',
                    marginBottom: '0.25rem',
                    wordBreak: 'break-word',
                  }}
                >
                  yoursite.com › {category}
                </div>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    wordBreak: 'break-word',
                    lineHeight: '1.3',
                  }}
                >
                  {seoDescription || 'Your meta description'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content List */}
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Content Library</h3>
          {contentList.length > 0 ? (
            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-secondary)',
                overflow: 'hidden',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderBottom: '2px solid var(--border-secondary)',
                    }}
                  >
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Title
                    </th>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Views
                    </th>
                    <th
                      style={{
                        padding: '1rem',
                        textAlign: 'right',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contentList.map((item) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid var(--border-secondary)',
                      }}
                    >
                      <td
                        style={{
                          padding: '1rem',
                          color: 'var(--text-primary)',
                          fontSize: '0.95rem',
                        }}
                      >
                        {item.title}
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            backgroundColor:
                              item.status === 'published'
                                ? 'rgba(0, 217, 38, 0.2)'
                                : item.status === 'draft'
                                  ? 'rgba(255, 200, 0, 0.2)'
                                  : 'rgba(128, 128, 128, 0.2)',
                            color:
                              item.status === 'published'
                                ? '#00d926'
                                : item.status === 'draft'
                                  ? '#ffc800'
                                  : '#888',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            textTransform: 'capitalize',
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          color: 'var(--text-primary)',
                          fontSize: '0.95rem',
                        }}
                      >
                        {item.views}
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          textAlign: 'right',
                        }}
                      >
                        <button
                          onClick={() => handleEdit(item)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-primary)',
                            cursor: 'pointer',
                            marginRight: '0.75rem',
                            fontSize: '0.9rem',
                          }}
                        >
                          ✏️
                        </button>
                        {item.status === 'draft' && (
                          <button
                            onClick={() => handlePublish(item.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--accent-success)',
                              cursor: 'pointer',
                              marginRight: '0.75rem',
                              fontSize: '0.9rem',
                            }}
                          >
                            📤
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ff6464',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                          }}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                color: 'var(--text-tertiary)',
                padding: '2rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-secondary)',
              }}
            >
              No content yet. Create your first post using the editor above!
            </div>
          )}
        </div>
      </>
      }
    </div>
  );
};

export default ContentManagementPage;
