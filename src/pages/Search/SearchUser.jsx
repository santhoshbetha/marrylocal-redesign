import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { searchUser } from '@/services/searchService';
import { SearchUserCard } from '@/components/SearchUserCard';
import { UserProfileDialog } from '@/components/UserProfileDialog';

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
  const isOnline = useOnlineStatus();

  const handleSearchSubmit = async e => {
    e.preventDefault();
    setSearchdone(false);

    var phoneregex = /^\d{10}$/;
    var emailregex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    var useridregex = /^\d{5,7}$/;
    if (searchtext.match(emailregex) || searchtext.match(phoneregex)) {
      setLoading(true);
      //await searchuser(searchtext)
      const res = await searchUser(searchtext);
      setLoading(false);
      if (res.success) {
        setUserdata(res.data);
      } else {
        setUserdata(null);
        setSearchdone(true);
      }
    } else {
      alert('invalid email or phone');
    }
    setSearchtext('');
  };

  return (
    <div className="mt-2 flex flex-col justify-center items-center">
      <Card className="bg-white dark:bg-background dark:border-3 w-[90%] sm:max-w-[525px] mb-3 relative">
        {loading && (
          <Spinner className="absolute top-[50%] left-[50%] z-50 cursor-pointer size-10" />
        )}
        <CardHeader>
          <CardTitle className="text-black dark:text-white">Search User</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="" onSubmit={handleSearchSubmit}>
            <div>
              <Label htmlFor="usersearch" className="mb-2">
                Email or Phone
              </Label>
              <Input
                id="email"
                type="text"
                placeholder=""
                name="searchtext"
                value={searchtext}
                onChange={e => setSearchtext(e.target.value.trim())}
                //autoFocus
              />
            </div>
            <div className="flex mt-4">
              <Button
                variant="outline"
                onClick={e => {
                  e.preventDefault();
                  navigate('/myspace');
                }}
              >
                Cancel
              </Button>
              <Button className="ms-auto" variant="default" type="submit">
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <br />
      {isObjEmpty(userdata) && searchdone && (
        <div className="rounded-lg bg-yellow-200 p-3">
          <div className="flex flex-row items-center">
            No user found
            <Button
              type="button"
              className="text-danger rounded bg-transparent border-0 ms-auto mb-1"
              variant="secondary"
              onClick={e => {
                setSearchdone(false);
                setUserdata(null);
              }}
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
      {!isObjEmpty(userdata) && (
        <Link
          to={{ pathname: `/user/${userdata?.shortid}` }}
          onClick={() => {
            localStorage.setItem('userstate', JSON.stringify({ backbutton: false }));
            console.log('shortid here::', userdata?.shortid);
            // const profileUrl = `/user/${userdata?.shortid}`
            // window.open(profileUrl, "_blank", "noopener,noreferrer")
          }}
          target="_blank"
        >
          <SearchUserCard
            profile={userdata}
            userid={userdata?.userid}
            shortid={userdata?.shortid}
            firstname={userdata?.firstname}
            age={userdata?.age}
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
