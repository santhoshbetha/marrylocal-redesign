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
            <AppRouter openLogin={openLogin} setOpenLogin={setOpenLogin} />
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
