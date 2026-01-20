import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Search } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { searchUser } from '@/services/searchService';
import { SearchUserCard } from '@/components/SearchUserCard';

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

export function SearchUser() {
  const navigate = useNavigate();
  const [searchtext, setSearchtext] = useState('');
  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchdone, setSearchdone] = useState(false);
  const [error, setError] = useState('');
  const isOnline = useOnlineStatus();
  const [useractive, setUseractive] = useState(true);

  const validateSearchInput = (input) => {
    const trimmed = input.trim();
    const phoneregex = /^\d{10}$/;
    const emailregex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const useridregex = /^\d{5,7}$/;

    if (trimmed.match(emailregex)) return { type: 'email', value: trimmed };
    if (trimmed.match(phoneregex)) return { type: 'phone', value: trimmed };
    if (trimmed.match(useridregex)) return { type: 'userid', value: trimmed };
    return null;
  };

  const handleSearchSubmit = async e => {
    e.preventDefault();
    if (loading) return; // Prevent multiple simultaneous searches

    setError('');
    setSearchdone(false);
    setUserdata(null);

    const trimmedSearch = searchtext.trim();
    if (!trimmedSearch) {
      setError('Please enter an email, phone number, or user ID');
      return;
    }

    const validation = validateSearchInput(trimmedSearch);
    if (!validation) {
      setError('Please enter a valid email (example@domain.com), 10-digit phone number, or 5-7 digit user ID');
      return;
    }

    if (!isOnline) {
      setError('No internet connection. Please check your connection and try again.');
      return;
    }

    setLoading(true);
    try {
      const res = await searchUser(trimmedSearch);
      if (res.success) {
        setUserdata(res.data);
        setUseractive(res.data?.userstate === 'active');
        setSearchdone(true);
      } else {
        setUserdata(null);
        setSearchdone(true);
        setUseractive(false);
        setError(res.msg || 'User not found');
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }

    setSearchtext('');
  };

  const clearResults = () => {
    setSearchdone(false);
    setUserdata(null);
    setUseractive(true);
    setError('');
  };

  return (
    <div className="mt-2 flex flex-col justify-center items-center">
      <Card className="bg-white dark:bg-background dark:border-3 w-[90%] sm:max-w-[525px] mb-3 relative">
        {loading && (
          <Spinner className="absolute top-[50%] left-[50%] z-50 cursor-pointer size-10" />
        )}
        <CardHeader>
          <CardTitle className="text-black dark:text-white flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="" onSubmit={handleSearchSubmit}>
            <div>
              <Label htmlFor="usersearch" className="mb-2">
                Email, Phone, or User ID
              </Label>
              <Input
                id="usersearch"
                type="text"
                placeholder="Enter email, phone (10 digits)"
                name="searchtext"
                value={searchtext}
                onChange={e => setSearchtext(e.target.value)}
                disabled={loading}
                className={error ? 'border-red-500' : ''}
              />
              {error && (
                <Alert className="mt-2 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <div className="flex mt-4 gap-2">
              <Button
                variant="outline"
                onClick={e => {
                  e.preventDefault();
                  navigate('/myspace');
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button className="ms-auto" variant="default" type="submit" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <br />
      {searchdone && !userdata && (
        <div className="rounded-lg bg-yellow-200 p-3 w-[90%] sm:max-w-[525px]">
          <div className="flex flex-row items-center">
            <span className="text-sm">
              {error || 'No user found'}
              {!useractive && error !== 'No user found' && ' OR User is not active'}
            </span>
            <Button
              type="button"
              className="text-danger rounded bg-transparent border-0 ms-auto mb-1"
              variant="secondary"
              onClick={clearResults}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                width="14"
                viewBox="0 0 384 512"
                fill="currentColor"
              >
                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
              </svg>
            </Button>
          </div>
        </div>
      )}
      {!isObjEmpty(userdata) && useractive && (
        <Link
          to={{ pathname: `/user/${userdata?.shortid}` }}
          onClick={() => {
            localStorage.setItem('userstate', JSON.stringify({ backbutton: false }));
          }}
          target="_blank"
          className="w-[90%] sm:max-w-[525px]"
        >
          <SearchUserCard
            images={userdata?.images}
            userid={userdata?.userid}
            shortid={userdata?.shortid}
            firstname={userdata?.firstname}
            age={userdata?.age}
            gender={userdata?.gender}
            setUserdata={setUserdata}
          />
        </Link>
      )}
    </div>
  );
}

/*

    const openInNewTab = () => {
        console.log("user handle::", user?.shortid)
        const profileUrl = `/user/${user?.shortid}`
        window.open(profileUrl, "_blank", "noopener,noreferrer")
    }
*/
