import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// --- Main Component ---
const OversightHub = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "agent_runs"), orderBy('updatedAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const taskData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(taskData);
      setLoading(false);
    }, (err) => {
      console.error("Error listening to Firestore:", err);
      setError("Failed to connect to the data stream. Check Firestore security rules and console for details.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {error && <ErrorMessage message={error} />}
        <TaskList tasks={tasks} loading={loading} />
      </main>
      <NotificationContainer />
    </div>
  );
};

// --- State Management for Notifications ---
// This is a simple, global state management for notifications
const listeners = new Set();
const notify = (message, type = 'success') => {
  const notification = { id: Date.now(), message, type };
  listeners.forEach(listener => listener(notification));
};

const NotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const listener = (notification) => {
      setNotifications(prev => [...prev, notification]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000); // Auto-dismiss after 5 seconds
    };
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-3">
      {notifications.map(n => <Notification key={n.id} {...n} />)}
    </div>
  );
};

const Notification = ({ message, type }) => {
  const baseClasses = "px-6 py-4 rounded-lg shadow-xl text-white";
  const typeClasses = {
    success: "bg-green-600/80 backdrop-blur-sm border border-green-500/50",
    error: "bg-red-600/80 backdrop-blur-sm border border-red-500/50",
  };
  return <div className={`${baseClasses} ${typeClasses[type]}`}>{message}</div>;
};


// --- Sub-components for a cleaner structure ---

const Header = () => (
  <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
    <div className="container mx-auto p-4 flex justify-between items-center border-b border-cyan-400/20">
      <div>
        <h1 className="text-3xl font-bold text-cyan-400">Oversight Hub</h1>
        <p className="text-sm text-gray-400">Real-Time Agent Monitoring</p>
      </div>
      {/* The global run button can be removed or repurposed later */}
    </div>
  </header>
);

const TaskList = ({ tasks, loading }) => {
  if (loading) {
    return <div className="text-center py-12 text-gray-500">Initializing data stream...</div>;
  }
  if (tasks.length === 0) {
    return <div className="text-center py-12 text-gray-500">No agent activity detected. Awaiting first run.</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {tasks.map(task => <TaskCard key={task.id} task={task} />)}
    </div>
  );
};

const TaskCard = ({ task }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRerun = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://us-central1-gen-lang-client-0031944915.cloudfunctions.net/intervene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'RUN_JOB', sheet_row_index: parseInt(task.id.split('_')[1]) })
      });
      if (!response.ok) throw new Error('Network response was not ok');
      notify(`Re-run command sent for task: ${task.topic || task.id}`);
    } catch (error) {
      console.error('Failed to send command:', error);
      notify('Error: Could not send command to the agent.', 'error');
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-5 border border-gray-700 hover:border-cyan-400/50 transition-colors duration-300 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold text-gray-100 break-words pr-4">{task.topic || 'Untitled Task'}</h2>
          <StatusBadge status={task.status} />
        </div>
        <p className="text-xs text-gray-500 mt-2 font-mono">ID: {task.id}</p>
      </div>
      <div className="mt-4 border-t border-gray-700 pt-4 flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Last Update: <span className="font-mono text-gray-300">{formatTimestamp(task.updatedAt)}</span>
        </p>
        <button 
          onClick={handleRerun}
          disabled={isLoading}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-1 px-3 rounded-lg text-sm shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '...' : 'Re-run'}
        </button>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const baseClasses = "px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap";
  const currentStatus = status ? status.toLowerCase() : 'unknown';
  
  const statusStyles = {
    processing: "bg-yellow-500/20 text-yellow-300",
    "published to strapi": "bg-green-500/20 text-green-300",
    error: "bg-red-500/20 text-red-300",
    default: "bg-gray-600/20 text-gray-300"
  };

  const style = statusStyles[currentStatus] || statusStyles.default;

  return <span className={`${baseClasses} ${style}`}>{status || 'Unknown'}</span>;
};

const ErrorMessage = ({ message }) => (
  <div className="bg-red-800/50 border border-red-500 text-red-200 p-4 rounded-lg mb-8">
    <p className="font-bold">Connection Error</p>
    <p>{message}</p>
  </div>
);

// --- Helper Functions ---
const formatTimestamp = (timestamp) => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toLocaleString();
  }
  return 'N/A';
};

export default OversightHub;