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
import { AlertTriangle, Trash2, Shield } from 'lucide-react';

function Delete() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);
  const [confirmClick, setConfirmClick] = useState(false);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    const deleteAccountMy = async userid => {
      const res = await deleteUserAccount(userid);
      if (res.success) {
        alert('Your account is deleted.');
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <Card className="bg-background rounded-2xl shadow-xl border border-border overflow-hidden">
          {deleting && (
            <Spinner className="absolute top-[50%] left-[50%] z-50 cursor-pointer size-10" />
          )}
          <CardHeader className="bg-gradient-to-r from-red-500/10 via-red-500/5 to-red-500/10 px-6 py-8 border-b border-border flex items-start justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-red-800">Delete Account</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Permanently remove your account and all associated data</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Warning Section */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Before You Proceed</h3>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• All your profile information will be permanently deleted</li>
                    <li>• Your photos and personal data will be removed</li>
                    <li>• You will lose access to all MarryLocal features</li>
                    <li>• This action cannot be undone</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">Data Privacy</h3>
                  <p className="text-sm text-blue-700">
                    Your privacy is important to us. Account deletion will permanently remove all your personal information from our servers in accordance with our privacy policy.
                  </p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-red-800 mb-2">Danger Zone</h3>
                  <p className="text-red-700 text-sm">Once you delete your account, there is no going back.</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="lg"
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Delete My Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-md">
                    {deleting && (
                      <Spinner className="absolute top-[50%] left-[50%] z-50 cursor-pointer size-8" />
                    )}
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        Final Confirmation
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-left space-y-2">
                        <p>This action <strong>cannot be undone</strong>. This will permanently delete your account and remove all your data from our servers.</p>
                        <p className="font-medium">Are you absolutely sure you want to delete your account?</p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3">
                      <AlertDialogCancel disabled={deleting} className="px-4 py-2">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => setConfirmClick(true)}
                        disabled={deleting}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-semibold"
                      >
                        {deleting ? (
                          <>
                            <Spinner className="mr-2 size-4" />
                            Deleting...
                          </>
                        ) : (
                          'Yes, Delete My Account'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Alternative Actions */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Need Help Instead?</h4>
              <p className="text-sm text-gray-600 mb-3">
                If you're having issues or need to temporarily deactivate your account, consider these alternatives:
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  Contact Support
                </Button>
                <Button variant="outline" size="sm" className="text-purple-600 border-purple-200 hover:bg-purple-50">
                  Privacy Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Delete;
