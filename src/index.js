import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Unused variable
const unusedConst = 'not used';

// Memory leak - event listener not cleaned up
window.addEventListener('resize', () => {
  console.log('Window resized');
});

// Missing StrictMode - but even with it, issues remain
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Rendering without cleanup
ReactDOM.createRoot(document.getElementById('another-root')).render(<App />);