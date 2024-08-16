import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { FaBell, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); 
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/notifications');
      console.log('Fetched notifications:', response.data);
      setNotifications(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to fetch notifications. Please try again.');
      toast.error('Error fetching notifications');
    } finally {
      setLoading(false);
    }
  };



  const markAsRead = async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FaCheckCircle className="icon success" />;
      case 'warning': return <FaExclamationTriangle className="icon warning" />;
      case 'info': return <FaInfoCircle className="icon info" />;
      default: return <FaBell className="icon" />;
    }
  };


  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="notifications">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications at the moment.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map(notification => (
            <li key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
              {getIcon(notification.type)}
              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <span className="notification-time">{new Date(notification.createdAt).toLocaleString()}</span>
              </div>
              <div className="notification-actions">
                {!notification.read && (
                  <button onClick={() => markAsRead(notification.id)} className="mark-read-btn">
                    <FaCheckCircle /> Mark as Read
                    </button>
                )}
                <button onClick={() => deleteNotification(notification.id)} className="delete-btn">
                  <FaTimes /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;