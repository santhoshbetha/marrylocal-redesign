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
