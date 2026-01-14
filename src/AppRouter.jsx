import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { UserProfile } from '@/pages/UserProfile';
import { About } from '@/pages/About';
import { Contact } from './pages/Contact';
import { Register } from '@/pages/auth/Register/Register';
import { LoginPage } from '@/pages/auth/LoginPage';
import { Logout } from '@/pages/auth/Logout';
import { Location } from '@/pages/Location';
import { PageNotFound } from './pages/404Page';
import { Search } from '@/pages/Search/Search';
import { Profile } from '@/pages/Profile';
import { Verify } from '@/pages/Verify';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { ChangePassword } from '@/pages/ChangePassword';
import { Settings } from '@/pages/Settings';
import { Photos } from '@/pages/Photos';

import { Addons } from '@/pages/Addons';

import { Terms } from '@/pages/Terms';
import { Privacy } from '@/pages/Privacy';
import { Delete } from '@/pages/Delete';
import { Referrals } from '@/pages/Referrals';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Cancellation } from './pages/Cancellation';
import { RegistrationSuccess } from '@/pages/auth/RegistrationSuccess';
import { EmailVerification } from '@/pages/auth/EmailVerification';
import { EmailNotVerified } from '@/pages/auth/EmailNotVerified';
import { Maintenance } from '@/pages/Maintenance';

export default function AppRouter({ openLogin, setOpenLogin }) {
  // Check if maintenance mode is enabled
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

  // If maintenance mode is enabled, show maintenance page
  if (isMaintenanceMode) {
    return <Maintenance />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home openLogin={openLogin} setOpenLogin={setOpenLogin} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/register" element={<Register />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/email-not-verified" element={<EmailNotVerified />} />
        <Route path="/login" element={<LoginPage setOpenLogin={setOpenLogin} />} />

        <Route exact path="user/:shortid" element={<UserProfile />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/changepassword" element={<ChangePassword />} />

        <Route path="/verify" element={<Verify />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cancellation" element={<Cancellation />} />

        <Route element={<ProtectedRoute />}>
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
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

/*
https://dev.to/ra1nbow1/building-reliable-protected-routes-with-react-router-v7-1ka0
*/
