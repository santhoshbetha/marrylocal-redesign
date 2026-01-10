import { useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import copy from 'copy-to-clipboard';

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

export function Referrals() {
  const { profiledata } = useAuth();
  const textRef = useRef();

  //Function to add text to clipboard
  const copyToClipboard = () => {
    // Text from the html element
    let copyText = textRef.current.value;
    // Adding text value to clipboard using copy function
    let isCopy = copy(copyText);

    //Dispalying notification
    if (isCopy) {
      toast.success('Copied to Clipboard');
    }
  };

  return (
    <Card className="w-[95%] max-w-6xl shadow-md border-border/50 mx-4 rounded-none mt-3">
      <CardHeader className="flex flex-row items-center justify-between md:mx-2 lg:mx-10">
        <CardTitle className="text-2xl">Referrals</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4 sm:px-18">
        <div className="text-xl">
          Tell a friend or family member about 'Marrylocal' and recieve 50 Rs off (for each
          referral) of your "Service Fees" which gets applied when there are more than 300 matches
          in your area. Maximum 8 referrals permitted.
        </div>
        <div className="flex flex-col">
          <div className="text-lg mb-2">Share below referral link:</div>
          <div>
            <Input
              value={`https://marrylocal.in/register?ref=${profiledata?.referral_code}`}
              disabled
              type="text"
              ref={textRef}
              className="md:w-[50%]"
            />
            <Button variant="outline" onClick={copyToClipboard}>
              Copy
            </Button>
          </div>
          <br />
          OR
          <div>
            <span className="text-lg">Share your referral code: </span>
            <span className="text-green-600 fw-bold">{profiledata?.referral_code}</span>
          </div>
        </div>
        {!isObjEmpty(profiledata?.referee_emails) ? (
          <div className="">
            <div className="text-lg">Your current referrals who have registered:</div>
            {isObjEmpty(profiledata?.referee_emails) ? (
              <>None</>
            ) : (
              <div>
                <ol className="list-decimal text-green-700 ms-6">
                  {profiledata?.referee_emails?.map((eachEmail, idx) => (
                    <li key={idx}>{eachEmail}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </CardContent>
    </Card>
  );
}
