import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  RefreshCw,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { makeRequest } from '../services/cofounderAgentClient';

const CommandQueuePage = () => {
  const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_desc');

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    running: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    running: <RefreshCw className="w-4 h-4 animate-spin" />,
    completed: <CheckCircle className="w-4 h-4" />,
    failed: <XCircle className="w-4 h-4" />,
  };

  useEffect(() => {
    loadCommands();
    const interval = setInterval(loadCommands, 5000);
    return () => clearInterval(interval);
  }, [statusFilter, sortBy]);

  const loadCommands = async () => {
    try {
      setLoading(true);
      let query = '/api/commands?';
      if (statusFilter !== 'all') query += `status=${statusFilter}&`;
      query += `sort=${sortBy}`;

      const response = await makeRequest(query, 'GET');
      setCommands(response.commands || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading commands:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (commandId) => {
    try {
      await makeRequest(`/api/commands/${commandId}/retry`, 'POST');
      alert('✅ Command retry queued');
      await loadCommands();
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    }
  };

  const handleDelete = async (commandId) => {
    if (!window.confirm('Delete this command?')) return;

    try {
      await makeRequest(`/api/commands/${commandId}`, 'DELETE');
      alert('✅ Command deleted');
      await loadCommands();
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    }
  };

  const getStats = () => {
    const stats = {
      total: commands.length,
      pending: commands.filter((c) => c.status === 'pending').length,
      running: commands.filter((c) => c.status === 'running').length,
      completed: commands.filter((c) => c.status === 'completed').length,
      failed: commands.filter((c) => c.status === 'failed').length,
    };
    return stats;
  };

  const stats = getStats();

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            🔄 Command Queue
          </h1>
          <p className="text-slate-600">
            Monitor and manage async task execution
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
            <div className="text-2xl font-bold text-slate-900">
              {stats.total}
            </div>
            <div className="text-sm text-slate-600 mt-1">Total Commands</div>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4 hover:shadow-lg transition-shadow border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-700">
              {stats.pending}
            </div>
            <div className="text-sm text-yellow-600 mt-1">Pending</div>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4 hover:shadow-lg transition-shadow border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">
              {stats.running}
            </div>
            <div className="text-sm text-blue-600 mt-1">Running</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4 hover:shadow-lg transition-shadow border border-green-200">
            <div className="text-2xl font-bold text-green-700">
              {stats.completed}
            </div>
            <div className="text-sm text-green-600 mt-1">Completed</div>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4 hover:shadow-lg transition-shadow border border-red-200">
            <div className="text-2xl font-bold text-red-700">
              {stats.failed}
            </div>
            <div className="text-sm text-red-600 mt-1">Failed</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_desc">Newest First</option>
              <option value="created_asc">Oldest First</option>
              <option value="status">By Status</option>
            </select>
          </div>

          <button
            onClick={loadCommands}
            disabled={loading}
            className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Commands List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {commands.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No commands found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                      Command ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                      Agent
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                      Result
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {commands.map((cmd) => (
                    <tr
                      key={cmd.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[cmd.status]}`}
                        >
                          {statusIcons[cmd.status]}
                          {cmd.status.charAt(0).toUpperCase() +
                            cmd.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                          {cmd.id.slice(0, 12)}...
                        </code>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {cmd.agent || 'system'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(cmd.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                        {cmd.result ? (
                          <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                            {typeof cmd.result === 'string'
                              ? cmd.result.slice(0, 40)
                              : JSON.stringify(cmd.result).slice(0, 40)}
                            ...
                          </code>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {cmd.status === 'failed' && (
                            <button
                              onClick={() => handleRetry(cmd.id)}
                              className="px-3 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold hover:bg-amber-200 transition-colors"
                            >
                              Retry
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(cmd.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-3 h-3 inline mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Queue Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            ℹ️ About Command Queue
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Commands are automatically retried 3 times on failure</li>
            <li>Completed commands are kept for 7 days for auditing</li>
            <li>Queue is processed FIFO by default (unless marked urgent)</li>
            <li>Refresh interval: 5 seconds (auto-updates)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommandQueuePage;
