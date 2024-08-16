import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {

      localStorage.setItem('token', token);

      navigate('/home');
    } else {

      navigate('/');
    }
  }, [navigate, location]);

  return <div>Authenticating...</div>;
};

export default AuthCallback;