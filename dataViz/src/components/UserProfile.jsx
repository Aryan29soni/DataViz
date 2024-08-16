import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import defaultUserImage from '/public/images/user.webp' ; 
import './UserProfile.css';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
    filesCount: 0,
    organization: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('/auth/user-info');
      setUserInfo(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user info:', error);
      setIsLoading(false);
    }
  };

  const handleOrganizationChange = async (e) => {
    const newOrganization = e.target.value;
    setUserInfo({ ...userInfo, organization: newOrganization });
    try {
      await axios.put('/auth/update-organization', { organization: newOrganization });
    } catch (error) {
      console.error('Error updating organization:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div className="profile-content">
        <div className="profile-picture">
          <img src={defaultUserImage} alt="Default user" />
        </div>
        <div className="user-info">
          <div className="info-item">
            <label>Primary Email:</label>
            <span>{userInfo.email}</span>
          </div>
          <div className="info-item">
            <label>Password:</label>
            <span>{showPassword ? userInfo.password : '••••••••'}</span>
            <button 
              className="show-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="info-item">
            <label>Number of Files:</label>
            <span>{userInfo.filesCount}</span>
          </div>
          <div className="info-item">
            <label>Organization:</label>
            <input
              type="text"
              value={userInfo.organization}
              onChange={handleOrganizationChange}
              placeholder="Enter your organization"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;