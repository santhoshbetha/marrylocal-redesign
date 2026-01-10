import { useState, useEffect } from 'react';
import AppRouter from './AppRouter';
import { Layout } from '@/components/Layout';
import { NavBefore } from '@/components/NavBefore';
import { NavAfter } from '@/components/NavAfter';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';
import { SearchDataAndRecoveryContextProvider } from './context/SearchDataAndRecoveryContext';
import { AuthVerify } from './commons/AuthVerify';

function App() {
  const [openLogin, setOpenLogin] = useState(false);
  const { user } = useAuth();

  const [theme, _setTheme] = useState('light');

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

  return (
    <div className="App">
      <Toaster richColors />

      {user ? <NavAfter /> : <NavBefore openLogin={openLogin} setOpenLogin={setOpenLogin} />}
      <SearchDataAndRecoveryContextProvider>
        <Layout>
          <AppRouter openLogin={openLogin} setOpenLogin={setOpenLogin} />
        </Layout>
      </SearchDataAndRecoveryContextProvider>
      <AuthVerify />
    </div>
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
