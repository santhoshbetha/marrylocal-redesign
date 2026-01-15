import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRemoveFromShortlist } from '@/hooks/useDataService';
import secureLocalStorage from 'react-secure-storage';

const CDNURL = 'https://gweikvxgqoptvyqiljhp.supabase.co/storage/v1/object/public/localm/images';

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

export function ShortCard({ loggedInUser, userprofile, profiledata, setProfiledata }) {
  const [removing, setRemoving] = useState(false);
  const removeFromShortlist = useRemoveFromShortlist();
  //let [imgSrc, setImgSrc] = useState(`${CDNURL}/${userprofile?.shortid}/${userprofile?.images[0]}`);

  //useEffect(() => {
  //  setImgSrc(`${CDNURL}/${userprofile?.shortid}/${userprofile?.images[0]}`);
  //}, []);

  async function removeFromShortlistNow(shortidtoremove) {
    await removeFromShortlist.mutateAsync({
      userid: loggedInUser,
      shortidtoremove: shortidtoremove,
    });

    if (!removeFromShortlist.isError) {
      setRemoving(false);
    } else {
      setRemoving(false);
    }
    setRemoving(false);
  }

  const removeFromShortlistClick = async e => {
    e.preventDefault();
    e.stopPropagation();
    //remove user from shortlist data
    setRemoving(true);
    await removeFromShortlistNow(userprofile?.shortid);

    //
    //
    //
    const shortlistarrayfromstorage = JSON.parse(localStorage.getItem('shortlistarray'));

    if (shortlistarrayfromstorage != null) {
      const slnew = shortlistarrayfromstorage.filter(item => item !== userprofile?.shortid);
      if (slnew.length == 0) {
        localStorage.removeItem('shortlistarray');
        setProfiledata({ ...profiledata, shortlist: null });
      } else {
        localStorage.setItem('shortlistarray', JSON.stringify(slnew));
        setProfiledata({ ...profiledata, shortlist: slnew });
      }
    }
  };

  return (
    <Card
      key={userprofile?.shortid}
      onClick={() => localStorage.setItem('activetab', 'shortlist')}
      className={`shadow-md hover:shadow-xl transition-all hover:scale-[1.02] border-2 rounded-md cursor-pointer w-[180px] pb-0 border-blue-300`}
    >
      <div className="flex flex-col items-center">
        {/* Profile Image */}
        <div className="w-30 h-30 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-400 to-blue-600">
          {!isObjEmpty(userprofile?.images) ? (
            <img
              //src={userprofile?.images[0] || "/placeholder.svg"}
              src={`${CDNURL}/${userprofile?.shortid}/${userprofile?.images[0]}`}
              alt={userprofile?.firstname}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#1B93D5]">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="35" r="15" fill="#FDB" />
                <ellipse cx="50" cy="75" rx="25" ry="20" fill="#333" />
              </svg>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div>
          <h4 className="font-bold text-md text-foreground mt-4">
            {userprofile?.firstname}, {userprofile?.age}
          </h4>
        </div>

        <div
          className="flex items-center ms-auto me-1"
          data-toggle="tooltip"
          title="Remove this from shortlist"
        >
          <Button
            variant="outline"
            className="text-danger rounded bg-transparent border-0"
            onClick={e => {
              removeFromShortlistClick(e);
              //localStorage.setItem("reloadshortlistdata", true);
              secureLocalStorage.setItem('reloadshortlistdata', true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="12"
              viewBox="0 0 384 512"
              fill="currentColor"
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </Button>
        </div>
      </div>
    </Card>
  );
}
