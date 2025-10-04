/**
 * @file OversightHub.jsx
 * @description This file contains the main React component for the Oversight Hub,
 * a real-time dashboard for monitoring AI agent tasks. It uses Firebase Firestore
 * for data synchronization and Tailwind CSS for styling.
 *
 * @requires react
 * @requires firebase/firestore
 * @requires ./firebaseConfig - The Firebase configuration initialized for the app.
 *
 * @suggestion FUTURE_ENHANCEMENT: Implement a more robust state management solution
 * like Redux Toolkit or Zustand if the application complexity grows. This will help
 * manage global state (like notifications or user authentication) more predictably.
 *
 * @suggestion FUTURE_ENHANCEMENT: Introduce component-level testing using a library
 * like React Testing Library to ensure UI components render and behave as expected.
 * This is crucial for maintaining a stable application as new features are added.
 *
 * @suggestion FUTURE_ENHANCEMENT: Add user authentication (e.g., via Firebase Auth)
 * to secure the dashboard and potentially introduce user-specific views or controls.
 */

import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

/**
 * The main application component.
 * It fetches and displays real-time task data from Firestore.
 * @returns {JSX.Element} The rendered application UI.
 */
const OversightHub = () => {
  /**
   * @state {Array<Object>} tasks - Stores the list of agent tasks fetched from Firestore.
   * @state {boolean} loading - Indicates whether the initial data fetch is in progress.
   * @state {string|null} error - Stores any error message that occurs during data fetching.
   */
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * @effect
   * Sets up a real-time listener to the 'agent_runs' collection in Firestore.
   * It orders the tasks by their update time in descending order.
   * The component unsubscribes from the listener on cleanup.
   *
   * @suggestion FUTURE_ENHANCEMENT: Implement pagination for the Firestore query.
   * As the number of agent runs grows, fetching all documents at once will become
   * inefficient. Use `limit()` and `startAfter()` to load data in chunks.
   */
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

/**
 * @module NotificationSystem
 * A simple, global state management system for notifications.
 * It uses a Set of listener functions to broadcast notification events.
 * This avoids the need for prop-drilling or a complex state library for this specific feature.
 *
 * @param {string} message - The notification message to display.
 * @param {'success'|'error'} [type='success'] - The type of notification, which affects its styling.
 */
const listeners = new Set();
const notify = (message, type = 'success') => {
  const notification = { id: Date.now(), message, type };
  listeners.forEach(listener => listener(notification));
};

/**
 * A container component that listens for and displays notifications.
 * @returns {JSX.Element} A fixed-position container for notification elements.
 */
const NotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);

  /**
   * @effect
   * Subscribes to the global notification system. When a notification is received,
   * it's added to the state and automatically removed after a timeout.
   */
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

/**
 * A presentational component for a single notification.
 * @param {Object} props
 * @param {string} props.message - The message to display.
 * @param {'success'|'error'} props.type - The notification type for styling.
 * @returns {JSX.Element} The styled notification alert.
 */
const Notification = ({ message, type }) => {
  const baseClasses = "px-6 py-4 rounded-lg shadow-xl text-white";
  const typeClasses = {
    success: "bg-green-600/80 backdrop-blur-sm border border-green-500/50",
    error: "bg-red-600/80 backdrop-blur-sm border border-red-500/50",
  };
  return <div className={`${baseClasses} ${typeClasses[type]}`}>{message}</div>;
};


// --- Sub-components for a cleaner structure ---

/**
 * The header component for the application.
 * Displays the title and a subtitle.
 *
 * @suggestion FUTURE_ENHANCEMENT: Add a status indicator to the header,
 * showing the connection status to Firestore (e.g., a green dot for 'connected',
 * red for 'error'). This provides immediate feedback to the user.
 *
 * @suggestion FUTURE_ENHANCEMENT: Consider adding a global "Run New Agent" button
 * here that could trigger a cloud function or a Pub/Sub message to start a new
 * agent process. This would make the hub more interactive.
 * @returns {JSX.Element} The rendered header.
 */
const Header = () => (
  <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
    <div className="container mx-auto p-4 flex justify-between items-center border-b border-cyan-400/20">
      <div>
        <h1 className="text-3xl font-bold text-cyan-400">Oversight Hub</h1>
        <p className="text-sm text-gray-400">Real-Time Agent Monitoring</p>
      </div>
      {/* 
        The global run button was removed for clarity. It can be re-added here
        if a global action is needed. For example:
        <button 
          onClick={() => notify('New agent run triggered!', 'success')}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Trigger New Run
        </button>
      */}
    </div>
  </header>
);

