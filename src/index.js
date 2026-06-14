import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// ISSUE 1: No error boundary wrapping
// ISSUE 2: Directly rendering without try-catch

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ISSUE 3: No service worker registration for offline support
// ISSUE 4: Missing manifest.json reference

// ISSUE 5: Global side effect
window.globalGameData = {
  version: '1.0.0',
  initialized: true,
  startTime: Date.now()
};

// ISSUE 6: Console log in production
console.log('App initialized at:', new Date().toISOString());

// ISSUE 7: No proper cleanup on unload
window.addEventListener('beforeunload', () => {
  // ISSUE 8: Synchronous storage write on unload
  localStorage.setItem('lastVisit', Date.now().toString());
});

// ISSUE 9: Performance monitoring without cleanup
setInterval(() => {
  if (window.performance && window.performance.memory) {
    const memory = window.performance.memory;
    console.log('Memory usage:', memory.usedJSHeapSize);
  }
}, 5000);

// ISSUE 10: No version checking for dependencies