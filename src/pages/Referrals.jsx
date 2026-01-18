import { useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import copy from 'copy-to-clipboard';
import { Copy, Gift, CheckCircle, Share2, Trophy, Users } from 'lucide-react';

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

function Referrals() {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header Section */}
      <div className="text-center py-4 sm:py-8 px-4">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-2 sm:mb-4">
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-1 sm:mb-2">Referrals</h1>
        <p className="text-muted-foreground text-base sm:text-lg">Invite friends and earn rewards</p>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Main Content Card */}
        <Card className="bg-background/95 backdrop-blur-sm border-border/50 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full mb-4">
              <Gift className="w-6 h-6 text-primary" />
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Benefits Section */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">How it works:</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Share your referral link with friends and family</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Earn ₹50 off your service fees for each successful referral</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Reward applies when there are 300+ matches in your area</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Maximum 8 referrals permitted</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Referral Link Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">
                  Share below Referral Link
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    value={`https://marrylocal.in/register?ref=${profiledata?.referral_code}`}
                    disabled
                    type="text"
                    ref={textRef}
                    className="flex-1 text-sm"
                    placeholder="Your referral link"
                  />
                  <Button
                    variant="default"
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 min-w-fit"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </Button>
                </div>

                <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Or share this referral code:</span>
                  <span className="font-mono text-lg font-semibold text-primary bg-primary/10 px-3 py-1 rounded-md">
                    {profiledata?.referral_code}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Referrals Section */}
            {!isObjEmpty(profiledata?.referee_emails) && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h3 className="text-xl font-semibold text-foreground">Your Successful Referrals</h3>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="text-sm text-green-700 dark:text-green-300 mb-3">
                    People who have registered using your referral:
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-green-700 dark:text-green-300">
                    {profiledata?.referee_emails?.map((eachEmail, idx) => (
                      <li key={idx} className="text-sm">{eachEmail}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border/50">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {profiledata?.referee_emails?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Referrals Made</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {Math.max(0, 8 - (profiledata?.referee_emails?.length || 0))}
                </div>
                <div className="text-sm text-muted-foreground">Referrals Left</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Referrals;
