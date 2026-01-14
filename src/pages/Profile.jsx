import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, RefreshCw, Edit3, Check, X } from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { Spinner } from '@/components/ui/Spinner';
import { Editable } from '@/components/Editable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { updateUserInfo } from '../services/userService';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}
const CDNURL = 'https://gweikvxgqoptvyqiljhp.supabase.co/storage/v1/object/public/localm/images';

export function Profile() {
  const { user, userSession, profiledata, setProfiledata } = useAuth();
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(
    isObjEmpty(profiledata?.phonenumber) ? '' : profiledata?.phonenumber,
  );
  const [facebook, setFacebook] = useState(
    isObjEmpty(profiledata?.facebook) ? '' : profiledata?.facebook,
  );
  const [instagram, setInstagram] = useState(
    isObjEmpty(profiledata?.instagram) ? '' : profiledata?.instagram,
  );
  const [reload, setReload] = useState(false);
  const [change, setChange] = useState(false);
  const [value, setValue] = useState('');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioValue, setBioValue] = useState(
    !isObjEmpty(profiledata?.bio) ? profiledata?.bio : ''
  );
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!isObjEmpty(profiledata) && reload) {
      setPhone(isObjEmpty(profiledata?.phonenumber) ? '' : profiledata?.phonenumber);
      setFacebook(isObjEmpty(profiledata?.facebook) ? '' : profiledata?.facebook);
      setInstagram(isObjEmpty(profiledata?.instagram) ? '' : profiledata?.instagram);
      setBioValue(!isObjEmpty(profiledata?.bio) ? profiledata?.bio : '');
      setReload(false);
    }
  }, [profiledata, reload]);

  const handlesaveSocials = async e => {
    e.preventDefault();
    setChange(false);

    var phoneregex = /^\d{10}$/;
    if (phone.match(phoneregex)) {
      setEditing(true);
      if (isOnline) {
        if (userSession) {
          const res = await updateUserInfo(user?.id, {
            phonenumber: phone,
            facebook: facebook,
            instagram: instagram,
          });
          if (res.success) {
            setProfiledata({
              ...profiledata,
              phonenumber: phone,
              facebook: facebook,
              instagram: instagram,
            });
          } else {
            alert('Something wrong. Try later');
          }
          setEditing(false);
        } else {
          setEditing(false);
          alert('Error, logout and login again');
        }
      } else {
        setEditing(false);
        alert('You are offline. check your internet connection.');
      }

      setEditing(false);
    } else {
      setEditing(false);
      alert('invalid phonenumber! try again');
    }

    return;
  };

  async function addbiodata(editdata) {
    setEditing(true);
    if (isOnline) {
      if (userSession) {
        const res = await updateUserInfo(user?.id, { bio: editdata.bio });
        if (res.success) {
          setProfiledata({ ...profiledata, bio: editdata.bio });
        } else {
          alert('Edit Biodata Error.. try again later');
        }
        setEditing(false);
      } else {
        setEditing(false);
        alert('Error, logout and login again');
      }
    } else {
      setEditing(false);
      alert('You are offline. check your internet connection.');
    }
  }

  const handleSaveBio = async () => {
    if (bioValue.trim() === profiledata?.bio?.trim()) {
      setIsEditingBio(false);
      return;
    }

    setEditing(true);
    if (isOnline) {
      if (userSession) {
        const res = await updateUserInfo(user?.id, { bio: bioValue.trim() });
        if (res.success) {
          setProfiledata({ ...profiledata, bio: bioValue.trim() });
          setIsEditingBio(false);
        } else {
          alert('Edit Biodata Error.. try again later');
        }
        setEditing(false);
      } else {
        setEditing(false);
        alert('Error, logout and login again');
      }
    } else {
      setEditing(false);
      alert('You are offline. check your internet connection.');
    }
  };

  const handleCancelBio = () => {
    setBioValue(!isObjEmpty(profiledata?.bio) ? profiledata?.bio : '');
    setIsEditingBio(false);
  };

  const addDefaultImg = ev => {
    if (profiledata?.gender == 'Male') {
      ev.target.src = '/male-default-4.png';
    } else {
      ev.target.src = '/female-default-2.png';
    }
  };

  return (
    <div className="">
      <Card className="w-full shadow-none border-border/50 rounded-none">
        <CardHeader className="flex flex-row items-center justify-between md:mx-2 lg:mx-10">
          <CardTitle className="text-2xl">Your Profile (edit as required)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center w-[100%]">
          <div className="grid sm:grid-cols-1 w-full lg:grid-cols-3 gap-2 md:gap-4">
            <Card className="p-6 md:p-8 shadow-lg border-border/50 w-full h-full md:h-[100%]">
              <div className="w-full max-w-[280px] aspect-square mx-auto overflow-hidden rounded-none">
                {!isObjEmpty(profiledata?.images) ? (
                  <img
                    src={`${CDNURL}/${profiledata?.shortid}/${profiledata?.images[1]}`}
                    alt="Profile picture"
                    className="object-scale-down md:object-cover"
                    onError={addDefaultImg}
                  />
                ) : (
                  <>
                    {profiledata?.gender == 'Male' ? (
                      <img
                        src="/male-default-4.png"
                        alt="Profile picture"
                        className="object-scale-down md:object-cover"
                      />
                    ) : (
                      <img
                        src="/female-default-2.png"
                        alt="Profile picture"
                        className="object-scale-down md:object-cover"
                      />
                    )}
                  </>
                )}
              </div>
            </Card>
            <Card className="p-6 md:p-8 shadow-lg border-border/50 lg:col-span-2 relative">
              {editing && (
                <Spinner className="absolute top-[50%] left-[50%] z-50 cursor-pointer size-10" />
              )}
              <div className="flex items-center gap-3">
                <div className="flex flex-wrap items-center gap-3 md:flex-row">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">
                      {profiledata?.firstname}{' '}
                      <span className="text-sm">({profiledata?.city}) </span>
                      &nbsp;
                      {!isObjEmpty(profiledata?.userhandle) ? (
                        <>({profiledata?.userhandle.toLowerCase()})</>
                      ) : (
                        <></>
                      )}
                    </h2>
                  </div>
                  <Button
                    size="icon-sm"
                    onClick={() => {
                      setChange(false);
                      setReload(true);
                    }}
                  >
                    <RefreshCw />
                  </Button>
                </div>
              </div>
              <form onSubmit={handlesaveSocials}>
                <div>
                  <div className="space-y-4 md:space-y-0 pb-6">
                    <div className="flex items-center gap-3 md:gap-4 group">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm md:text-base text-foreground/90 font-medium break-all">
                        {profiledata?.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4 group">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <Editable
                        text={phone}
                        placeholder="Click to enter your Phonenumber"
                        type="input"
                      >
                        <Input
                          type="text"
                          name="phone"
                          placeholder="Enter Your Phone number"
                          value={phone}
                          onChange={e => {
                            setChange(true);
                            setPhone(e.target.value);
                          }}
                        />
                      </Editable>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                        <FaFacebook className="w-5 h-5 text-blue-600" />
                      </div>
                      <Editable
                        text={facebook}
                        placeholder="Click to enter your Facebook"
                        type="input"
                      >
                        <Input
                          type="text"
                          name="facebook"
                          placeholder="Enter Your Facebook"
                          value={facebook}
                          onChange={e => {
                            setChange(true);
                            setFacebook(e.target.value);
                          }}
                        />
                      </Editable>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-500/20 transition-colors">
                        <FaInstagram className="w-5 h-5 text-pink-600" />
                      </div>
                      <Editable
                        text={instagram}
                        placeholder="Click to enter your Instagram"
                        type="input"
                      >
                        <Input
                          type="text"
                          name="instagram"
                          placeholder="Enter Your Instagram"
                          value={instagram}
                          onChange={e => {
                            setChange(true);
                            setInstagram(e.target.value);
                          }}
                        />
                      </Editable>
                    </div>
                  </div>
                  <div className="py-6 mx-3 border-t border-border">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">About Me</label>
                        {!isEditingBio && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditingBio(true)}
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {isEditingBio ? (
                        <div className="space-y-3">
                          <Textarea
                            value={bioValue}
                            onChange={(e) => setBioValue(e.target.value)}
                            placeholder="Write about yourself here (optional)"
                            rows={5}
                            className="resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelBio}
                              className="h-8"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleSaveBio}
                              disabled={editing}
                              className="h-8 bg-blue-600 hover:bg-blue-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="min-h-[120px] p-3 bg-gray-50 rounded-md border border-gray-200">
                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {!isObjEmpty(bioValue)
                              ? bioValue
                              : 'Write about yourself here (optional)'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
