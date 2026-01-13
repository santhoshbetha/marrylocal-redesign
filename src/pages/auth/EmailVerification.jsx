import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import supabase from '../../lib/supabase';

export function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    // Check if user is already verified
    const checkUserStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        navigate('/login');
      }
    };

    checkUserStatus();
  }, [navigate]);

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Please enter your email address');
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
        toast.success('Verification email sent! Please check your inbox.');
        setVerificationSent(true);
      }
    } catch (error) {
      toast.error('Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  const handleManualVerification = async () => {
    if (!verificationCode.trim()) {
      toast.error('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    try {
      // For Supabase, email verification is typically handled via the link
      // But we can check if the user is verified
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        toast.error('Verification failed. Please try again.');
      } else if (user?.email_confirmed_at) {
        toast.success('Email verified successfully!');
        navigate('/login');
      } else {
        toast.error('Email not yet verified. Please check your email and click the verification link.');
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Verify Your Email
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-gray-600">
              We've sent a verification link to your email address.
            </p>
            <p className="text-sm text-gray-500">
              Click the link in the email to activate your account.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Verification Code (Optional)</Label>
              <Input
                id="code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter code if provided"
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Some email providers may include a verification code
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleManualVerification}
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  I've Verified My Email
                </>
              )}
            </Button>

            <Button
              onClick={handleResendVerification}
              variant="outline"
              className="w-full"
              size="lg"
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </>
              )}
            </Button>

            <Button
              onClick={handleGoToLogin}
              variant="ghost"
              className="w-full"
              size="lg"
            >
              Back to Login
            </Button>
          </div>

          {verificationSent && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-800">
                  Verification email sent! Please check your inbox and spam folder.
                </p>
              </div>
            </div>
          )}

          <div className="text-center space-y-2">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-yellow-800">Need Help?</p>
                  <p className="text-sm text-yellow-700">
                    Can't find the email? Check your spam folder or contact support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}