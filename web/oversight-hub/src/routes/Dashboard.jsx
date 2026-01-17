/**
 * Dashboard.jsx
 *
 * Main dashboard - displays task management interface
 * Now wrapped by LayoutWrapper which provides:
 * - Navigation header and menu
 * - Chat panel at bottom
 */

import React from 'react';
import TaskManagement from './TaskManagement';

const Dashboard = () => {
  return <TaskManagement />;
};

export default Dashboard;
