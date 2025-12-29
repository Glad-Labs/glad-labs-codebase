import React, { useState, useEffect } from 'react';

const TaskQueueView = ({ tasks = [], onTaskSelect = () => {} }) => {
  const [polling, setPolling] = useState(true);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // ✅ Tasks are passed as props from parent, no fetch needed
  // Polling state is used for UI controls but data comes from parent

  // Filter tasks by status
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter((task) => task.status === statusFilter));
    }
  }, [tasks, statusFilter]);

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-400 bg-yellow-900 border-yellow-600',
      in_progress: 'text-cyan-400 bg-cyan-900 border-cyan-600',
      completed: 'text-green-400 bg-green-900 border-green-600',
      failed: 'text-red-400 bg-red-900 border-red-600',
    };
    return colors[status] || 'text-gray-400 bg-gray-700 border-gray-600';
  };

  // Get task type emoji
  const getTaskTypeEmoji = (type) => {
    const emojis = {
      blog_post: '📝',
      image_generation: '🖼️',
      social_media_post: '📱',
      email_campaign: '📧',
      content_brief: '📋',
      content_generation: '✨',
    };
    return emojis[type] || '📌';
  };

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Calculate progress percentage
  const getProgress = (task) => {
    const statusProgress = {
      pending: 10,
      in_progress: 50,
      completed: 100,
      failed: 100,
    };
    return statusProgress[task.status] || 0;
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <div className="text-4xl mb-4">📭</div>
        <div className="text-lg font-semibold">No tasks yet</div>
        <div className="text-sm mt-2">Create a new task to get started</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-lg border border-cyan-500/30">
      {/* Header */}
      <div className="border-b border-cyan-500/30 p-4 flex justify-between items-center">
        <h3 className="text-lg font-bold text-cyan-400">📋 Task Queue</h3>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setPolling(!polling)}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              polling
                ? 'bg-cyan-500 text-gray-900 hover:bg-cyan-600'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {polling ? '⊙ Live' : '⊘ Paused'}
          </button>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 bg-gray-700 text-gray-300 rounded border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All ({filteredTasks.length})</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto">
        {filteredTasks.map((task) => {
          const isSelected = selectedTaskId === task.id;
          const progress = getProgress(task);
          const statusColors = getStatusColor(task.status);

          return (
            <div
              key={task.id}
              onClick={() => {
                setSelectedTaskId(task.id);
                onTaskSelect(task);
              }}
              className={`border-b border-gray-700 p-4 cursor-pointer transition hover:bg-gray-800 ${
                isSelected ? 'bg-gray-800 border-l-4 border-l-cyan-500' : ''
              }`}
            >
              {/* Task Header */}
              <div className="flex justify-between items-start gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">
                      {getTaskTypeEmoji(task.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-cyan-300 font-semibold truncate">
                        {task.title || task.name || 'Untitled Task'}
                      </h4>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {task.description ||
                      task.parameters?.topic ||
                      'No description'}
                  </p>
                </div>

                {/* Status Badge */}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors} whitespace-nowrap`}
                >
                  {task.status?.replace('_', ' ') || 'unknown'}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2 bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    task.status === 'completed'
                      ? 'bg-green-500'
                      : task.status === 'failed'
                        ? 'bg-red-500'
                        : task.status === 'in_progress'
                          ? 'bg-cyan-500'
                          : 'bg-yellow-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Footer Info */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex gap-3">
                  {task.agent && <span>🤖 {task.agent}</span>}
                  {task.created_at && (
                    <span>⏱ {formatTime(task.created_at)}</span>
                  )}
                </div>
                {isSelected && (
                  <span className="text-cyan-400 font-semibold">→ Preview</span>
                )}
              </div>

              {/* Error Message (if failed) */}
              {task.status === 'failed' && task.error_message && (
                <div className="mt-2 p-2 bg-red-900/30 border border-red-600/50 rounded text-xs text-red-300">
                  ⚠️ {task.error_message}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats Footer */}
      <div className="border-t border-cyan-500/30 px-4 py-2 bg-gray-800 text-xs text-gray-400 flex justify-between">
        <div>Total: {filteredTasks.length}</div>
        <div>
          {filteredTasks.filter((t) => t.status === 'in_progress').length} In
          Progress
        </div>
        <div className="text-green-400">
          {filteredTasks.filter((t) => t.status === 'completed').length}{' '}
          Completed
        </div>
      </div>
    </div>
  );
};

export default TaskQueueView;
