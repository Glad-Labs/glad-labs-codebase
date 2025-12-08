import React, { useState, useEffect } from 'react';

/**
 * Models Configuration Page
 * Manage AI model providers, settings, and performance metrics
 */
const ModelsPage = () => {
  const [providers, setProviders] = useState([
    {
      id: 'ollama',
      name: 'Ollama',
      icon: '🏠',
      status: 'connected',
      models: ['mistral', 'llama2', 'neural-chat'],
      selected: true,
      latency: 145,
      costPerRequest: 0,
    },
    {
      id: 'openai',
      name: 'OpenAI',
      icon: '🔴',
      status: 'connected',
      models: ['gpt-4', 'gpt-3.5-turbo'],
      selected: false,
      latency: 280,
      costPerRequest: 0.03,
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      icon: '⭐',
      status: 'connected',
      models: ['claude-3-opus', 'claude-3-sonnet'],
      selected: false,
      latency: 320,
      costPerRequest: 0.015,
    },
    {
      id: 'google',
      name: 'Google Gemini',
      icon: '✨',
      status: 'connected',
      models: ['gemini-pro', 'gemini-1.5-pro'],
      selected: false,
      latency: 250,
      costPerRequest: 0.001,
    },
  ]);

  const [selectedModel, setSelectedModel] = useState('ollama-mistral');
  const [apiKey, setApiKey] = useState('sk-...');
  const [showApiKey, setShowApiKey] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testResults, setTestResults] = useState({});

  const handleProviderToggle = (id) => {
    setProviders(
      providers.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const handleTestConnection = async (id) => {
    try {
      setTestLoading(true);
      // Simulate API test
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTestResults({
        ...testResults,
        [id]: { success: true, message: 'Connection successful' },
      });
      setTimeout(() => {
        setTestResults((prev) => {
          const newResults = { ...prev };
          delete newResults[id];
          return newResults;
        });
      }, 3000);
    } catch (error) {
      setTestResults({
        ...testResults,
        [id]: { success: false, message: 'Connection failed' },
      });
    } finally {
      setTestLoading(false);
    }
  };

  const fallbackChain = [
    { provider: 'ollama', priority: 1, cost: '$0/req' },
    { provider: 'claude-opus', priority: 2, cost: '$0.015/req' },
    { provider: 'gpt-4', priority: 3, cost: '$0.03/req' },
    { provider: 'gemini', priority: 4, cost: '$0.001/req' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>🤖 Model Configuration</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Configure AI model providers, manage API keys, and set fallback chain
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem',
          marginBottom: '2rem',
        }}
      >
        {/* Providers Grid */}
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Available Providers</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
            }}
          >
            {providers.map((provider) => (
              <div
                key={provider.id}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  border: provider.selected
                    ? '2px solid var(--accent-primary)'
                    : '1px solid var(--border-secondary)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ fontSize: '1.5rem' }}>{provider.icon}</div>
                    <div>
                      <div
                        style={{
                          fontWeight: 'bold',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {provider.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        {provider.models.length} models
                      </div>
                    </div>
                  </div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={provider.selected}
                      onChange={() => handleProviderToggle(provider.id)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    <span
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {provider.status === 'connected'
                        ? '🟢 Connected'
                        : '🔴 Offline'}
                    </span>
                  </label>
                </div>

                {/* Status Badge */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-tertiary)',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Latency
                    </div>
                    <div
                      style={{
                        fontWeight: 'bold',
                        color: 'var(--accent-primary)',
                        fontSize: '0.9rem',
                      }}
                    >
                      {provider.latency}ms
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-tertiary)',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Cost
                    </div>
                    <div
                      style={{
                        fontWeight: 'bold',
                        color:
                          provider.costPerRequest === 0
                            ? '#00d926'
                            : 'var(--accent-primary)',
                        fontSize: '0.9rem',
                      }}
                    >
                      {provider.costPerRequest === 0
                        ? 'FREE'
                        : `$${provider.costPerRequest}`}
                    </div>
                  </div>
                </div>

                {/* Models List */}
                <div
                  style={{
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: '0.375rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <div
                    style={{
                      color: 'var(--text-secondary)',
                      marginBottom: '0.5rem',
                      fontWeight: 'bold',
                    }}
                  >
                    Models:
                  </div>
                  {provider.models.map((model) => (
                    <div
                      key={model}
                      style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '0.8rem',
                        marginLeft: '0.5rem',
                      }}
                    >
                      • {model}
                    </div>
                  ))}
                </div>

                {/* Test Button */}
                <button
                  onClick={() => handleTestConnection(provider.id)}
                  disabled={testLoading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    backgroundColor: testResults[provider.id]?.success
                      ? 'rgba(0, 217, 38, 0.2)'
                      : testResults[provider.id]?.success === false
                        ? 'rgba(255, 100, 100, 0.2)'
                        : 'var(--accent-primary)',
                    color: testResults[provider.id]?.success
                      ? '#00d926'
                      : testResults[provider.id]?.success === false
                        ? '#ff6464'
                        : 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                  }}
                >
                  {testLoading ? '🔄 Testing...' : 'Test Connection'}
                </button>

                {testResults[provider.id] && (
                  <div
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.85rem',
                      color: testResults[provider.id].success
                        ? '#00d926'
                        : '#ff6464',
                    }}
                  >
                    {testResults[provider.id].message}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Fallback Chain */}
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Model Fallback Chain</h3>
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-secondary)',
            }}
          >
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginBottom: '1rem',
              }}
            >
              Models are tried in this order. If one fails, the next is used.
            </p>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {fallbackChain.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--border-secondary)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-primary)',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      marginRight: '0.75rem',
                      flexShrink: 0,
                    }}
                  >
                    {item.priority}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                      }}
                    >
                      {item.provider}
                    </div>
                    <div
                      style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '0.8rem',
                      }}
                    >
                      {item.cost}
                    </div>
                  </div>
                  {idx < fallbackChain.length - 1 && (
                    <div
                      style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '1rem',
                      }}
                    >
                      ↓
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(0, 217, 38, 0.1)',
                borderRadius: '0.375rem',
                border: '1px solid rgba(0, 217, 38, 0.3)',
                fontSize: '0.85rem',
                color: '#00d926',
              }}
            >
              <strong>✅ Smart Fallback:</strong> Automatically switches to
              cheaper/faster models if preferred model fails
            </div>
          </div>
        </div>
      </div>

      {/* API Keys Configuration */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          border: '1px solid var(--border-secondary)',
          marginBottom: '2rem',
        }}
      >
        <h3 style={{ marginBottom: '1rem' }}>API Key Management</h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {['OpenAI', 'Anthropic', 'Google Gemini'].map((provider) => (
            <div key={provider}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  fontWeight: 'bold',
                  color: 'var(--text-secondary)',
                }}
              >
                {provider} API Key
              </label>
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                }}
              >
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  readOnly
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--border-secondary)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                  }}
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--border-secondary)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  {showApiKey ? '👁️' : '🙈'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Comparison */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          border: '1px solid var(--border-secondary)',
        }}
      >
        <h3 style={{ marginBottom: '1rem' }}>Performance Comparison</h3>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '2px solid var(--border-secondary)',
                }}
              >
                {[
                  'Provider',
                  'Latency',
                  'Accuracy',
                  'Cost/1K tokens',
                  'Uptime',
                ].map((header) => (
                  <th
                    key={header}
                    style={{
                      padding: '0.75rem',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: 'Ollama',
                  latency: '145ms',
                  accuracy: '✓ Good',
                  cost: 'FREE',
                  uptime: '99.9%',
                },
                {
                  name: 'GPT-4',
                  latency: '280ms',
                  accuracy: '✓✓ Excellent',
                  cost: '$0.03',
                  uptime: '99.98%',
                },
                {
                  name: 'Claude',
                  latency: '320ms',
                  accuracy: '✓✓ Excellent',
                  cost: '$0.015',
                  uptime: '99.95%',
                },
                {
                  name: 'Gemini',
                  latency: '250ms',
                  accuracy: '✓ Good',
                  cost: '$0.001',
                  uptime: '99.9%',
                },
              ].map((row) => (
                <tr
                  key={row.name}
                  style={{
                    borderBottom: '1px solid var(--border-secondary)',
                  }}
                >
                  <td
                    style={{
                      padding: '0.75rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {row.name}
                  </td>
                  <td
                    style={{
                      padding: '0.75rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {row.latency}
                  </td>
                  <td
                    style={{
                      padding: '0.75rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {row.accuracy}
                  </td>
                  <td
                    style={{
                      padding: '0.75rem',
                      color:
                        row.cost === 'FREE'
                          ? '#00d926'
                          : 'var(--text-secondary)',
                      fontWeight: row.cost === 'FREE' ? 'bold' : 'normal',
                    }}
                  >
                    {row.cost}
                  </td>
                  <td
                    style={{
                      padding: '0.75rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {row.uptime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ModelsPage;
