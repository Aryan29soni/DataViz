// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaFileAlt, FaDatabase, FaLifeRing, FaBell, FaUser, FaArrowsAltV } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    { id: 1, icon: <FaPlus />, label: 'New', path: '/home/new' },
    { id: 2, icon: <FaFileAlt />, label: 'Reports', path: '/home/reports' },
    { id: 3, icon: <FaDatabase />, label: 'Databases', path: '/home/databases' },
    { id: 4, icon: <FaLifeRing />, label: 'Help & Support', path: '/home/help-and-support' },
    { id: 5, icon: <FaBell />, label: 'Notifications', path: '/home/notifications' },
    { id: 6, icon: <FaUser />, label: 'User Profile', path: '/home/user-profile' },
  ]);
  const [isEditing, setIsEditing] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('itemIndex', index);
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
  );
};

export default Sidebar;