/**
 * Displays the list of tasks or a loading/empty state message.
 * @param {Object} props
 * @param {Array<Object>} props.tasks - The list of tasks to display.
 * @param {boolean} props.loading - Whether the data is currently loading.
 * @returns {JSX.Element} The rendered list or a status message.
 */
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

/**
 * A card component that displays individual task details and provides a "Re-run" action.
 *
 * @param {Object} props
 * @param {Object} props.task - The task data object from Firestore.
 * @returns {JSX.Element} The rendered task card.
 *
 * @suggestion FUTURE_ENHANCEMENT: Clicking on a card could open a modal or a separate
 * page with more detailed information about the task, including full logs, generated
 * content, and performance metrics. This would make debugging and analysis easier.
 *
 * @suggestion SECURITY_NOTE: The `intervene` cloud function URL is hardcoded.
 * This should be moved to an environment variable (e.g., using `.env` files and
 * `process.env.REACT_APP_INTERVENE_URL`) to avoid committing sensitive URLs
 * directly into the source code.
 */
const TaskCard = ({ task }) => {
  /**
   * @state {boolean} isLoading - Tracks the loading state for the re-run action to prevent multiple clicks.
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles the re-run button click.
   * It sends a POST request to a cloud function to trigger a new agent run
   * for the specific task ID.
   */
  const handleRerun = async () => {
    setIsLoading(true);
    try {
      // The URL for the cloud function that can trigger agent runs.
      const response = await fetch('https://us-central1-gen-lang-client-0031944915.cloudfunctions.net/intervene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The payload specifies the command and the target row for the agent.
        body: JSON.stringify({ command: 'RUN_JOB', sheet_row_index: parseInt(task.id.split('_')[1]) })
      });
      if (!response.ok) {
        // Provide more specific error feedback if possible.
        const errorBody = await response.text();
        throw new Error(`Network response was not ok. Status: ${response.status}. Body: ${errorBody}`);
      }
      notify(`Re-run command sent for task: ${task.topic || task.id}`);
    } catch (error) {
      console.error('Failed to send command:', error);
      notify(`Error: Could not send command. ${error.message}`, 'error');
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

/**
 * A badge component for displaying the task's current status with appropriate colors.
 * @param {Object} props
 * @param {string} props.status - The status string (e.g., "processing", "published to strapi").
 * @returns {JSX.Element} The rendered status badge.
 *
 * @suggestion FUTURE_ENHANCEMENT: The status strings are hardcoded. It would be more
 * robust to define these statuses as constants in a separate file (e.g., `src/constants.js`)
 * and import them here and in the agent code. This prevents typos and makes updates easier.
 */
const StatusBadge = ({ status }) => {
  const baseClasses = "px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap";
  // Normalize status to lower case to make matching case-insensitive.
  const currentStatus = status ? status.toLowerCase() : 'unknown';
  
  // Maps status strings to Tailwind CSS classes for styling.
  const statusStyles = {
    processing: "bg-yellow-500/20 text-yellow-300",
    "published to strapi": "bg-green-500/20 text-green-300",
    error: "bg-red-500/20 text-red-300",
    default: "bg-gray-600/20 text-gray-300"
  };

  const style = statusStyles[currentStatus] || statusStyles.default;

  return <span className={`${baseClasses} ${style}`}>{status || 'Unknown'}</span>;
};

/**
 * A component to display a prominent error message, typically for connection failures.
 * @param {Object} props
 * @param {string} props.message - The error message to display.
 * @returns {JSX.Element} The rendered error message container.
 */
const ErrorMessage = ({ message }) => (
  <div className="bg-red-800/50 border border-red-500 text-red-200 p-4 rounded-lg mb-8">
    <p className="font-bold">Connection Error</p>
    <p>{message}</p>
  </div>
);

/**
 * A utility function to format a Firestore timestamp into a more readable, localized string.
 * @param {Object} timestamp - The Firestore timestamp object (or any object with a `toDate` method).
 * @returns {string} The formatted date and time string, or 'N/A' if the timestamp is invalid.
 */
const formatTimestamp = (timestamp) => {
  // Firestore timestamps are objects; check for the toDate method for safe conversion.
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toLocaleString();
  }
  // Return a fallback string for invalid or missing timestamps.
  return 'N/A';
};

export default OversightHub;