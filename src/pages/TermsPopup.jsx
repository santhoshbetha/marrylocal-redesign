import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { updateUserInfo } from '../services/userService';
import { logout } from '../store/actions/authActions';
import secureLocalStorage from "react-secure-storage";
import { useDispatch } from "react-redux";
import supabase from '../lib/supabase';

const delay = ms => new Promise(res => setTimeout(res, ms));
function isObjEmpty(val){
    return (val == null || val.length <= 0 ||
            (Object.keys(val).length === 0 && val.constructor === Object)
           ) ? true : false;
};  

export function TermsPopup() {
    const {user, profiledata, setProfiledata} = useAuth();
    const [agree, setAgree] = useState(false);
    const [termsAdding, setTermsAdding] = useState(false);
    let [disabledclass, setDisabledclass] = useState("disabled");
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [accepted, setAccepted] = useState(true);
    let [showclass, setShowclass] = useState("");
    const [termsChecked, setTermsChecked] = useState(false);

    useEffect(() => {
        //console.log("terms useeffect here", auth._id)
        if (!isObjEmpty(user)) {
            delay(1200).then(() => {
                setAccepted(profiledata?.termsaccepted);
                if (profiledata?.termsaccepted == false) {
                    //console.log("here")
                    setShowclass("show")
                }
                setTermsChecked(true);
            })
        } else {
            setTermsChecked(true);
        }
    }, [profiledata]);

    useEffect(() => {
        if (user == null) {
            setShowclass("")
        }
    }, [user]);
    
    const setTermsaccepted = async () => {
        //console.log("settermsaccepted user?.id", user?.id)
        let termsaccepted = true;
        const res = await updateUserInfo(user?.id, {termsaccepted: termsaccepted});
        if (res.success) {
            setProfiledata({...profiledata, termsaccepted: termsaccepted});
            setShowclass("")
            setTermsAdding(false)
        } else {
          //console.log(res.msg);
          alert ('Something wrong. Try again later')
        }
        setTermsAdding(false)
    }

    const onDisagreeClick = async (e) => {
        e.preventDefault();
        if (user) {
            // Sign out from Supabase
            await supabase.auth.signOut();
            // Clear all local storage
            localStorage.removeItem("shortlistarray");
            localStorage.removeItem('page');
            localStorage.removeItem('userstate');
            localStorage.clear(); 
            secureLocalStorage.clear();
            setAccepted(true);
            setShowclass("")
            dispatch(logout());
        }
        navigate('/')
    }
    
    const onAgreeClick = async (e) => {
        e.preventDefault();
        if (!user) {
            alert ('Something wrong. Try reloading page');
            return
        }
        setTermsAdding(true)
        setTermsaccepted ()
    }

    const checkboxHandler = () => {
        // if agree === true, it will be set to false
        // if agree === false, it will be set to true
        setAgree(!agree);
        if (!agree) {
           setDisabledclass("")
        } else {
          setDisabledclass("disabled")
        }
        // Don't miss the exclamation mark
    }

    return (
        termsChecked && (
            <Dialog open={!profiledata?.termsaccepted && !isObjEmpty(user)} onOpenChange={() => {}}>
                <DialogContent className="max-w-lg lg:w-3/4 max-h-[90vh] overflow-y-auto" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Terms and Conditions</DialogTitle>
                </DialogHeader>
                {termsAdding && (
                    <Spinner className="absolute top-[50%] left-[50%] z-50 cursor-pointer size-10" />
                )}
                <div className="space-y-4 p-6">
                    <p className="font-bold text-xl">Terms and Conditions:</p>
                    <p className="font-bold">Last updated on 27-10-2025 19:25:00</p>
                    <p>
                        These Terms and Conditions, along with privacy policy or other terms (“Terms”)
                        constitute a binding agreement by and between MarryLocal.in and you and relate to your
                        use of our website.
                    </p>
                    <p>
                        By using our website and availing the Services, you agree that you have read and
                        accepted these Terms (including the Privacy Policy). We reserve the right to modify
                        these Terms at any time and without assigning any reason. It is your responsibility to
                        periodically review these Terms to stay informed of updates.
                    </p>
                    <p>This site is not for anyone under the age of 18 years.</p>
                    <h6 className="font-bold">
                        The use of this website or availing of our Services is subject to the following terms of
                        use:
                    </h6>
                    <div className="fs-6">
                        <div>
                        To access and use the Services, you agree to provide true, accurate and complete
                        information to us during and after registration, and you shall be responsible for all
                        acts done through the use of your registered account.
                        </div>
                        <div>
                        Your use of our Services and the website is solely at your own risk and discretion..
                        You are required to independently assess and ensure that the Services meet your
                        requirements.
                        </div>
                        <div>
                        The contents of the Website and the Services are proprietary to Us and you will not
                        have any authority to claim any intellectual property rights, title, or interest in
                        its contents.
                        </div>
                        <div>You agree to pay us the charges associated with availing the Services.</div>
                        <div>
                        You acknowledge that unauthorized use of the Website or the Services may to action
                        against you as per these Terms or applicable laws.
                        </div>
                        <div>
                        You understand that upon initiating a transaction for availing the Services you are
                        entering into a legally binding and enforceable contract with the us for the Services.
                        </div>
                        <div>
                        You shall be entitled to claim a refund of the payment made by you in case we are not
                        able to provide the Service. The timelines for such return and refund will be
                        according to the specific Service you have availed or within the time period provided
                        in our policies (as applicable). In case you do not raise a refund claim within the
                        stipulated time, than this would make you ineligible for a refund.
                        </div>
                        <div>
                        All concerns or communications relating to these Terms must be communicated to us
                        using the contact information provided on this website.
                        </div>
                    </div>
                    <h6 className="font-bold">User Conduct:</h6>
                    All users of the Site shall refrain from any and all conduct that is:
                    <div className="fs-6">
                        <div>
                        Unlawful, threatening, abusive, harassing, defamatory, libelous, deceptive,
                        fraudulent, invasive of another person's privacy, tortious, contains explicit or
                        graphic depictions or accounts of sexual acts, or otherwise violates our rules or
                        policies.
                        </div>
                        <div>
                        Posting inappropriate content like adult content or explicit adult material in your
                        profile.
                        </div>
                        <div>
                        Posting any ad for products or services in the bio,‭ ‬use or sale of which is
                        prohibited by any law or regulation.
                        </div>
                        <div>
                        Using any automated device,‭ ‬spider,‭ ‬robot,‭ ‬crawler,‭ ‬data mining tool, ‭
                        ‬software or routine to access,‭ ‬copy,‭ ‬or download any part of the Site.
                        </div>
                        <div>Taking any action creating a disproportionately large usage load on the Site.</div>
                        <div>
                        Posting any employment ads in the bio, violating the anti-discrimination provisions of
                        the Immigration and Nationality Act or messages which violate any law or regulation
                        </div>
                        <div>
                        Using the Site to engage in or assist another individual or entity to engage in
                        fraudulent,‭ ‬abusive,‭ ‬manipulative or illegal activity.
                        </div>
                        <div>
                        Posting free ads promoting links to commercial services or web sites except in areas
                        of the Site where such ads are expressly permitted.
                        </div>
                        <div>
                        Posting any material advertising weapons the use,‭ ‬carrying,‭ ‬or advertising of
                        which is prohibited by law in the bio info.
                        </div>
                    </div>
                    Please report any violations of these Terms to:{' '}
                    <span className="font-semibold">contact@marrylocal.in</span>
                    <div className='mt-3 border-3 border-red-400 p-2 mb-2'>
                        <h6 className='font-bold'>Fees:</h6>
                        <p>
                        Service fees of <b className=''>500Rs</b> applies when there are more than <b>300</b> matches in your area.
                        <span className='block'>Validity: <b>1 year</b>.</span>
                        <span className='block'>Account will be <b>deactivated</b> after <b>1 year</b>. You may activate again.</span>
                        </p>
                    </div>
                </div>
                <div className='ps-6'>
                    <input type="checkbox" id="agree" onChange={checkboxHandler} />
                    <label htmlFor="agree">&nbsp;I agree to <b>terms and conditions</b></label>
                </div>
                <div className="flex justify-between mt-6">
                    <Button
                        type="submit"
                        className={`${disabledclass}`}
                        disabled={!agree}
                        onClick={onAgreeClick}
                    >
                        CONTINUE
                    </Button>
                    <Button
                        type="submit"
                        variant="secondary"
                        onClick={onDisagreeClick}
                    >
                        I DONT AGREE
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
        )
    );
}
