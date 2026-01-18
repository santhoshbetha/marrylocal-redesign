import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useState, useEffect } from 'react';

// Lazy load components for code splitting
const Home = lazy(() => import('@/pages/Home'));
const UserProfile = lazy(() => import('@/pages/UserProfile'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Register = lazy(() => import('@/pages/auth/Register/Register'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const Logout = lazy(() => import('@/pages/auth/Logout'));
const PageNotFound = lazy(() => import('./pages/404Page'));
const Search = lazy(() => import('@/pages/Search/Search'));
const Profile = lazy(() => import('@/pages/Profile'));
const Verify = lazy(() => import('@/pages/Verify'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ChangePassword = lazy(() => import('@/pages/ChangePassword'));
const Settings = lazy(() => import('@/pages/Settings'));
const Photos = lazy(() => import('@/pages/Photos'));
const Addons = lazy(() => import('@/pages/Addons'));
const ServiceFeesPhonePePayPage = lazy(() => import('@/pages/ServiceFeesPhonePePayPage'));
const ServiceFeesPhonePePaymentStatus = lazy(() => import('@/pages/ServiceFeesPhonePePaymentStatus'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Delete = lazy(() => import('@/pages/Delete'));
const Referrals = lazy(() => import('@/pages/Referrals'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const Cancellation = lazy(() => import('./pages/Cancellation'));
const RegistrationSuccess = lazy(() => import('@/pages/auth/RegistrationSuccess'));
const EmailVerification = lazy(() => import('@/pages/auth/EmailVerification'));
const EmailNotVerified = lazy(() => import('@/pages/auth/EmailNotVerified'));
const AuthConfirm = lazy(() => import('@/pages/auth/AuthConfirm'));
const Maintenance = lazy(() => import('@/pages/Maintenance'));
const Admin = lazy(() => import('@/pages/Admin'));
const AdminRoute = lazy(() => import('./components/AdminRoute'));
const AdminRegister = lazy(() => import('@/pages/auth/AdminRegister'));
const AdminBulkOperations = lazy(() => import('@/pages/AdminBulkOperations'));
const UserProfiles = lazy(() => import('@/pages/UserProfiles'));
const AdminUserList = lazy(() => import('@/pages/AdminUserList'));
const AdminEmailTemplates = lazy(() => import('@/pages/AdminEmailTemplates'));
const ScrollToTop = lazy(() => import('./components/ScrollToTop'));
const Location = lazy(() => import('@/pages/Location'));

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
