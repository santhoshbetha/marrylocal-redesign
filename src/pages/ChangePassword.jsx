import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateUserInfo } from '../services/userService';
import { updatePasswordRetryCount } from '../services/registerService';
import { SearchDataAndRecoveryContext } from '../context/SearchDataAndRecoveryContext';
import supabase from '../lib/supabase';
import secureLocalStorage from 'react-secure-storage';

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

export function ChangePassword() {
  const { user, userSession } = useAuth();
  const { email } = useContext(SearchDataAndRecoveryContext);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Validate access - only allow access after successful AuthConfirm
  useEffect(() => {
    if (!userSession || !user) {
      setMessage('Access denied. Please use the password reset link from your email.');
      setMessageType('error');
      setTimeout(() => {
          navigate('/', { replace: true });
      }, 5000);
      return;
    }
  }, [user, userSession, navigate]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    // Validate passwords
    if (!password) {
      setMessage('Please enter a new password');
      setMessageType('error');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setMessage(passwordError);
      setMessageType('error');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return;
    }

    setLoading(true);

    try {
      // This is the core call that updates the user's password in the database
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
        setMessageType('error');
      } else if (data?.user) {
        // reset password_retry_count to '0'
        if (!isObjEmpty(userSession)) {
          const res1 = await updateUserInfo(user?.id, {
            password_retry_count: 0,
          });
        } else {
          const res2 = await updatePasswordRetryCount({
            email: email.trim(),
            count: 0,
          });
        }

        setLoading(false);
        setMessage('Password reset successful!');
        setMessageType('success');

        // Small delay so user sees success message before redirect
        setTimeout(() => {
          //
          // logout
          //
          if (!isObjEmpty(userSession)) {
            localStorage.removeItem('shortlistarray');
            localStorage.removeItem('page');
            localStorage.removeItem('shortlistarraylength');
            localStorage.removeItem('userstate');
            localStorage.clear();
            secureLocalStorage.clear();
            //dispatch(logout());
          }
          navigate('/login?msg=reset');
        }, 2000);
      }
    } catch (err) {
      setMessage('An unexpected error occurred. Please try again.');
      setMessageType('error');
    }

    setLoading(false);
  };

  // If no valid session, show access denied message
  if (!userSession || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Access Denied
                </CardTitle>
                <p className="text-gray-600 text-sm mt-2">
                  You can only access this page through a valid password reset link.
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Please use the password reset link from your email to access this page.
                    You will be redirected to the homepage shortly.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={() => navigate('/', { replace: true })}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Go to Homepage
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto relative">
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Updating your password...</p>
              </div>
            </div>
          )}

          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Lock className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Set New Password
              </CardTitle>
              <p className="text-gray-600 text-sm mt-2">
                Enter your new password below
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                {/* New Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating Password...' : 'Update Password'}
                </Button>
              </form>

              {/* Message Display */}
              {message && (
                <Alert className={`${
                  messageType === 'success'
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center">
                    {messageType === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                    )}
                    <AlertDescription className={
                      messageType === 'success' ? 'text-green-800' : 'text-red-800'
                    }>
                      {message}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {/* Password Requirements */}
              <div className="text-xs text-gray-500 space-y-1">
                <p className="font-medium">Password requirements:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>At least 6 characters long</li>
                  <li>Both passwords must match</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}