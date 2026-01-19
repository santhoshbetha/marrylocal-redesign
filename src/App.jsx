import React, { useState, useEffect } from 'react';
import AppRouter from './AppRouter';
import { Layout } from '@/components/Layout';
import { NavBefore } from '@/components/NavBefore';
import { NavAfter } from '@/components/NavAfter';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';
import { SearchDataAndRecoveryContextProvider } from './context/SearchDataAndRecoveryContext';
import { AuthVerify } from './commons/AuthVerify';
import { Suspense, lazy } from 'react';

// Error Boundary for lazy loading failures
class LazyLoadErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Check if it's a chunk loading error
    if (error.message && (
      error.message.includes('Loading failed for the module') ||
      error.message.includes('ChunkLoadError') ||
      error.message.includes('error loading dynamically imported module')
    )) {
      console.error('Lazy loading error detected:', error);
      // Trigger cache clear and reload
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
      return { hasError: true };
    }
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lazy loading error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4 p-6 bg-background/90 rounded-2xl shadow-2xl border border-border">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary"></div>
            <p className="text-sm text-muted-foreground font-medium">Reloading app...</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global Loading Context
export const GlobalLoadingContext = React.createContext();

export const useGlobalLoading = () => {
  const context = React.useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within a GlobalLoadingProvider');
  }
  return context;
};

/*
USAGE EXAMPLE:
import { useGlobalLoading } from '../App';

function MyComponent() {
  const { setGlobalLoading } = useGlobalLoading();

  const handleAsyncOperation = async () => {
    setGlobalLoading(true);
    try {
      await someAsyncOperation();
    } finally {
      setGlobalLoading(false);
    }
  };

  return <button onClick={handleAsyncOperation}>Do Something</button>;
}
*/

function App() {
  const [openLogin, setOpenLogin] = useState(false);
  const { user, profiledata, loading: authLoading } = useAuth();
  const [theme, _setTheme] = useState('light');
  const [shouldLoadTermsPopup, setShouldLoadTermsPopup] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);

  // Lazy load TermsPopup only when needed
  const TermsPopup = lazy(() => import('./pages/TermsPopup').then(module => ({ default: module.TermsPopup })));

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  // Check if TermsPopup should be loaded
  useEffect(() => {
    if (user && profiledata && profiledata.termsaccepted === false) {
      setShouldLoadTermsPopup(true);
    } else {
      setShouldLoadTermsPopup(false);
    }
  }, [user, profiledata]);

  // Show global loading during login until profile data is loaded
  useEffect(() => {
    if (authLoading && user) {
      setGlobalLoading(true);
    } else if (!authLoading && profiledata) {
      setGlobalLoading(false);
    }
  }, [authLoading, user, profiledata]);

  // Version check for app updates
  useEffect(() => {
    const checkVersion = async () => {
      try {
        // Add timestamp to prevent any caching
        const timestamp = Date.now();
        const response = await fetch(`/meta.json?v=${timestamp}`, { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!response.ok) {
          console.warn('Failed to fetch meta.json:', response.status);
          return;
        }
        
        const data = await response.json();
        const currentVersion = localStorage.getItem('app_version');

        if (currentVersion && data.version && data.version !== currentVersion) {
          console.log('New app version detected, updating and reloading...');
          localStorage.setItem('app_version', data.version);
          
          // Clear all caches
          if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map(key => caches.delete(key)));
          }
          
          // Clear localStorage version before reload to force re-check
          localStorage.removeItem('app_version');
          
          // Force reload with cache busting
          window.location.href = window.location.href + (window.location.href.includes('?') ? '&' : '?') + 'v=' + Date.now();
        } else if (data.version) {
          localStorage.setItem('app_version', data.version);
        }
      } catch (error) {
        console.warn('Version check failed:', error);
        // On version check failure, try a more aggressive reload for chunk errors
        if (error.message && (error.message.includes('fetch') || error.message.includes('network'))) {
          console.log('Network error during version check, attempting cache-bust reload');
          window.location.href = window.location.href + (window.location.href.includes('?') ? '&' : '?') + 'v=' + Date.now();
        }
      }
    };
    
    // Check version immediately and then every 2 minutes
    checkVersion();
    const interval = setInterval(checkVersion, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <GlobalLoadingContext.Provider value={{ globalLoading, setGlobalLoading }}>
      <div className="App">
        <Toaster richColors />

        {/* Global Loading Spinner */}
        {globalLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 p-6 bg-background/90 rounded-2xl shadow-2xl border border-border">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary"></div>
              <p className="text-sm text-muted-foreground font-medium">Loading...</p>
            </div>
          </div>
        )}

        {user ? <NavAfter /> : <NavBefore openLogin={openLogin} setOpenLogin={setOpenLogin} />}
        <SearchDataAndRecoveryContextProvider>
          <Layout>
            <LazyLoadErrorBoundary>
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="flex flex-col items-center gap-4 p-6 bg-background/90 rounded-2xl shadow-2xl border border-border">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary"></div>
                    <p className="text-sm text-muted-foreground font-medium">Loading...</p>
                  </div>
                </div>
              }>
                <AppRouter openLogin={openLogin} setOpenLogin={setOpenLogin} />
              </Suspense>
            </LazyLoadErrorBoundary>
          </Layout>
        </SearchDataAndRecoveryContextProvider>
        <AuthVerify />
        {shouldLoadTermsPopup && (
          <Suspense fallback={null}>
            <TermsPopup />
          </Suspense>
        )}
      </div>
    </GlobalLoadingContext.Provider>
  );
}

export default App;

/*
          <Layout>
            <AppRouter openLogin={openLogin} setOpenLogin={setOpenLogin} />
            {user ?
              <>
              </>
              :
              <Footer/>
            }
          </Layout>
*/
