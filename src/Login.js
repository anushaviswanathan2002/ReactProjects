import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './Auth.css';

export const Login = ({ onSwitchToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setIsLoading(true);

    if (!username || !password) {
      setLocalError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = await login(username, password);
    if (!result.success) {
      setLocalError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">🧠 Memory Game</h1>
        <h2>Login</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          {localError && <div className="error-message">{localError}</div>}

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account?{' '}
          <button 
            type="button"
            onClick={onSwitchToSignup}
            className="switch-button"
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};
