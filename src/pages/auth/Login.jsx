import { useState, useContext, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import * as Yup from 'yup';
import secureLocalStorage from 'react-secure-storage';
import { Formik } from 'formik';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import usePasswordToggle from '@/hooks/usePasswordToggle';
import supabase from '@/lib/supabase';
import { loginSuccess } from '../../store/actions/authActions';

export function Login({ openLogin, setOpenLogin }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();
  const emailInputRef = useRef(null);

  // Prevent auto-focus on email input
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.blur();
    }
  }, []);

  const forgotPassword = e => {
    setOpenLogin(false);
  };

  const onSignupClick = e => {
    setOpenLogin(false);
  };

  const doLogin = async (values, actions) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password.trim(),
      });

      if (data && !error) {
        setOpenLogin(false);
        dispatch(loginSuccess(data?.session));
        secureLocalStorage.setItem('reloadshortlistdata', true);

        // Check if user is admin and redirect accordingly
        const isAdmin = data?.user?.user_metadata?.role === 'admin';
        navigate(isAdmin ? '/admin' : '/myspace');
      }

      if (error) {
        // Check if the error is related to email not being verified
        if (error.message?.includes('Email not confirmed') ||
            error.message?.includes('email_not_confirmed') ||
            error.message?.includes('not confirmed') ||
            error.message?.includes('verify your email')) {
          // Redirect to email not verified page with the email
          navigate('/email-not-verified', {
            state: { email: values.email.trim() }
          });
          return;
        }

        // Replace Supabase's default error message with a more user-friendly one
        let errorMessage = String(error);
        if (errorMessage.includes('Invalid login credentials') || errorMessage.includes('AuthApiError')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        }

        setError(errorMessage);
        throw error;
      }
    } catch (error) {
      //console.log('error', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const UserloginFormSchema = Yup.object().shape({
    email: Yup.string().email().required('Required'),
    password: Yup.string().min(8, 'Too Short! (password is min 8 characters)').required('Required'),
  });

  return (
    <DialogContent className="w-[95%] sm:w-[90%] sm:max-w-[425px] mx-2 sm:mx-auto">
      {loading && <Spinner size="lg" className="fixed top-[50%] left-[50%] z-50 cursor-pointer" />}
      <DialogTitle></DialogTitle>
      <CardHeader className="px-4 sm:px-6 py-3 sm:py-4">
        <CardTitle className="text-xl sm:text-2xl">Login</CardTitle>
        <CardDescription className="text-sm sm:text-base">Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={UserloginFormSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              //alert(JSON.stringify(values, null, 2));
              actions.setSubmitting(false);
            }, 1000);
            localStorage.clear();
            secureLocalStorage.clear();
            secureLocalStorage.clear();
            doLogin(values, actions);
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    autoFocus={false}
                    required
                    className="h-9 sm:h-10 text-sm sm:text-base"
                  />
                  <p className="text-red-700 text-xs sm:text-sm">{errors.email && touched.email && errors.email}</p>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
                    <Link
                      to="/forgotpassword"
                      className="ml-auto inline-block text-xs sm:text-sm underline-offset-4 hover:underline"
                      onClick={forgotPassword}
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={PasswordInputType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      required
                      className="h-9 sm:h-10 text-sm sm:text-base pr-8"
                    />
                    <span
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-7 sm:w-7 text-gray-500
                                                hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 bg-background"
                    >
                      {ToggleIcon}
                    </span>
                  </div>
                  <p className="text-red-700 text-xs sm:text-sm">
                    {errors.password && touched.password && errors.password}
                  </p>
                </div>
                {error && <div className="text-red-500 text-xs sm:text-sm">{error}</div>}
                <Button type="submit" className="w-full h-9 sm:h-10 text-sm sm:text-base" disabled={isSubmitting}>
                  Login
                </Button>
              </div>
              <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm">
                Don&apos;t have an account?{' '}
                <Link
                  to="/register"
                  onClick={onSignupClick}
                  className="underline underline-offset-4"
                >
                  Register
                </Link>
              </div>
            </form>
          )}
        </Formik>
      </CardContent>
    </DialogContent>
  );
}
