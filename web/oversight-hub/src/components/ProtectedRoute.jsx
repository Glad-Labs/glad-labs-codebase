/**
 * ProtectedRoute Component
 * Wrapper component that ensures user is authenticated before accessing routes
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * ProtectedRoute - Only renders children if user is authenticated
 * @param {object} props - Component props
 * @param {ReactNode} props.children - Component to render if authenticated
 * @param {string} props.requiredRole - Optional: required user role (admin, editor, viewer)
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          color: '#666',
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          color: '#e74c3c',
        }}
      >
        <div>Access Denied: Insufficient Permissions</div>
      </div>
    );
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
