import { useRef, useState, useEffect, useContext } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { useFormik } from 'formik';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import { languages } from '../../lib/languages';
import { communities } from '../../lib/communities';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchList } from '../../components/SearchList';
import { Search } from 'lucide-react';
import { getCityUsercount } from '@/services/registerService';
import { searchUsers } from '@/services/searchService';
import { useQuery } from '@tanstack/react-query';

let distanceMap = new Map([
  ['10 kms', 10000],
  ['25 kms', 25000],
  ['35 kms', 35000],
  ['50 kms', 50000],
  ['75 kms', 75000],
  ['100 kms', 100000],
  ['Full City', 500000],
]);

const getLanguages = languages.map((language, index) => (
  <SelectItem key={index} value={language}>
    {language}
  </SelectItem>
));

const getCommunities = communities.map((community, index) => (
  <SelectItem key={index} value={community}>
    {community}
  </SelectItem>
));

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

const delay = ms => new Promise(res => setTimeout(res, ms));

let searchinput;
export function SearchSection({
  gender,
  shortlist,
  addons,
  primarycity,
  verified,
  active,
  locationset,
  onetimepaymentrequired,
  maxsearchdistance,
  profilereligion,
  profiledata,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [opacity, setOpacity] = useState('');
  const [searchresultszero, setSearchresultszero] = useState(false);
  const [selectcity, setSelectcity] = useState(primarycity);
  const [cityusercount, SetCityusercount] = useState(999999);
  const [cityNum, setCityNum] = useState(1);

  const getMin = () => {
    return formik.values.agefrom;
  };

  const getmaxsearchdistance = cityIn => {
    //primary city
    if (isObjEmpty(cityIn) || cityIn == primarycity) {
      if (!isObjEmpty(addons?.fullcitySearch)) {
        if (addons?.fullcitySearch) {
          return 100;
        } else {
          return maxsearchdistance; //set this thro admin panel for all cities (maxsearchdistance only applicable to primary city)
        }
      } else {
        return maxsearchdistance;
      }
    }

    // second and third cities
    let usercount;
    if (cityIn == addons?.location2?.city2) {
      usercount = secureLocalStorage.getItem('city2uc');
    } else if (cityIn == addons?.location3?.city3) {
      usercount = secureLocalStorage.getItem('city3uc');
    }

    if (addons?.fullcitySearch) {
      return 100;
    } else {
      try {
        if (usercount > 999) {
          return 50;
        } else if (usercount < 1000 && usercount > 750) {
          return 75;
        } else {
          return 100;
        }
      } catch {
        return 100;
      }
    }
  };

  const usersSearchQueryKey = () => ['userssearch'];

  const {
    status,
    data: querydata,
    error: fetcherror,
    refetch,
  } = useQuery({
    queryKey: usersSearchQueryKey(),
    queryFn: async ({ signal }) => {
      if (!isObjEmpty(searchinput)) {
        const response = await searchUsers(searchinput, signal);
        return response.data || null;
      } else {
        return null;
      }
    },
    //enabled: false,
    refetchInterval: 7 * (60 * 1000), // 7 min
    //refetchOnMount: false
  });

  useEffect(() => {
    if (!isObjEmpty(querydata)) {
      setSearchData(
        querydata?.filter(eachUser => {
          if (eachUser?.userid == profiledata?.userid) {
            return false;
          }
          if (eachUser?.showinotherreligionpeoplesearch == true) {
            if (eachUser?.userstate == 'active') {
              return true;
            } else {
              return false;
            }
          } else if (eachUser?.showinotherreligionpeoplesearch == false) {
            if (eachUser?.religion == profilereligion) {
              if (eachUser?.userstate == 'active') {
                return true;
              } else {
                return false;
              }
            }
          }
        }),
      );
    }
  }, [querydata]);

  useEffect(() => {
    if (onetimepaymentrequired) {
      if (verified) {
        setOpacity('opacity-50');
        setError("Registration fees required, click on 'SERVICE FEES PAYMENT' button");
      }
    } else if (!verified) {
      setOpacity('opacity-50');
      setError(
        "Your account is not verified, please click on 'VERIFY PROFILE' button or Email us Aadhar copy",
      );
    } else if (!locationset) {
      setOpacity('opacity-50');
      setError(
        "Your location is not set, go to 'Location' tab and set it or Email you co-ordinates to start searching",
      );
    } else if (!active) {
      setOpacity('opacity-50');
      setError("Your account is in inactive state. click on 'REACTIVATE' button");
    } else {
      setOpacity('');
      setError('');
    }
  }, [verified, locationset, onetimepaymentrequired, active]);

  useEffect(() => {
    secureLocalStorage.setItem('searchdata', JSON.stringify(searchData));
  }, [searchData]);

  useEffect(() => {
    const getCityUsercountNow = async () => {
      setLoading(true);
      const res = await getCityUsercount({
        city: selectcity,
        gender: gender,
      });
      if (res.success) {
        SetCityusercount(Number(res.userCount));
        if (addons?.location2?.city2 == selectcity) {
          secureLocalStorage.setItem('city2uc', Number(res.userCount));
        }
        if (addons?.location3?.city3 == selectcity) {
          secureLocalStorage.setItem('city3uc', Number(res.userCount));
        }
      } else {
        alert('Something wrong. Try again later');
      }
      setLoading(false);
    };

    if (!isObjEmpty(selectcity) && selectcity != primarycity) {
      if (!addons?.fullcitySearch) {
        if (
          addons?.location2?.city2 == selectcity &&
          secureLocalStorage.getItem('city2uc') == null
        ) {
          getCityUsercountNow();
        }
        if (
          addons?.location3?.city3 == selectcity &&
          secureLocalStorage.getItem('city3uc') == null
        ) {
          getCityUsercountNow();
        }
      }
    }
  }, [selectcity]);

  const formik = useFormik({
    initialValues: {
      religion: '',
      language: '',
      searchdistance: 0,
      agefrom: 21,
      ageto: '',
      educationlevel: '',
      jobstatus: true,
      city: '',
      community: '',
      economicstatus: 'All',
    },

    onSubmit: async values => {
      //alert(JSON.stringify(values, null, 2));
      searchinput = {
        gender: profiledata?.gender,
        religion: formik.values.religion,
        language: formik.values.language,
        educationlevel: formik.values.educationlevel,
        jobstatus: formik.values.jobstatus,
        state: profiledata?.state,
        lat: profiledata?.latitude,
        lng: profiledata?.longitude,
        city: isObjEmpty(formik.values.city) ? profiledata?.city : formik.values.city,
        community: isObjEmpty(formik.values.community)
          ? profiledata?.community
          : formik.values.community,
        economicstatus: formik.values.economicstatus,
        searchdistance: distanceMap.get(formik.values.searchdistance),
        agefrom: formik.values.agefrom,
        ageto: formik.values.ageto,
        addons: profiledata?.addons,
      };
      //console.log("formik.values::", formik.values)
      //console.log("onSubmit::", searchinput)
      setLoading(true);

      localStorage.setItem('page', 1);

      const res = await refetch();

      //console.log("res.status::", res.status)
      //console.log("res.data::", res.data)

      if (res.status == 'success') {
        if (res.data?.length != 0) {
          console.log('searchUsers success::', res.data);
        } else {
          setSearchData([]);
        }
        if (res.data?.length == 0) {
          setSearchresultszero(true);
        }
        if (res.data?.length > 500) {
          alert('More than 500 matches. Modify your search criteria next time for better outputs');
        }
      } else {
        alert('Search Error');
      }

      setLoading(false);
      //formik.resetForm({values: ""});
      const element = document.getElementById('search-section');
      if (element) {
        // Will scroll smoothly to the top of the next section
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
  });
  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="w-full p-5 bg-white dark:bg-background"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-2xl py-0">Search matches around you</AccordionTrigger>
          <AccordionContent className="flex flex-col items-center justify-center gap-4 text-balance">
            <form
              className="w-[100%] md:w-[84%] lg:w-[72%]"
              onSubmit={e => {
                e.preventDefault();
                formik.handleSubmit(e);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                <Select
                  required
                  name="religion"
                  onValueChange={value => {
                    formik.values.religion = value;
                  }}
                >
                  <SelectTrigger className="w-full md:mt-5">
                    <SelectValue placeholder="Religion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Hindu">Hindu</SelectItem>
                      <SelectItem value="Muslim">Muslim</SelectItem>
                      <SelectItem value="Christian">Christian</SelectItem>
                      <SelectItem value="Sikh">Sikh</SelectItem>
                      <SelectItem value="Parsi">Parsi</SelectItem>
                      <SelectItem value="Jain">Jain</SelectItem>
                      <SelectItem value="Buddhist">Buddhist</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select
                  required
                  name="language"
                  onValueChange={value => {
                    formik.values.language = value;
                  }}
                >
                  <SelectTrigger className="w-full md:mt-5">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="All">All</SelectItem>
                      {getLanguages}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {!isObjEmpty(addons) && addons?.communitySearch ? (
                  <Select
                    required
                    name="community"
                    onValueChange={value => {
                      formik.values.searchdistance = value;
                    }}
                  >
                    <SelectTrigger className="w-full md:mt-5">
                      <SelectValue placeholder="Community" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="All">All</SelectItem>
                        {getCommunities}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <></>
                )}

                <Select
                  required
                  name="economicstatus"
                  onValueChange={value => {
                    formik.values.economicstatus = value;
                  }}
                >
                  <SelectTrigger className="w-full md:mt-5">
                    <SelectValue placeholder="Economic Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Below Middleclass">Below Middleclass</SelectItem>
                      <SelectItem value="Middleclass">Middleclass</SelectItem>
                      <SelectItem value="Above Middleclass">Above Middleclass</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select
                  required
                  name="searchdistance"
                  onValueChange={value => {
                    formik.values.searchdistance = value;
                  }}
                >
                  <SelectTrigger className="w-full md:mt-5">
                    <SelectValue placeholder="Search distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="10 kms">10 kms</SelectItem>
                      <SelectItem value="25 kms">25 kms</SelectItem>
                      <SelectItem value="35 kms">35 kms</SelectItem>
                      <SelectItem value="50 kms">50 kms</SelectItem>
                      {getmaxsearchdistance(formik.values.city) < 75 ? (
                        <SelectItem value="75 kms" hidden>
                          75 kms
                        </SelectItem>
                      ) : (
                        <SelectItem value="75 kms">75 kms</SelectItem>
                      )}
                      {getmaxsearchdistance(formik.values.city) < 100 ? (
                        <SelectItem value="100 kms" hidden>
                          100 kms
                        </SelectItem>
                      ) : (
                        <SelectItem value="100 kms">100 kms</SelectItem>
                      )}
                      {!isObjEmpty(addons) && addons?.fullcitySearch == true ? (
                        <SelectItem value="Full City">Full City</SelectItem>
                      ) : (
                        <SelectItem value="Full City (coming soon)" disabled>
                          Full City (coming soon)
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {true ? (
                  <div>
                    <Select
                      required
                      name="city"
                      onValueChange={value => {
                        formik.values.city = value;
                      }}
                    >
                      <SelectTrigger className="w-full md:mt-5">
                        <SelectValue placeholder="Search Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="22">{primarycity}</SelectItem>
                          {!isObjEmpty(addons?.location2?.city2) &&
                          (addons?.location2?.usercoordsset == true ||
                            addons?.location2?.defaultcoordsset == true) ? (
                            <SelectItem value="33">{addons?.location2?.city2}</SelectItem>
                          ) : (
                            <></>
                          )}
                          {!isObjEmpty(addons?.location3?.city3) &&
                          (addons?.location3?.usercoordsset == true ||
                            addons?.location3?.defaultcoordsset == true) ? (
                            <SelectItem value="43">{addons?.location3?.city3}</SelectItem>
                          ) : (
                            <></>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <></>
                )}

                <Select
                  required
                  name="economicstatus"
                  onValueChange={value => {
                    formik.values.educationlevel = value;
                  }}
                >
                  <SelectTrigger className="w-full md:mt-5">
                    <SelectValue placeholder="Education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="Bachelors level">Bachelors level</SelectItem>
                      <SelectItem value="Masters level">Masters level</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-row justify-between gap-3 mt-6 mx-2">
                <div className="grid gap-2 mb-2 w-full">
                  <Label htmlFor="agefrom">Age from</Label>
                  <Input
                    required
                    id="agefrom"
                    type="number"
                    min={21}
                    max={45}
                    onChange={formik.handleChange}
                    value={formik.values.agefrom}
                  />
                </div>

                <div className="grid gap-2 mb-2 w-full">
                  <Label htmlFor="ageto">Age to</Label>
                  <Input
                    required
                    id="ageto"
                    type="number"
                    min={getMin()}
                    max={48}
                    onChange={formik.handleChange}
                    value={formik.values.ageto}
                  />
                </div>

                <div className="grid gap-2 mb-2 w-full mt-6">
                  <label htmlFor="jobstatus" className="md:w-2/3 block text-gray-500 font-bold">
                    <input
                      className="mr-2 leading-tight controls"
                      type="checkbox"
                      id="jobstatus"
                      checked={formik.values.jobstatus}
                      value={formik.values.jobstatus}
                      onChange={formik.handleChange}
                    />
                    <span className="text-sm">With Job</span>
                  </label>
                </div>
              </div>

              <div className="mt-4">
                {error == '' ? (
                  <Button
                    type="submit"
                    variant="default"
                    className={`w-full ${opacity} font-semibold`}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    SEARCH
                  </Button>
                ) : (
                  <>
                    <Button
                      type="submit"
                      className="w-full"
                      // /disabled={true}
                    >
                      <Search className="" />
                      <span className="text-lg">SEARCH</span>
                    </Button>
                  </>
                )}
                {error && (
                  <div className="p-6 mt-2 bg-orange-400 font-bold border-2 rounded-lg text-dark text-center text-lg">
                    {error}
                  </div>
                )}
              </div>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <SearchList
        profiledata={profiledata}
        searchProfiles={searchData}
        shortlist={shortlist}
        searchresultszero={searchresultszero}
        cityNum={cityNum}
        loading={loading}
      />
    </>
  );
}
