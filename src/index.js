import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Global variable pollution
var appConfig = {
  apiUrl: 'http://localhost:3000',
  debug: true,
  version: '1.0.0'
};

// Unused global variable
var tempData = [];

// Function with side effects - BAD PRACTICE
function initializeApp() {
  console.log('Initializing app...');
  if (appConfig.debug) {
    console.log('Debug mode enabled');
  }
  // Modifying global state
  globalNoteId = 100;
}

// Calling function with side effects at module load
initializeApp();

// Missing error boundary
const root = ReactDOM.createRoot(document.getElementById('root'));

// Missing StrictMode can cause issues with double rendering in development
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Memory leak potential - no cleanup listener
if (module.hot) {
  module.hot.dispose(() => {
    console.log('Module being replaced');
    // Forgot cleanup
  });
}

// Service Worker registration with no error handling
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(
    (registration) => {
      console.log('Service Worker registered:', registration);
    }
  );
  // Missing catch for error handling
}

// Global event listeners without cleanup
window.addEventListener('online', () => {
  console.log('App is online');
});

window.addEventListener('offline', () => {
  console.log('App is offline');
});

// TODO: Add proper error handling
// TODO: Remove unused tempData variable