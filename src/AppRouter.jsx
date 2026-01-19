import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useState, useEffect } from 'react';

// Safe lazy loading wrapper with error handling
const safeLazy = (importFunc) => {
  return lazy(() =>
    importFunc().catch(error => {
      console.error('Lazy loading failed:', error);

      // Automatically trigger cache clearing and reload
      setTimeout(() => {
        console.log('Automatically clearing caches and reloading due to lazy loading failure');

        // Clear caches
        if ('caches' in window) {
          caches.keys().then(names => {
            console.log('Clearing caches:', names);
            return Promise.all(names.map(name => caches.delete(name)));
          }).then(() => {
            console.log('Caches cleared, unregistering service worker');
            // Unregister service worker
            if ('serviceWorker' in navigator) {
              return navigator.serviceWorker.getRegistrations();
            }
            return [];
          }).then(registrations => {
            if (registrations && registrations.length > 0) {
              return Promise.all(registrations.map(reg => reg.unregister()));
            }
          }).then(() => {
            // Force reload with cache busting
            const newUrl = window.location.href + (window.location.href.includes('?') ? '&' : '?') + '_cache_bust=' + Date.now();
            window.location.replace(newUrl);
          }).catch(error => {
            console.error('Error during cache clearing:', error);
            // Fallback: just reload
            window.location.reload();
          });
        } else {
          // No caches API, just reload
          window.location.reload();
        }
      }, 100); // Small delay to ensure error logging

      // Return a fallback component that shows loading state
      return {
        default: () => (
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="flex flex-col items-center gap-4 p-6 bg-background/90 rounded-2xl shadow-2xl border border-border max-w-md">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary"></div>
              <div className="text-center">
                <h2 className="text-xl font-semibold text-primary mb-2">Updating App</h2>
                <p className="text-muted-foreground text-sm">Loading the latest version...</p>
              </div>
            </div>
          </div>
        )
      };
    })
  );
};

// Import components normally to avoid chunk loading issues
import Register from '@/pages/auth/Register/Register';
import Home from '@/pages/Home';
import UserProfile from '@/pages/UserProfile';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import LoginPage from '@/pages/auth/LoginPage';
import Logout from '@/pages/auth/Logout';
import PageNotFound from '@/pages/404Page';
import Search from '@/pages/Search/Search';
import Profile from '@/pages/Profile';
import Verify from '@/pages/Verify';
import ForgotPassword from '@/pages/ForgotPassword';
import ChangePassword from '@/pages/ChangePassword';
import Settings from '@/pages/Settings';
import Photos from '@/pages/Photos';
import Addons from '@/pages/Addons';
import ServiceFeesPhonePePayPage from '@/pages/ServiceFeesPhonePePayPage';
import ServiceFeesPhonePePaymentStatus from '@/pages/ServiceFeesPhonePePaymentStatus';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Delete from '@/pages/Delete';
import Referrals from '@/pages/Referrals';
import ProtectedRoute from '@/components/ProtectedRoute';
import Cancellation from '@/pages/Cancellation';
import RegistrationSuccess from '@/pages/auth/RegistrationSuccess';
import EmailVerification from '@/pages/auth/EmailVerification';
import EmailNotVerified from '@/pages/auth/EmailNotVerified';
import AuthConfirm from '@/pages/auth/AuthConfirm';
import Maintenance from '@/pages/Maintenance';
import Admin from '@/pages/Admin';
import AdminRoute from '@/components/AdminRoute';
import AdminRegister from '@/pages/auth/AdminRegister';
import AdminBulkOperations from '@/pages/AdminBulkOperations';
import UserProfiles from '@/pages/UserProfiles';
import AdminUserList from '@/pages/AdminUserList';
import AdminEmailTemplates from '@/pages/AdminEmailTemplates';
import ScrollToTop from '@/components/ScrollToTop';

// Lazy load components for code splitting
// Note: All components are now imported normally to avoid chunk loading issues in production
const Location = safeLazy(() => import('@/pages/Location'));

export default function AppRouter({ openLogin, setOpenLogin }) {
  // Check if maintenance mode is enabled
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );

  // If maintenance mode is enabled, show maintenance page
  if (isMaintenanceMode) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Maintenance />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home openLogin={openLogin} setOpenLogin={setOpenLogin} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/register" element={<Register />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/email-not-verified" element={<EmailNotVerified />} />
        <Route path="/auth/confirm" element={<AuthConfirm />} />
        <Route path="/login" element={<LoginPage setOpenLogin={setOpenLogin} />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        <Route exact path="user/:shortid" element={<UserProfile />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/changepassword" element={<ChangePassword />} />

        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cancellation" element={<Cancellation />} />

        <Route path="/servicefees" element={<ServiceFeesPhonePePayPage/>}/>
        <Route path="/paymentstatus" element={<ServiceFeesPhonePePaymentStatus/>}/>

        <Route element={<ProtectedRoute />}>
          <Route path="/verify" element={<Verify />} />
          <Route path="/myspace" element={<Navigate to="/search" />} />
          <Route path="/location" element={<Location />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/photos" element={<Photos />} />

          <Route path="/addons" element={<Addons />} />

          <Route path="/referrals" element={<Referrals />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logout" element={<Logout />} />

          <Route path="/delete" element={<Delete />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/bulk" element={<AdminBulkOperations />} />
            <Route path="/admin/profiles" element={<UserProfiles />} />
            <Route path="/admin/userlist" element={<AdminUserList />} />
            <Route path="/admin/emails" element={<AdminEmailTemplates />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />

        </Route>
      </Routes>
    </Suspense>
  );
}

/*
https://dev.to/ra1nbow1/building-reliable-protected-routes-with-react-router-v7-1ka0
         <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
*/
