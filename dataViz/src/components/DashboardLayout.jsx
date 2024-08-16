// src/components/DashboardLayout.jsx
import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import './DashboardLayout.css'
import { FaPlus, FaFileAlt, FaDatabase, FaLifeRing, FaBell, FaUser, FaArrowsAltV,FaHome,FaComment,FaCommentDots } from 'react-icons/fa';
import UserMenu from './UserMenu';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    {id:1,icon:<FaHome/>,label:'Home',path:'/home'},
    { id: 2, icon: <FaCommentDots />, label: 'ChatBot', path: '/home/chatbot' },
    { id: 3, icon: <FaFileAlt />, label: 'Reports', path: '/home/reports' },
    { id: 4, icon: <FaDatabase />, label: 'Databases', path: '/home/databases' },
    { id: 5, icon: <FaLifeRing />, label: 'Help & Support', path: '/home/help-and-support' },
    { id: 6, icon: <FaBell />, label: 'Notifications', path: '/home/notifications' },
    { id: 7, icon: <FaUser />, label: 'User Profile', path: '/home/user-profile' },
  
  
  ]);
  const [isEditing, setIsEditing] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleDragStart = (e, index) => {
    if (isEditing) e.dataTransfer.setData('itemIndex', index);
  };

  const handleDrop = (e, dropIndex) => {
    const dragIndex = e.dataTransfer.getData('itemIndex');
    const draggedItem = items[dragIndex];
    const remainingItems = items.filter((_, index) => index !== parseInt(dragIndex, 10));
    const updatedItems = [
      ...remainingItems.slice(0, dropIndex),
      draggedItem,
      ...remainingItems.slice(dropIndex),
    ];
    setItems(updatedItems);
  };

  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        {items.map((item, index) => (
          <button
            key={item.id}
            className={`sidebar-item ${item.label === 'Notifications' ? 'bell' : ''}`}
            onClick={() => handleNavigation(item.path)}
            draggable={isEditing}
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="sidebar-icon">{item.icon}</div>
            {item.label}
          </button>
        ))}
        <button className="sidebar-item reorder-button" onClick={() => setIsEditing(!isEditing)}>
          <FaArrowsAltV className="sidebar-icon" />
          Reorder
        </button>
      </div>
      <div className="main-content">
      {location.pathname !== '/home' && (
          <div className="top-bar">
            <UserMenu />
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
};


export default DashboardLayout;