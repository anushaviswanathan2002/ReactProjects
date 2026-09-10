import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import MemoryDashboard from './components/MemoryDashboard';

// Create Auth Context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Get all users from localStorage
    const allUsers = JSON.parse(localStorage.getItem('users') || '{}');
    const userData = allUsers[email];

    if (!userData || userData.password !== password) {
      throw new Error('Invalid email or password');
    }

    setUser({ email, name: userData.name });
    localStorage.setItem('user', JSON.stringify({ email, name: userData.name }));
  };

  const signUp = (email, name, password) => {
    // Get all users from localStorage
    const allUsers = JSON.parse(localStorage.getItem('users') || '{}');

    if (allUsers[email]) {
      throw new Error('Email already registered');
    }

    // Store new user
    allUsers[email] = { name, password };
    localStorage.setItem('users', JSON.stringify(allUsers));

    // Auto login after signup
    setUser({ email, name });
    localStorage.setItem('user', JSON.stringify({ email, name }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'signup', 'dashboard'
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If user is logged in, show dashboard
  if (user) {
    return <MemoryDashboard onLogout={() => setCurrentPage('login')} />;
  }

  // Show login or signup page
  return (
    <>
      {currentPage === 'login' ? (
        <Login onSwitchToSignUp={() => setCurrentPage('signup')} />
      ) : (
        <SignUp onSwitchToLogin={() => setCurrentPage('login')} />
      )}
    </>
  );
}

export default App;
