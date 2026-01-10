import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '../context/AuthContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useFormik } from 'formik';
import { updateUserInfo } from '../services/userService';
import { cities } from '@/lib/cities';
import { coords } from '@/lib/defaultcoords';
import dayjs from 'dayjs';

const delay = ms => new Promise(res => setTimeout(res, ms));

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

export function Settings() {
  const { user, userSession, profiledata, setProfiledata } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showphone, setShowphone] = useState(profiledata?.showphone);
  const [showfacebook, setShowfacebook] = useState(profiledata?.showfacebook);
  const [showinstagram, setShowinstagram] = useState(profiledata?.showinstagram);
  const [showcommunity, setShowcommunity] = useState(profiledata?.showcommunity);
  const [showinotherreligionpeoplesearch, setShowinotherreligionpeoplesearch] = useState(
    profiledata?.showinotherreligionpeoplesearch,
  );
  let [valueschanged, setValueschanged] = useState(false);
  const isOnline = useOnlineStatus();
  const [state1, setState1] = useState('');
  const [city1, setCity1] = useState('');
  const [allowlocationchange, setAllowlocationchange] = useState(false);
  const datenow = new Date(Date.now());
  const [showNewDialog, setShowNewDialog] = useState(false);

  useEffect(() => {
    if (!isObjEmpty(profiledata)) {
      if (!isObjEmpty(profiledata?.dateoflocation)) {
        let dif = Math.abs(datenow - new Date(profiledata?.dateoflocation));
        let dayssincelocationchange = Math.floor(dif / (1000 * 3600 * 24));
        if (dayssincelocationchange > 30) {
          //1 month
          console.log('useEffect allowlocationchange true');
          setAllowlocationchange(true);
        } else {
          setAllowlocationchange(false);
        }
      } else {
        setAllowlocationchange(true);
      }
    }
  }, []);

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

  const getcoords = city => {
    for (var i = 0; i < coords.length; i++) {
      if (coords[i].city == city) {
        return coords[i].coords;
      }
    }
  };

  const formik = useFormik({
    initialValues: {},

    onSubmit: async values => {
      if (!isOnline) {
        alert('You are offline. check your internet connection');
        return;
      }

      if (
        showphone == profiledata?.showphone &&
        showfacebook == profiledata?.showfacebook &&
        showinstagram == profiledata?.showinstagram &&
        showcommunity == profiledata?.showcommunity &&
        showinotherreligionpeoplesearch == profiledata?.showinotherreligionpeoplesearch
      ) {
        setValueschanged(false);
        return;
      }

      let settingsdata = {
        showphone: showphone, //formik.values.showphone,
        showfacebook: showfacebook,
        showinstagram: showinstagram,
        showcommunity: showcommunity,
        showinotherreligionpeoplesearch: showinotherreligionpeoplesearch,
      };

      if (valueschanged) {
        setLoading(true);
        const res = await updateUserInfo(user?.id, settingsdata);

        if (res.success) {
          setProfiledata({ ...profiledata, ...settingsdata });
          toast('Changes update successful', {
            position: 'top-center',
          });
        } else {
          toast.error(res.msg, {
            position: 'top-center',
          });
        }
        setLoading(false);
        setValueschanged(false);
      }
    },
  });

  const handleLocationSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    console.log('handleLocationSubmit 1 stat1, city1::', state1, city1);

    if (isOnline) {
      if (userSession) {
        let dateoflocation = new Date().toISOString().substring(0, 10).toString();
        try {
          let newlocationdata = {
            state: state1,
            city: city1,
            latitude: getcoords(city1).lat,
            longitude: getcoords(city1).lng,
            defaultcoordsset: true,
            usercoordsset: false,
            dateoflocation: dateoflocation,
          };

          console.log('newlocationdata::', newlocationdata);
          const res = await updateUserInfo(user?.id, newlocationdata);
          if (res.success) {
            setProfiledata({
              ...profiledata,
              state: state1,
              city: city1,
              latitude: getcoords(city1).lat,
              longitude: getcoords(city1).lng,
              defaultcoordsset: true,
              usercoordsset: false,
              dateoflocation: dateoflocation,
            });
          }

          console.log('changelocation res:', res);

          delay(1000).then(async () => {
            setLoading(false);
            setShowNewDialog(false);
            if (res.success) {
              alert('Location change successful');
            }
          });
        } catch (error) {
          console.log('error::', error);
          setLoading(false);
          alert('Something wrong. Try later');
        }
      } else {
        alert('Error, logout and login again');
      }
    } else {
      alert('You are offline. check your internet connection.');
    }
  };

  return (
    <div>
      <Card className="shadow-md border-border/50 rounded-none ">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col relative">
          {loading && (
            <Spinner className="absolute top-[50%] left-[50%] z-50 cursor-pointer size-10" />
          )}
          <form action="" method="post" role="form" className="" onSubmit={formik.handleSubmit}>
            <div>
              <div className="grid grid-cols-12 gap-1 py-2">
                <span className="col-span-5">Hide Phone</span>
                <span className="col-span-1">
                  <Switch
                    checked={showphone}
                    onCheckedChange={value => {
                      if (value != profiledata?.showphone) {
                        setValueschanged(true);
                      } else {
                        setValueschanged(false);
                      }
                      setValueschanged(true);
                      setShowphone(value);
                    }}
                  />
                </span>
                <span className="ms-4 col-span-4">Show Phone</span>
              </div>
              <div className="grid grid-cols-12 gap-1 py-2">
                <span className="col-span-5">Hide Facebook</span>
                <span className="col-span-1">
                  <Switch
                    checked={showfacebook}
                    onCheckedChange={value => {
                      setValueschanged(true);
                      setShowfacebook(value);
                    }}
                  />
                </span>
                <span className="ms-4 col-span-4">Show Instagram</span>
              </div>
              <div className="grid grid-cols-12 gap-1 py-2">
                <span className="col-span-5">Hide Instagram</span>
                <span className="col-span-1">
                  <Switch
                    checked={showinstagram}
                    onCheckedChange={value => {
                      setValueschanged(true);
                      setShowinstagram(value);
                    }}
                  />
                </span>
                <span className="ms-4 col-span-4">Show Facebook</span>
              </div>
              <div className="grid grid-cols-12 gap-1 py-2">
                <span className="col-span-5">Hide Community</span>
                <span className="col-span-1">
                  <Switch
                    checked={showcommunity}
                    onCheckedChange={value => {
                      setValueschanged(true);
                      setShowcommunity(value);
                    }}
                  />
                </span>
                <span className="ms-4 col-span-4">Show Community</span>
              </div>
              <div className="grid grid-cols-12 gap-1 py-2">
                <span className="col-span-5">Hide me from other religion people's search</span>
                <span className="col-span-1">
                  <Switch
                    checked={showinotherreligionpeoplesearch}
                    onCheckedChange={value => {
                      setValueschanged(true);
                      setShowinotherreligionpeoplesearch(value);
                    }}
                  />
                </span>
                <span className="ms-4 col-span-4">Show me in other religion people's search</span>
              </div>

              {valueschanged ? (
                <div className="flex justify-between md:w-[70%] mt-4">
                  <Button className="" variant="outline" onClick={() => setValueschanged(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="default">
                    SUBMIT
                  </Button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </form>

          <Separator className="my-4" />
          <Button
            //type="submit"
            className="md:w-[40%] bg-teal-600 hover:bg-[#0D9488]/90 text-white font-bold"
            onClick={() => setShowNewDialog(true)}
          >
            CHANGE LOCATION
          </Button>
          <Separator className="my-4" />

          <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
            <DialogContent className="sm:max-w-[525px]">
              {loading && (
                <Spinner className="absolute top-[40%] left-[50%] z-50 cursor-pointer size-10" />
              )}
              {allowlocationchange ? (
                <div>
                  <form onSubmit={handleLocationSubmit}>
                    <DialogHeader>
                      <DialogTitle>Select your new Location</DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-3 mt-4">
                      <Select
                        required
                        name="state"
                        onValueChange={value => {
                          setState1(value);
                        }}
                      >
                        <SelectTrigger className="w-full md:w-[48%]">
                          <SelectValue placeholder="Select state" />
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
                            <SelectItem value="YPuducherry">Puducherry</SelectItem>
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
                      <Select
                        required
                        name="city"
                        onValueChange={value => {
                          setCity1(value);
                        }}
                      >
                        <SelectTrigger className="w-full md:w-[48%]">
                          <SelectValue placeholder="Choose city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>{getCities()}</SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter className="mt-4">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Submit</Button>
                    </DialogFooter>
                  </form>
                </div>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-red-700">
                      Only one location change is allowed per month.
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <p className="text-md">
                    Your last change date: &nbsp;
                    <span className="text-green-700 font-bold">
                      {dayjs(profiledata?.dateoflocation).format('MMM D, YYYY')}
                    </span>
                  </p>
                </>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}

/*
w-[95%] max-w-7xl
*/
