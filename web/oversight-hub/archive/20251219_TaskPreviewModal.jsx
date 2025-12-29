import React, { useState } from 'react';
import './TaskPreviewModal.css';

const TaskPreviewModal = ({ task, onClose }) => {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const handleCopyContent = () => {
    const content = task.result?.content || 'No content available';
    navigator.clipboard.writeText(content);
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  const handleDownload = () => {
    const content = task.result?.content || 'No content available';
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
    );
    element.setAttribute('download', `${task.topic || 'blog-post'}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const wordCount = task.result?.content
    ? task.result.content.split(/\s+/).length
    : 0;
  const timeSpent =
    task.created_at && task.updated_at
      ? Math.round(
          (new Date(task.updated_at) - new Date(task.created_at)) / 1000
        )
      : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task.topic || 'Blog Post'}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-metadata">
          <div className="meta-item">
            <span className="meta-label">Status:</span>
            <span className="meta-value">{task.status || 'pending'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Style:</span>
            <span className="meta-value">{task.style || 'technical'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Tone:</span>
            <span className="meta-value">{task.tone || 'professional'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Words:</span>
            <span className="meta-value">{wordCount}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Created:</span>
            <span className="meta-value">
              {new Date(task.created_at).toLocaleString()}
            </span>
          </div>
          {timeSpent > 0 && (
            <div className="meta-item">
              <span className="meta-label">Time Spent:</span>
              <span className="meta-value">
                {timeSpent < 60
                  ? `${timeSpent}s`
                  : `${Math.round(timeSpent / 60)}m`}
              </span>
            </div>
          )}
        </div>

        <div className="modal-body">
          {task.result?.content ? (
            <div className="content-preview">
              <div className="content-text">{task.result.content}</div>
            </div>
          ) : task.status === 'completed' ? (
            <div className="no-content">
              Content generation completed but no content available
            </div>
          ) : task.status === 'processing' || task.status === 'in_progress' ? (
            <div className="processing-message">
              <div className="spinner"></div>
              Content is being generated... (Progress: {task.progress || 0}%)
            </div>
          ) : (
            <div className="no-content">
              No preview available yet. Task status: {task.status}
            </div>
          )}
        </div>

        {task.result?.content && (
          <div className="modal-actions">
            <button className="action-btn copy-btn" onClick={handleCopyContent}>
              {copiedToClipboard ? '✓ Copied!' : '📋 Copy Content'}
            </button>
            <button
              className="action-btn download-btn"
              onClick={handleDownload}
            >
              ⬇️ Download
            </button>
          </div>
        )}

        {task.error && (
          <div className="error-message">
            <strong>Error:</strong> {task.error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskPreviewModal;
