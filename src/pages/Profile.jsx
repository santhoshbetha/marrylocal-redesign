import { useState, useEffect, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, RefreshCw } from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { Spinner } from '@/components/ui/Spinner';
import { Editable } from '@/components/Editable';
import { SearchDataAndRecoveryContext } from '../context/SearchDataAndRecoveryContext';
import EdiText from 'react-editext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { updateUserInfo } from '../services/userService';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { getSupabaseFileUrl, getImagesList } from '../services/imageService';

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
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!isObjEmpty(profiledata) && reload) {
      setPhone(isObjEmpty(profiledata?.phonenumber) ? '' : profiledata?.phonenumber);
      setFacebook(isObjEmpty(profiledata?.facebook) ? '' : profiledata?.facebook);
      setInstagram(isObjEmpty(profiledata?.instagram) ? '' : profiledata?.instagram);
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

  const handleSave = async val => {
    console.log('Edited Value -> ', val);
    setValue(val);
    let editdata = {
      bio: val,
    };
    if (isOnline) {
      if (userSession) {
        // add bio data to database
        if (String(val) !== String(profiledata?.bio)) {
          await addbiodata(editdata);
          setEditing(false);
        }
      } else {
        alert('Error, logout and login again');
      }
    } else {
      alert('You are offline. check your internet connection.');
      return;
    }
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
                    <EdiText
                      value={
                        !isObjEmpty(profiledata?.bio)
                          ? profiledata?.bio
                          : 'Write about you here (optional)'
                      }
                      type="textarea"
                      onSave={handleSave}
                      editButtonProps={{
                        style: {
                          color: 'blue',
                          backgroundColor: 'yellow',
                        },
                      }}
                      inputProps={{
                        style: {
                          outline: 'none',
                          minWidth: 'auto',
                        },
                        rows: 5,
                      }}
                    />
                    {change == true ? (
                      <div className="flex py-4 px-4">
                        <Button className="ms-auto" type="submit" variant="secondary">
                          SAVE
                        </Button>
                      </div>
                    ) : (
                      <></>
                    )}
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
