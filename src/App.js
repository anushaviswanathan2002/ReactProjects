import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Load users from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }

    const storedCurrentUser = localStorage.getItem('currentUser');
    if (storedCurrentUser) {
      setCurrentUser(JSON.parse(storedCurrentUser));
      setCurrentPage('dashboard');
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const handleSignup = (email, password, name) => {
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      alert('User already exists!');
      return;
    }

    const newUser = {
      id: Date.now(),
      email,
      password, // In real app, this should be hashed
      name,
      memories: []
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setCurrentPage('dashboard');
  };

  const handleLogin = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      alert('Invalid email or password!');
      return;
    }

    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('login');
  };

  const handleUpdateMemories = (updatedMemories) => {
    const updatedUser = { ...currentUser, memories: updatedMemories };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Update the user in the users list
    const updatedUsers = users.map(u =>
      u.id === updatedUser.id ? updatedUser : u
    );
    setUsers(updatedUsers);
  };

  return (
    <div className="App">
      {currentPage === 'login' && (
        <Login onLogin={handleLogin} onSwitchToSignup={() => setCurrentPage('signup')} />
      )}
      {currentPage === 'signup' && (
        <Signup onSignup={handleSignup} onSwitchToLogin={() => setCurrentPage('login')} />
      )}
      {currentPage === 'dashboard' && currentUser && (
        <Dashboard user={currentUser} onLogout={handleLogout} onUpdateMemories={handleUpdateMemories} />
      )}
    </div>
  );
}

export default App;
