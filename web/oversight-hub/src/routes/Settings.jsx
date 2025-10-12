import React from 'react';
import useStore from '../store/useStore';

function Settings() {
  const { theme, toggleTheme } = useStore((state) => ({
    theme: state.theme,
    toggleTheme: state.toggleTheme,
  }));

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
            {theme === 'light' ? (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                Light Mode
              </>
            ) : (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
                Dark Mode
              </>
            )}
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
          <button className="theme-toggle-btn">Enabled</button>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h3>Notifications</h3>
            <p>Receive desktop notifications for important updates</p>
          </div>
          <button className="theme-toggle-btn">Enabled</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
