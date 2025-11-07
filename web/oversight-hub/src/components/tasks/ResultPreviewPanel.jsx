import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const ResultPreviewPanel = ({
  task = null,
  onApprove = () => {},
  onReject = () => {},
  isLoading = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedSEO, setEditedSEO] = useState({});
  const [publishDestination, setPublishDestination] = useState('');

  // Initialize editable content when task changes
  React.useEffect(() => {
    if (task && task.result) {
      // Handle both nested (result.content) and flat (result string) structures
      const content =
        typeof task.result === 'string'
          ? task.result
          : task.result.content || task.result.generated_content || '';
      setEditedContent(content);
      setEditedTitle(task.title || task.result.task_name || task.topic || '');
      setEditedSEO(
        task.result.seo || { title: '', description: '', keywords: '' }
      );
    }
  }, [task]);

  if (!task) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-900 rounded-lg border border-cyan-500/30">
        <div className="text-4xl mb-4">📋</div>
        <div className="text-lg font-semibold">No task selected</div>
        <div className="text-sm mt-2 text-center">
          Select a task from the queue to preview results
        </div>
      </div>
    );
  }

  if (task.status === 'pending' || task.status === 'in_progress') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-900 rounded-lg border border-cyan-500/30">
        <div className="text-4xl mb-4 animate-pulse">⏳</div>
        <div className="text-lg font-semibold">Task in progress</div>
        <div className="text-sm mt-2">
          Results will appear here when complete
        </div>
      </div>
    );
  }

  if (task.status === 'failed') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-900 rounded-lg border border-red-500/30">
        <div className="text-4xl mb-4">❌</div>
        <div className="text-lg font-semibold text-red-400">Task Failed</div>
        <div className="text-sm mt-4 text-red-300 text-center max-w-sm">
          {task.error_message || 'An error occurred while processing this task'}
        </div>
        <button
          onClick={() => onReject(task)}
          className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition"
        >
          ✕ Discard
        </button>
      </div>
    );
  }

  // Task completed - show results
  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-lg border border-cyan-500/30 overflow-hidden">
      {/* Header */}
      <div className="border-b border-cyan-500/30 p-4 bg-gray-800 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-cyan-400">✓ Results Preview</h3>
          <p className="text-xs text-gray-400 mt-1">
            Review and approve before publishing
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded font-medium transition ${
            isEditing
              ? 'bg-cyan-600 text-white hover:bg-cyan-700'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {isEditing ? '✓ Done Editing' : '✎ Edit'}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-cyan-400 mb-2">
            Title
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          ) : (
            <div className="p-3 bg-gray-800 rounded border border-gray-700 text-gray-100">
              {editedTitle || 'Untitled'}
            </div>
          )}
        </div>

        {/* Content Preview */}
        <div>
          <label className="block text-sm font-semibold text-cyan-400 mb-2">
            Content
          </label>
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
              rows={12}
            />
          ) : (
            <div className="p-4 bg-gray-800 rounded border border-gray-700 prose prose-invert max-w-none">
              {task.type?.includes('blog') || task.type === 'blog_post' ? (
                <div className="text-gray-300 max-h-96 overflow-y-auto">
                  <ReactMarkdown>{editedContent}</ReactMarkdown>
                </div>
              ) : (
                <pre className="text-gray-300 whitespace-pre-wrap break-words text-sm">
                  {editedContent}
                </pre>
              )}
            </div>
          )}
        </div>

        {/* SEO Metadata (for blog posts) */}
        {task.type?.includes('blog') && (
          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-sm font-semibold text-cyan-400 mb-3">
              SEO Metadata
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Meta Title
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedSEO.title || ''}
                    onChange={(e) =>
                      setEditedSEO({ ...editedSEO, title: e.target.value })
                    }
                    maxLength="60"
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  />
                ) : (
                  <div className="p-2 bg-gray-800 rounded border border-gray-700 text-gray-300 text-sm">
                    {editedSEO.title || 'Not set'}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {editedSEO.title?.length || 0}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Meta Description
                </label>
                {isEditing ? (
                  <textarea
                    value={editedSEO.description || ''}
                    onChange={(e) =>
                      setEditedSEO({
                        ...editedSEO,
                        description: e.target.value,
                      })
                    }
                    maxLength="160"
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    rows={2}
                  />
                ) : (
                  <div className="p-2 bg-gray-800 rounded border border-gray-700 text-gray-300 text-sm">
                    {editedSEO.description || 'Not set'}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {editedSEO.description?.length || 0}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Keywords
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedSEO.keywords || ''}
                    onChange={(e) =>
                      setEditedSEO({ ...editedSEO, keywords: e.target.value })
                    }
                    placeholder="keyword1, keyword2, keyword3"
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  />
                ) : (
                  <div className="p-2 bg-gray-800 rounded border border-gray-700 text-gray-300 text-sm">
                    {editedSEO.keywords || 'Not set'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Publish Destination */}
        <div className="border-t border-gray-700 pt-4">
          <label className="block text-sm font-semibold text-cyan-400 mb-2">
            Publish To
          </label>
          <select
            value={publishDestination}
            onChange={(e) => setPublishDestination(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Select destination...</option>
            <option value="strapi">📚 Strapi CMS</option>
            <option value="twitter">𝕏 Twitter/X</option>
            <option value="facebook">👍 Facebook</option>
            <option value="instagram">📸 Instagram</option>
            <option value="linkedin">💼 LinkedIn</option>
            <option value="email">📧 Email Campaign</option>
            <option value="google-drive">☁️ Google Drive</option>
            <option value="download">💾 Download Only</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-cyan-500/30 bg-gray-800 p-4 flex gap-3 justify-end">
        <button
          onClick={() => onReject(task)}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition disabled:opacity-50"
        >
          ✕ Reject
        </button>
        <button
          onClick={() => {
            const updatedTask = {
              ...task,
              title: editedTitle,
              result: {
                ...task.result,
                content: editedContent,
                seo: editedSEO,
              },
              publish_destination: publishDestination,
            };
            onApprove(updatedTask);
          }}
          disabled={isLoading || !publishDestination}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⟳</span> Publishing...
            </>
          ) : (
            '✓ Approve & Publish'
          )}
        </button>
      </div>
    </div>
  );
};

export default ResultPreviewPanel;
