import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TodoApp from './pages/TodoApp';
import AuthContext from './context/AuthContext';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setCurrentPage('app');
      } catch (e) {
        console.error('Failed to parse stored user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentPage('app');
  };

  const handleSignup = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentPage('app');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('login');
  };

  const handleSwitchToSignup = () => {
    setCurrentPage('signup');
  };

  const handleSwitchToLogin = () => {
    setCurrentPage('login');
  };

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, handleLogout }}>
      <div className="app">
        {currentPage === 'login' && (
          <LoginPage
            onLogin={handleLogin}
            onSwitchToSignup={handleSwitchToSignup}
          />
        )}
        {currentPage === 'signup' && (
          <SignupPage
            onSignup={handleSignup}
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}
        {currentPage === 'app' && user && (
          <TodoApp user={user} onLogout={handleLogout} />
        )}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
