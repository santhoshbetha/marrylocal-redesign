import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { SearchDataAndRecoveryContext } from '../context/SearchDataAndRecoveryContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useAuth } from '../context/AuthContext';
import { Resend } from 'resend';
import axios from 'axios';
import supabase from '../lib/supabase';
import { url } from '../api';
import { checkIfUserExists } from '../services/registerService';
import { updateUserInfo } from '../services/userService';
import { getPasswordRetryCount, updatePasswordRetryCount } from '../services/registerService';
import { toast } from 'sonner';

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

export function ForgotPassword() {
  const { user, profiledata, userSession } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customerror, setCustomError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const { setCode, setEmail } = useContext(SearchDataAndRecoveryContext);
  const isOnline = useOnlineStatus();

  // Countdown timer effect
  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Countdown finished, navigate to logout
            navigate('/logout');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown, navigate]);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required('required'),
    }),
  });

  const handleForgotPassSubmit = async e => {
    e.preventDefault();

    try {
      //const OTP = Math.floor(Math.random() * 1000000 + 1);
      //setCode(OTP);
      //await setEmail(formik.values.email.trim());

      if (!isOnline) {
        toast.error('You are offline. Check your internet connection.');
        return;
      } else {
        if (!isObjEmpty(userSession)) {
          if (!isObjEmpty(profiledata)) {
            if (formik.values.email != profiledata?.email) {
              toast.error('Email entered is not your email. Please try again.');
              navigate('/');
              return;
            }
          }
        }

        let passwordretrycount = 0;
        let userExists = false;
        //
        // if user logged in
        //
        if (!isObjEmpty(userSession)) {
          if (!isObjEmpty(profiledata)) {
            userExists = true;
            passwordretrycount = profiledata?.password_retry_count;
          }
        }

        //
        // if user not logged in
        //
        if (isObjEmpty(userSession)) {
          setLoading(true);
          const res1 = await checkIfUserExists({
            email: formik.values.email,
            phonenumber: '1111122222',
            aadharnumber: '1111222233333',
          });

          if (res1.success) {
            if (res1.userExists) {
              userExists = true;
              setLoading(true);
              const res2 = await getPasswordRetryCount(formik.values.email.trim());
              if (res2.success) {
                setLoading(false);
                passwordretrycount = res2.passwordretrycount;
              } else {
                setLoading(false);
                toast.error('Something went wrong. Please try again later.');
                navigate('/');
                return;
              }
            } else {
              setLoading(false);
              toast.error('Incorrect email address. Please try again.');
              navigate('/');
              return;
            }
          } else {
            toast.error('Something went wrong. Please try again later.');
            navigate('/');
            return;
          }
        }

        if (passwordretrycount > 6) {
          toast.error('Password retry limit exceeded. Please contact us: contact@marrylocal.in');
          navigate('/');
          return;
        }

        // increment 'passwordretrycount' on "SEND CODE" click
        if (!isObjEmpty(userSession)) {
          await updateUserInfo(user?.id, {
            password_retry_count: profiledata?.password_retry_count + 1,
          });
        } else {
          await updatePasswordRetryCount({
            email: formik.values.email.trim(),
            count: passwordretrycount + 1,
          });
        }

        if (passwordretrycount <= 5 && userExists) {
          //
          // go to change page
          //
          setLoading(true);

        //  if (isObjEmpty(userSession)) {
            const { data, error } = await supabase.auth.resetPasswordForEmail(
              formik.values.email.trim(),
              {
                redirectTo: `${import.meta.env.VITE_MARRYLOCAL_URL}/changepassword`,
              },
            );
            setLoading(false);
            if (data) {
              setLoading(false);
              toast.success('Password reset email sent! Please check your inbox and follow the instructions.', {
                duration: 10000,
                description: `You will be logged out for security reasons in ${countdown} seconds.`,
              });
              // Start countdown timer for logout
              setCountdown(10);
            }
            if (error) {
              setLoading(false);
              navigate('/');
              toast.error('Email Error. Try again later', {
                description: 'Please check your email address and try again.',
              });
            }
        /*  } else {
            const response = await axios.post(`${url}/recovery/sendrecoveryemail`, {
              otp: OTP,
              email: formik.values.email.trim(),
            });
            setLoading(false);
            if (response?.data?.message == 'success') {
              setLoading(false);
              navigate('/changepassword');
            } else {
              setLoading(false);
              navigate('/');
              alert('Email Error. Try again later');
            }
          }*/
        }
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      console.log("otp error:", error);
      toast.error('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="mt-2 flex justify-center">
      <Card className="bg-white w-[90%] sm:max-w-[525px] relative">
        {loading && (
          <Spinner className="absolute top-[50%] left-[50%] z-50 cursor-pointer size-10" />
        )}
        <CardHeader>
          <CardTitle className="text-black">Set New Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassSubmit} className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="email">Enter your email</Label>
              <Input
                id="email"
                type="email"
                placeholder=""
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="text-red-700">{formik.errors.email} </p>
              ) : null}
            </div>
            <div className="flex mt-5">
              <Button
                variant="outline"
                onClick={e => {
                  e.preventDefault();
                  navigate(-1);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="ms-auto" disabled={countdown > 0}>
                {countdown > 0 ? 'Email Sent' : 'Send password reset email'}
              </Button>
            </div>
          </form>
          {countdown > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800 text-center font-medium">
                {isObjEmpty(userSession) 
                  ? `Closing in ${countdown} for security reasons` 
                  : `Logging out in ${countdown} seconds for security reasons...`
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/*
 {!isObjEmpty(userSession) ? <>Send Code</> : <>Send password reset email</>}
*/
