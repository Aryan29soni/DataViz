import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);

  const handleSectionClick = (section) => {
    setActiveSection(section);
    if (section === 'upload') {
      console.log('Navigating to upload page');
      navigate('/home/upload');
    }
  };

  return (
    <div className="home-container">
      <div className="dashboard-heading-box">
        <h1 className="dashboard-heading">Welcome to Your Dashboard</h1>
        <FaUser className="user-profile-icon" onClick={() => navigate('/home/user-profile')} />
      </div>
      <div className="sections-container">
        <div
          className={`section reports ${activeSection === 'reports' ? 'active' : ''}`}
          onClick={() => handleSectionClick('reports')}
        >
          <div className="section-heading">Reports</div>
          {activeSection === 'reports' && (
            <div className="menu">
              <div className="menu-item">Edit</div>
              <div className="menu-item" onClick={() => handleSectionClick('upload')}>Upload</div>
              <div className="menu-item" onClick={() => navigate('/home/reports')}>View</div>
            </div>
          )}
        </div>
        <div
          className={`section databases ${activeSection === 'databases' ? 'active' : ''}`}
          onClick={() => handleSectionClick('databases')}
        >
          <div className="section-heading">Databases</div>
          {activeSection === 'databases' && (
            <div className="menu">
              <div className="menu-item">Edit</div>
              <div className="menu-item" onClick={() => handleSectionClick('upload')}>Upload</div>
              <div className="menu-item" onClick={() => navigate('/home/databases')}>View</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;