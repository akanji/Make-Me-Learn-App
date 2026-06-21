if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    // Gracefully ignore Vite's HMR WebSocket disconnect alerts so they don't block app runtime
    if (event.reason && event.reason.message?.includes('WebSocket')) {
      event.preventDefault();
      console.warn('Handled HMR WebSocket disconnect safely.');
    }
  });
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
