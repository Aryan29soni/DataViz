// src/components/UserMenu.jsx
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './UserMenu.css';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/home/user-profile');
  };

  return (
    <div className="user-menu-container">
      <FaUser className="user-icon" onClick={() => setIsOpen(!isOpen)} />
      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={handleProfile}>Profile</button>
          <button onClick={handleLogout}>Log out</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;