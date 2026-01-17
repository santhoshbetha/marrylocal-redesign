import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import supabase from '../../lib/supabase';

export default function AuthConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [hasProcessed, setHasProcessed] = useState(false); // Prevents double execution

  useEffect(() => {
    // 1. Extract the secure parameters from the email link URL
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type'); // This will be 'recovery' for password resets
    const next = searchParams.get('next') || '/changepassword';

    const verifyAndRedirect = async () => {
      console.log("Starting verification process 1 hasProcessed:", hasProcessed);
      if (hasProcessed) return;
      setHasProcessed(true);

       console.log("Starting verification process 2");

      if (token_hash && type) {
         console.log("Starting verification process 3");
        try {
          // 2. Exchange the token_hash for a live browser session
           console.log("Starting verification process 4");
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'recovery',
          });

          console.log("Verifying OTP with token_hash:", token_hash, "and type:", type);
          console.log("Verification result:", { error });

          if (!error) {
            // 3. SUCCESS: The user is now authenticated.
            // Log out any existing session before redirecting to password reset
            await supabase.auth.signOut();
            navigate(next, { replace: true });
          } else {
            // FAILURE: Token might be expired or already used
            console.error('Hash verification failed:', error.message);
            navigate('/login?error=link-expired', { replace: true });
          }
        } catch (err) {
          console.error('Unexpected error during verification:', err);
          navigate('/login?error=verification-failed', { replace: true });
        }
      } else {
        // Missing required parameters
        console.error('Missing token_hash or type parameters');
        navigate('/login?error=invalid-link', { replace: true });
      }
    };

     console.log("Starting verifyAndRedirect call");
    //verifyAndRedirect();
  }, [searchParams, navigate, hasProcessed]); // Empty dependency array ensures this only runs once on mount

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Link</h2>
        <p className="text-gray-600">Please wait while we verify your secure link...</p>
      </div>
    </div>
  );
}