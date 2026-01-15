import { Card, CardContent } from '@/components/ui/card';
import { Heart, CheckCircle, AlertTriangle, MapPin, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

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
      className="bg-background rounded-2xl shadow-xl border border-border hover:shadow-2xl hover:border-primary/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden group"
    >
      {shortlisted && (
        <div className="absolute top-4 right-4 z-10 animate-pulse">
          <div className="bg-red-500 rounded-full p-2 shadow-lg">
            <Heart className="text-white w-4 h-4" fill="white" />
          </div>
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex gap-4 mb-4">
          {/* Enhanced Profile Image */}
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
            {profile?.images ? (
              <img
                src={`${CDNURL}/${profile?.shortid}/${profile?.images[0]}`}
                alt={profile?.firstname}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {profile?.firstname?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background shadow-sm"></div>
          </div>

          {/* Enhanced Profile Info */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {profile?.firstname}, {profile?.age}
              </h3>
              <TooltipProvider>
                {(profile?.aadharverified || profile?.passportverified || profile?.licenseverified) ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2 py-1">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Identity Verified</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 px-2 py-1">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Unverified
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Identity Not Verified</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">{profile?.educationlevel}</p>
              <p className="text-sm text-muted-foreground">{profile?.community}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {profile?.economicstatus}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {profile?.language}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer with Last Login and Distance */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {!isObjEmpty(profile?.timeoflogin) ? (
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Active {dayjs(profile?.timeoflogin).fromNow()}
                </span>
              ) : (
                <span>Recently joined</span>
              )}
            </div>
            {!isObjEmpty(profile?.distance) && profile?.distance > 5 ? (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="font-medium">{Math.round(profile?.distance)} km away</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span className="font-medium">Nearby</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
