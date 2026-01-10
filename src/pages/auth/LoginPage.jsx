import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import * as Yup from 'yup';
import secureLocalStorage from 'react-secure-storage';
import { Formik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import usePasswordToggle from '@/hooks/usePasswordToggle';
import supabase from '@/lib/supabase';
import { loginSuccess } from '../../store/actions/authActions';

export function LoginPage({ setOpenLogin }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();

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
        navigate('/myspace');
      }

      if (error) {
        setError(String(error));
        throw error;
      }
    } catch (error) {
      console.log('error', error);
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
    <div className="flex justify-center mt-4">
      <Card className="w-[90%] sm:max-w-[425px]">
        {loading && <Spinner className="fixed top-[50%] left-[50%] z-50 cursor-pointer size-10" />}
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
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
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      required
                    />
                    <p className="text-red-700">{errors.email && touched.email && errors.email}</p>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/forgotpassword"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
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
                      />
                      <span
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500
                                                    hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 bg-background"
                      >
                        {ToggleIcon}
                      </span>
                    </div>
                    <p className="text-red-700">
                      {errors.password && touched.password && errors.password}
                    </p>
                  </div>
                  {error && <div className="text-red-500">{error}</div>}
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    Login
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
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
      </Card>
    </div>
  );
}
