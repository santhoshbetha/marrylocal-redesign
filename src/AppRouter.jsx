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

// Lazy load components for code splitting
const Home = safeLazy(() => import('@/pages/Home'));
const UserProfile = safeLazy(() => import('@/pages/UserProfile'));
const About = safeLazy(() => import('@/pages/About'));
const Contact = safeLazy(() => import('@/pages/Contact'));
const Register = safeLazy(() => import('@/pages/auth/Register/Register'));
const LoginPage = safeLazy(() => import('@/pages/auth/LoginPage'));
const Logout = safeLazy(() => import('@/pages/auth/Logout'));
const PageNotFound = safeLazy(() => import('@/pages/404Page'));
const Search = safeLazy(() => import('@/pages/Search/Search'));
const Profile = safeLazy(() => import('@/pages/Profile'));
const Verify = safeLazy(() => import('@/pages/Verify'));
const ForgotPassword = safeLazy(() => import('@/pages/ForgotPassword'));
const ChangePassword = safeLazy(() => import('@/pages/ChangePassword'));
const Settings = safeLazy(() => import('@/pages/Settings'));
const Photos = safeLazy(() => import('@/pages/Photos'));
const Addons = safeLazy(() => import('@/pages/Addons'));
const ServiceFeesPhonePePayPage = safeLazy(() => import('@/pages/ServiceFeesPhonePePayPage'));
const ServiceFeesPhonePePaymentStatus = safeLazy(() => import('@/pages/ServiceFeesPhonePePaymentStatus'));
const Terms = safeLazy(() => import('@/pages/Terms'));
const Privacy = safeLazy(() => import('@/pages/Privacy'));
const Delete = safeLazy(() => import('@/pages/Delete'));
const Referrals = safeLazy(() => import('@/pages/Referrals'));
const ProtectedRoute = safeLazy(() => import('@/components/ProtectedRoute'));
const Cancellation = safeLazy(() => import('@/pages/Cancellation'));
const RegistrationSuccess = safeLazy(() => import('@/pages/auth/RegistrationSuccess'));
const EmailVerification = safeLazy(() => import('@/pages/auth/EmailVerification'));
const EmailNotVerified = safeLazy(() => import('@/pages/auth/EmailNotVerified'));
const AuthConfirm = safeLazy(() => import('@/pages/auth/AuthConfirm'));
const Maintenance = safeLazy(() => import('@/pages/Maintenance'));
const Admin = safeLazy(() => import('@/pages/Admin'));
const AdminRoute = safeLazy(() => import('@/components/AdminRoute'));
const AdminRegister = safeLazy(() => import('@/pages/auth/AdminRegister'));
const AdminBulkOperations = safeLazy(() => import('@/pages/AdminBulkOperations'));
const UserProfiles = safeLazy(() => import('@/pages/UserProfiles'));
const AdminUserList = safeLazy(() => import('@/pages/AdminUserList'));
const AdminEmailTemplates = safeLazy(() => import('@/pages/AdminEmailTemplates'));
const ScrollToTop = safeLazy(() => import('@/components/ScrollToTop'));
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
