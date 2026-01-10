import { useRef, useState, useEffect } from 'react';
import { UserCard } from './UserCard';
import { UserProfileDialog } from './UserProfileDialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

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
  const totalPages = Math.ceil(searchProfiles?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [isLoading, setIsLoading] = useState(false);

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

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage <= 3) {
      // Near the beginning: show 1, 2, 3, 4, ..., last
      pages.push(2, 3, 4);
      pages.push('ellipsis-end');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near the end: show 1, ..., last-3, last-2, last-1, last
      pages.push('ellipsis-start');
      pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      // In the middle: show 1, ..., current-1, current, current+1, ..., last
      pages.push('ellipsis-start');
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push('ellipsis-end');
      pages.push(totalPages);
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
    <div>
      <div className="mb-1 relative h-1 bg-muted/30 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full transition-all duration-500 ${
            isLoading ? 'w-full animate-pulse' : 'w-0'
          }`}
          style={{
            animation: isLoading ? 'progress 1s ease-in-out infinite' : 'none',
          }}
        />
      </div>

      {currentProfiles?.length == 0 && searchresultszero != true && (
        <div className="flex justify-center">
          <div className="p-4 border-2 bg-yellow-200 dark:bg-accent-foreground m-2 rounded-lg lg:w-[70%]">
            Search results will be displayed here.
          </div>
        </div>
      )}

      {currentProfiles?.length == 0 && searchresultszero == true && (
        <div className="flex justify-center">
          <div className="p-4 border-2 bg-orange-200 m-2 rounded-lg lg:w-[70%]">
            No results found of your search criteria. try new.
          </div>
        </div>
      )}

      {currentProfiles?.length > 0 && (
        <div className="flex items-center px-3 mb-2 mx-2">
          <h6 className="pt-3 fw-bold text-info">
            Count: {currentProfiles?.length}
            {sortmsg != '' && <span className="ms-2 text-green-600">({sortmsg})</span>}
          </h6>
          <button
            className="btn btn-outline-secondary p-1 ms-auto"
            data-toggle="tooltip"
            title="Sort by logindate/age"
            onClick={e => {
              sortClick(e);
            }}
          >
            <span className="">
              <LayoutGrid size={28} />
            </span>
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
              shortlisted={shortlist?.includes(profile?.shortid)}
            />
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="my-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Previous Button */}
          <Button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            variant="outline"
            className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground transition-all bg-transparent"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {getPageNumbers().map((page, index) => {
              if (typeof page === 'string') {
                // Render ellipsis
                return (
                  <span
                    key={`${page}-${index}`}
                    className="w-10 h-10 flex items-center justify-center text-muted-foreground"
                  >
                    ...
                  </span>
                );
              }
              // Render page number button
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    currentPage === page
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-background border border-border hover:bg-muted text-foreground'
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
            className="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground transition-all bg-transparent"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Results Info */}
      {currentProfiles?.length > 0 ? (
        <div className="mt-6 text-center text-md text-muted-foreground pb-6">
          Showing {startIndex + 1}-{Math.min(endIndex, searchProfiles?.length)} of{' '}
          {searchProfiles?.length} profiles
        </div>
      ) : (
        <></>
      )}

      {/* User Profile Dialog */}
      {selectedUser && (
        <UserProfileDialog user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}
