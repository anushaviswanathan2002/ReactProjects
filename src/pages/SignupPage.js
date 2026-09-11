import React, { useState } from 'react';
import { validateEmail, validatePassword } from '../utils/validation';
import '../styles/AuthPages.css';

function SignupPage({ onSignup, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate inputs
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.some(u => u.email === email)) {
        setError('Email already registered');
        setLoading(false);
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.toLowerCase(),
        password, // In production, this would be hashed on backend
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      const { password: pwd, ...userWithoutPassword } = newUser;
      onSignup(userWithoutPassword);
    }, 500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Memory App</h1>
        <h2>Sign Up</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
            <small>At least 6 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account?</p>
          <button 
            type="button"
            className="link-btn"
            onClick={onSwitchToLogin}
            disabled={loading}
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
