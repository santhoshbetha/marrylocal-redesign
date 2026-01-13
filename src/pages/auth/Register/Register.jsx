import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import SimpleReactValidator from 'simple-react-validator';
import { AccountForm } from './AccountForm';
import { CommunityForm } from './CommunityForm';
import { UseMultiStepForm } from './UseMultiStepForm';
import { UserInfoForm } from './UserInfoForm';
import { registerSuccess, registerFailure, clearstate } from '../../../store/actions/authActions';
import supabase from '../../../lib/supabase';
import ShortUniqueId from 'short-unique-id'
import { checkIfUserExists, 
  getCityUsercount, 
  getUsercountToday, 
  appendToRefereeEmails 
} from '../../../services/registerService';
import { coords } from '../../../lib/defaultcoords';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const BASE_URL = 'http://localhost:5173';

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

const INITIAL_DATA = {
  // referrer
  referrer: null,
  // user info form
  firstname: '',
  lastname: '',
  dob: '2002-01-01',
  age: 21,
  gender: '',
  educationlevel: '',
  jobstatus: false,
  city: '',
  state: '',
  // community form
  language: '',
  religion: '',
  community: '',
  economicstatus: '',
  // account form
  aadharnumber: '',
  phonenumber: '',
  email: '',
  password: '',
  passwordconfirm: '',
};

function calcAge(dateString) {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
}

const getcoords = (city) => {
  for (var i = 0; i < coords.length; i++) {
    if (coords[i].city == city){
      return coords[i].coords;
    }
  }
  return { lat: 0, lng: 0 };
}

const authRegister = async (userdata, signal) => {
    const res1 = await checkIfUserExists(userdata, signal);
    let userExists = false;
    if (res1.success) {
        userExists = res1.userExists;
        if (userExists) {
            console.log("userExists true")
            throw new Error('User with given email or phone number or aadhar number exists!');
        }
    }
    if (!res1.success) {
        throw new Error('Registration Error, try again later')
    }
    
    if (!userExists) {
        const dateofbirth = userdata?.dob == '' ? (new Date('2002-01-01')).toISOString()
                                               : (new Date(`${userdata.dob}`)).toISOString()
        const age = calcAge(dateofbirth.toString());
        const dateofcreation = (new Date()).toISOString();
        const short_uid = new ShortUniqueId({ length: 9 });
        const shortid = short_uid.rnd();

        const referrercode_uid = new ShortUniqueId({ length: 10 });
        const referrer_code = referrercode_uid.rnd();
        const referrer = isObjEmpty(userdata?.referrer) ? null : userdata?.referrer;

        console.log("referrer_code:;", referrer_code)
        console.log("referrer:;", referrer)
    
        let onetimefeesrequired = false;

        const res2 = await getCityUsercount({
            city: userdata.city,
            gender: userdata.gender
        }, signal);

        if (res2.success) {
          if (res2.userCount <= 500) {
              onetimefeesrequired = false; 
          } else {
              onetimefeesrequired = true;
          }
        } else {
          onetimefeesrequired = false;
        }

       let email = userdata.email.trim();
       let password = userdata.password.trim();

      const {data, error} = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
              data: {
                  shortid: shortid,
                  firstname: userdata.firstname.trim(),
                  lastname: userdata.lastname.trim(),
                  dateofbirth: dateofbirth,
                  age: age,
                  gender: userdata.gender,
                  educationlevel: userdata.educationlevel,
                  jobstatus: userdata.jobstatus,
                  city: userdata.city,
                  state: userdata.state,
                  language: userdata.language,
                  religion: userdata.language,
                  community: userdata.community,
                  economicstatus: userdata.economicstatus,
                  phonenumber: userdata.phonenumber,
                  email: userdata.email.toLowerCase(),
                  dateofcreation: dateofcreation,
                  dateofactivation: dateofcreation, 
                  dateoflocation: dateofcreation,   
                  onetimefeesrequired: onetimefeesrequired,
                  referral_code: referrer_code,
                  referrer: referrer,
                  latitude: getcoords(userdata.city).lat,
                  longitude: getcoords(userdata.city).lng
              },
              emailRedirectTo: `${BASE_URL}/login`
          }
      });

      console.log("data:", data)

      //data.user.id
      //data.user.aud = "authenticated"
      //data.user.role = "authenticated"
      //data.user.created_at
      //data.user.updated_at
      console.log("data.session:", data.session)
      console.log("error:", error)
      
      if (error) {
          console.log("signUp Error: error", error)
          throw error
      }

      if (!error && data) {
          console.log("not error and data")
          //
          // add this email to the user who referred
          //
          const res3 = await appendToRefereeEmails({
              referrer_code: userdata.referrer,
              emailtoadd: userdata.email.toLowerCase()
          }, signal);

          //if (res3.success) {
          //  return session;
          //} else {
          //    console.log("signUp Error: error", error)
          //    throw error;
          //}
      }

      if (!isObjEmpty(data?.session)) {
          return data.session;
      } else {
          if (!isObjEmpty(data)) {
              return null;
          }
      }
    }
}

