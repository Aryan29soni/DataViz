// src/components/Layout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import UserMenu from './UserMenu';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  const noUserMenuPaths = ['/', '/signup', '/forgot-password'];

  return (
    <div className="layout">
      {!noUserMenuPaths.includes(location.pathname) && <UserMenu />}
      <Outlet />
    </div>
  );
};

export default Layout;