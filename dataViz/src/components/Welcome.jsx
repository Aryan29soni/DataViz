// src/components/Welcome.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import './welcome.css';
import Slideshow from './Slideshow';
import { useAuth } from '../AuthContext';
import { FaTimes, FaGoogle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const slideDescriptions = [
  {
    title: "Welcome to Dataviz",
    text: "Dataviz helps you visualize complex data with ease. Create, share, and explore interactive data visualizations that provide insights and drive decisions."
  },
  {
    title: "AI-Powered Insights",
    text: "Our AI algorithms analyze your data and provide powerful insights that help you make informed decisions quickly and accurately."
  },
  {
    title: "Automated Reports",
    text: "Generate detailed and visually appealing reports automatically. Save time and focus on analyzing the results rather than compiling data."
  },
  {
    title: "Collaborative Platform",
    text: "Work together with your team in real-time. Share visualizations, comment on insights, and make collaborative decisions effortlessly."
  },
  {
    title: "Customizable Dashboards",
    text: "Create dashboards that suit your specific needs. Add widgets, adjust layouts, and get a personalized view of your key metrics."
  },
  {
    title: "Seamless Integration",
    text: "Easily integrate Dataviz with your existing tools and data sources. Our platform supports a wide range of integrations for a seamless workflow."
  },
];

const Welcome = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { signupMessage, setSignupMessage } = useAuth();
  const [showPopup, setShowPopup] = useState(false);

  const isButtonEnabled = email.length > 0 && password.length > 0;

  useEffect(() => {
    if (signupMessage) {
      setShowPopup(true);
    }
  }, [signupMessage]);

  const closePopup = () => {
    setShowPopup(false);
    setSignupMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isButtonEnabled) {
      try {
        console.log('Attempting login...');
        const response = await axios.post('/auth/login', { email, password });
        console.log('Login response:', response);
        if (response.data.access_token) {
          console.log('Token received, storing in localStorage');
          localStorage.setItem('token', response.data.access_token);
          console.log('Navigating to /home');
          toast.success(`Welcome back! You've logged in successfully at ${new Date().toLocaleTimeString()}.`);
          navigate('/home');
        } else {
          console.log('No access token in response');
          setError('Login failed. Please try again.');
        }
      } catch (error) {
        console.error('Login error:', error);
        if (error.response) {
          console.error('Error response:', error.response);
          setError(error.response.data.message || 'An error occurred during login.');
        } else if (error.request) {
          console.error('Error request:', error.request);
          setError('No response received from server.');
        } else {
          console.error('Error message:', error.message);
          setError('An error occurred during login. Please try again.');
        }
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div className="welcome-container">
      <div className="welcome-header">
        <h1 className="header-title">dataviz</h1>
        <div className="header-menu">
          <Link to="/about">About Dataviz</Link>
          <Link to="/source">Source</Link>
          <Link to="/tutorial">Tutorial</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
      </div>
      <Slideshow onSlideChange={setCurrentSlide} />
      <div className="description">
        <h2>{slideDescriptions[currentSlide].title}</h2>
        <p>{slideDescriptions[currentSlide].text}</p>
        <Link className='get-started-link' to="/signup">Get started ➡️</Link>
      </div>
      <div className="signup-box">
        <h2>Log in to your account</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="welcome-form" onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="password">Password</label>
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={!isButtonEnabled}
          >
            Log In
          </button>
          <button type="button" onClick={handleGoogleLogin} className="google-login-button">
            <FaGoogle /> Login with Google
          </button>
          <div className="links">
            <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
            <p className="signin-text">
              Don't have an account? <Link to="/signup" className="signin-link">Sign up here</Link>
            </p>
          </div>
        </form>
      </div>
      {showPopup && (
        <>
          <div className="overlay" onClick={closePopup}></div>
          <div className="popup">
            <button className="close-popup" onClick={closePopup}>
              <FaTimes />
            </button>
            <p>{signupMessage}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Welcome;