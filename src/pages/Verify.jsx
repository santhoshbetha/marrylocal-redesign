import { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QrScanner from 'qr-scanner';
import axios from 'axios';
import { convertXML } from 'simple-xml-to-json';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { updateUserInfo } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { RotateCw, CreditCard, Car, Plane } from 'lucide-react';
import { toast } from 'sonner';

const OCR_API_URL = import.meta.env.VITE_OCR_API_URL || import.meta.env.VITE_API_URL || '';

function isEmpty(val) {
  return val === undefined || val == null || val.length <= 0 || val == 0 ? true : false;
}

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

// multiplication table d
var d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];
// permutation table p
var p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];
// inverse table inv
var _inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];
// converts string or number to an array and inverts it
function invArray(array) {
  if (Object.prototype.toString.call(array) == '[object Number]') {
    array = String(array);
  }

  if (Object.prototype.toString.call(array) == '[object String]') {
    array = array.split('').map(Number);
  }

  return array.reverse();
}

// validates checksum
function validate(array) {
  var c = 0;
  var invertedArray = invArray(array);

  for (var i = 0; i < invertedArray.length; i++) {
    c = d[c][p[i % 8][invertedArray[i]]];
  }
  return c === 0;
  /*var regexp=/^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;
  if (regexp.test(array)) {
      return true
  } else {
    return false
  }*/
}

