
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Note: 'uuid' would be a dependency to install, e.g., `npm install uuid @types/uuid`
// For this environment, we assume it's available.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);