export function Register() {
  const dispatch = useDispatch();
  const [data, setData] = useState(INITIAL_DATA);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const RegisterPressCount = useRef(0);
  const simpleValidator1 = useRef(new SimpleReactValidator());
  const simpleValidator2 = useRef(new SimpleReactValidator());
  const [accountformallValid, setAccountformallValid] = useState(true);
  let [searchParams] = useSearchParams();
  const refcode = searchParams.get('ref');

  const doRegister = useMutation({
    mutationFn: async (variables) => {
      const controller = new AbortController();
      return authRegister(variables, controller.signal);
    },
    onSuccess: (resp) => {
      console.log("register onSuccess")
      dispatch(registerSuccess(resp));
    },
    onError: (error) => {
      console.log("register onError error", error)
        toast.error(error.message || 'Registration failed', {
          position: 'top-center',
        });
      dispatch(registerFailure(error));
    }
  });

  function updateFields(fields) {
    setData(prev => {
      return { ...prev, ...fields };
    });
  }

  const ValidationSuccess = (isLast = false) => {
    const userInfoformValid = simpleValidator1.current.allValid();
    const accountformValid = simpleValidator1.current.allValid();
    if (!isLast) {
      if (!userInfoformValid) {
        simpleValidator1.current.showMessages();
        //forceUpdate(1)
        return false;
      }
    } else {
      if (!(accountformValid && accountformallValid)) {
        simpleValidator2.current.showMessages();
        //forceUpdate(1)
        return false;
      }
    }

    if (!isObjEmpty(data.password)) {
      if (!isObjEmpty(data.passwordconfirm)) {
        if (data.password != data.passwordconfirm) {
          return false;
        }
      }
    }
    return true;
  };

  const { currentStepIndex, step, isFirstStep, isLastStep, back, next } =
    UseMultiStepForm([
      <UserInfoForm
        {...data}
        updateFields={updateFields}
        simpleValidator={simpleValidator1}
        refcode={refcode}
      />,
      <CommunityForm {...data} updateFields={updateFields} />,
      <AccountForm
        {...data}
        updateFields={updateFields}
        simpleValidator={simpleValidator2}
        setAccountformallValid={setAccountformallValid}
      />,
    ]);

  const onSubmit = async e => {
    e.preventDefault(); //prevents default refreshing page
    if (!isLastStep) {
      if (ValidationSuccess(false)) {
        return next();
      } else {
        return 1;
      }
    } else {
      if (!ValidationSuccess(true)) {
        return 1;
      }
    }

    setLoading(true);
    RegisterPressCount.current = RegisterPressCount.current + 1;
    
    // TODO: Replace with actual registration mutation (Redux or React Query)
    const registerData = refcode != null ? { ...data, referrer: refcode } : data;
    doRegister.mutate(registerData);
    
    // Temporary placeholder - remove once integration is complete
    console.warn('Registration mutation not configured. Please implement doRegister mutation.');
  };

  function handleClose() {
    navigate(-1);
  }

  return (
    <div className="flex justify-center mt-4 mb-8">
      <Card className="w-[95%] max-w-3xl shadow-lg border-border/50 mx-4 rounded-lg">
        <CardHeader className="bg-gradient-to-r from-[#10182C] to-[#1a2340] pt-6 pb-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold text-white">Create Account</CardTitle>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white rounded-full p-2"
              onClick={handleClose}
              aria-label="Close registration dialog"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                width="20"
                viewBox="0 0 384 512"
                fill="currentColor"
              >
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            </Button>
          </div>
          <Separator className="mt-4 bg-white/20" />
          <div className="mt-4 flex gap-2">
            {[0, 1, 2].map((stepIndex) => (
              <div
                key={stepIndex}
                className={`h-2 flex-1 rounded-full transition-all ${
                  stepIndex <= currentStepIndex
                    ? 'bg-blue-500'
                    : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
          <p className="text-blue-100 text-sm mt-3">
            Step {currentStepIndex + 1} of 3
          </p>
        </CardHeader>

        <CardContent className="pt-8 pb-8">
          <form onSubmit={onSubmit}>
            {isFirstStep && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-900 text-center font-medium">
                  ℹ️ Your Names and Date of Birth should match with your official ID
                </p>
              </div>
            )}
            <div className="mb-6">
              {step}
            </div>
            <Separator className="my-6" />
            <div className="flex justify-between items-center gap-4">
              {!isFirstStep && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="text-base"
                  onClick={back}
                  disabled={loading}
                >
                  ← Back
                </Button>
              )}

              <div className={`${isFirstStep ? 'w-full' : ''} ms-auto`}>
                {RegisterPressCount.current < 4 ? (
                  <Button
                    variant="default"
                    className="text-base font-semibold min-w-[200px]"
                    type="submit"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        {isLastStep ? 'Registering...' : 'Processing...'}
                      </span>
                    ) : (
                      isLastStep ? 'Complete Registration' : 'Continue →'
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    className="text-base font-semibold min-w-[200px]"
                    type="submit"
                    disabled
                  >
                    Retry Limit Exceeded
                  </Button>
                )}
              </div>
            </div>
            {RegisterPressCount.current > 3 && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-center font-medium">
                  ⚠️ RETRY LIMIT EXCEEDED - Please try again later
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
