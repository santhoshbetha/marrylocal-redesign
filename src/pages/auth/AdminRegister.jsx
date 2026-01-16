import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { Loader2, UserPlus, ArrowLeft, Eye, EyeOff, ChevronDownIcon } from 'lucide-react';
import { toast } from 'sonner';
import { registerAdmin } from '../../services/authService';
import usePasswordToggle from '@/hooks/usePasswordToggle';
import { useEffect } from 'react';

function AdminRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();
  const [ConfirmPasswordInputType, ConfirmToggleIcon] = usePasswordToggle();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    phonenumber: ''
  });
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    dateofbirth: '',
    gender: '',
    email: '',
    phonenumber: '',
    password: '',
    confirmPassword: '',
    inviteCode: '',
  });

  // Calculate max date (18 years ago from today for admin registration)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  const currentYear = new Date().getFullYear();
  const fromYear = 1900;
  const toYear = currentYear - 18;

  // Sync selectedDate with formData.dateofbirth
  useEffect(() => {
    if (formData.dateofbirth && !selectedDate) {
      setSelectedDate(new Date(formData.dateofbirth));
    } else if (!formData.dateofbirth && selectedDate) {
      setSelectedDate(null);
    }
  }, [formData.dateofbirth, selectedDate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    // Clear field-specific errors when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Invalid email format';
    }
    return '';
  };

  const validatePhoneNumber = (phone) => {
    if (!phone.trim()) {
      return 'Phone number is required';
    }
    if (!/^\d{10}$/.test(phone)) {
      return 'Phone number must be 10 digits';
    }
    return '';
  };

  const handleEmailBlur = () => {
    const emailError = validateEmail(formData.email);
    setFieldErrors(prev => ({ ...prev, email: emailError }));
  };

  const handlePhoneBlur = () => {
    const phoneError = validatePhoneNumber(formData.phonenumber);
    setFieldErrors(prev => ({ ...prev, phonenumber: phoneError }));
  };

  const validateForm = () => {
    // Check field-specific errors first
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhoneNumber(formData.phonenumber);

    if (emailError || phoneError) {
      setFieldErrors({
        email: emailError,
        phonenumber: phoneError
      });
      return emailError || phoneError;
    }

    if (!formData.firstname.trim()) return 'First name is required';
    if (!formData.lastname.trim()) return 'Last name is required';
    if (!formData.dateofbirth) return 'Date of birth is required';
    if (!formData.gender) return 'Gender is required';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 8) return 'Password must be at least 8 characters long';
    if (!formData.confirmPassword) return 'Please confirm your password';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    if (!formData.inviteCode.trim()) return 'Invite code is required';

    // Check if user is 18 or older
    const birthDate = new Date(formData.dateofbirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) return 'You must be at least 18 years old';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await registerAdmin(formData);

      if (result.success) {
        toast.success('Admin registration successful! Please check your email for verification.');
        navigate('/login');
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
            <Spinner size="lg" />
            <p className="text-gray-700 font-medium">Registering admin account...</p>
          </div>
        </div>
      )}
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-blue-100 p-3">
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Admin Registration
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Register as an administrator
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name *</Label>
                <Input
                  id="firstname"
                  type="text"
                  value={formData.firstname}
                  onChange={(e) => handleInputChange('firstname', e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name *</Label>
                <Input
                  id="lastname"
                  type="text"
                  value={formData.lastname}
                  onChange={(e) => handleInputChange('lastname', e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateofbirth">Date of Birth *</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between font-normal">
                    {selectedDate ? selectedDate.toLocaleDateString() : 'Select date of birth'}
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    captionLayout="dropdown"
                    toDate={maxDate}
                    fromYear={fromYear}
                    toYear={toYear}
                    onSelect={date => {
                      setSelectedDate(date);
                      const formattedDate = date ? date.toISOString().split('T')[0] : '';
                      handleInputChange('dateofbirth', formattedDate);
                      setCalendarOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={handleEmailBlur}
                placeholder="admin@example.com"
                required
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phonenumber">Phone Number *</Label>
              <Input
                id="phonenumber"
                type="tel"
                value={formData.phonenumber}
                onChange={(e) => handleInputChange('phonenumber', e.target.value)}
                onBlur={handlePhoneBlur}
                placeholder="1234567890"
                maxLength="10"
                required
              />
              {fieldErrors.phonenumber && (
                <p className="text-red-500 text-sm">{fieldErrors.phonenumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={PasswordInputType}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <span
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500
                                hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 bg-background"
                >
                  {ToggleIcon}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={ConfirmPasswordInputType}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
                <span
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500
                                hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 bg-background"
                >
                  {ConfirmToggleIcon}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inviteCode">Invite Code *</Label>
              <Input
                id="inviteCode"
                type="text"
                value={formData.inviteCode}
                onChange={(e) => handleInputChange('inviteCode', e.target.value)}
                placeholder="Enter admin invite code"
                required
              />
              <p className="text-xs text-gray-500">
                You need a valid invite code to register as an administrator
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register as Admin
                </>
              )}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:text-blue-500 flex items-center justify-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default AdminRegister;