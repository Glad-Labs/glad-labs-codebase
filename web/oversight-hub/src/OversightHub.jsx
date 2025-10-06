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

import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import TaskQueue from "./components/tasks/TaskQueue"; // Import the new TaskQueue component

/**
 * The main application component.
 * It fetches and displays real-time task data from Firestore.
 * @returns {JSX.Element} The rendered application UI.
 */
const OversightHub = () => {
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <TaskQueue />
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
const notify = (message, type = "success") => {
  const notification = { id: Date.now(), message, type };
  listeners.forEach((listener) => listener(notification));
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
      setNotifications((prev) => [...prev, notification]);
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
      }, 5000); // Auto-dismiss after 5 seconds
    };
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-3">
      {notifications.map((n) => (
        <Notification key={n.id} {...n} />
      ))}
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
  if (timestamp && typeof timestamp.toDate === "function") {
    return timestamp.toDate().toLocaleString();
  }
  // Return a fallback string for invalid or missing timestamps.
  return "N/A";
};

export default OversightHub;