function validate_adhar(adhar) {
  //console.clear();
  //pretty dumb but the easiest solution to know if the number is 12 digit or not :)
  if (adhar >= 100000000000 && adhar <= 999999999999) {
    if (validate(adhar) == false) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

export function Verify() {
  const { user, profiledata, setProfiledata } = useAuth();
  const [aadharNum, setAadharNum] = useState('');
  const [_file1, setFile1] = useState(null);
  let [numclass, setNumclass] = useState('');
  let [imgclass, setImgclass] = useState('hidden');
  let [retryclass, setRetryclass] = useState('custom-opacity');
  let [opacityclass, setOpacityclass] = useState('');
  const [aadharImg, setAadharImg] = useState({});
  const [verifysuccess, setVerifysuccess] = useState(false);
  const [aadharAdding, setaAdharAdding] = useState(false);
  const isOnline = useOnlineStatus();
  const trycount = useRef(
    isObjEmpty(profiledata?.verifytrycount) ? 0 : profiledata?.verifytrycount,
  );
  let aadharqrscanpass = false;
  let errmsg = '';

  useEffect(() => {
    const setAadharverified = async () => {
      let aadharverified = true;

      const res = await updateUserInfo(user?.id, {
        aadharverified: aadharverified,
      });
      if (res.success) {
        setProfiledata({ ...profiledata, aadharverified: aadharverified });
        toast('Changes update successful', {
          position: 'top-center',
        });
      } else {
        alert('Something wrong. Try again later');
      }
      setaAdharAdding(false);
      setOpacityclass('');
    };

    if (verifysuccess) {
      setaAdharAdding(true);
      setOpacityclass('custom-opacity');
      setAadharverified();
    }
  }, [verifysuccess]);

  const callOCRAPI = async fileIn => {
    if (!OCR_API_URL) {
      alert('OCR service URL not configured. Please set VITE_OCR_API_URL or VITE_API_URL in env.');
      return null;
    }

    const formData = new FormData();
    formData.append('idimage', fileIn);

    try {
      const resp = await axios.post(`${OCR_API_URL}/verify/idverify`, formData);
      return resp;
    } catch (error) {
      if (error?.response?.status == 429) {
        alert('Too many requests. try again after 2 minutes!');
      } else {
        alert('Aadhar card error, try again or email the copy to contact@marrylocal.in');
      }
      setAadharImg({});
      setaAdharAdding(false);
      return null;
    }
  };

  const formik = useFormik({
    initialValues: {
      aadhar: '',
    },
    validationSchema: Yup.object({
      aadhar: Yup.string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .length(12)
        .required('required'),
    }),
  });

  const verifyNumber = async e => {
    e.preventDefault();
    console.log('verify here');
    if (validate_adhar(formik.values.aadhar)) {
      console.log('verify here 2:', profiledata?.aadharnumber);
      if (!isObjEmpty(profiledata?.aadharnumber)) {
        if (formik.values.aadhar == Number(profiledata?.aadharnumber)) {
          console.log('verify here 3');
          setNumclass('custom-opacity');
          setImgclass('');
          setRetryclass('');
        } else {
          alert('Aadhar number is different from the one provided while registering, try again');
          formik.resetForm({ values: '' });
        }
      } else {
        setNumclass('custom-opacity');
        setImgclass('');
        setRetryclass('');
      }
    } else {
      alert('Invalid aadhar number, try again');
      formik.resetForm({ values: '' });
    }
  };

  const extractStrings = async dataArray => {
    var alphabetsregex = /^[A-Za-z\s]*$/;
    let i = 0;
    let stringsArray = [];
    let furtherarray = [];
    while (i < dataArray.length) {
      if (dataArray[i].match(alphabetsregex) && dataArray[i].length > 3) {
        if (dataArray[i].length > 3) {
          //minimun 4 length names
          let j = 0;
          furtherarray = dataArray[i].split(' ');
          while (j < furtherarray.length) {
            if (furtherarray[j].length > 3) {
              //minimun 4 length names
              stringsArray.push(furtherarray[j].toLowerCase());
            }
            j++;
          }
        }
        //stringsArray.push(dataArray[i])
      }
      i++;
    }
    return stringsArray;
  };

  const extractNumbers = async dataArray => {
    var numbersregex = /^[0-9\s]*$/;
    var numbersregex2 = /^[0-9]{0,}$/; //no space regex
    let i = 0;
    let numbersArray = [];
    let furtherarray = [];
    while (i < dataArray.length) {
      if (dataArray[i].match(numbersregex) && dataArray[i].length > 3) {
        if (dataArray[i].length > 4) {
          let j = 0;
          furtherarray = dataArray[i].split(' ');
          while (j < furtherarray.length) {
            if (furtherarray[j].match(numbersregex2)) {
              numbersArray.push(Number(furtherarray[j]));
            }
            j++;
          }
        } else {
          if (dataArray[i].match(numbersregex2)) {
            numbersArray.push(Number(dataArray[i]));
          }
        }
      }
      i++;
    }
    return numbersArray;
  };

  const extractdob = async dataArray => {
    var dobregex = /\d{1,2}\/\d{1,2}\/\d{2,4}/;
    let i = 0;

    while (i < dataArray.length) {
      if (dataArray[i].match(dobregex)) {
        return dataArray[i].trim().slice(-10);
      }
      i++;
    }
    return null;
  };

  async function updateVerifytrycount(verifytrycount) {
    const res = await updateUserInfo(user?.id, {
      verifytrycount: verifytrycount,
    });
    if (res.success) {
      setProfiledata({ ...profiledata, verifytrycount: verifytrycount });
      toast('Changes update successful', {
        position: 'top-center',
      });
    } else {
      alert('Something wrong. Try again later');
    }
  }

  //https://github.com/nimiq/qr-scanner
  const ValidateAadhar = async (event, fileIn) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append(1, fileIn);
    var options = {};

    if (!user) {
      alert('Something wrong. Try reloading page');
      return;
    }

    try {
      const result = await QrScanner.scanImage(fileIn, options);
      const toJson = await convertXML(result.toString());

      if (!isObjEmpty(toJson.PrintLetterBarcodeData)) {
        if (toJson.PrintLetterBarcodeData.uid == aadharNum) {
          //validate name and year of birth
          const aadhar_names = toJson.PrintLetterBarcodeData.name.toLowerCase().split(' ');
          const currentyear = new Date().getFullYear();
          if (
            aadhar_names.includes(profiledata?.firstname.toLowerCase()) ||
            aadhar_names.includes(profiledata?.lastname.toLowerCase())
          ) {
            if (!isObjEmpty(toJson.PrintLetterBarcodeData.yob)) {
              const age = Math.abs(currentyear - toJson.PrintLetterBarcodeData.yob);
              if (!isEmpty(profiledata?.age)) {
                if (
                  profiledata?.age == age ||
                  profiledata?.age == age - 1 ||
                  profiledata?.age == age + 1
                ) {
                  setVerifysuccess(true);
                  aadharqrscanpass = true;
                  alert('Aadhar Verification Successful!!');
                } else {
                  alert('Date of birth does not match, try again');
                  setAadharImg({});
                  setaAdharAdding(false);
                  aadharqrscanpass = true;
                }
              }
            }
          } else {
            alert('Names does not match, try again');
            setAadharImg({});
            setaAdharAdding(false);
            aadharqrscanpass = true;
          }
        } else {
          alert('Aadhar numbers does not match, try again');
          setAadharImg({});
          setaAdharAdding(false);
          aadharqrscanpass = true;
        }
      } else {
        errmsg = 'Aadhar card error, try again or email the copy to contact@marrylocal.in';
        aadharqrscanpass = false;
      }
    } catch (error) {
      if (error?.response?.status == 429) {
        alert('Too many requests. try again after 2 minutes!');
        setAadharImg({});
        setaAdharAdding(false);
        aadharqrscanpass = true; //not true but just to prevent to go to next step of OCR scanning
      } else {
        errmsg = `QR image not clear, try again or email the 33333 copy to contact@marrylocal.in`;
        aadharqrscanpass = false;
      }
    }

    if (aadharqrscanpass == true) {
      alert(errmsg);
    }

    if (aadharqrscanpass == false) {
      try {
        // Try OCR
        const resp = await callOCRAPI(fileIn);
        if (resp.data.status == 'success') {
          if (!isObjEmpty(resp.data.data.ParsedResults)) {
            const dataArray = resp.data.data.ParsedResults[0].ParsedText.split('\r\n');

            let extractedstrings = await extractStrings(dataArray);
            let extractednumbers = await extractNumbers(dataArray);
            let extracteddob = await extractdob(dataArray);
            let extractedyob = !isObjEmpty(extracteddob) ? extracteddob.slice(-4) : null;
            const currentyear = new Date().getFullYear();

            if (!isObjEmpty(extractedstrings) & !isObjEmpty(extractednumbers)) {
              if (
                extractedstrings.includes(profiledata?.firstname.toLowerCase()) ||
                extractedstrings.includes(profiledata?.lastname.toLowerCase())
              ) {
                let aadharnum1 = aadharNum % 10000;
                let aadharnum2 = aadharNum / 10000;
                aadharnum2 = parseInt(aadharnum2 % 10000);
                let aadharnum3 = aadharNum / 100000000;
                aadharnum3 = parseInt(aadharnum3 % 10000);

                if (
                  extractednumbers.includes(aadharnum1) &&
                  extractednumbers.includes(aadharnum2) &&
                  extractednumbers.includes(aadharnum3)
                ) {
                  // yob/age verification
                  if (!isObjEmpty(extracteddob) && isNumber(extractedyob)) {
                    const age = Math.abs(currentyear - extractedyob);
                    if (!isEmpty(profiledata?.age)) {
                      if (
                        profiledata?.age == age ||
                        profiledata?.age == age - 1 ||
                        profiledata?.age == age + 1
                      ) {
                        setVerifysuccess(true);
                        alert('Aadhar Verification Successful!!');
                      } else {
                        alert('date of birth does not match, try again');
                        setAadharImg({});
                        setaAdharAdding(false);
                      }
                    }
                  } else {
                    //set verify success if some reason DOB extract incorrect
                    setVerifysuccess(true);
                    alert('Aadhar Verification Successful!!');
                  }
                } else {
                  alert('Aadhar numbers does not match, try again');
                  setAadharImg({});
                  setaAdharAdding(false);
                }
              } else {
                alert('Names does not match, try again');
                setAadharImg({});
                setaAdharAdding(false);
              }
            } else {
              alert('Data Extract Error. try again now or later');
              setAadharImg({});
              setaAdharAdding(false);
            }
          } else {
            alert('Server timeout. try again now or later');
            trycount.current = trycount.current - 1;
            setAadharImg({});
            setaAdharAdding(false);
          }
        }

        if (resp == null || resp.data.status == 500) {
          alert('Image not clear, try again or email the copy to contact@marrylocal.in');
          setaAdharAdding(false);
        }
        setAadharImg({});
        setaAdharAdding(false);
      } catch (error) {
        if (error?.response?.status == 429) {
          alert('Too many requests. try again after 2 minutes!');
          setAadharImg({});
          setaAdharAdding(false);
        } else {
          alert('Aadhar card error, try again or email the copy to contact@marrylocal.in');
          setAadharImg({});
          setaAdharAdding(false);
        }
      }
    }
    setaAdharAdding(false);
  };

  const retryClick = e => {
    e.preventDefault();
    setNumclass('');
    setImgclass('hidden');
    setAadharImg({});
    formik.resetForm({ values: '' });
    setaAdharAdding(false);
  };

  return (
    <div>
      <Card className="w-full shadow-md border-border/50 rounded-none">
        <CardHeader className="flex flex-row items-center justify-between md:mx-2 lg:mx-10">
          <CardTitle className="text-2xl">Verification</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center w-[100%] relative">
          {aadharAdding && (
            <Spinner className="absolute top-[50%] left-[50%] z-50 cursor-pointer size-10" />
          )}

          <Tabs defaultValue="aadhaar" className="w-full max-w-4xl">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="aadhaar" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Aadhaar Card
              </TabsTrigger>
              <TabsTrigger value="driver-license" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Driver License
              </TabsTrigger>
              <TabsTrigger value="passport" className="flex items-center gap-2">
                <Plane className="h-4 w-4" />
                Passport
              </TabsTrigger>
            </TabsList>

            <TabsContent value="aadhaar" className="space-y-6">
              {profiledata?.aadharverified == true && (
                <div className="p-4">
                  <span className="inline-block border border-accent-500 px-4 py-4 text-md font-semibold rounded-lg bg-yellow-200">
                    You are verified, nothing to do here.
                  </span>
                </div>
              )}
              {profiledata?.aadharverified == false && (
                <div className={`${opacityclass} w-[80%]`}>
                  <div className="underline underline-offset-2 text-2xl pb-2">
                    Upload your Aadhar front picture &nbsp;
                  </div>
                  <div className="text-red-600 text-lg pb-4">
                    (QR code should be visibly clear on your aadhar picture)
                  </div>
                  <div className="">
                    <form className="mt-4" onSubmit={verifyNumber}>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div className={`${numclass} space-y-2 md:w-[400px]`}>
                      <Label>Enter Aadhar Number&nbsp;:</Label>
                      <Input
                        type="text"
                        className="border-bottom"
                        name="aadhar"
                        placeholder=""
                        value={formik.values.aadhar}
                        onChange={e => {
                          formik.handleChange(e);
                          setAadharNum(e.target.value);
                        }}
                        onBlur={formik.handleBlur}
                        required
                      />
                      {formik.touched.aadhar && formik.errors.aadhar ? (
                        <p className="text-red-600">{formik.errors.aadhar} </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-0 md:flex-row">
                      <Button className={`${numclass}`} variant="secondary" type="submit">
                        Click here to verify number
                      </Button>
                      <Button
                        className={`${retryclass}`}
                        size="icon-sm"
                        data-toggle="tooltip"
                        title="retry"
                        onClick={e => {
                          retryClick(e);
                        }}
                      >
                        <RotateCw />
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
              <div className={`${imgclass}`}>
                <form>
                  <div className="pt-6">
                    {aadharImg && (
                      <img
                        className="w-[300px]"
                        src={aadharImg['url']}
                        //src='https://blr1.vultrobjects.com/localm/33361/first'
                        //src={file1 && URL.createObjectURL(file1)}
                        alt=""
                      />
                    )}
                    {JSON.stringify(aadharImg) === '{}' && (
                      <>
                        <div className="space-y-2 mt-6">
                          <Label className="mt-4">Click to Upload:</Label>
                          <Input
                            className="lg:w-[40%]"
                            onChange={async e => {
                              setFile1(e.target.files[0]);
                              if (isOnline) {
                                trycount.current = trycount.current + 1;
                                setProfiledata({
                                  ...profiledata,
                                  verifytrycount: trycount.current,
                                });
                                if (trycount.current < 25) {
                                  //max 24 retries
                                  setAadharImg({
                                    url:
                                      e.target.files[0] && URL.createObjectURL(e.target.files[0]),
                                  });
                                  setaAdharAdding(true);
                                  ValidateAadhar(e, e.target.files[0]);
                                } else {
                                  await updateVerifytrycount(trycount.current);
                                  setaAdharAdding(false);
                                  setImgclass('hidden');
                                  alert('RETRY LIMIT EXCEEDED, EMAIL US YOUR ID');
                                }
                              } else {
                                alert('You are offline. check your internet connection.');
                                return;
                              }
                            }}
                            onClick={e => (e.target.value = null)}
                            type="file"
                            accept="image/*"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </form>
                {JSON.stringify(aadharImg) !== '{}' && (
                  <>
                    {aadharAdding ? (
                      <></>
                    ) : (
                      <Button
                        className={`${opacityclass}`}
                        variant="destructive"
                        onClick={() => {
                          setAadharImg({});
                        }}
                      >
                        Remove to Add New
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
            </TabsContent>

            <TabsContent value="driver-license" className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <Car className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-2xl font-semibold">Driver License Verification</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Verify your identity using your Driver License. This helps us ensure the security and authenticity of your account.
                </p>
              </div>

              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-lg">Submit Driver License Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dl-number">License Number</Label>
                      <Input
                        id="dl-number"
                        placeholder="Enter license number"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dl-state">State</Label>
                      <Input
                        id="dl-state"
                        placeholder="Issuing state"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dl-dob">Date of Birth</Label>
                      <Input
                        id="dl-dob"
                        type="date"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dl-expiry">Expiry Date</Label>
                      <Input
                        id="dl-expiry"
                        type="date"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Driver License (Front)</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      className="mt-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Driver License (Back)</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      className="mt-1"
                    />
                  </div>

                  <Button className="w-full mt-6" disabled>
                    Submit for Verification
                    <span className="ml-2 text-xs">(Coming Soon)</span>
                  </Button>

                  <p className="text-sm text-gray-500 text-center mt-4">
                    Driver License verification will be available soon. Please use Aadhaar verification for now.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="passport" className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <Plane className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-2xl font-semibold">Passport Verification</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Verify your identity using your Passport. This provides the highest level of identity verification.
                </p>
              </div>

              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-lg">Submit Passport Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="passport-number">Passport Number</Label>
                      <Input
                        id="passport-number"
                        placeholder="Enter passport number"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="passport-country">Issuing Country</Label>
                      <Input
                        id="passport-country"
                        placeholder="Country of issue"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="passport-dob">Date of Birth</Label>
                      <Input
                        id="passport-dob"
                        type="date"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="passport-expiry">Expiry Date</Label>
                      <Input
                        id="passport-expiry"
                        type="date"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Passport Photo Page</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      className="mt-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Passport Address Page (Optional)</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      className="mt-1"
                    />
                  </div>

                  <Button className="w-full mt-6" disabled>
                    Submit for Verification
                    <span className="ml-2 text-xs">(Coming Soon)</span>
                  </Button>

                  <p className="text-sm text-gray-500 text-center mt-4">
                    Passport verification will be available soon. Please use Aadhaar verification for now.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
