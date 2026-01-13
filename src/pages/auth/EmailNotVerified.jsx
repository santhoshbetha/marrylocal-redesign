import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Mail, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import supabase from '../../lib/supabase';

export function EmailNotVerified() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email] = useState(location.state?.email || '');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // If no email provided, redirect to login
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Email address not found. Please try logging in again.');
      navigate('/login');
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Verification email sent! Please check your inbox and spam folder.');
      }
    } catch (err) {
      console.error('Failed to resend verification email:', err);
      toast.error('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Email Not Verified
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-gray-600">
                Your email address <strong>{email}</strong> has not been verified yet.
              </p>
              <p className="text-sm text-gray-500">
                Please check your inbox and click the verification link to activate your account.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </Button>

              <Button
                onClick={handleBackToLogin}
                variant="outline"
                className="w-full"
              >
                Back to Login
              </Button>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>Didn't receive the email? Check your spam folder.</p>
              <p>Still having issues? Contact our support team.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}