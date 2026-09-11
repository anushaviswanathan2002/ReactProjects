import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MemoryApp from './pages/MemoryApp';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setCurrentPage('memory');
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('memory');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentPage('login');
  };

  const switchToSignup = () => setCurrentPage('signup');
  const switchToLogin = () => setCurrentPage('login');

  if (loading) {
    return <div className="container"><div className="loader">Loading...</div></div>;
  }

  return (
    <div className="app">
      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} onSwitchToSignup={switchToSignup} />
      )}
      {currentPage === 'signup' && (
        <SignupPage onSignup={handleLogin} onSwitchToLogin={switchToLogin} />
      )}
      {currentPage === 'memory' && user && (
        <MemoryApp user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
