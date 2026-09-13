import React, { useState } from 'react';
import { authService } from '../services/authService';

function LoginPage({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (!email || !password) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      const result = authService.login(email, password);

      if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.error);
      }

      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>📝 Memory App</h1>
        <p>Your personal todo and memory assistant</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
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
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="auth-button"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="switch-auth">
        Don't have an account?
        <button type="button" onClick={onSwitchToSignup}>
          Sign up
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
