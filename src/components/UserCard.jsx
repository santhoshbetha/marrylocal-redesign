import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';
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
      className={`overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] border-2 cursor-pointer py-0 rounded-none`}
    >
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
            <div className="flex flex-row justify-between">
              <div className="font-bold text-lg text-foreground mb-2">
                {profile?.firstname}, {profile?.age}
              </div>
              {shortlisted && <Heart className="text-red-600" fill="red" />}
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
