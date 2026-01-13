import { Card } from '@/components/ui/card';
import { Heart, CheckCircle, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import dayjs from 'dayjs';

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

const CDNURL = 'https://gweikvxgqoptvyqiljhp.supabase.co/storage/v1/object/public/localm/images';
export function UserCard({ setSelectedUser, profile, shortlisted }) {
  return (
    <Card
      key={profile?.id}
      onClick={() => setSelectedUser(profile)}
      className={`overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] border-2 cursor-pointer py-0 rounded-none relative`}
    >
      {shortlisted && (
        <div className="absolute top-4 right-4 z-10">
          <Heart className="text-red-600 w-6 h-6" fill="red" />
        </div>
      )}
      <div className="p-6">
        <div className="flex gap-4 mb-4">
          {/* Profile Image */}
          <div className="w-20 h-20 rounded-4xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-400 to-blue-600">
            {profile?.images ? (
              <img
                //src={profile?.images[0] || "/placeholder.svg"}
                src={`${CDNURL}/${profile?.shortid}/${profile?.images[0]}`}
                alt={profile?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="35" r="15" fill="#FDB" />
                  <ellipse cx="50" cy="75" rx="25" ry="20" fill="#333" />
                </svg>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="font-bold text-lg text-foreground">
                {profile?.firstname}, {profile?.age}
              </div>
              <TooltipProvider>
                {profile?.aadharverified ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CheckCircle className="h-4 w-4 text-green-600 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Verified</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertTriangle className="h-4 w-4 text-yellow-600 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Not Verified</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>

            <p className="text-sm text-muted-foreground mb-1">{profile?.educationlevel}</p>
            <p className="text-sm text-muted-foreground">{profile?.community}</p>
            <p className="text-sm text-green-700">{profile?.economicstatus}</p>
            <p className="text-sm text-muted-foreground">{profile?.language}</p>
          </div>
        </div>

        {/* Last Login */}
        <div className="pt-4 border-t">
          <div className="flex justify-between">
            {!isObjEmpty(profile?.timeoflogin) ? (
              <div className="text-muted-foreground text-xs">
                Last Login:{' '}
                <span className="text-green-700">
                  {dayjs(profile?.timeoflogin).format('MMM D, YYYY HH:mm')}
                </span>
              </div>
            ) : (
              <></>
            )}
            {!isObjEmpty(profile?.distance) && profile?.distance > 5 ? (
              <div className="text-muted-foreground text-xs">{profile?.distance} kms away</div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
