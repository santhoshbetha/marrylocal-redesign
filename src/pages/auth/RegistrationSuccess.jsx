import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';

export function RegistrationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = location.state?.email || '';

  useEffect(() => {
    // Clear autosaved form data on successful registration
    localStorage.removeItem('registrationForm');
  }, []);

  const handleContinueToVerification = () => {
    navigate('/verify-email', { state: { email: userEmail } });
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Registration Successful!
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-gray-600">
              Welcome to MarryLocal! Your account has been created successfully.
            </p>
            <p className="text-sm text-gray-500">
              We've sent a verification email to:
            </p>
            <p className="font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {userEmail}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-medium text-blue-900">Next Step: Verify Your Email</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Please check your email and click the verification link to activate your account.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleContinueToVerification}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              Continue to Email Verification
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              onClick={handleGoToLogin}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Go to Login
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Didn't receive the email? Check your spam folder.</p>
            <p>Still no email? Contact our support team.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}