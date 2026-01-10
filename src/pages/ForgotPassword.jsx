import React, { useContext, useState } from 'react';
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
  const { setCode, setEmail } = useContext(SearchDataAndRecoveryContext);
  const isOnline = useOnlineStatus();

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
      const OTP = Math.floor(Math.random() * 1000000 + 1);
      setCode(OTP);
      await setEmail(formik.values.email.trim());

      if (!isOnline) {
        alert('You are offline. check your internet connection.');
      } else {
        if (!isObjEmpty(userSession)) {
          if (!isObjEmpty(profiledata)) {
            if (formik.values.email != profiledata?.email) {
              alert('Email entered is not your email, try again.');
              navigate('/');
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
                alert('Something wrong. Try again later');
                navigate('/');
              }
            } else {
              setLoading(false);
              alert('Incorrect Email. Try again');
              navigate('/');
            }
          } else {
            alert('Something wrong. Try again later');
            navigate('/');
          }
        }

        if (passwordretrycount > 5) {
          alert('Password retry limit exceeded. Please contact us: contact@marrylocal.in');
          navigate('/');
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

          if (isObjEmpty(userSession)) {
            const { data, error } = await supabase.auth.resetPasswordForEmail(
              formik.values.email.trim(),
              {
                redirectTo: 'https://marrylocal.in/changepassword',
              },
            );
            setLoading(false);
            if (data) {
              setLoading(false);
              navigate('/');
              alert('Please check you emails for password reset');
            }
            if (error) {
              setLoading(false);
              navigate('/');
              alert('Email Error. Try again later');
            }
          } else {
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
          }
        }
      }
    } catch (error) {
      setLoading(false);
      alert('Something wrong. try again later');
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
              <Button type="submit" className="ms-auto">
                {!isObjEmpty(userSession) ? <>Send Code</> : <>Send password reset email</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
