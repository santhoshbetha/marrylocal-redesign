import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import SimpleReactValidator from 'simple-react-validator';
import { AccountForm } from './AccountForm';
import { CommunityForm } from './CommunityForm';
import { UseMultiStepForm } from './UseMultiStepForm';
import { UserInfoForm } from './UserInfoForm';

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

export function Register() {
  const [data, setData] = useState(INITIAL_DATA);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const RegisterPressCount = useRef(0);
  const simpleValidator1 = useRef(new SimpleReactValidator());
  const simpleValidator2 = useRef(new SimpleReactValidator());
  const [accountformallValid, setAccountformallValid] = useState(true);
  let [searchParams] = useSearchParams();
  const refcode = searchParams.get('ref');

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
    // const registerData = refcode != null ? { ...data, referrer: refcode } : data;
    // doRegister.mutate(registerData);
    
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
