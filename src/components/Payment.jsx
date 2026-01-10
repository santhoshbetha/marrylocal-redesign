import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import axios from 'axios';
import { url, setHeaders } from '../api';
import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async/dynamic';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const imgstyle = {
  display: 'block',
  width: '250px',
  height: '250px',
};

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

export function Payment({
  buttonname,
  userid,
  name,
  emailid,
  phone,
  city,
  state,
  //checkoutClass,
  amount,
  setPaymentdone,
  addonsdata,
  setAddonsdone,
  subscriptiondata,
  setSubscriptiondone,
}) {
  const [imgsrc, setImgsrc] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [paymentsuccess, setPaymentsuccess] = useState(false);
  const [paymentfailed, setPaymentfailed] = useState(false);
  const [paymentobj, setPaymentobj] = useState({});
  const orderid = useRef(0);
  const isOnline = useOnlineStatus();
  const [showNewDialog, setShowNewDialog] = useState(false);

  const handleCheckout = async () => {
    if (!isOnline) {
      alert('You are offline. check your internet connection.');
      return;
    }

    setLoading(true);

    try {
      const order = await axios.post(
        `${url}/payments/create-order/`,
        {
          amount: amount,
          customerid: userid,
          customeremail: emailid,
          customerphone: phone,
        },
        setHeaders(),
      );
      const pay = await axios.post(
        `${url}/payments/pay-order/`,
        {
          sessionid: order.data.sessionid,
        },
        setHeaders(),
      );
      setCheckout(true);
      orderid.current = order.data.orderid;
      setImgsrc(pay.data.qrcode);
      setShowQr(true);
      setLoading(false);
    } catch (error) {
      if (error?.response?.status == 429) {
        alert('Too many requests. try again after 2 minutes!');
      } else {
        alert('Something wrong. Try again later');
      }
      //alert('There was an error, please try again')
      setLoading(false);
    }
  };

  function handleClose() {
    setShowQr(false);
    setCheckout(false);
    setShowNewDialog(false);
  }

  useEffect(() => {
    if (checkout) {
      setTimeLeft(300);
      const intervalId = setInterval(() => {
        //close after 5 minutes
        setShowQr(false);
        setCheckout(false);
      }, 300000); //Every 5 minutes

      const intervalId2 = setIntervalAsync(async () => {
        setLoading2(true);
        try {
          const payments = await axios.post(
            `${url}/payments/get-payments/`,
            {
              userid: userid,
              name: name,
              emailid: emailid,
              city: city,
              state: state,
              order_id: orderid.current,
              setonetimefeespaid: false,
              addonsdata: addonsdata,
              subscriptiondata: subscriptiondata,
            },
            setHeaders(),
          );

          if (payments.status == 200) {
            if (payments.data.paymentstatus == 'SUCCESS') {
              setShowQr(false);
              setCheckout(false);
              setPaymentsuccess(true);
              setPaymentobj(payments);
              setPaymentdone(true);
              setLoading2(false);
              if (setAddonsdone != null) {
                if (payments.data.addaddonssuccessonbackend == true) {
                  setAddonsdone(true);
                }
              }
              if (setSubscriptiondone != null) {
                if (payments.data.addsubscriptionsuccessonbackend == true) {
                  setSubscriptiondone(true);
                }
              }
            } else if (payments.data.paymentstatus == 'FAILED') {
              setPaymentfailed(true);
              setLoading2(false);
            }
          }
        } catch (error) {
          setLoading(false);
          setLoading2(false);
          setShowQr(false);
          setCheckout(false);
          if (error?.response?.status == 429) {
            alert('Too many requests. try again after 2 minutes!');
          } else {
            alert('There was an error with payment, please try after sometime');
          }
        }
        setLoading2(false);
      }, 10000); //Every 10 sec

      // clear interval on re-render to avoid memory leaks
      return () => {
        clearInterval(intervalId);
        clearIntervalAsync(intervalId2);
        setLoading2(false);
        //clearInterval(intervalId2);
      };
    }
  }, [checkout]);

  useEffect(() => {
    // exit early when we reach 0
    if (!timeLeft) {
      return;
    }

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft]);

  useEffect(() => {
    const recordPayment = async () => {
      try {
        if (paymentobj?.data.paymentrecordedonbacken) {
          const recordpayment = await axios.post(
            `${url}/payments/record-payment/`,
            {
              userid: userid,
              name: name,
              city: city,
              state: state,
              emailid: emailid,
              paymentobj: paymentobj?.data,
            },
            setHeaders(),
          );
        }
      } catch (error) {
        if (error?.response?.status == 429) {
          alert('Too many requests. try again after 2 minutes!');
        } else {
          alert('There was an error with payment, please try after sometime');
        }
        setLoading(false);
      }
    };

    if (paymentsuccess) {
      if (!isObjEmpty(paymentobj)) {
        if (paymentobj?.data.paymentrecordedonbackend == false) {
          setLoading(true);
          recordPayment();
          setLoading(false);
        }
      }
    }
  }, [paymentsuccess, paymentobj]);

  return (
    <>
      <div className="">
        <Button
          //type="submit"
          className="bg-teal-600 hover:bg-[#0D9488]/90 text-white font-bold"
          onClick={() => {
            setShowNewDialog(true);
            setTimeout(() => {
              // handleCheckout()
            }, 500);
          }}
        >
          {buttonname}
        </Button>

        <Popup open={paymentsuccess} modal>
          <div className="p-4">
            <h6 className="text-green-600 text-center">Payment successful</h6>
          </div>
        </Popup>
        <Popup open={paymentfailed} modal>
          <div className="p-4">
            <h6 className="text-red-700 text-center">Payment Failed, try again</h6>
          </div>
        </Popup>

        <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
          <DialogContent className="sm:max-w-[525px] [&>button]:hidden pt-0">
            {loading && (
              <Spinner className="absolute top-[50%] left-[50%] z-50 cursor-pointer size-10 text-red-800" />
            )}
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div>
              <div className="flex items-center">
                <div className="text-blue-400">
                  Expires in <span className="text-danger">{timeLeft}</span> seconds ...
                  {loading2 && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                </div>
                <Button variant="outline" className="ms-auto" onClick={handleClose}>
                  <span className="p-0 fs-6">X</span>
                </Button>
              </div>
              <div className="text-red-600 mt-2">
                (Do not close this window while attempting payment on your phone!!!)
              </div>

              <div className="flex pb-4 flex-col items-center">
                <div className="pt-3 text-lg font-semibold">Scan QR code to Pay: {amount}Rs</div>
                <img style={imgstyle} className="" src={imgsrc} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
