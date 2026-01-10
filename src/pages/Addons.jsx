import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '../context/AuthContext';
import { useFormik } from 'formik';
import { Payment } from '@/components/Payment';
import { states } from '../lib/states';
import { cities } from '../lib/cities';
import { coords } from '../lib/defaultcoords';
import { Separator } from '@/components/ui/separator';
import { updateUserInfo } from '../services/userService';

const getStates = states.map((state, index) => (
  <SelectItem key={index} value={state}>
    {state}
  </SelectItem>
));

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

let addonsdata = {};
let subscriptiondata = {};
let newProfiledata;

export function Addons() {
  const { user, setAuth: _setAuth, profiledata, setProfiledata } = useAuth();
  const [communitySearch, setCommunitySearch] = useState(false);
  const [fullcitySearch, setFullcitySearch] = useState(false);
  const [loc2price, setLoc2price] = useState(0);
  const [loc3price, setLoc3price] = useState(0);
  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);
  const [error3, setError3] = useState(false);
  const [error4, setError4] = useState(false);
  const [totalprice, setTotalprice] = useState(0);

  const [paymentdone, setPaymentdone] = useState(false);
  const [addonsdone, setAddonsdone] = useState(false);
  const [subscriptiondone, setSubscriptiondone] = useState(false);

  const getCities = stateIn =>
    cities
      .filter(function (city) {
        return city.state === stateIn && city.name != profiledata?.city;
      })
      .map((city, idx) => {
        return (
          <SelectItem key={idx} value={city.name}>
            {city.name}
          </SelectItem>
        );
      });

  useEffect(() => {
    if (!isEmpty(profiledata)) {
      if (!isEmpty(profiledata?.addons)) {
        if (profiledata?.addons?.communitySearch == true) {
          setCommunitySearch(false); // to make rate value display from 100 to 0
        }
        if (profiledata?.addons?.fullcitySearch == true) {
          setFullcitySearch(false); // to make rate value display from 100 to 0
        }
        if (!isEmpty(profiledata?.addons?.location2?.city2)) {
          setLoc2price(Number(0));
        }
        if (!isEmpty(profiledata?.addons?.location3?.city3)) {
          setLoc3price(Number(0));
        }
        if (
          profiledata?.addons?.communitySearch == true &&
          profiledata?.addons?.fullcitySearch == true &&
          !isEmpty(profiledata?.addons?.location2?.city2) &&
          !isEmpty(profiledata?.addons?.location3?.city3)
        ) {
          // setcheckoutClass("custom-opacity")
        }
      }
    }
  }, [totalprice, profiledata]);

  useEffect(() => {
    const saveaddons = async () => {
      if (addonsdone == true) {
        setProfiledata({ ...profiledata, addons: addonsdata });
      } else {
        const res = await updateUserInfo(user?.id, {
          addons: JSON.stringify(addonsdata),
        });
        if (res.success) {
          setProfiledata({ ...profiledata, addons: addonsdata });
        } else {
          console.log(res.msg);
        }
      }
    };

    const savesubscriptions = async () => {
      if (subscriptiondone == true) {
        await setProfiledata(newProfiledata);
      } else {
        const res = await updateUserInfo(user?.id, {
          subscriptioninfo: JSON.stringify(subscriptiondata),
        });
        if (res.success) {
          setProfiledata({
            ...profiledata,
            subscriptioninfo: subscriptiondata,
          });
        } else {
          console.log(res.msg);
        }
      }
    };

    if (paymentdone) {
      try {
        saveaddons();
        savesubscriptions();
      } catch (error) {
        if (error?.response?.status == 429) {
          alert('Too many requests. try again after 2 minutes!');
        } else {
          alert('Something wrong. Try again later');
        }
      }
      setPaymentdone(false);
      setTotalprice(0);
    }
  }, [paymentdone]);

  const formik = useFormik({
    initialValues: {
      state2: '',
      city2: '',
      state3: '',
      city3: '',
    },
  });

  const getcoords = city => {
    for (var i = 0; i < coords.length; i++) {
      if (coords[i].city == city) {
        return coords[i].coords;
      }
    }
  };

  const handleAddonsSubmit = async e => {
    e.preventDefault();
    const datenow = new Date();
    const date2 = new Date();
    const startdate = datenow.toISOString().substring(0, 10).toString();
    const enddate = new Date(date2.setMonth(date2.getMonth() + 1))
      .toISOString()
      .substring(0, 10)
      .toString();

    addonsdata = {
      communitySearch:
        profiledata?.addons?.communitySearch == true
          ? profiledata?.addons?.communitySearch
          : communitySearch,
      fullcitySearch:
        profiledata?.addons?.fullcitySearch == true
          ? profiledata?.addons?.fullcitySearch
          : fullcitySearch,
      location2: {
        city2: isObjEmpty(profiledata?.addons?.location2?.city2)
          ? formik.values.city2
          : profiledata?.addons?.location2?.city2,
        state2: isObjEmpty(profiledata?.addons?.location2?.state2)
          ? formik.values.state2
          : profiledata?.addons?.location2?.state2,
        lat: isObjEmpty(profiledata?.addons?.location2?.lat)
          ? getcoords(formik.values.city2)
            ? getcoords(formik.values.city2).lat
            : 0
          : profiledata?.addons?.location2?.lat,
        lng: isObjEmpty(profiledata?.addons?.location2?.lng)
          ? getcoords(formik.values.city2)
            ? getcoords(formik.values.city2).lng
            : 0
          : profiledata?.addons?.location2?.lng,
        usercoordsset: isObjEmpty(profiledata?.addons?.location2?.usercoordsset)
          ? false
          : profiledata?.addons?.location2?.usercoordsset,
        defaultcoordsset: isObjEmpty(profiledata?.addons?.location2?.defaultcoordsset)
          ? false
          : profiledata?.addons?.location2?.defaultcoordsset,
      },
      location3: {
        city3: isObjEmpty(profiledata?.addons?.location3?.city3)
          ? formik.values.city3
          : profiledata?.addons?.location3?.city3,
        state3: isObjEmpty(profiledata?.addons?.location3?.state3)
          ? formik.values.state3
          : profiledata?.addons?.location3?.state3,
        lat: isObjEmpty(profiledata?.addons?.location3?.lat)
          ? getcoords(formik.values.city3)
            ? getcoords(formik.values.city3).lat
            : 0
          : profiledata?.addons?.location3?.lat,
        lng: isObjEmpty(profiledata?.addons?.location3?.lng)
          ? getcoords(formik.values.city3)
            ? getcoords(formik.values.city3).lng
            : 0
          : profiledata?.addons?.location3?.lng,
        usercoordsset: isObjEmpty(profiledata?.addons?.location3?.usercoordsset)
          ? false
          : profiledata?.addons?.location3?.usercoordsset,
        defaultcoordsset: isObjEmpty(profiledata?.addons?.location3?.defaultcoordsset)
          ? false
          : profiledata?.addons?.location3?.defaultcoordsset,
      },
    };

    subscriptiondata = {
      communitySearch:
        addonsdata?.communitySearch == true
          ? {
              active: true,
              startdate:
                !isObjEmpty(profiledata?.subscriptioninfo) &&
                profiledata?.subscriptioninfo?.communitySearch?.active == true
                  ? profiledata?.subscriptioninfo?.communitySearch?.startdate
                  : startdate,
              enddate:
                !isObjEmpty(profiledata?.subscriptioninfo) &&
                profiledata?.subscriptioninfo?.communitySearch?.active == true
                  ? profiledata?.subscriptioninfo?.communitySearch?.enddate
                  : enddate,
              canceldate: '',
            }
          : {
              active: false,
              startdate: '',
              enddate: '',
              canceldate: '',
            },
      fullcitySearch:
        addonsdata?.fullcitySearch == true
          ? {
              active: true,
              startdate:
                !isObjEmpty(profiledata?.subscriptioninfo) &&
                profiledata?.subscriptioninfo?.fullcitySearch?.active == true
                  ? profiledata?.subscriptioninfo?.fullcitySearch?.startdate
                  : startdate,
              enddate:
                !isObjEmpty(profiledata?.subscriptioninfo) &&
                profiledata?.subscriptioninfo?.fullcitySearch?.active == true
                  ? profiledata?.subscriptioninfo?.fullcitySearch?.enddate
                  : enddate,
              canceldate: '',
            }
          : {
              active: false,
              startdate: '',
              enddate: '',
              canceldate: '',
            },
      location2:
        addonsdata?.location2?.city2 != ''
          ? {
              active: true,
              startdate:
                !isObjEmpty(profiledata?.subscriptioninfo) &&
                profiledata?.subscriptioninfo?.location2?.active == true
                  ? profiledata?.subscriptioninfo?.location2?.startdate
                  : startdate,
              enddate:
                !isObjEmpty(profiledata?.subscriptioninfo) &&
                profiledata?.subscriptioninfo?.location2?.active == true
                  ? profiledata?.subscriptioninfo?.location2?.enddate
                  : enddate,
              canceldate: '',
            }
          : {
              active: false,
              startdate: '',
              enddate: '',
              canceldate: '',
            },
      location3:
        addonsdata?.location3?.city3 != ''
          ? {
              active: true,
              startdate:
                !isObjEmpty(profiledata?.subscriptioninfo) &&
                profiledata?.subscriptioninfo?.location3?.active == true
                  ? profiledata?.subscriptioninfo?.location3?.startdate
                  : startdate,
              enddate:
                !isObjEmpty(profiledata?.subscriptioninfo) &&
                profiledata?.subscriptioninfo?.location3?.active == true
                  ? profiledata?.subscriptioninfo?.location3?.enddate
                  : enddate,
              canceldate: '',
            }
          : {
              active: false,
              startdate: '',
              enddate: '',
              canceldate: '',
            },
    };

    if (totalprice != 0) {
      if (
        formik.values.state2 != 'choose' &&
        formik.values.city2 != 'choose' &&
        formik.values.state3 != 'choose' &&
        formik.values.city3 != 'choose'
      ) {
        //https://javascript.info/object-copy
        newProfiledata = structuredClone(profiledata);
        newProfiledata = Object.assign(newProfiledata, { addons: addonsdata });
        newProfiledata = Object.assign(newProfiledata, {
          subscriptioninfo: subscriptiondata,
        });
      }
    }
  };

  return (
    <div>
      <Card className="w-full shadow-md border-border/50 rounded-none p-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Addons</CardTitle>
        </CardHeader>
        {isObjEmpty(profiledata) && (
          <div className="p-4">
            <span className="inline-block border border-accent-500 px-4 py-4 text-md font-semibold rounded-lg bg-yellow-200">
              Nothing to show
            </span>
          </div>
        )}
        {!isObjEmpty(profiledata) && (
          <form onSubmit={handleAddonsSubmit}>
            <div className="table-responsive shopping-cart bg-white">
              <Table className="table">
                <TableBody className="">
                  <TableRow>
                    <TableCell className="">
                      <div className="text-xl font-semibold">
                        Community search option
                        {profiledata?.addons?.communitySearch == true ? (
                          <>
                            <span className="text-orange-500">&nbsp;(option enabled)</span>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="md:w-[300px]">
                        {profiledata?.addons?.communitySearch == true ? (
                          <Switch disabled checked={true} name="communitysearch" />
                        ) : (
                          <Switch
                            checked={communitySearch}
                            name="communitysearch"
                            onCheckedChange={value => {
                              setCommunitySearch(value);
                              if (value) {
                                setTotalprice(totalprice + 118);
                              } else {
                                setTotalprice(totalprice - 118);
                              }
                            }}
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-lg">
                      {communitySearch ? <>100.00</> : <>0.00</>}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="">
                      <div className="text-xl font-semibold">
                        Full City search option
                        {profiledata?.addons?.fullcitySearch == true ? (
                          <>
                            <span className="text-orange-300">&nbsp;(option enabled)</span>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="">
                        {profiledata?.addons?.communitySearch == true ? (
                          <Switch disabled checked={true} name="fullcitysearch" />
                        ) : (
                          <Switch
                            checked={fullcitySearch}
                            name="fullcitysearch"
                            onCheckedChange={value => {
                              setFullcitySearch(value);
                              if (value) {
                                setTotalprice(totalprice + 118);
                              } else {
                                setTotalprice(totalprice - 118);
                              }
                            }}
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-lg">
                      {fullcitySearch ? <>100.00</> : <>0.00</>}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <Separator />

            <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-6">
              <div className="w-[33%] flex-none">
                <div>
                  <Label htmlFor="state2" className="">
                    State or Union territory
                  </Label>
                  <Select
                    name="state2"
                    value={formik.values.state2}
                    onValueChange={value => {
                      formik.values.state2 = value;
                      setError1(false);
                      setError2(true);
                      if (loc2price != 0) {
                        setTotalprice(totalprice - 118);
                      }
                      setLoc2price(0);
                    }}
                  >
                    <SelectTrigger className="w-full mt-3">
                      <SelectValue placeholder="Choose state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>{getStates}</SelectGroup>
                    </SelectContent>
                  </Select>
                  {error1 ? <p className="text-red-600">select state </p> : null}
                </div>
              </div>
              <div className="w-[33%] flex-none">
                <div className="">
                  <Label htmlFor="city2" className="">
                    City or Nearby City
                  </Label>
                  <span className="">
                    <Select
                      value={formik.values.city2}
                      onValueChange={value => {
                        formik.values.city2 = value;
                        setError1(false);
                        setError2(true);
                        if (loc2price != 0) {
                          setTotalprice(totalprice - 118);
                        }
                        setLoc2price(0);
                        setError2(false);
                      }}
                      name="city2"
                      onBlur={formik.handleBlur}
                    >
                      <SelectTrigger className="w-full mt-3">
                        <SelectValue placeholder="Choose city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>{getCities(formik.values.state2)}</SelectGroup>
                      </SelectContent>
                    </Select>
                    {error2 ? <p className="text-red-600">select city</p> : null}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <div className="md:mt-7 flex items-center justify-between">
                  <div className="">
                    <Button
                      className="rounded-none"
                      variant="default"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (formik.values.state2 == '' || formik.values.state2 == 'choose') {
                          setError1(true);
                        } else if (formik.values.city2 == '' || formik.values.city2 == 'choose') {
                          setError2(true);
                        } else {
                          setLoc2price(Number(100));
                          if (loc2price != 100) {
                            setTotalprice(totalprice + 118);
                          }
                        }
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      className="rounded-none"
                      variant="destructive"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setLoc2price(0);
                        if (loc2price != 0) {
                          setTotalprice(totalprice - 118);
                        }
                        formik.resetForm({
                          values: { ...formik.values, state2: '', city2: '' },
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="text-lg">{loc2price}.00</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-6">
              <div className="w-[33%] flex-none">
                <div>
                  <Label htmlFor="state3" className="">
                    State or Union territory
                  </Label>
                  <Select
                    name="state3"
                    value={formik.values.state3}
                    onValueChange={value => {
                      formik.values.state3 = value;
                      setError3(false);
                      setError4(true);
                      if (loc3price != 0) {
                        setTotalprice(totalprice - 118);
                      }
                      setLoc3price(0);
                    }}
                  >
                    <SelectTrigger className="w-full mt-3">
                      <SelectValue placeholder="Choose state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>{getStates}</SelectGroup>
                    </SelectContent>
                  </Select>
                  {error3 ? <p className="text-red-600">select state </p> : null}
                </div>
              </div>
              <div className="w-[33%] flex-none">
                <div className="">
                  <Label htmlFor="city3" className="">
                    City or Nearby City
                  </Label>
                  <span className="">
                    <Select
                      value={formik.values.city3}
                      onValueChange={value => {
                        formik.values.city3 = value;
                        setError3(false);
                        setError4(true);
                        if (loc3price != 0) {
                          setTotalprice(totalprice - 118);
                        }
                        setLoc3price(0);
                        setError4(false);
                      }}
                      name="city3"
                      onBlur={formik.handleBlur}
                    >
                      <SelectTrigger className="w-full mt-3">
                        <SelectValue placeholder="Choose city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>{getCities(formik.values.state3)}</SelectGroup>
                      </SelectContent>
                    </Select>
                    {error4 ? <p className="text-red-600">select city</p> : null}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <div className="md:mt-7 flex items-center justify-between">
                  <div className="">
                    <Button
                      className="rounded-none"
                      variant="default"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (formik.values.state3 == '' || formik.values.state3 == 'choose') {
                          setError3(true);
                        } else if (formik.values.city3 == '' || formik.values.city3 == 'choose') {
                          setError4(true);
                        } else {
                          setLoc3price(Number(100));
                          if (loc3price != 100) {
                            setTotalprice(totalprice + 118);
                          }
                        }
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      className="rounded-none"
                      variant="destructive"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setLoc3price(0);
                        if (loc3price != 0) {
                          setTotalprice(totalprice - 118);
                        }
                        formik.resetForm({
                          values: { ...formik.values, state3: '', city3: '' },
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="text-lg">{loc3price}.00</div>
                </div>
              </div>
            </div>

            {loc2price + loc3price + (communitySearch ? 100 : 0) + (fullcitySearch ? 100 : 0) !=
            0 ? (
              <>
                <div className="flex bg-white mt-2">
                  <div className="ms-auto text-lg">
                    GST (18%):{' '}
                    <span className="text-medium">
                      {loc2price +
                        loc3price +
                        (communitySearch ? 100 : 0) +
                        (fullcitySearch ? 100 : 0) ==
                      0 ? (
                        0
                      ) : (
                        <>
                          {(loc2price +
                            loc3price +
                            (communitySearch ? 100 : 0) +
                            (fullcitySearch ? 100 : 0)) *
                            0.18}
                          .00
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            <div className="flex bg-white mt-2">
              <div className="ms-auto text-lg">
                Subtotal:{' '}
                <span className="text-md">
                  {loc2price +
                    loc3price +
                    (communitySearch ? 118 : 0) +
                    (fullcitySearch ? 118 : 0) ==
                  0 ? (
                    0
                  ) : (
                    <>
                      {(loc2price == 100 ? 118 : 0) +
                        (loc3price == 100 ? 118 : 0) +
                        (communitySearch ? 118 : 0) +
                        (fullcitySearch ? 118 : 0)}
                      .00
                    </>
                  )}
                </span>
              </div>
            </div>

            {loc2price + loc3price + (communitySearch ? 118 : 0) + (fullcitySearch ? 118 : 0) >
            0 ? (
              <div className="flex mt-2">
                <div className="ms-auto">
                  <Payment
                    buttonname={'PAY'}
                    userid={profiledata?.userid}
                    name={profiledata?.firstname}
                    city={profiledata?.city}
                    state={profiledata?.state}
                    emailid={profiledata?.email}
                    phone={profiledata?.phonenumber}
                    // checkoutClass={checkoutClass}
                    amount={totalprice}
                    setPaymentdone={setPaymentdone}
                    addonsdata={addonsdata}
                    setAddonsdone={setAddonsdone}
                    subscriptiondata={subscriptiondata}
                    setSubscriptiondone={setSubscriptiondone}
                  />
                </div>
              </div>
            ) : (
              <></>
            )}
          </form>
        )}
      </Card>
    </div>
  );
}
