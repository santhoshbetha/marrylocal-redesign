import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Spinner } from '@/components/ui/spinner';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useAuth } from '../context/AuthContext';
import secureLocalStorage from 'react-secure-storage';
import { deleteUserAccount } from '../services/registerService';
import { logout } from '../store/actions/authActions';
import { useDispatch } from 'react-redux';

export function Delete() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);
  const [confirmClick, setConfirmClick] = useState(false);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    const deleteAccountMy = async userid => {
      const res = await deleteUserAccount(userid);
      if (res.success) {
        alert('Your acoount is deleted.');
        localStorage.removeItem('shortlistarray');
        localStorage.removeItem('shortlistarraylength');
        localStorage.removeItem('userstate');
        localStorage.clear();
        secureLocalStorage.clear();
        dispatch(logout());
        window.location.href = '/';
      } else {
        setDeleting(false);
        setConfirmClick(false);
      }
      setDeleting(false);
      setConfirmClick(false);
    };

    if (confirmClick == true) {
      setDeleting(true);
      if (!isOnline) {
        alert('You are offline. check your internet connection.');
      } else {
        try {
          deleteAccountMy(user?.id);
        } catch (error) {
          if (error?.response?.status == 429) {
            alert('Too many requests. try again after 2 minutes!');
          } else {
            alert('Something wrong. Try again later');
          }
        }
      }
    }
  }, [confirmClick]);

  return (
    <Card className="w-[95%] max-w-6xl shadow-md border-border/50 mx-4 rounded-none mt-3 relative">
      {deleting && (
        <Spinner className="absolute top-[50%] left-[50%] z-50 cursor-pointer size-10" />
      )}
      <CardHeader className="flex flex-row items-center justify-between md:mx-2 lg:mx-10">
        <CardTitle className="text-2xl">Delete</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4 sm:px-18">
        <AlertDialog>
          <div className="text-red-600 font-bold text-2xl">Danger Zone</div>
          <div className="border-4 border-solid border-red-500 flex p-4 flex-wrap">
            <h3 className="text-wrap font-bold text-2xl mt-2">Delete my account</h3>
            <AlertDialogTrigger asChild>
              <Button className="ms-auto text-wrap py-6" variant="destructive">
                DELETE MY ACCOUNT
              </Button>
            </AlertDialogTrigger>
          </div>
          <AlertDialogContent>
            {deleting && (
              <Spinner className="absolute top-[50%] left-[50%] z-50 cursor-pointer size-10" />
            )}
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove
                your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => setConfirmClick(true)}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
