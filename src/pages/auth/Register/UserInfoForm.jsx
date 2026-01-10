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
import { ChevronDownIcon } from 'lucide-react';
import { FormWrapper } from './FormWrapper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { cities } from '@/lib/cities';
//import  DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";

export function UserInfoForm({
  firstname,
  lastname,
  dob /*age,*/,
  gender,
  educationlevel,
  jobstatus,
  state,
  city,
  updateFields,
  simpleValidator,
}) {
  const [state1, setState1] = useState('');
  const [open, setOpen] = useState(false);
  const [dobDate, setDobDate] = useState(new Date('2002-01-01'));

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
    }),
  });

  return (
    <FormWrapper title="User Details">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="">
          <Label className="py-2">First Name</Label>
          <Input
            type="text"
            name="firstname"
            placeholder=""
            className=""
            autoFocus
            required
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
            required
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
            required
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
                onSelect={date => {
                  setDobDate(date);
                  updateFields({ dob: date });
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="educationlevel" className="px-1 py-2">
            Education
          </Label>
          <Select
            required
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
            required
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
          <Select
            required
            name="state"
            value={state}
            onValueChange={value => {
              formik.values.state = value;
              updateFields({ state: value });
              setState1(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose state" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Andaman and Nichobar Islands">
                  Andaman and Nichobar Islands
                </SelectItem>
                <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
                <SelectItem value="Assam">Assam</SelectItem>
                <SelectItem value="Bihar">Bihar</SelectItem>
                <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                <SelectItem value="Dadra and Nagar Haveli and Daman and Diu">
                  Dadra and Nagar Haveli and Daman and Diu
                </SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Goa">Goa</SelectItem>
                <SelectItem value="Gujarat">Gujarat</SelectItem>
                <SelectItem value="Haryana">Haryana</SelectItem>
                <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
                <SelectItem value="Jammu and Kashmir">Jammu and Kashmir</SelectItem>
                <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
                <SelectItem value="Kerala">Kerala</SelectItem>
                <SelectItem value="Ladakh">Ladakh</SelectItem>
                <SelectItem value="Lakshadweep">Lakshadweep</SelectItem>
                <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                <SelectItem value="Manipur">Manipur</SelectItem>
                <SelectItem value="Meghalaya">Meghalaya</SelectItem>
                <SelectItem value="Mizoram">Mizoram</SelectItem>
                <SelectItem value="Nagaland">Nagaland</SelectItem>
                <SelectItem value="Odisha">Odisha</SelectItem>
                <SelectItem value="Puducherry">Puducherry</SelectItem>
                <SelectItem value="Punjab">Punjab</SelectItem>
                <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                <SelectItem value="Sikkim">Sikkim</SelectItem>
                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                <SelectItem value="Telangana">Telangana</SelectItem>
                <SelectItem value="Tripura">Tripura</SelectItem>
                <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                <SelectItem value="West Bengal">West Bengal</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="city" className="px-1 py-2">
            City or Nearby City
          </Label>
          <Select
            required
            name="city"
            value={city}
            onValueChange={value => {
              formik.values.city = value;
              updateFields({ city: value });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose city" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>{getCities()}</SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </FormWrapper>
  );
}
