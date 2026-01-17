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
function SearchSection({
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
  const [conditionsLoaded, setConditionsLoaded] = useState(false);

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
    // Check if all condition variables are loaded (not undefined)
    if (
      verified !== undefined &&
      active !== undefined &&
      locationset !== undefined &&
      onetimepaymentrequired !== undefined
    ) {
      setConditionsLoaded(true);
    }
  }, [verified, active, locationset, onetimepaymentrequired]);

  useEffect(() => {
    // Only set error messages after condition variables are fully loaded
    if (!conditionsLoaded) return;

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
  }, [verified, locationset, onetimepaymentrequired, active, conditionsLoaded]);

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
      searchdistance: '',
      agefrom: 21,
      ageto: '',
      educationlevel: '',
      jobstatus: profiledata?.gender === 'Female' ? true : false,
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
        searchdistance: distanceMap.get(formik.values.searchdistance) || 10000,
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <Card className="bg-background rounded-2xl shadow-xl border border-border mb-2">
          <CardContent className="px-4 py-0">
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue="item-1"
            >
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary transition-colors px-0 py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-md">
                      <Search className="w-4 h-4 text-primary" />
                    </div>
                    Search Preferences
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0 pb-0">
                  <form
                    className="space-y-4"
                    onSubmit={e => {
                      e.preventDefault();
                      formik.handleSubmit(e);
                    }}
                  >
                    {/* Basic Preferences Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Religion</Label>
                        <Select
                          required
                          name="religion"
                          onValueChange={value => {
                            formik.setFieldValue('religion', value);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select religion" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="All">All Religions</SelectItem>
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
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Language</Label>
                        <Select
                          required
                          name="language"
                          onValueChange={value => {
                            formik.setFieldValue('language', value);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="All">All Languages</SelectItem>
                              {getLanguages}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      {!isObjEmpty(addons) && addons?.communitySearch ? (
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-foreground">Community</Label>
                          <Select
                            required
                            name="community"
                            onValueChange={value => {
                              formik.setFieldValue('community', value);
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select community" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="All">All Communities</SelectItem>
                                {getCommunities}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      ) : null}

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Economic Status</Label>
                        <Select
                          required
                          name="economicstatus"
                          onValueChange={value => {
                            formik.setFieldValue('economicstatus', value);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="All">All Status</SelectItem>
                              <SelectItem value="Below Middleclass">Below Middleclass</SelectItem>
                              <SelectItem value="Middleclass">Middleclass</SelectItem>
                              <SelectItem value="Above Middleclass">Above Middleclass</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Search Distance</Label>
                        <Select
                          required
                          name="searchdistance"
                          onValueChange={value => {
                            formik.setFieldValue('searchdistance', value);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select distance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="10 kms">10 kms</SelectItem>
                              <SelectItem value="25 kms">25 kms</SelectItem>
                              <SelectItem value="35 kms">35 kms</SelectItem>
                              <SelectItem value="50 kms">50 kms</SelectItem>
                              {getmaxsearchdistance(formik.values.city) < 75 ? null : (
                                <SelectItem value="75 kms">75 kms</SelectItem>
                              )}
                              {getmaxsearchdistance(formik.values.city) < 100 ? null : (
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
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Search Location</Label>
                        <Select
                          required
                          name="city"
                          onValueChange={value => {
                            formik.setFieldValue('city', value);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="22">{primarycity}</SelectItem>
                              {!isObjEmpty(addons?.location2?.city2) &&
                              (addons?.location2?.usercoordsset == true ||
                                addons?.location2?.defaultcoordsset == true) ? (
                                <SelectItem value="33">{addons?.location2?.city2}</SelectItem>
                              ) : null}
                              {!isObjEmpty(addons?.location3?.city3) &&
                              (addons?.location3?.usercoordsset == true ||
                                addons?.location3?.defaultcoordsset == true) ? (
                                <SelectItem value="43">{addons?.location3?.city3}</SelectItem>
                              ) : null}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Education Level</Label>
                        <Select
                          required
                          name="educationlevel"
                          onValueChange={value => {
                            formik.setFieldValue('educationlevel', value);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select education" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="All">All Levels</SelectItem>
                              <SelectItem value="High School">High School</SelectItem>
                              <SelectItem value="Bachelors level">Bachelors level</SelectItem>
                              <SelectItem value="Masters level">Masters level</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Age Range and Job Status */}
                    <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                      <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                        <div className="p-1 bg-primary/10 rounded">
                          <Search className="w-3.5 h-3.5 text-primary" />
                        </div>
                        Additional Preferences
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="agefrom" className="text-sm font-semibold text-foreground">Age From</Label>
                          <Input
                            required
                            id="agefrom"
                            type="number"
                            min={21}
                            max={45}
                            onChange={formik.handleChange}
                            value={formik.values.agefrom}
                            className="w-full"
                            placeholder="21"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="ageto" className="text-sm font-semibold text-foreground">Age To</Label>
                          <Input
                            required
                            id="ageto"
                            type="number"
                            min={getMin()}
                            max={48}
                            onChange={formik.handleChange}
                            value={formik.values.ageto}
                            className="w-full"
                            placeholder="35"
                          />
                        </div>

                        <div className="flex items-center space-x-3 pt-8">
                          <Checkbox
                            id="jobstatus"
                            checked={formik.values.jobstatus}
                            onCheckedChange={(checked) => {
                              formik.setFieldValue('jobstatus', checked);
                            }}
                          />
                          <Label htmlFor="jobstatus" className="text-sm font-semibold text-foreground cursor-pointer">
                            Employed
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                        <p className="text-destructive font-medium text-center">{error}</p>
                      </div>
                    )}

                    {/* Search Button */}
                    <div className="flex justify-center pt-2">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full md:w-auto px-10 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all"
                        disabled={loading}
                      >
                        <Search className="w-4 h-4 mr-2" />
                        {loading ? 'Searching...' : 'Find Matches'}
                      </Button>
                    </div>
                  </form>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <SearchList
          profiledata={profiledata}
          searchProfiles={searchData}
          shortlist={shortlist}
          searchresultszero={searchresultszero}
          cityNum={cityNum}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default SearchSection;
