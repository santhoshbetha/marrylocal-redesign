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
import {
  Shield,
  Eye,
  EyeOff,
  MapPin,
  Users,
  Search,
  Settings as SettingsIcon,
  Check,
  X
} from 'lucide-react';

const delay = ms => new Promise(res => setTimeout(res, ms));

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

function Settings() {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <Card className="bg-background rounded-2xl shadow-xl border border-border overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-6 py-8 border-b border-border flex items-start justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <SettingsIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl text-primary">Settings</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Manage your privacy and account preferences</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {loading && (
              <Spinner className="absolute top-[50%] left-[50%] z-50 cursor-pointer size-10" />
            )}

            {/* Privacy Settings Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">Privacy Settings</h3>
                  <p className="text-sm text-blue-600">Control what information is visible to other users</p>
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-6 space-y-4">
                <form action="" method="post" role="form" className="" onSubmit={formik.handleSubmit}>
                  {/* Phone Privacy */}
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <span className="text-green-600 font-bold">📱</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Phone Number</div>
                        <div className="text-sm text-gray-600">
                          {showphone ? 'Visible to other users' : 'Hidden from other users'}
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={showphone}
                      onCheckedChange={value => {
                        if (value != profiledata?.showphone) {
                          setValueschanged(true);
                        } else {
                          setValueschanged(false);
                        }
                        setShowphone(value);
                      }}
                    />
                  </div>

                  {/* Facebook Privacy */}
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <span className="text-blue-600 font-bold">📘</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Facebook Profile</div>
                        <div className="text-sm text-gray-600">
                          {showfacebook ? 'Visible to other users' : 'Hidden from other users'}
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={showfacebook}
                      onCheckedChange={value => {
                        setValueschanged(true);
                        setShowfacebook(value);
                      }}
                    />
                  </div>

                  {/* Instagram Privacy */}
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-pink-100 rounded-lg">
                        <span className="text-pink-600 font-bold">📷</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Instagram Profile</div>
                        <div className="text-sm text-gray-600">
                          {showinstagram ? 'Visible to other users' : 'Hidden from other users'}
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={showinstagram}
                      onCheckedChange={value => {
                        setValueschanged(true);
                        setShowinstagram(value);
                      }}
                    />
                  </div>

                  {/* Community Privacy */}
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Community Information</div>
                        <div className="text-sm text-gray-600">
                          {showcommunity ? 'Visible to other users' : 'Hidden from other users'}
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={showcommunity}
                      onCheckedChange={value => {
                        setValueschanged(true);
                        setShowcommunity(value);
                      }}
                    />
                  </div>

                  {/* Cross-Religion Search */}
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Search className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Cross-Religion Search</div>
                        <div className="text-sm text-gray-600">
                          {showinotherreligionpeoplesearch
                            ? 'Appear in searches by people of other religions'
                            : 'Only appear in searches by people of same religion'
                          }
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={showinotherreligionpeoplesearch}
                      onCheckedChange={value => {
                        setValueschanged(true);
                        setShowinotherreligionpeoplesearch(value);
                      }}
                    />
                  </div>

                  {/* Save/Cancel Buttons */}
                  {valueschanged && (
                    <div className="flex justify-end gap-3 pt-4 border-t border-blue-200">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowphone(profiledata?.showphone);
                          setShowfacebook(profiledata?.showfacebook);
                          setShowinstagram(profiledata?.showinstagram);
                          setShowcommunity(profiledata?.showcommunity);
                          setShowinotherreligionpeoplesearch(profiledata?.showinotherreligionpeoplesearch);
                          setValueschanged(false);
                        }}
                        className="px-6 py-2"
                      >
                        <X className="mr-2 size-4" />
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2"
                      >
                        <Check className="mr-2 size-4" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            <Separator />

            {/* Location Settings Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800">Location Settings</h3>
                  <p className="text-sm text-green-600">Update your location (limited to once per month)</p>
                </div>
              </div>

              <div className="bg-green-50/50 border border-green-200 rounded-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="font-medium text-gray-800 mb-1">Current Location</div>
                    <div className="text-sm text-gray-600">{profiledata?.city}, {profiledata?.state}</div>
                    {profiledata?.dateoflocation && (
                      <div className="text-xs text-gray-500 mt-1">
                        Last changed: {dayjs(profiledata?.dateoflocation).format('MMM D, YYYY')}
                      </div>
                    )}
                  </div>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2"
                    onClick={() => setShowNewDialog(true)}
                    disabled={!allowlocationchange}
                  >
                    {allowlocationchange ? (
                      <>
                        <MapPin className="mr-2 size-4" />
                        Change Location
                      </>
                    ) : (
                      <>
                        <span className="mr-2">⏰</span>
                        Location change allowed in {30 - Math.floor(Math.abs(new Date(Date.now()) - new Date(profiledata?.dateoflocation)) / (1000 * 3600 * 24))} days
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Location Change Dialog */}
            <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
              <DialogContent className="sm:max-w-[525px]">
                {loading && (
                  <Spinner className="absolute top-[40%] left-[50%] z-50 cursor-pointer size-10" />
                )}
                {allowlocationchange ? (
                  <div>
                    <form onSubmit={handleLocationSubmit}>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-green-600" />
                          Change Your Location
                        </DialogTitle>
                        <DialogDescription>
                          Select your new state and city. You can only change your location once per month.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <Select
                          required
                          name="state"
                          onValueChange={value => {
                            setState1(value);
                          }}
                        >
                          <SelectTrigger className="w-full">
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
                        <Select
                          required
                          name="city"
                          onValueChange={value => {
                            setCity1(value);
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
                      <DialogFooter className="mt-6 gap-3">
                        <DialogClose asChild>
                          <Button variant="outline" className="px-4 py-2">
                            <X className="mr-2 size-4" />
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2">
                          <Check className="mr-2 size-4" />
                          Update Location
                        </Button>
                      </DialogFooter>
                    </form>
                  </div>
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-amber-700">
                        <span className="text-amber-600">⏰</span>
                        Location Change Cooldown
                      </DialogTitle>
                      <DialogDescription>
                        You can only change your location once per month to maintain community trust.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                      <p className="text-sm text-amber-800">
                        Your last location change was on{' '}
                        <span className="font-semibold">
                          {dayjs(profiledata?.dateoflocation).format('MMMM D, YYYY')}
                        </span>
                      </p>
                      <p className="text-sm text-amber-700 mt-2">
                        You can change your location again in{' '}
                        <span className="font-semibold">
                          {30 - Math.floor(Math.abs(new Date(Date.now()) - new Date(profiledata?.dateoflocation)) / (1000 * 3600 * 24))} days
                        </span>
                      </p>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/*
w-[95%] max-w-7xl
*/

export default Settings;
