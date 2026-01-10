import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export function Contact() {
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top-left corner
  }, []);

  return (
    <>
      <div className="h-dvh">
        <div className="flex justify-center">
          <Card className="w-[95%] max-w-7xl shadow-md border-border/50 mx-4 rounded-none mt-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">Contact</CardTitle>
            </CardHeader>
            <CardContent className="px-10">
              <h5 className="text-lg font-semibold tracking-tight">
                Write us your sugestions or queries to:
                <span className="text-green-700">&nbsp;contact@marrylocal.in</span>
              </h5>
            </CardContent>
            <CardHeader>
              <CardTitle className="text-black dark:text-white">Developers</CardTitle>
            </CardHeader>
            <CardContent className="px-10">
              <h5 className="font-semibold">
                Developers who would like to contribute to this project and enhance it may contact
                at
                <span className="text-green-700">&nbsp;developers@marrylocal.in</span>
              </h5>
            </CardContent>
          </Card>
        </div>
      </div>
      {!user ? <Footer /> : <></>}
    </>
  );
}
