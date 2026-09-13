import React, { useState, useEffect } from 'react';
import './App.css';
import AuthContext from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'signup', 'dashboard'

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    if (token && userId && username) {
      setAuth({ token, userId, username });
      setCurrentPage('dashboard');
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, userId, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    setAuth({ token, userId, username });
    setCurrentPage('dashboard');
  };

  const handleSignup = (token, userId, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    setAuth({ token, userId, username });
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setAuth(null);
    setCurrentPage('login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ auth, handleLogout }}>
      <div className="App">
        {auth ? (
          <Dashboard username={auth.username} token={auth.token} onLogout={handleLogout} />
        ) : (
          <div className="auth-container">
            {currentPage === 'login' ? (
              <Login onLogin={handleLogin} onSwitchToSignup={() => setCurrentPage('signup')} />
            ) : (
              <Signup onSignup={handleSignup} onSwitchToLogin={() => setCurrentPage('login')} />
            )}
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
