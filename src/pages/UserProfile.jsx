import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  MapPin,
  Phone,
  Mail,
  Flag,
  MoveLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
} from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAddToShortlist, useGetUserProfile } from '../hooks/useDataService';
import secureLocalStorage from 'react-secure-storage';

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

const CDNURL = 'https://gweikvxgqoptvyqiljhp.supabase.co/storage/v1/object/public/localm/images';

export function UserProfile() {
  const { user: loggedInUser, profiledata, setProfiledata } = useAuth();
  let [shortlisttext, setShortListtext] = useState('ADD TO SHORTLIST');
  const params = useParams();
  const navigate = useNavigate();
  //const user = getUserData(params.shortid);
  const [user, setUser] = useState({});
  let [buttonvariant, setButtonvariant] = useState('contain');
  const shortlistarray = JSON.parse(localStorage.getItem('shortlistarray'));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const addToShortlist = useAddToShortlist();

  const userstate = JSON.parse(localStorage.getItem('userstate'));
  const backbutton = isObjEmpty(userstate) ? true : userstate?.backbutton;

  const { data: userinfo } = useGetUserProfile({
    shortid: params.shortid,
  });

  const images = user?.images || [
    user.image || '/professional-portrait-in-urban-setting.jpg',
    '/professional-woman-smiling.png',
    '/young-woman-portrait.png',
    '/professional-headshot-of-a-young-man-with-brown-ha.jpg',
  ];

  useEffect(() => {
    if (!isObjEmpty(userinfo)) {
      setUser(userinfo);
    }
  }, [userinfo]);

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const goToImage = index => {
    setCurrentImageIndex(index);
  };

  const shortlistClick = async e => {
    e.preventDefault();

    setShortListtext('ADDED TO SHORTLIST'); //ADDED TO SHORTLIST
    setButtonvariant('ghost');

    //add this user to shortlistdata
    //const res = await addToShortlist(user?.id, shortid);

    await addToShortlist.mutateAsync({
      userid: loggedInUser?.id,
      shortid: user?.shortid,
    });

    if (!addToShortlist.isError) {
      let shortlistarrayfromstorage = JSON.parse(localStorage.getItem('shortlistarray'));

      if (shortlistarrayfromstorage == null) {
        shortlistarrayfromstorage = new Array();
        shortlistarrayfromstorage.push(user?.shortid);
      } else {
        shortlistarrayfromstorage.push(user?.shortid);
      }
      localStorage.setItem('shortlistarray', JSON.stringify(shortlistarrayfromstorage));

      //
      // Add to Profile Data
      //
      if (isObjEmpty(profiledata.shortlist)) {
        profiledata.shortlist = new Array();
        profiledata.shortlist.push(user?.shortid);
      } else {
        profiledata.shortlist?.push(user?.shortid);
      }

      setProfiledata({ ...profiledata, shortlist: profiledata?.shortlist });
    } else {
      alert('Shortlist failed. Try again');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Profile Content */}
      <div className="container mx-auto px-4 py-4 max-w-4xl dark:border-3 mt-2">
        <div className="bg-background rounded-2xl shadow-xl border border-border overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-6 py-6 border-b border-border flex items-start justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">
                {user?.firstname} <span className="text-lg">({user?.city})</span>
              </div>
            </div>
            {backbutton ? (
              <Button
                className="bg-blue-500 hover:bg-blue-400"
                onClick={async () => {
                  // localStorage.setItem('scrollback', "true");
                  //localStorage.setItem("reloadshortlistdata", false);
                  secureLocalStorage.setItem('reloadshortlistdata', false);
                  navigate(-1);
                }}
              >
                Back
              </Button>
            ) : (
              <button className="p-2 hover:bg-destructive/10 rounded-full transition-colors group">
                <Flag
                  fill="red"
                  className="w-8 h-8 text-destructive group-hover:scale-110 transition-transform"
                />
              </button>
            )}
          </div>

          {/* Image Carousel */}
          {!isObjEmpty(user?.images) && (
            <div className="px-6 py-2">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 shadow-lg group">
                <div className="relative w-full h-full">
                  {images?.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <img
                        src={`${CDNURL}/${user.shortid}/${image}}`}
                        alt={`${user?.firstname} - Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {images?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {images?.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex
                            ? 'bg-white w-6'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {images?.length > 1 && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Details */}
          <div className="py-2 px-4 space-y-4">
            {/* Contact Information */}
            {!isObjEmpty(user) && user?.userstate == 'active' && (
              <div className="pb-4">
                <div className="mx-2 mt-2 p-6 rounded-3 bg-yellow-100 dark:bg-background border-3 rounded-lg border-[#FFD700]">
                  <div className="py-2">
                    <div className="flex justify-between">
                      <div className="pb-3 flex flex-col md:flex-row">
                        <div className="font-bold text-blue-400 ms-2 capitalize inline-block text-2xl">
                          {user?.firstname}, {user?.age}
                        </div>
                      </div>
                      {backbutton == false ? (
                        profiledata?.shortid != user?.shortid &&
                        profiledata?.gender != user?.gender ? (
                          <>
                            <div className="me-5 pb-2">
                              {shortlistarray?.includes(user?.shortid) ? (
                                <Button variant="ghost" className="rounded-none" disabled>
                                  <span className="hidden sm:block">ADDED TO SHORTLIST</span>
                                  <Heart className="" />
                                </Button>
                              ) : (
                                <Button
                                  variant={`${buttonvariant}`}
                                  className="bg-red-600 text-white font-bold rounded-none"
                                  onClick={async e => {
                                    //setShortListtext("ADDED TO SHORTLIST")
                                    //localStorage.setItem("reloadshortlistdata", true);
                                    secureLocalStorage.setItem('reloadshortlistdata', true);
                                    shortlistClick(e);
                                  }}
                                >
                                  <span className="hidden sm:block">{shortlisttext}</span>
                                  <Heart className="" />
                                </Button>
                              )}
                            </div>
                          </>
                        ) : (
                          <></>
                        )
                      ) : (
                        <></>
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row justify-between space-y-8 mx-4 my-4">
                      <div className="flex flex-col space-y-1">
                        <div>{user?.language}</div>
                        <div>
                          {user?.showcommunity == true ? (
                            <>
                              {user?.community ? (
                                <>
                                  {user?.community != 'Do not wish to mention' ? (
                                    <>{user?.community}</>
                                  ) : (
                                    <></>
                                  )}
                                </>
                              ) : (
                                <></>
                              )}
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div>{user?.religion}</div>
                        <div className="text-green-700">{user?.economicstatus}</div>
                        <div>
                          <span className="font-bold">Education: </span>
                          {user?.educationlevel}
                        </div>
                        <div>
                          <span className="font-bold">Work: </span>
                          {user?.jobstatus ? 'True' : 'false'}
                        </div>
                      </div>

                      <div className="">
                        {/* Phone */}
                        <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group">
                          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-lg font-medium">{user.city}</span>
                        </div>
                        {/* Phone */}
                        <div>
                          {user?.showphone ? (
                            <>
                              <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group">
                                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                  <Phone className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-sm font-medium">{user.phonenumber}</span>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group">
                          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Mail className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-sm font-medium break-all">{user.email}</span>
                        </div>

                        {/* Facebook */}
                        <div>
                          {user?.showfacebook == true ? (
                            <>
                              {user?.facebook ? (
                                <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group">
                                  <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                    <FaFacebook className="w-5 h-5 text-blue-500" />
                                  </div>
                                  <span className="text-sm font-medium">{user.facebook}</span>
                                </div>
                              ) : (
                                <></>
                              )}
                            </>
                          ) : (
                            <></>
                          )}
                        </div>

                        {/* Instagram */}
                        <div>
                          {user?.showinstagram == true ? (
                            <>
                              {user?.instagram ? (
                                <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group">
                                  <div className="p-2 bg-pink-500/10 rounded-lg group-hover:bg-pink-500/20 transition-colors">
                                    <FaInstagram className="w-5 h-5 text-pink-500" />
                                  </div>
                                  <span className="text-sm font-medium">{user.instagram}</span>
                                </div>
                              ) : (
                                <></>
                              )}
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground leading-relaxed">{user.bio}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
