import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  const location = useLocation();
  
  console.log('PrivateRoute - Current path:', location.pathname);
  console.log('PrivateRoute - Is authenticated:', isAuthenticated);
  
  if (!isAuthenticated) {

    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;