import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormWrapper } from './FormWrapper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator';
import usePasswordToggle from '@/hooks/usePasswordToggle';

const isNumberRegx = /\d/;
const specialCharacterRegx = /[^A-Za-z 0-9]/;

export function AccountForm({
  aadharnumber,
  phonenumber,
  email,
  password,
  passwordconfirm,
  updateFields,
  setAccountformallValid,
}) {
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();
  const [ConfirmPasswordInputType, ConfirmToggleIcon] = usePasswordToggle();
  const formik = useFormik({
    initialValues: {
      aadharnumber: aadharnumber,
      phonenumber: phonenumber,
      email: email,
      password: password,
      passwordconfirm: passwordconfirm,
    },
    validationSchema: Yup.object().shape({
      // aadharnumber: Yup.string()
      //   .matches(/^[0-9]+$/, 'Must be only digits')
      //   .length(12)
      //   .required('required'),
      phonenumber: Yup.string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .length(10)
        .required('required'),
      email: Yup.string().email().required('required'),
      password: Yup.string().min(6).required('required'),
      passwordconfirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    }),
  });

  const onChangePassword = password => {
    //setPassword(password);
    if (
      password.length >= 8 &&
      isNumberRegx.test(password) &&
      specialCharacterRegx.test(password)
    ) {
      setAccountformallValid(true);
    } else {
      setAccountformallValid(false);
    }
  };

  return (
    <FormWrapper title="Account Creation">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
      {/* <div className="grid gap-2">
          <Label htmlFor="aadharnumber">Aadhar Number</Label>
          <Input
            id="aadharnumber"
            type="text"
            placeholder="1234 3434 4545"
            onChange={e => {
              formik.values.aadharnumber = e.target.value.trim();
              updateFields({ aadharnumber: e.target.value.trim() });
            }}
            onBlur={formik.handleBlur}
            value={formik.values.aadharnumber}
          />
          {formik.touched.aadharnumber && formik.errors.aadharnumber && (
            <p className="text-red-600 text-sm">{formik.errors.aadharnumber}</p>
          )}
        </div> */}

        <div className="grid gap-2">
          <Label htmlFor="phonenumber">Phone Number</Label>
          <Input
            id="phonenumber"
            type="text"
            placeholder="1234567891"
            onChange={e => {
              formik.values.phonenumber = e.target.value.trim();
              updateFields({ phonenumber: e.target.value.trim() });
            }}
            onBlur={formik.handleBlur}
            value={formik.values.phonenumber}
          />
          {formik.touched.phonenumber && formik.errors.phonenumber && (
            <p className="text-red-600 text-sm">{formik.errors.phonenumber}</p>
          )}
        </div>
      </div>
      <div className="grid gap-2 mt-4">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          value={formik.values.email}
          onChange={e => {
            formik.values.email = e.target.value.trim();
            updateFields({ email: e.target.value.trim().toLowerCase() });
          }}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-600 text-sm">{formik.errors.email}</p>
        )}
      </div>
      <div className="grid gap-2 mt-4">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={PasswordInputType}
            value={formik.values.password}
            onChange={e => {
              formik.values.password = e.target.value.trim();
              updateFields({ password: e.target.value.trim() });
              onChangePassword(e.target.value.trim());
            }}
            onBlur={formik.handleBlur}
          />
          <span
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500
                                      hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 bg-background"
          >
            {ToggleIcon}
          </span>
        </div>

        {formik.touched.password && formik.errors.password && (
          <p className="text-red-600 text-sm">{formik.errors.password}</p>
        )}
      </div>
      <div className="grid gap-2 mt-4">
        <Label htmlFor="passwordconfirm">Password (Confirm)</Label>
        <div className="relative">
          <Input
            id="passwordconfirm"
            type={ConfirmPasswordInputType}
            value={formik.values.passwordconfirm}
            onChange={e => {
              formik.values.passwordconfirm = e.target.value.trim();
              updateFields({ passwordconfirm: e.target.value.trim() });
              onChangePassword(e.target.value.trim());
            }}
            onBlur={formik.handleBlur}
          />
          <span
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500
                                      hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 bg-background"
          >
            {ConfirmToggleIcon}
          </span>
        </div>

        {formik.touched.passwordconfirm && formik.errors.passwordconfirm && (
          <p className="text-red-600 text-sm">{formik.errors.passwordconfirm}</p>
        )}
      </div>
    </FormWrapper>
  );
}
