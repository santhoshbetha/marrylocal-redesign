import { useRef, useState, useEffect, useContext, useCallback, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShortlistSection } from './ShortlistSection';
import { SearchUser } from './SearchUser';
import { useAuth } from '../../context/AuthContext';
import { SearchDataAndRecoveryContext } from '../../context/SearchDataAndRecoveryContext';
import { current } from '@reduxjs/toolkit';
import { updateUserInfo } from '../../services/userService';
import { Search as SearchIcon, Heart, UserSearch } from 'lucide-react';

// Lazy load heavy components
const SearchSection = lazy(() => import('./SearchSection'));

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

function Search() {
  const { user, setAuth, profiledata, setProfiledata } = useAuth();
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem('activetab') ? localStorage.getItem('activetab') : 'search',
  );
  let [verified, setVerified] = useState(true);
  let [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const { logininitsDone, setLogininitsDone } = useContext(SearchDataAndRecoveryContext);

  const datenow = new Date(Date.now());
  let addonsdata = useRef({});
  let subscriptiondata = useRef({});
  let communitysearchexpired = useRef(false);
  let fullcitysearchexpired = useRef(false);
  let location2expired = useRef(false);
  let location3expired = useRef(false);

  const updatestate = async statedata => {
    const res = await updateUserInfo(user?.id, statedata);
    if (res.success) {
      setProfiledata({ ...profiledata, ...statedata });
    } else {
      console.log(res.msg);
    }
    setLoading(false);
  };

  const updateTimeOfLogin = async logintimedata => {
    const res = await updateUserInfo(user?.id, logintimedata);
    if (res.success) {
      setProfiledata({ ...profiledata, ...logintimedata });
    } else {
      console.log(res.msg);
    }
    setLoading(false);
  };

  const loginInits = useCallback(async () => {
    //console.log("loginInits logininitsDone::", logininitsDone)
    if (!isObjEmpty(profiledata) && !logininitsDone) {
      //
      // Verified check
      //
      if (!(profiledata?.aadharverified || profiledata?.passportverified || profiledata?.licenseverified)) {
        if (!isObjEmpty(profiledata?.dateofactivation)) {
          let dif = Math.abs(datenow - new Date(profiledata?.dateofcreation));
          let dayssincecreation = Math.floor(dif / (1000 * 3600 * 24));
          //7 days
          if (!isObjEmpty(profiledata?.arounduserscount)) {
            if (dayssincecreation > 7 && profiledata?.arounduserscount > 100) {
              //verification is required if more than 100 users around
              setVerified(false);
            }
          } else {
            if (dayssincecreation > 7) {
              setVerified(false);
            }
          }
        }
      }

      //
      // subscription date check
      //
      if (!isObjEmpty(profiledata)) {
        if (!isObjEmpty(profiledata?.subscriptioninfo)) {
          if (profiledata?.subscriptioninfo?.communitySearch?.active == true) {
            if (datenow > new Date(profiledata?.subscriptioninfo?.communitySearch?.enddate)) {
              addonsdata.current = Object.assign(addonsdata.current, {
                communitySearch: false,
                fullcitySearch: profiledata?.addons?.fullcitySearch,
                location2: profiledata?.addons?.location2,
                location3: profiledata?.addons?.location3,
              });

              subscriptiondata.current = Object.assign(subscriptiondata.current, {
                communitySearch: {
                  active: false,
                  startdate: profiledata?.subscriptioninfo?.communitySearch?.startdate,
                  enddate: profiledata?.subscriptioninfo?.communitySearch?.enddate,
                  canceldate: profiledata?.subscriptioninfo?.communitySearch?.canceldate,
                },
                fullcitySearch: profiledata?.subscriptioninfo?.fullcitySearch,
                location2: profiledata?.subscriptioninfo?.location2,
                location3: profiledata?.subscriptioninfo?.location3,
              });
              fullcitysearchexpired.current = true;
            }
          }

          if (profiledata?.subscriptioninfo?.fullcitySearch?.active == true) {
            if (datenow > new Date(profiledata?.subscriptioninfo?.fullcitySearch?.enddate)) {
              addonsdata.current = Object.assign(addonsdata.current, {
                communitySearch: communitysearchexpired.current
                  ? false
                  : profiledata?.addons?.communitySearch,
                fullcitySearch: false,
                location2: profiledata?.addons?.location2,
                location3: profiledata?.addons?.location3,
              });

              subscriptiondata.current = Object.assign(subscriptiondata.current, {
                communitySearch: communitysearchexpired.current
                  ? subscriptiondata.current.communitySearch
                  : profiledata?.subscriptioninfo?.communitySearch,
                fullcitySearch: {
                  active: false,
                  startdate: profiledata?.subscriptioninfo?.fullcitySearch?.startdate,
                  enddate: profiledata?.subscriptioninfo?.fullcitySearch?.enddate,
                  canceldate: profiledata?.subscriptioninfo?.fullcitySearch?.canceldate,
                },
                location2: profiledata?.subscriptioninfo?.location2,
                location3: profiledata?.subscriptioninfo?.location3,
              });
              fullcitysearchexpired.current = true;
            }
          }
          if (profiledata?.subscriptioninfo?.location2?.active == true) {
            if (datenow > new Date(profiledata?.subscriptioninfo?.location2?.enddate)) {
              addonsdata.current = Object.assign(addonsdata.current, {
                communitySearch: communitysearchexpired.current
                  ? false
                  : profiledata?.addons?.communitySearch,
                fullcitySearch: fullcitysearchexpired.current
                  ? false
                  : profiledata?.addons?.fullcitySearch,
                location2: {
                  city2: '',
                  state2: '',
                  lat: 0,
                  lng: 0,
                },
                location3: profiledata?.addons?.location3,
              });

              subscriptiondata.current = Object.assign(subscriptiondata.current, {
                communitySearch: communitysearchexpired.current
                  ? subscriptiondata.current.communitySearch
                  : profiledata?.subscriptioninfo?.communitySearch,
                fullcitySearch: fullcitysearchexpired.current
                  ? subscriptiondata.current.fullcitySearch
                  : profiledata?.subscriptioninfo?.fullcitySearch,
                location2: {
                  active: false,
                  startdate: profiledata?.subscriptioninfo?.location2?.startdate,
                  enddate: profiledata?.subscriptioninfo?.location2?.enddate,
                  canceldate: profiledata?.subscriptioninfo?.location2?.canceldate,
                },
                location3: profiledata?.subscriptioninfo?.location3,
              });
              location2expired.current = true;
            }
          }
          if (profiledata?.subscriptioninfo?.location3?.active == true) {
            if (datenow > new Date(profiledata?.subscriptioninfo?.location3?.enddate)) {
              addonsdata.current = Object.assign(addonsdata.current, {
                communitySearch: communitysearchexpired.current
                  ? false
                  : profiledata?.addons?.communitySearch,
                fullcitySearch: fullcitysearchexpired.current
                  ? false
                  : profiledata?.addons?.fullcitySearch,
                location2: location2expired.current ? false : profiledata?.addons?.location2,
                location3: {
                  city3: '',
                  state3: '',
                  lat: 0,
                  lng: 0,
                },
              });

              subscriptiondata.current = Object.assign(subscriptiondata.current, {
                communitySearch: communitysearchexpired.current
                  ? subscriptiondata.current.communitySearch
                  : profiledata?.subscriptioninfo?.communitySearch,
                fullcitySearch: fullcitysearchexpired.current
                  ? subscriptiondata.current.fullcitySearch
                  : profiledata?.subscriptioninfo?.fullcitySearch,
                location2: location2expired.current
                  ? subscriptiondata.current.location2
                  : profiledata?.subscriptioninfo?.location2,
                location3: {
                  active: false,
                  startdate: profiledata?.subscriptioninfo?.location3?.startdate,
                  enddate: profiledata?.subscriptioninfo?.location3?.enddate,
                  canceldate: profiledata?.subscriptioninfo?.location3?.canceldate,
                },
              });
              location3expired.current = true;
            }
          }

          if (
            communitysearchexpired.current ||
            fullcitysearchexpired.current ||
            location2expired.current ||
            location3expired.current
          ) {
            setLoading(true);
            setProfiledata({ ...profiledata, addonsdata: addonsdata.current });
            setProfiledata({
              ...profiledata,
              subscriptiondata: subscriptiondata.current,
            });
            setLoading(false);
          }
        }
      }

      //
      // userstate check and update
      //
      if (!isObjEmpty(profiledata)) {
        if (!isObjEmpty(profiledata?.dateofactivation)) {
          let dif = Math.abs(datenow - new Date(profiledata?.dateofactivation));
          let dayssinceactivation = Math.floor(dif / (1000 * 3600 * 24));
          if (dayssinceactivation > Number(profiledata?.acceptedyearsofservice) * 356) {
            //12 months  (356 = 12 months, 547 = 18 months, 712 = 24 months)
            if (profiledata?.userstate == 'active') {
              setActive(false);
              setLoading(true);
              updatestate({ userstate: 'inactive' });
              setLoading(false);
            }
          }
        }
      }

      //
      // update logintime
      //
      setLoading(true);
      updateTimeOfLogin({ timeoflogin: user?.last_sign_in_at });
      setLoading(false);
      setLogininitsDone(true);
    }
  }, [logininitsDone]);

  useEffect(() => {
    loginInits();
  }, [profiledata]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Enhanced Tab Navigation */}
      <div className="bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm mx-2 sm:mx-4 rounded-t-xl sm:rounded-t-2xl overflow-hidden">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-2 px-2 sm:px-4 md:px-8 py-3 sm:py-4 text-xs sm:text-sm md:text-base font-semibold transition-all duration-200 ${
                activeTab === 'search'
                  ? 'text-primary bg-primary/5 border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <SearchIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">Search</span>
            </button>
            <button
              onClick={() => setActiveTab('shortlist')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-2 px-2 sm:px-4 md:px-8 py-3 sm:py-4 text-xs sm:text-sm md:text-base font-semibold transition-all duration-200 ${
                activeTab === 'shortlist'
                  ? 'text-primary bg-primary/5 border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">Shortlist</span>
            </button>
            <button
              onClick={() => setActiveTab('searchuser')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-2 px-2 sm:px-4 md:px-8 py-3 sm:py-4 text-xs sm:text-sm md:text-base font-semibold transition-all duration-200 ${
                activeTab === 'searchuser'
                  ? 'text-primary bg-primary/5 border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <UserSearch className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Search User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1">
        {activeTab === 'search' ? (
          <Suspense fallback={
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground text-sm">Loading search...</p>
              </div>
            </div>
          }>
            <SearchSection
              gender={profiledata?.gender}
              shortlist={profiledata?.shortlist}
              addons={profiledata?.addons}
              primarycity={profiledata?.city}
              verified={verified}
              active={active}
              locationset={profiledata?.defaultcoordsset || profiledata?.usercoordsset}
              onetimepaymentrequired={profiledata?.onetimefeesrequired && !profiledata?.onetimefeespaid}
              maxsearchdistance={
                isObjEmpty(profiledata?.maxsearchdistance) ? 100 : profiledata?.maxsearchdistance
              }
              profilereligion={isObjEmpty(profiledata?.religion) ? '' : profiledata?.religion}
              profiledata={profiledata}
            />
          </Suspense>
        ) : activeTab === 'shortlist' ? (
          <ShortlistSection
            loggedInUser={profiledata?.userid}
            userid={user?.id}
            gender={profiledata?.gender}
            shortlist={profiledata?.shortlist}
            profiledata={profiledata}
            setProfiledata={setProfiledata}
          />
        ) : activeTab === 'searchuser' ? (
          <SearchUser />
        ) : (
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card className="bg-background rounded-2xl shadow-xl border border-border">
              <CardContent className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-6">
                  <SearchIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-bold mb-4 text-foreground">
                  {activeTab === 'search' ? 'Search' : 'Search Users'}
                </h1>
                <p className="text-muted-foreground text-lg">This page is under construction.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
