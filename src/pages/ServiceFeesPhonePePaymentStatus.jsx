import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '../context/AuthContext';
import { updateUserInfo } from '../services/userService';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import axios from 'axios';
import { url, setHeaders } from '../api';
import { toast } from 'sonner';

function isObjEmpty(val){
    return (val == null || val.length <= 0 || 
            (Object.keys(val).length === 0 && val.constructor === Object)
           ) ? true : false;
};

function ServiceFeesPhonePePaymentStatus() {
    const {user, profiledata, setProfiledata} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [paymentsuccess, setPaymentsuccess] = useState(false);
    const [paymentfailed, setPaymentfailed] = useState(false);
    const [paymentobj, setPaymentobj] = useState({});
    let [searchParams] = useSearchParams();
    const userid = location.state === null ?  profiledata?.userid : location.state.userid;

    useEffect(() => {
        async function processpaymentstatus() {
            try {
                if (searchParams.get('status') == 'SUCCESS') {
                    const payments = await axios.post(`${url}/payments/phonepe/get-payments`,
                                                        {
                                                            userid: userid,
                                                            name: profiledata?.firstname,
                                                            city: profiledata?.city,
                                                            state: profiledata?.state,
                                                            emailid: profiledata?.email,
                                                            order_id: searchParams.get('orderid'),
                                                            setonetimefeespaid: true,
                                                            addonsdata: null,
                                                            subscriptiondata: null
                                                        },
                                                        setHeaders()
                                                    );
    
                    setPaymentsuccess(true)
                    setPaymentobj(payments)
                } else if (searchParams.get('status') == 'FAILED') {
                    setPaymentfailed(true);
                }
            } catch (error) {
                if (error?.response?.status == 429) {
                    toast.error('Too many requests. Please try again after 2 minutes.');
                }
            }
        }
         
        processpaymentstatus()
    }, [searchParams, profiledata?.firstname, profiledata?.city, profiledata?.state, profiledata?.email, userid]);

    useEffect(() => {
        async function recordPayment() {
            try {
                if (paymentobj?.data.paymentrecordedonbacken) {
                    await axios.post(`${url}/payments/record-payment/`,
                    {
                        userid: userid,
                        name: profiledata?.firstname,
                        city: profiledata?.city,
                        state: profiledata?.state,
                        emailid: profiledata?.email,
                        paymentobj: paymentobj?.data
                    }, 
                    setHeaders()
                  );
                }

                if (paymentobj?.data.onetimefeessetonbackend == false) {
                    let onetimefeespaid = true;
                    const res = await updateUserInfo(user?.id, {onetimefeespaid: onetimefeespaid, referee_emails: []});
                    if (res.success) {
                        if (user) {
                            setProfiledata({...profiledata, onetimefeespaid: onetimefeespaid, referee_emails: []});
                        }
                        setTimeout(() => {
                            if (user) {
                                navigate('/myspace');
                            } else {
                                navigate('/login');
                            }
                        }, 3000);
                    } else {
                      console.log(res.msg);
                      navigate('/login') 
                    }
                }
            } catch (error) {
                if (error?.response?.status == 429) {
                    toast.error('Too many requests. Please try again after 2 minutes.');
                } else {
                    toast.error('There was an error with payment processing. Please try again later.');
                }
            }
        }

        if (paymentsuccess) {
            if (!isObjEmpty(paymentobj)) {
                if (paymentobj?.data.paymentrecordedonbackend == false || paymentobj?.data.onetimefeessetonbackend == false) {
                    recordPayment();
                } else {
                    if (user) {
                        setProfiledata({...profiledata, onetimefeespaid: true});
                    }
                    setTimeout(() => {
                        if (user) {
                            navigate('/myspace')
                        } else {
                            navigate('/login')
                        }
                    }, 1000);
                }
            }
        }
    }, [paymentsuccess, paymentobj, navigate, profiledata, setProfiledata, user, userid]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg border-border/50">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl text-gray-800">
                        Payment Status
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {paymentsuccess ? (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <CheckCircle className="h-16 w-16 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-semibold text-green-700">Payment Successful!</h3>
                                <p className="text-gray-600">
                                    Your service fees have been paid successfully. You will be redirected to your dashboard shortly.
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <Spinner className="size-6 text-green-500" />
                            </div>
                            <p className="text-sm text-gray-500">Redirecting in a few seconds...</p>
                        </div>
                    ) : paymentfailed ? (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <XCircle className="h-16 w-16 text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-semibold text-red-700">Payment Failed</h3>
                                <p className="text-gray-600">
                                    Unfortunately, your payment could not be processed. Please try again or contact support.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <Button
                                    className="w-full"
                                    onClick={() => navigate('/service-fees')}
                                >
                                    Try Again
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate('/contact')}
                                >
                                    Contact Support
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <Clock className="h-16 w-16 text-blue-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-semibold text-blue-700">Processing Payment</h3>
                                <p className="text-gray-600">
                                    Please wait while we verify your payment status...
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <Spinner className="size-8 text-blue-500" />
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t">
                        <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => navigate('/myspace')}
                        >
                            Go to Dashboard
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default ServiceFeesPhonePePaymentStatus;
