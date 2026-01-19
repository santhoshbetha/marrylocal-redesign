import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { configureStore } from '@reduxjs/toolkit';
import { applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import authReducer from './store/reducers/authReducer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import registerServiceWorker from './serviceWorkerRegistration';
import './index.css';
import App from './App.jsx';

// Enhanced error handling for chunk loading failures
window.addEventListener('error', (e) => {
  if (e.message && (
      e.message.includes('Loading failed for the module') || 
      e.message.includes('ChunkLoadError') ||
      e.message.includes('Loading failed for the module with source') ||
      e.message.includes('Script error') ||
      e.message.includes('error loading dynamically imported module') ||
      (e.filename && e.filename.includes('.js') && e.message.includes('error'))
    )) {
    console.error('JavaScript loading error detected:', e.message, e.filename);
    
    // Clear caches and reload
    if ('caches' in window) {
      caches.keys().then(names => {
        return Promise.all(names.map(name => caches.delete(name)));
      }).then(() => {
        console.log('Caches cleared due to chunk loading error');
        window.location.reload();
      }).catch(() => {
        // If cache clearing fails, still reload
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  }
}, true);

// Also listen for unhandled promise rejections that might be chunk loading errors
window.addEventListener('unhandledrejection', (e) => {
  if (e.reason && (
      (typeof e.reason === 'string' && (
        e.reason.includes('Loading failed for the module') || 
        e.reason.includes('ChunkLoadError') ||
        e.reason.includes('Loading failed for the module with source') ||
        e.reason.includes('error loading dynamically imported module')
      )) ||
      (e.reason && e.reason.message && (
        e.reason.message.includes('Loading failed for the module') ||
        e.reason.message.includes('ChunkLoadError') ||
        e.reason.message.includes('error loading dynamically imported module')
      ))
    )) {
    console.error('Promise rejection with chunk loading error:', e.reason);
    
    // Clear caches and reload
    if ('caches' in window) {
      caches.keys().then(names => {
        return Promise.all(names.map(name => caches.delete(name)));
      }).then(() => {
        window.location.reload();
      }).catch(() => {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  }
});

import {
  createStateSyncMiddleware,
  // initMessageListener,
  initStateWithPrevTab,
} from 'redux-state-sync';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});

const store = configureStore(
  {
    reducer: {
      auth: authReducer, //reducer object 'auth'
    },
  },
  //applyMiddleware(thunk)
  applyMiddleware(createStateSyncMiddleware()),
);

initStateWithPrevTab(store);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <App />
          </Provider>
        </QueryClientProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);

registerServiceWorker();
