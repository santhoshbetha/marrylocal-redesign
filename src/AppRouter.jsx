import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useState, useEffect } from 'react';

// Safe lazy loading wrapper with error handling
const safeLazy = (importFunc) => {
  return lazy(() => 
    importFunc().catch(error => {
      console.error('Lazy loading failed:', error);
      // Return a fallback component
      return {
        default: () => (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Loading Error</h2>
              <p className="text-gray-600">Failed to load component. Please refresh the page.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Refresh Page
              </button>
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
