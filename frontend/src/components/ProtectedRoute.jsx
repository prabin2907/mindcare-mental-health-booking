import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if admin is logged in
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }
  
  // Render the protected component
  return children;
};

export default ProtectedRoute;