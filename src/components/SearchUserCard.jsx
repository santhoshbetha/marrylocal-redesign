import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CDNURL = 'https://gweikvxgqoptvyqiljhp.supabase.co/storage/v1/object/public/localm/images';

export function SearchUserCard({ images, shortid, firstname, age, gender, setUserdata }) {
  let [imgSrc, setImgSrc] = useState(`${CDNURL}/${shortid}/first`);
  const [removing, setRemoving] = useState(false);
   
  const removeClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setRemoving(true);
    setUserdata(null);
    setRemoving(false);
  };

  return (
    <Card
      key={shortid}
      //onClick={() => setSelectedUser(profile)}
      className={`shadow-md hover:shadow-xl transition-all hover:scale-[1.02] border-3 rounded-none cursor-pointer w-[180px] pb-0`}
    >
      <div className="flex flex-col items-center">
        {/* Profile Image */}
        <div className="w-30 h-30 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-400 to-blue-600">
          {images && images.length > 0 ?
          <>
           {gender == 'Male' ? (
              <img
                // eslint-disable-next-line no-constant-binary-expression
                src={`${CDNURL}/${shortid}/first` || "/male-default-4.png"}
                alt={firstname}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                // eslint-disable-next-line no-constant-binary-expression
                src={`${CDNURL}/${shortid}/first` || "/female-default-2.png"}
                alt={firstname}
                className="w-full h-full object-cover"
              />
            )}
          </>
          :
          <>
           {gender == 'Male' ? (
              <img
                src={"/male-default-4.png"}
                alt={firstname}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={"/female-default-2.png"}
                alt={firstname}
                className="w-full h-full object-cover"
              />
            )}
          </>
        }
        </div>

        {/* Profile Info */}
        <div>
          <h4 className="font-bold text-md text-foreground mt-4">
            {firstname}, {age}
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
              removeClick(e);
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
