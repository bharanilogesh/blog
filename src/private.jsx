import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth.jsx';

function PrivateRoute({ element, ...props }) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <Route {...props} element={element} />
  ) : (
    <Navigate to="/login" />
  );
}

export default PrivateRoute;
