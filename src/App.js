import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import MemoryNotes from './components/MemoryNotes';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setCurrentPage('memories');
      } catch (err) {
        console.error('Failed to parse user data');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('memories');
  };

  const handleSignupSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('memories');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      {user && currentPage === 'memories' ? (
        <MemoryNotes user={user} onLogout={handleLogout} />
      ) : currentPage === 'signup' ? (
        <Signup 
          onSignupSuccess={handleSignupSuccess}
          onSwitchToLogin={() => setCurrentPage('login')}
        />
      ) : (
        <Login 
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setCurrentPage('signup')}
        />
      )}
    </div>
  );
}

export default App;
