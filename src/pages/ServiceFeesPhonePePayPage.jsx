import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '../context/AuthContext';
import { isGuid } from 'check-guid';
import { CreditCard, DollarSign} from 'lucide-react';

function isObjEmpty(val){
    return (val == null || val.length <= 0 || 
            (Object.keys(val).length === 0 && val.constructor === Object)
           ) ? true : false;
};

export function ServiceFeesPhonePePayPage() {
  const { profiledata } = useAuth();
  const [servicefees, setServiceFees] = useState(null);
  const [phonepeUrl, setPhonepeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [ordercreated, setOrdercreated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userid = location.state === null ?  profiledata?.userid : location.state.userid;

  useEffect(() => {
    // Calculate service fees based on number of matches
    if (profiledata) {
      const matches = profiledata?.numberofmatches || 0;
      let baseFee = 0; // Default fees

      if (matches > 300) {        
        baseFee = 500;
      }

      const discount = (profiledata?.referee_emails?.length || 0) * 50;
      const discountedFee = Math.max(0, baseFee - discount);
      
      setServiceFees(discountedFee);
    }
  }, [profiledata]);
  
  useEffect(() => {
      //console.log("useEffect 1 attemptscount =", attemptsCount)
      //console.log("handle create order..userid", userid) 

      async function createPayment() {
          setLoading(true)

          const data = {
              name: profiledata?.firstname,
              amount: isObjEmpty(servicefees) ? 590 : Number(servicefees*1.18),
              number: Number(profiledata?.phonenumber),
              MUID: "MUID" + Date.now(),
              transactionId: 'T' + Date.now(),
          }

          /*try {
              const orderresp = await axios.post(`${url}/payments/phonepe/order`,
                  {
                      ...data
                  },
                  setHeaders()
              );

              //console.log("resp order here::", orderresp.data.data.instrumentResponse.redirectInfo.url)
              //console.log("resp order status here::", orderresp.status)
              //console.log("ordercreated::", ordercreated)

              if (orderresp.status == 200) {
                  if (orderresp.data && !isObjEmpty(orderresp.data.data.instrumentResponse.redirectInfo.url)) {
                      setPhonepeUrl(orderresp.data.data.instrumentResponse.redirectInfo.url)
                  }
                  setOrdercreated(true)
              }
              setLoading(false)
          } catch (error) {
              //console.log("payment error::", error)
              if (error?.response?.status == 429) {
                alert('Too many requests. try again after 2 minutes!')
              } else {
                alert('There was an error creating payment, please try after sometime 22')
              }
              //console.log('There was an error, please try again: error', error)
              setLoading(false)
          }*/
      }
      
      if (/*isGuid(userid) && */attemptsCount < 2) {
          setAttemptsCount(attemptsCount + 1)
          createPayment()
      } else {
          navigate('/')
      }

  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg border-border/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2 text-green-700">
            Service Fees Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading && (
            <div className="flex justify-center">
              <Spinner className="size-8" />
            </div>
          )}

          <div className="text-center space-y-2">
            <p className="text-gray-600">
              You have more than 300 matches in your area. Complete your payment to continue enjoying our premium services.
            </p>
          </div>

          <div className="space-y-4">
            {(() => {
              const baseFee = profiledata?.acceptedonetimefeesamount || 500;
              const discount = (profiledata?.referee_emails?.length || 0) * 50;
              const discountedFee = baseFee - discount;
              const gstAmount = (discountedFee * 0.18).toFixed(2);
              const totalAmount = (discountedFee * 1.18).toFixed(2);

              return (
                <>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                    <span className="font-medium">Base Service Fee:</span>
                    <span className="font-semibold">{baseFee} Rs</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border">
                    <span className="font-medium">Referral Discount ({profiledata?.referee_emails?.length || 0} referrals):</span>
                    <span className="font-semibold text-blue-700">-{discount} Rs</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                    <span className="font-medium">Service Fee after Discount:</span>
                    <span className="font-semibold">{discountedFee} Rs</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                    <span className="font-medium">GST (18%):</span>
                    <span className="font-semibold">{gstAmount} Rs</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <span className="font-bold text-lg">Total Amount:</span>
                    <span className="font-bold text-lg text-green-700">{totalAmount} Rs</span>
                  </div>
                </>
              );
            })()}
          </div>

          <div className="text-sm text-gray-500 space-y-2 bg-blue-50 p-4 rounded-lg">
            <p>
              <strong>Referral Details:</strong> {profiledata?.referee_emails?.length || 0} successful referrals. Discount: {(profiledata?.referee_emails?.length || 0) * 50} Rs
            </p>
            <p>
              <strong>Original Amount (before discount):</strong> {profiledata?.acceptedonetimefeesamount} Rs
            </p>
            <p>
              <strong>Validity:</strong> {profiledata?.acceptedyearsofservice == 1 ? '1 year' : `${profiledata?.acceptedyearsofservice} years`}
            </p>
          </div>

          <Button
            className="w-full py-3 text-lg"
            disabled={!phonepeUrl || loading}
            onClick={(e) => {
              e.preventDefault();
              if (phonepeUrl) {
                window.location.href = phonepeUrl;
              }
            }}
          >
            <CreditCard className="h-5 w-5 mr-2" />
            {loading ? 'Preparing Payment...' : 'Proceed to Pay with PhonePe'}
          </Button>

          {!phonepeUrl && !loading && (
            <p className="text-center text-red-500 text-sm">
              Payment link is being prepared. Please wait...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

