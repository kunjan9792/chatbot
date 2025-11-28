import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Username and password required');
      return;
    }
    try {
      let res;
      if (isSignup) {
        res = await axios.post(`${API_URL}/api/auth/signup`, { username, password, avatar });
      } else {
        res = await axios.post(`${API_URL}/api/auth/login`, { username, password });
      }
      // Store JWT and user
      localStorage.setItem('chatapp_token', res.data.token);
      onLogin({ ...res.data.user, token: res.data.token });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to authenticate');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="card-header">
          <i className="fas fa-user-circle"></i>
          <h2>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
          <p>{isSignup ? 'Sign up to get started' : 'Login to continue'}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <i className="fas fa-user"></i>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-lock"></i>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {isSignup && (
            <div className="form-group">
              <label>
                <i className="fas fa-image"></i>
                Avatar URL
              </label>
              <input
                type="text"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
                placeholder="Enter avatar URL (optional)"
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn">
            {isSignup ? 'Create Account' : 'Login'}
          </button>

          <div className="form-links">
            {!isSignup && (
              <Link to="/forgot-password" className="forgot-password-link">
                <i className="fas fa-key"></i> Forgot Password?
              </Link>
            )}
          </div>

          <div className="toggle-form">
            <p>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                className="toggle-btn"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? 'Login' : 'Sign Up'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
