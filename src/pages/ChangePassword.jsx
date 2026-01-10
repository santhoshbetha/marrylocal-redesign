import { useState, useContext } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import usePasswordToggle from '../hooks/usePasswordToggle';
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
  const { user, userSession, profiledata } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customerror, setCustomError] = useState('');
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();
  const { email, code } = useContext(SearchDataAndRecoveryContext);

  console.log('ChangePassword code::', code);

  const formik = useFormik({
    initialValues: {
      code: '',
      password: '',
      passwordconfirm: '',
    },
    validationSchema: Yup.object({
      // email: Yup.string().email().required("required"),
      code: Yup.string()
        .required('Code is Required')
        .matches(/^[0-9]+$/, 'Must be only digits')
        .min(5, 'Must be exactly 5 or 6 digits')
        .max(6, 'Must be exactly 5 or 6 digits'),
      password: Yup.string().min(6).required('required'),
      passwordconfirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    }),
  });

  const handleChangePassSubmit = async e => {
    e.preventDefault();
    try {
      if (!isObjEmpty(code)) {
        if (formik.values.code != code) {
          setCustomError('Invalid Code or Code Expired. Please check email for latest code');
        }
        if (formik.values.code == code) {
          setLoading(true);

          const { data, error } = await supabase.auth.updateUser({
            password: formik.values.password.trim(),
          });

          if (error) {
            setLoading(false);
            alert('Password reset failed. try again later');
            setCustomError(String(error));
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
            alert('Password reset succesful!');

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
          }
        }
      }
    } catch (error) {
      alert('Something wrong. Try again later');
      setLoading(false);
      setCustomError('Password reset failed, try again');
      navigate('/');
    }
  };

  return (
    <div className="mt-2 flex justify-center">
      <Card className="bg-white w-[90%] sm:max-w-[525px] relative">
        {loading && (
          <Spinner className="absolute top-[50%] left-[50%] z-50 cursor-pointer size-10" />
        )}
        {isObjEmpty(userSession) ? (
          <>
            <CardHeader>
              <CardTitle className="text-red-500">
                Link expired. Click 'Forgot Password' below.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex">
                <button className="" onClick={() => navigate('/')}>
                  Cancel
                </button>
                <Button
                  variant="destructive"
                  color="error"
                  className="ms-auto"
                  type="submit"
                  onClick={() => navigate('/forgotpassword')}
                >
                  Forgot Password
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-black">Set New Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="mb-2">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder=""
                    name="email"
                    value={email ? email : profiledata?.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <p className="text-red-700">{formik.errors.email} </p>
                  ) : null}
                </div>

                {!isObjEmpty(code) ? (
                  <>
                    <div
                      style={{ cursor: 'pointer' }}
                      className="border-2 rounded-sm mt-4 mb-3 p-3 rounded-3 bg-yellow-300"
                    >
                      <p className="fw-bold">
                        Please leave this page open and go check your email for the one-time
                        security code we just sent you. Enter it below, and enter your new password.
                      </p>
                      <p className="fw-bold">
                        If you do not recieve the email, wait few minutes, check both inbox and spam
                        folders and then contact us: contact@marrylocal.in (with the subject line
                        "Reset password Issue").
                      </p>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <div>
                  <Label htmlFor="code" className="mb-2">
                    Code
                  </Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder=""
                    name="code"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                  {formik.touched.code && formik.errors.code ? (
                    <p className="text-red-700">{formik.errors.code} </p>
                  ) : null}
                </div>

                <div>
                  <Label htmlFor="password" className="mb-2">
                    New Password
                  </Label>
                  <Input
                    id="password"
                    type="text"
                    placeholder=""
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <p className="text-red-700">{formik.errors.password} </p>
                  ) : null}
                </div>

                <div>
                  <Label htmlFor="passwordconfirm" className="mt-2 mb-2">
                    New Password (Confirm)
                  </Label>
                  <Input
                    id="passwordconfirm"
                    type="password"
                    placeholder=""
                    name="passwordconfirm"
                    value={formik.values.passwordconfirm}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                  {formik.touched.passwordconfirm && formik.errors.passwordconfirm ? (
                    <p className="text-red-700">{formik.errors.passwordconfirm} </p>
                  ) : null}
                </div>

                <div className="flex mt-3">
                  <Button
                    variant="outline"
                    onClick={e => {
                      e.preventDefault();
                      navigate('/myspace');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="ms-auto">
                    Confirm New Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
