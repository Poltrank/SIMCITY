import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Filter expected benign Vite HMR websocket reconnection warnings in sandboxed preview environments
if (typeof window !== 'undefined') {
  const origConsoleError = console.error;
  console.error = (...args: any[]) => {
    if (typeof args[0] === 'string' && (args[0].includes('[vite]') || args[0].includes('websocket'))) {
      // Benign HMR notice in container environment
      return;
    }
    origConsoleError.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
