import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// Placeholder for a real Pub/Sub client library
const pubsub = {
  topic: (name) => ({
    publishMessage: async ({ json }) => {
      console.log(`Publishing to Pub/Sub topic: ${name}`, json);
      alert('Intervention signal sent to the Content Agent network.');
      return 'message-id-123';
    },
  }),
};


const OversightHub = () => {
  const [tasks, setTasks] = useState([]);
  const [financials, setFinancials] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState({ tasks: true, financials: true, metrics: true });
  const [error, setError] = useState(null);

  // Hook for real-time Firestore data
  const useFirestoreCollection = (collectionName, setData) => {
    useEffect(() => {
      try {
        const q = query(collection(db, collectionName), orderBy('updatedAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setData(items);
          setLoading(prev => ({ ...prev, [collectionName]: false }));
        }, (err) => {
          console.error(`Error listening to ${collectionName}:`, err);
          setError(`Failed to load ${collectionName}. Please check console for details.`);
          setLoading(prev => ({ ...prev, [collectionName]: false }));
        });

        return () => unsubscribe();
      } catch (err) {
        console.error("Firestore query error:", err);
        setError("An error occurred while setting up the data listener.");
      }
    }, [collectionName, setData]);
  };

  useFirestoreCollection('tasks', setTasks);
  useFirestoreCollection('financials', setFinancials);
  useFirestoreCollection('content_metrics', setMetrics);

  // Function to handle the INTERVENE button click
  const handleIntervene = async () => {
    try {
      const topic = pubsub.topic('agent-interventions');
      await topic.publishMessage({
        json: {
          timestamp: new Date().toISOString(),
          source: 'OversightHub',
          action: 'PAUSE_ALL_AGENTS',
          reason: 'Manual intervention triggered by operator.',
        },
      });
    } catch (error) {
      console.error('Failed to send intervention signal:', error);
      alert('Error: Could not send intervention signal.');
    }
  };

  const renderStatus = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    // Defensive check: if status is missing, default to 'unknown'
    const currentStatus = status ? status.toLowerCase() : 'unknown';
    switch (currentStatus) {
      case 'completed':
        return <span className={`${baseClasses} bg-green-500 text-green-900`}>Completed</span>;
      case 'in_progress':
        return <span className={`${baseClasses} bg-yellow-500 text-yellow-900`}>In Progress</span>;
      case 'queued':
        return <span className={`${baseClasses} bg-blue-500 text-blue-900`}>Queued</span>;
      case 'failed':
        return <span className={`${baseClasses} bg-red-500 text-red-900`}>Failed</span>;
      default:
        return <span className={`${baseClasses} bg-gray-600 text-gray-200`}>{status || 'Unknown'}</span>;
    }
  };

  const formatTimestamp = (timestamp) => {
    // Defensive check: ensure timestamp and toDate method exist
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleString();
    }
    return 'N/A';
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8 font-sans">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">Oversight Hub</h1>
        <button
          onClick={handleIntervene}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          // INTERVENE
        </button>
      </header>

      {error && <div className="bg-red-800 text-white p-4 rounded-lg mb-8">{error}</div>}

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Tasks */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Active Tasks</h2>
          {loading.tasks ? <p>Loading tasks...</p> : (
            <ul>
              {tasks.length > 0 ? tasks.map(task => (
                <li key={task.id} className="p-3 mb-2 bg-gray-700 rounded-md border-l-4 border-cyan-500">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{task.taskName}</span>
                    {renderStatus(task.status)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Last Updated: {formatTimestamp(task.updatedAt)}
                  </div>
                </li>
              )) : <p>No active tasks.</p>}
            </ul>
          )}
        </div>

        {/* Column 2: Financials */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Financials</h2>
          {loading.financials ? <p>Loading financials...</p> : (
            <ul>
              {financials.length > 0 ? financials.map(fin => (
                <li key={fin.id} className="p-2 border-b border-gray-700">{fin.metric}: <span className="text-green-400">{fin.value}</span></li>
              )) : <p>No financial data available.</p>}
            </ul>
          )}
        </div>

        {/* Column 3: Metrics */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Content Metrics</h2>
          {loading.metrics ? <p>Loading metrics...</p> : (
            <ul>
              {metrics.length > 0 ? metrics.map(metric => (
                <li key={metric.id} className="p-2 border-b border-gray-700">{metric.name}: <span className="text-blue-400">{metric.value}</span></li>
              )) : <p>No content metrics available.</p>}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default OversightHub;