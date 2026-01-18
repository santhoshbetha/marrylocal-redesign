import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { ShortCard } from '../../components/ShortCard';
import { useShortlistData } from '../../hooks/useDataService';
import secureLocalStorage from 'react-secure-storage';

const delay = ms => new Promise(res => setTimeout(res, ms));

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

export function ShortlistSection({ loggedInUser, userid, shortlist, profiledata, setProfiledata }) {
  const [shortListProfiles, setShortListProfiles] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;
  const resultsRef = useRef(null);
  const totalPages = Math.ceil(shortListProfiles?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProfiles = shortListProfiles?.slice(startIndex, endIndex);
  const [isLoading, setIsLoading] = useState(true);

  const { /*isLoading,*/ data, refetch } = useShortlistData({
    userid: userid,
    shortlist: shortlist,
  });

  //const reload = JSON.parse(localStorage.getItem("reloadshortlistdata"))
  const reload = JSON.parse(secureLocalStorage.getItem('reloadshortlistdata'));

  const refetchShortListData = useCallback(async () => {
    const res = await refetch();
  }, [shortlist]);

  useEffect(() => {
    if (reload) {
      refetchShortListData();
      secureLocalStorage.setItem('reloadshortlistdata', false);
    }
  }, [shortlist]);

  useEffect(() => {
    if (!isObjEmpty(data)) {
      setShortListProfiles(data);
      setIsLoading(false);
    }
    delay(100).then(() => {
      setIsLoading(false);
    });
  }, [data]);

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

  /*const { isLoading, error, data, status, refetch } = useShortlistData({
        userid: userid, 
        shortlist: shortlist
    });*/

  return (
    <Card className="border-border/50 rounded-none">
      <div className="relative h-1 bg-muted/30 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full transition-all duration-500 ${
            isLoading ? 'w-full animate-pulse' : 'w-0'
          }`}
          style={{
            animation: isLoading ? 'progress 1s ease-in-out infinite' : 'none',
          }}
        />
      </div>
      {isObjEmpty(data) && (
        <div className="text-center text-muted-foreground">
          <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No shortlisted profiles yet</p>
          <p className="text-sm mt-2">Start searching to find your perfect matches</p>
        </div>
      )}
      {shortListProfiles?.length > 0 && !isObjEmpty(data) && (
        <>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Your shortlisted users</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`col-span-full flex flex-wrap justify-center
                            gap-4 transition-opacity duration-300 ${
                              isLoading ? 'opacity-50' : 'opacity-100'
                            }`}
            >
              {currentProfiles?.map(eachUser => (
                <Link
                  key={eachUser?.shortid || eachUser?.id}
                  to={{ pathname: `/user/${eachUser?.shortid}` }}
                  onClick={() => {
                    localStorage.setItem(
                      'userstate',
                      JSON.stringify({
                        backbutton: true,
                        userid: eachUser?.userid,
                      }),
                    );
                  }}
                >
                  <ShortCard
                    loggedInUser={loggedInUser}
                    userprofile={eachUser}
                    profiledata={profiledata}
                    setProfiledata={setProfiledata}
                  />
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
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
          </CardContent>
        </>
      )}
    </Card>
  );
}

/*
            <div className="p-4">
                <span className="inline-block border border-accent-500 px-4 py-4 text-md font-semibold rounded-lg bg-yellow-200">
                    Nothing here. Your registered events will be shown here.
                </span>
            </div>

                    {selectedUser && <UserProfileDialog user={selectedUser} onClose={() => setSelectedUser(null)} />}
*/
