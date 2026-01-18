import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDownIcon } from 'lucide-react';
import { FormWrapper } from './FormWrapper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { cities } from '@/lib/cities';
import { states } from '@/lib/states';

export function UserInfoForm({
  firstname,
  lastname,
  dob /*age,*/,
  gender,
  educationlevel,
  jobstatus,
  state,
  city,
  referrer,
  updateFields,
  simpleValidator,
  refcode
}) {
  const [state1, setState1] = useState('');
  const [open, setOpen] = useState(false);
  const [dobDate, setDobDate] = useState(new Date('2002-01-01'));
  const [dobError, setDobError] = useState('');
  const [searchState, setSearchState] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  //const [refcode, setRefcode] = useState(null); // Set to null to show referrer input

  const filteredStates = states.filter(st => 
    st.toLowerCase().includes(searchState.toLowerCase())
  );

  const filteredCities = cities
    .filter(function (city) {
      return city.state === state1;
    })
    .filter(city => 
      city.name.toLowerCase().includes(searchCity.toLowerCase())
    );

  // Calculate max date (20 years ago from today)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 20);

  const currentYear = new Date().getFullYear();
  const fromYear = 1900;
  const toYear = currentYear - 20;

  const getCities = () =>
    cities
      .filter(function (city) {
        return city.state === state1;
      })
      .map((city, idx) => {
        return (
          <SelectItem key={idx} value={city.name}>
            {city.name}
          </SelectItem>
        );
      });

  const formik = useFormik({
    initialValues: {
      firstname: firstname,
      lastname: lastname,
      referrer: referrer || '',
      dob: dob,
      gender: gender,
      educationlevel: educationlevel,
      job: '',
      state: state,
      city: city,
    },
    validationSchema: Yup.object().shape({
      firstname: Yup.string()
        .min(4)
        .max(15)
        .required('required')
        .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed'),
      lastname: Yup.string()
        .min(3)
        .max(15)
        .required('required')
        .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed'),
      referrer: Yup.string()
        .optional()
        .test('referrer-validation', 'Referrer code must be exactly 10 characters and contain only letters and numbers', function(value) {
          if (!value || value.length === 0) {
            return true; // Optional field, empty is valid
          }
          if (value.length !== 10) {
            return this.createError({ message: 'Referrer code must be exactly 10 characters' });
          }
          if (!/^[a-zA-Z0-9]+$/.test(value)) {
            return this.createError({ message: 'Referrer code must contain only letters and numbers' });
          }
          return true;
        }),
      dob: Yup.date()
        .required('Date of birth is required'),
    }),
    validateOnChange: false,
  });

  return (
    <FormWrapper title="User Details">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
        {refcode == null ? (
          <div className="col-span-1 md:col-span-2">
            <Label className="py-2">Your Referrer Code (<span className='text-primary'>Leave it empty if none</span>)</Label>
            <Input
              type="text"
              name="referrer"
              placeholder=""
              className=""
              value={formik.values.referrer}
              onChange={e => {
                formik.values.referrer = e.target.value.trim();
                updateFields({ referrer: e.target.value });
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.referrer && formik.errors.referrer ? (
              <p className="text-red-600">{formik.errors.referrer}</p>
            ) : null}
          </div>
        ) : null}
        <div className="">
          <Label className="py-2">First Name</Label>
          <Input
            type="text"
            name="firstname"
            placeholder=""
            className=""
            autoFocus
            value={formik.values.firstname}
            onChange={e => {
              formik.values.firstname = e.target.value.trim();
              updateFields({ firstname: e.target.value });
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.firstname && formik.errors.firstname ? (
            <p className="text-red-600">{formik.errors.firstname}</p>
          ) : null}
          {simpleValidator.current.message('firstname', firstname, 'required|min:4|alpha')}
        </div>

        <div className="">
          <Label className="py-2">Last Name</Label>
          <Input
            type="text"
            name="lastname"
            placeholder=""
            className=""
            value={formik.values.lastname}
            onChange={e => {
              formik.values.lastname = e.target.value.trim();
              updateFields({ lastname: e.target.value });
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.lastname && formik.errors.lastname ? (
            <p className="text-red-600">{formik.errors.lastname} </p>
          ) : null}
          {simpleValidator.current.message('lastname', lastname, 'required|min:3|alpha')}
        </div>

        <div>
          <Label htmlFor="gender" className="py-2">
            Gender
          </Label>
          <Select
            name="gender"
            value={gender}
            onValueChange={value => {
              formik.values.gender = value;
              updateFields({ gender: value });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="">
          <Label htmlFor="date" className="px-1 py-2">
            Date of birth
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" id="date" className="w-full justify-between font-normal">
                {dobDate ? dobDate.toLocaleDateString() : 'Select date'}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={dobDate}
                captionLayout="dropdown"
                toDate={maxDate}
                fromYear={fromYear}
                toYear={toYear}
                onSelect={date => {
                  setDobDate(date);
                  formik.setFieldValue('dob', date);
                  formik.setFieldTouched('dob', true);
                  if (date > maxDate) {
                    setDobError('You must be at least 20 years old to register. Please select a valid date of birth.');
                  } else {
                    setDobError('');
                  }
                  updateFields({ dob: date });
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
          {formik.touched.dob && dobError ? (
            <p className="text-red-600 text-sm mt-1">{dobError}</p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="educationlevel" className="px-1 py-2">
            Education
          </Label>
          <Select
            name="educationlevel"
            value={educationlevel}
            onValueChange={value => {
              formik.values.educationlevel = value;
              updateFields({ educationlevel: value });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Education" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="High School">High School</SelectItem>
                <SelectItem value="Bachelors level">Bachelors level</SelectItem>
                <SelectItem value="Masters level">Masters level</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="job" className="px-1 py-2">
            Job status
          </Label>
          <Select
            name="job"
            value={jobstatus === true || jobstatus === 'Yes' ? 'Yes' : jobstatus === false || jobstatus === 'No' ? 'No' : ''}
            onValueChange={value => {
              formik.values.job = value;
              updateFields({ jobstatus: value });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Job" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="state" className="px-1 py-2">
            State or Union territory
          </Label>
          <Popover open={stateOpen} onOpenChange={setStateOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between font-normal">
                {state || 'Choose state'}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-2">
                <Input
                  placeholder="Search states..."
                  value={searchState}
                  onChange={(e) => setSearchState(e.target.value)}
                  className="mb-2"
                />
              </div>
              <ScrollArea className="h-64">
                {filteredStates.map((st, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      formik.values.state = st;
                      updateFields({ state: st });
                      setState1(st);
                      setSearchState('');
                      setStateOpen(false);
                    }}
                  >
                    {st}
                  </Button>
                ))}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="city" className="px-1 py-2">
            City or Nearby City
          </Label>
          <Popover open={cityOpen} onOpenChange={setCityOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between font-normal">
                {city || 'Choose city'}
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-2">
                <Input
                  placeholder="Search cities..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="mb-2"
                />
              </div>
              <ScrollArea className="h-64">
                {filteredCities.map((ct, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      formik.values.city = ct.name;
                      updateFields({ city: ct.name });
                      setSearchCity('');
                      setCityOpen(false);
                    }}
                  >
                    {ct.name}
                  </Button>
                ))}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </FormWrapper>
  );
}
