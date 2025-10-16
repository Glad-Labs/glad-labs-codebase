import React from 'react';
import useStore from '../store/useStore';
import './Settings.css';

function Settings() {
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const autoRefresh = useStore((state) => state.autoRefresh);
  const toggleAutoRefresh = useStore((state) => state.toggleAutoRefresh);
  const notifications = useStore((state) => state.notifications);
  const toggleDesktopNotifications = useStore(
    (state) => state.toggleDesktopNotifications
  );
  const apiKeys = useStore((state) => state.apiKeys);
  const setApiKey = useStore((state) => state.setApiKey);

  const handleApiKeyChange = (e) => {
    const { name, value } = e.target;
    setApiKey(name, value);
  };

  return (
    <div className="settings-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Settings</h1>
        <p className="dashboard-subtitle">Customize your experience</p>
      </div>

      <div className="settings-section">
        <h2>Appearance</h2>
        <p>Customize how the application looks and feels.</p>

        <div className="setting-item">
          <div className="setting-info">
            <h3>Theme</h3>
            <p>Choose between light and dark mode</p>
          </div>
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${
              theme === 'light' ? 'dark' : 'light'
            } theme`}
          >
            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2>System</h2>
        <p>Application and performance settings.</p>

        <div className="setting-item">
          <div className="setting-info">
            <h3>Auto-refresh</h3>
            <p>Automatically refresh data every 30 seconds</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={toggleAutoRefresh}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h3>Notifications</h3>
            <p>Receive desktop notifications for important updates</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notifications.desktop}
              onChange={toggleDesktopNotifications}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h2>API Keys</h2>
        <p>Manage your API keys for third-party services.</p>

        <div className="setting-item">
          <div className="setting-info">
            <h3>Mercury API Key</h3>
            <p>Used for financial data integration.</p>
            <input
              type="password"
              name="mercury"
              className="api-key-input"
              value={apiKeys.mercury}
              onChange={handleApiKeyChange}
              placeholder="Enter your Mercury API key"
            />
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h3>GCP Billing API Key</h3>
            <p>Used for Google Cloud Platform cost analysis.</p>
            <input
              type="password"
              name="gcp"
              className="api-key-input"
              value={apiKeys.gcp}
              onChange={handleApiKeyChange}
              placeholder="Enter your GCP Billing API key"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
