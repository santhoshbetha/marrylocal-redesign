import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '../context/AuthContext';
import { updateUserInfo } from '../services/userService';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const delay = ms => new Promise(res => setTimeout(res, ms));

function isObjEmpty(val){
    return (val == null || val.length <= 0 || 
            (Object.keys(val).length === 0 && val.constructor === Object)
           ) ? true : false;
};

export function ServiceFeesPhonePePaymentStatus() {
    const {user, setAuth, profiledata, setProfiledata} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [loading, setLoading] = useState(false)
    const [paymentsuccess, setPaymentsuccess] = useState(false);
    const [paymentfailed, setPaymentfailed] = useState(false);
    const [paymentobj, setPaymentobj] = useState({});
    let [searchParams, setSearchParams] = useSearchParams();
    let newProfiledata;
    const userid = location.state === null ?  profiledata?.userid : location.state.userid;

    useEffect(() => {
        const status = searchParams.get('status');
        if (status === 'SUCCESS') {
            setPaymentsuccess(true);
            // Simulate processing
            setTimeout(() => {
                if (user) {
                    navigate('/myspace');
                } else {
                    navigate('/login');
                }
            }, 3000);
        } else if (status === 'FAILED') {
            setPaymentfailed(true);
        }
        // For other cases, remain in loading state or show appropriate message
    }, [searchParams, user, navigate]);

    // Payment processing logic is commented out for now

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
