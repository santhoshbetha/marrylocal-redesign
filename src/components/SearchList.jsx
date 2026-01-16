import { useRef, useState, useEffect, useMemo } from 'react';
import { UserCard } from './UserCard';
import { UserProfileDialog } from './UserProfileDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, LayoutGrid, Search } from 'lucide-react';

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

function roundToTwo(num) {
  return +(Math.round(num + 'e+2') + 'e-2');
}

var toKilometers = function (miles) {
  return roundToTwo(miles * 1.609344);
};

var deg2rad = function (value) {
  return value * 0.017453292519943295;
};

function haversine(latIn1, lonIn1, latIn2, lonIn2) {
  // Retuns the great circle distance between two coordinate points in miles
  var dLat = deg2rad(latIn2 - latIn1);
  var dLon = deg2rad(lonIn2 - lonIn1);
  var lat1 = deg2rad(latIn1);
  var lat2 = deg2rad(latIn2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return toKilometers(3960 * c);
}

export function SearchList({
  profiledata,
  searchProfiles,
  shortlist,
  searchresultszero,
  cityNum,
  loading,
}) {
  const [sortmsg, setSortmsg] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  let pagesave = localStorage.getItem('page');
  const [currentPage, setCurrentPage] = useState(
    pagesave == null ? 1 : Number(localStorage.getItem('page')),
  );
  const itemsPerPage = 9;
  const resultsRef = useRef(null);
  const totalPages = Math.ceil((searchProfiles?.length || 0) / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [isLoading, setIsLoading] = useState(false);

  // Memoize shortlist as a Set for efficient lookups
  const shortlistSet = useMemo(() => new Set(shortlist || []), [shortlist]);

  let [dataclone, setDataclone] = useState(searchProfiles);
  let datasort = structuredClone(searchProfiles);

  let lat;
  let lng;

  const currentProfiles = isObjEmpty(dataclone) ? [] : dataclone?.slice(startIndex, endIndex);

  useEffect(() => {
    if (!isObjEmpty(searchProfiles)) {
      setDataclone(searchProfiles);
    }
  }, [searchProfiles]);

  useEffect(() => {
    if (cityNum == 1) {
      lat = profiledata?.latitude;
      lng = profiledata?.longitude;
    } else if (cityNum == 2) {
      lat = profiledata?.addons?.location2?.lat;
      lng = profiledata?.addons?.location2?.lng;
    } else if (cityNum == 3) {
      lat = profiledata?.addons?.location3?.lat;
      lng = profiledata?.addons?.location3?.lng;
    } else {
      lat = profiledata?.latitude;
      lng = profiledata?.longitude;
    }

    if (!isObjEmpty(searchProfiles)) {
      for (const eachuser of dataclone) {
        const distance = haversine(lat, lng, eachuser.latitude, eachuser.longitude);
        //console.log("useEffect distance::", distance)
        eachuser.distance = distance;
      }
    }
  }, [dataclone]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const goToPage = page => {
    if (page !== currentPage) {
      setIsLoading(true);
      setCurrentPage(page);
      localStorage.setItem('page', page);
      setTimeout(() => {
        setIsLoading(false);
        resultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };


  // Helper function to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;

    // Ensure totalPages is a valid number
    const validTotalPages = Math.max(1, Math.floor(totalPages) || 1);

    if (validTotalPages <= maxVisiblePages) {
      // Show all pages if total is small
      return Array.from({ length: validTotalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage <= 3) {
      // Near the beginning: show 1, 2, 3, 4, ..., last
      pages.push(2, 3, 4);
      pages.push('ellipsis-end');
      pages.push(validTotalPages);
    } else if (currentPage >= validTotalPages - 2) {
      // Near the end: show 1, ..., last-3, last-2, last-1, last
      pages.push('ellipsis-start');
      pages.push(validTotalPages - 3, validTotalPages - 2, validTotalPages - 1, validTotalPages);
    } else {
      // In the middle: show 1, ..., current-1, current, current+1, ..., last
      pages.push('ellipsis-start');
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push('ellipsis-end');
      pages.push(validTotalPages);
    }

    return pages;
  };

  if (!isObjEmpty(shortlist)) {
    localStorage.setItem('shortlistarray', JSON.stringify(shortlist));
  }

  const sortClick = e => {
    e.preventDefault();
    if (sortmsg == '' || sortmsg == 'Sorted by distance') {
      datasort.sort((a, b) => new Date(b.timeoflogin) - new Date(a.timeoflogin));
      setSortmsg('Sorted by login time');
    } else if (sortmsg == 'Sorted by login time') {
      datasort.sort((a, b) => a.age - b.age);
      setSortmsg('Sorted by age - ascending');
    } else if (sortmsg == 'Sorted by age - ascending') {
      datasort.sort((a, b) => b.age - a.age);
      setSortmsg('Sorted by age - descending');
    } else if (sortmsg == 'Sorted by age - descending') {
      datasort.sort((a, b) => a.distance - b.distance);
      setSortmsg('Sorted by distance');
    }
    setDataclone(datasort);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Loading Progress Bar */}
      <div className="mb-6 relative h-2 bg-muted/30 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full transition-all duration-500 ${
            isLoading ? 'w-full animate-pulse' : 'w-0'
          }`}
          style={{
            animation: isLoading ? 'progress 1s ease-in-out infinite' : 'none',
          }}
        />
      </div>

      {/* No Results - Initial State */}
      {currentProfiles?.length == 0 && searchresultszero != true && (
        <Card className="bg-background rounded-2xl shadow-xl border border-border">
          <CardContent className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-6">
              <LayoutGrid className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Search</h3>
            <p className="text-muted-foreground">Your search results will appear here once you submit your preferences.</p>
          </CardContent>
        </Card>
      )}

      {/* No Results Found */}
      {currentProfiles?.length == 0 && searchresultszero == true && (
        <Card className="bg-background rounded-2xl shadow-xl border border-border">
          <CardContent className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full mb-6">
              <Search className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Matches Found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria to find more potential matches.</p>
            <Button
              variant="outline"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/20"
            >
              Adjust Search Criteria
            </Button>
          </CardContent>
        </Card>
      )}

      {currentProfiles?.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 mb-4 mx-2 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-primary">
                {currentProfiles?.length} {currentProfiles?.length === 1 ? 'Profile' : 'Profiles'} Found
              </span>
            </div>
            {sortmsg != '' && (
              <span className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md border">
                {sortmsg}
              </span>
            )}
          </div>
          <button
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-200 border border-border hover:border-primary/30"
            title="Sort by login date/age"
            onClick={e => {
              sortClick(e);
            }}
          >
            <LayoutGrid size={16} />
            <span className="hidden sm:inline">Sort</span>
          </button>
        </div>
      )}

      {/* User Profiles Grid */}
      <div ref={resultsRef} className="px-4">
        <div
          className={`col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 transition-opacity duration-300 ${
            isLoading ? 'opacity-50' : 'opacity-100'
          }`}
        >
          {currentProfiles?.map(profile => (
            <UserCard
              setSelectedUser={setSelectedUser}
              profile={profile}
              shortlisted={shortlistSet.has(profile?.shortid)}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <Card className="bg-background rounded-2xl shadow-xl border border-border">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Previous Button */}
              <Button
                onClick={goToPrevious}
                disabled={currentPage === 1}
                variant="outline"
                className="px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-2 flex-wrap justify-center">
                {getPageNumbers().map((page, index) => {
                  if (typeof page === 'string') {
                    return (
                      <span
                        key={`${page}-${index}`}
                        className="w-12 h-12 flex items-center justify-center text-muted-foreground font-medium"
                      >
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-12 h-12 rounded-xl font-semibold transition-all ${
                        currentPage === page
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'bg-muted/50 border border-border hover:bg-muted text-foreground hover:border-primary/50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <Button
                onClick={goToNext}
                disabled={currentPage === totalPages}
                variant="outline"
                className="px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      {currentProfiles?.length > 0 && (
        <div className="text-center text-sm text-muted-foreground mt-6 pb-6">
          Showing {startIndex + 1}-{Math.min(endIndex, searchProfiles?.length)} of{' '}
          {searchProfiles?.length} profiles
        </div>
      )}

      {/* User Profile Dialog */}
      {selectedUser && (
        <UserProfileDialog user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}
