import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slideshow from './Slideshow';
import './Login.css';
import { useAuth } from '../AuthContext';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setSignupMessage } = useAuth();

  const isButtonEnabled = email.length > 0 && password.length > 0;

  const handleSignup = async (e) => {
    e.preventDefault();
    if (isButtonEnabled) {
      try {
        const response = await axios.post('http://localhost:3000/users/signup', { email, password });
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setSignupMessage('You have been signed up successfully. Use your email and password to log in.');
          navigate('/');
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('An error occurred during signup. Please try again.');
        }
      }
    }
  };

  const onSlideChange = (currentIndex) => {
    console.log('Slide changed to:', currentIndex);
    
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sign up for a new account</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="login-form" onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`login-button ${isButtonEnabled ? 'enabled' : 'disabled'}`}
            disabled={!isButtonEnabled}
          >
            ➡️
          </button>
          </form>
        <div className="links">
          <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
          <p className="signup-text">
            Already have an account? <Link to="/" className="signup-link">Log in here</Link>
          </p>
        </div>
      </div>
      <div className="slideshow-container">
        <Slideshow onSlideChange={onSlideChange} />
      </div>
    </div>
  );
};



export default Login;
