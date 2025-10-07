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
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { db } from './firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import Sidebar from './components/Sidebar';
import DataPane from './components/DataPane';
import CommandPane from './components/CommandPane';
import './OversightHub.css';

// --- Helper Functions ---
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp.seconds * 1000).toLocaleString();
};

const ErrorMessage = ({ message }) => (
  <div className="error-message">
    <p>⚠️ {message}</p>
  </div>
);

// --- Main Component ---
const OversightHub = () => {
  const [tasks, setTasks] = useState([]);
  const [runs, setRuns] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // --- Data Fetching ---
  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'content-tasks'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
        setLoading(false);
      },
      (err) => {
        setError(
          'Failed to fetch tasks. Please check Firestore connection and permissions.'
        );
        setLoading(false);
        console.error(err);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedTask) {
      const runsQuery = query(
        collection(db, `content-tasks/${selectedTask.id}/runs`),
        orderBy('startTime', 'desc')
      );
      const unsubscribe = onSnapshot(runsQuery, (querySnapshot) => {
        const runsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRuns((prevRuns) => ({ ...prevRuns, [selectedTask.id]: runsData }));
      });
      return () => unsubscribe();
    }
  }, [selectedTask]);

  // --- UI Handlers ---
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleIntervene = async (command) => {
    const functionUrl = process.env.REACT_APP_INTERVENE_FUNCTION_URL;
    if (!functionUrl) {
      alert('Intervention Function URL is not configured.');
      return;
    }
    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command,
          reason: `Manual intervention: ${command}`,
        }),
      });
      if (!response.ok) throw new Error(`Failed to send ${command} signal.`);
      alert(`${command} signal sent successfully.`);
    } catch (err) {
      console.error(`${command} failed:`, err);
      alert(`Failed to send ${command} signal.`);
    }
  };

  // --- Render Methods ---
  const renderStatus = (status) => (
    <span
      className={`status-badge status-${status
        ?.toLowerCase()
        .replace(' ', '-')}`}
    >
      {status || 'Unknown'}
    </span>
  );

  return (
    <Router>
      <div className="oversight-hub-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DataPane />} />
          </Routes>
          <CommandPane />
        </main>
      </div>
    </Router>
  );
};

// --- Sub-components ---
const TaskList = ({ tasks, onTaskClick, renderStatus }) => (
  <div className="task-list">
    <h2>Content Task Queue</h2>
    <table>
      <thead>
        <tr>
          <th>Topic</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Primary Keyword</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id} onClick={() => onTaskClick(task)}>
            <td>{task.topic}</td>
            <td>{renderStatus(task.status)}</td>
            <td>{formatTimestamp(task.createdAt)}</td>
            <td>{task.primary_keyword}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TaskDetailModal = ({ task, runs, onClose, renderStatus }) => (
  <div className="modal-backdrop" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>
      <h2>Task Details: {task.topic}</h2>
      <div className="task-details">
        <p>
          <strong>Status:</strong> {renderStatus(task.status)}
        </p>
        <p>
          <strong>ID:</strong> {task.id}
        </p>
        <p>
          <strong>Category:</strong> {task.category}
        </p>
        <p>
          <strong>Target Audience:</strong> {task.target_audience}
        </p>
        {task.publishedUrl && (
          <p>
            <strong>Published URL:</strong>{' '}
            <a
              href={task.publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {task.publishedUrl}
            </a>
          </p>
        )}
        {task.error && <ErrorMessage message={task.error} />}
      </div>
      <RunHistory runs={runs} />
    </div>
  </div>
);

const RunHistory = ({ runs }) => (
  <div className="run-history">
    <h3>Run History</h3>
    {runs.length === 0 ? (
      <p>No runs found for this task.</p>
    ) : (
      <ul>
        {runs.map((run) => (
          <li key={run.id}>
            <strong>{formatTimestamp(run.startTime)}:</strong> {run.status}
            {run.error && <p className="run-error">Error: {run.error}</p>}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default OversightHub;
