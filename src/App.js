import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { TimerProvider } from './TimerContext';
import Login from './Login';
import SignUp from './SignUp';
import TodoApp from './TodoApp';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return isSignUp ? (
      <SignUp onSwitchToLogin={() => setIsSignUp(false)} />
    ) : (
      <Login onSwitchToSignup={() => setIsSignUp(true)} />
    );
  }

  return <TodoApp />;
}

function App() {
  return (
    <AuthProvider>
      <TimerProvider>
        <AppContent />
      </TimerProvider>
    </AuthProvider>
  );
}

export default App;
