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
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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

function UserProfile() {
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
  const [isOpenedInNewTab, setIsOpenedInNewTab] = useState(false);

  const userstate = JSON.parse(localStorage.getItem('userstate'));
  const backbutton = isObjEmpty(userstate) ? true : userstate?.backbutton;

  const { data: userinfo, isLoading, error } = useGetUserProfile({
    shortid: params.shortid,
  });

  const images = user?.images ? user.images.filter(image => image && image.trim() !== '') : [
    user?.image || '/professional-portrait-in-urban-setting.jpg',
  ].filter(Boolean);

  useEffect(() => {
    if (!isObjEmpty(userinfo)) {
      setUser(userinfo);
    }
  }, [userinfo]);

  useEffect(() => {
    setIsOpenedInNewTab(window.opener !== null);
  }, []);


  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const goToImage = index => {
    setCurrentImageIndex(index);
  };

  const reportUser = () => {
    const subject = encodeURIComponent('Report User');
    const body = encodeURIComponent(`Reporting user ID: ${user?.shortid || user?.id}\n\nPlease provide details about the issue:`);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
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

  const openInNewTab = () => {
    const url = `/user/${user?.shortid}`;
    window.open(url, '_blank');
  };

  const ProfileSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Profile Content */}
      <div className="container mx-auto px-4 py-4 max-w-4xl dark:border-3 mt-2">
        <div className="bg-background rounded-2xl shadow-xl border border-border overflow-hidden">
          {/* Profile Header Skeleton */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-6 py-8 border-b border-border flex items-start justify-between shadow-sm">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64 bg-gray-200" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 bg-gray-200" />
                <Skeleton className="h-6 w-20 bg-gray-200" />
                <Skeleton className="h-6 w-24 bg-gray-200" />
              </div>
            </div>
            <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
          </div>

          {/* Image Carousel Skeleton */}
          <div className="px-6 py-4">
            <Skeleton className="w-full lg:max-w-lg mx-auto aspect-square rounded-2xl bg-gray-200" />
          </div>

          {/* Profile Details Skeleton */}
          <div className="py-6 px-6 space-y-6">
            <div className="pb-4">
              <div className="mx-2 mt-2 p-6 rounded-3 bg-yellow-100 dark:bg-background border-3 rounded-lg border-[#FFD700] shadow-lg">
                <div className="py-2">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-48 bg-gray-100" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-20 bg-gray-100" />
                        <Skeleton className="h-6 w-24 bg-gray-100" />
                        <Skeleton className="h-6 w-28 bg-gray-100" />
                      </div>
                    </div>
                    <Skeleton className="h-12 w-48 rounded-lg bg-gray-100" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-4 my-4">
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full rounded-lg bg-gray-100" />
                      <Skeleton className="h-20 w-full rounded-lg bg-gray-100" />
                      <Skeleton className="h-20 w-full rounded-lg bg-gray-100" />
                    </div>
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full rounded-lg bg-gray-100" />
                      <Skeleton className="h-20 w-full rounded-lg bg-gray-100" />
                      <Skeleton className="h-20 w-full rounded-lg bg-gray-100" />
                      <Skeleton className="h-20 w-full rounded-lg bg-gray-100" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <div className="container mx-auto px-4 py-4 max-w-md">
          <div className="bg-background rounded-2xl shadow-xl border border-border p-8 text-center">
            <div className="text-6xl mb-4">⏱️</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Request Timed Out</h2>
            <p className="text-muted-foreground mb-6">
              {error.message || 'The request took too long to complete. Please try again.'}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-6">
      {/* Profile Content */}
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-background rounded-3xl shadow-2xl border border-border/50 overflow-hidden backdrop-blur-sm">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 px-4 sm:px-6 py-1.5 sm:py-6 border-b border-border/50 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1 sm:mb-3">
                  <h1 className="text-2xl sm:text-4xl font-bold text-primary truncate">
                    {user?.firstname}
                  </h1>
                  <span className="text-lg sm:text-2xl text-muted-foreground font-medium">({user?.city})</span>
                  {(user?.aadharverified || user?.passportverified || user?.licenseverified) ? (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-green-200/50 shadow-sm self-start">
                      <CheckCircle className="h-4 w-4" />
                      <span>Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-amber-200/50 shadow-sm self-start">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Unverified</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span className="text-sm sm:text-lg font-medium">Age:</span>
                    <span className="text-sm sm:text-lg text-foreground font-semibold">{user?.age}</span>
                  </div>
                  <span className="hidden sm:inline text-muted-foreground/50">•</span>
                  <span className="text-sm sm:text-lg font-medium">{user?.language}</span>
                  {user?.showcommunity == true && user?.community && user?.community != 'Do not wish to mention' && (
                    <>
                      <span className="hidden sm:inline text-muted-foreground/50">•</span>
                      <span className="text-sm sm:text-lg font-medium">{user?.community}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 self-start sm:self-auto flex gap-2">
                {isOpenedInNewTab || !backbutton ? (
                  <button
                    onClick={reportUser}
                    className="p-2 hover:bg-destructive/10 rounded-full transition-all duration-200 group border border-transparent hover:border-destructive/20"
                    aria-label="Report user"
                    title="Report this user"
                  >
                    <Flag className="w-5 h-5 text-destructive group-hover:scale-110 transition-transform" />
                  </button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary font-medium shadow-sm"
                    onClick={async () => {
                      secureLocalStorage.setItem('reloadshortlistdata', false);
                      navigate(-1);
                    }}
                  >
                    <MoveLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                {!isOpenedInNewTab && backbutton && (
                  <button
                    onClick={openInNewTab}
                    className="p-2 hover:bg-primary/10 rounded-full transition-all duration-200 group border border-transparent hover:border-primary/20"
                    aria-label="Open in new tab"
                    title="Open profile in new tab"
                  >
                    <ExternalLink className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Image Carousel */}
          {user?.images && images.length > 0 && (
            <div className="px-6 pb-6">
              <div className="relative w-full lg:max-w-lg mx-auto aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 shadow-2xl group border border-border/50">
                <div className="relative w-full h-full">
                  {images?.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                      }`}
                    >
                      <img
                        src={`${CDNURL}/${user?.shortid}/${image}`}
                        alt={`${user?.firstname} - Photo ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>

                {images?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg backdrop-blur-sm"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg backdrop-blur-sm"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 shadow-lg backdrop-blur-sm ${
                            index === currentImageIndex
                              ? 'bg-white w-8 shadow-white/50'
                              : 'bg-white/50 hover:bg-white/75 hover:scale-110'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="absolute top-6 right-6 px-4 py-2 bg-black/40 backdrop-blur-sm text-white text-sm rounded-full font-medium border border-white/20">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Profile Details */}
          <div className="py-6 px-6 space-y-6">
            {/* Contact Information */}
            {!isObjEmpty(user) && user?.userstate == 'active' && (
              <div className="space-y-6">
                {/* Name and Tags */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                      {user?.firstname}, {user?.age}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
                        {user?.language}
                      </span>
                      {user?.showcommunity == true && user?.community && user?.community != 'Do not wish to mention' && (
                        <span className="px-3 py-1.5 bg-secondary/10 text-secondary-foreground rounded-full text-sm font-semibold border border-secondary/20">
                          {user?.community}
                        </span>
                      )}
                      {user?.religion && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-semibold border border-purple-200/50 dark:border-purple-700/50">
                          {user?.religion}
                        </span>
                      )}
                    </div>
                  </div>
                  {backbutton == false && profiledata?.shortid != user?.shortid && profiledata?.gender != user?.gender && (
                    <div className="flex-shrink-0">
                      {shortlistarray?.includes(user?.shortid) ? (
                        <Button variant="outline" className="rounded-lg border-2 border-muted bg-muted/50" disabled>
                          <Heart className="mr-2 text-red-500" fill="red" />
                          <span className="font-medium">In Shortlist</span>
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={async e => {
                            secureLocalStorage.setItem('reloadshortlistdata', true);
                            shortlistClick(e);
                          }}
                        >
                          <Heart className="mr-2" />
                          <span>{shortlisttext}</span>
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-xl border border-green-200/50 dark:border-green-800/50 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <span className="text-green-700 dark:text-green-400 font-bold text-lg">💼</span>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground font-medium">Economic Status</div>
                          <div className="text-green-700 dark:text-green-400 font-semibold">{user?.economicstatus}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-xl border border-blue-200/50 dark:border-blue-800/50 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <span className="text-blue-700 dark:text-blue-400 font-bold text-lg">🎓</span>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground font-medium">Education</div>
                          <div className="font-semibold">{user?.educationlevel}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 p-4 rounded-xl border border-purple-200/50 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <span className="text-purple-700 dark:text-purple-400 font-bold text-lg">💼</span>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground font-medium">Work Status</div>
                          <div className="font-semibold">{user?.jobstatus ? 'Employed' : 'Not Employed'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-4 rounded-xl border border-primary/20 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground font-medium">Location</div>
                          <div className="text-lg font-semibold text-primary">{user?.city}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {user?.showphone && (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-xl border border-green-200/50 dark:border-green-800/50 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground font-medium">Phone</div>
                            <div className="text-lg font-semibold text-green-700 dark:text-green-400">{user?.phonenumber}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-xl border border-blue-200/50 dark:border-blue-800/50 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground font-medium">Email</div>
                          <div className="text-sm font-semibold break-all">{user?.email}</div>
                        </div>
                      </div>
                    </div>

                    {user?.showfacebook == true && user?.facebook && (
                      <div className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20 p-4 rounded-xl border border-blue-200/50 dark:border-blue-800/50 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <FaFacebook className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground font-medium">Facebook</div>
                            <div className="text-sm font-semibold break-all">{user?.facebook}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {user?.showinstagram == true && user?.instagram && (
                      <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 p-4 rounded-xl border border-pink-200/50 dark:border-pink-800/50 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                            <FaInstagram className="w-5 h-5 text-pink-500" />
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground font-medium">Instagram</div>
                            <div className="text-sm font-semibold break-all">{user?.instagram}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio Section */}
                {user?.bio && user?.bio.trim() && (
                  <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 p-6 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg flex-shrink-0">
                        <span className="text-indigo-700 dark:text-indigo-400 font-bold text-xl">📝</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-3">About {user?.firstname}</h3>
                        <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-base">{user?.bio}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
