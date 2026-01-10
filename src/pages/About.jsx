import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { Footer } from '../components/Footer';
import ScrollToTop from 'react-scroll-to-top';

export function About() {
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top-left corner
  }, []);

  return (
    <>
      <div className="h-dvh">
        <ScrollToTop smooth />
        <div className="flex justify-center">
          <Card className="w-[95%] max-w-7xl shadow-md border-border/50 mx-4 rounded-none mt-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">More about MarryLocal</CardTitle>
            </CardHeader>
            <CardContent className="px-10">
              <ul className="list-disc">
                <li className="text-lg p-2">
                  <span>
                    We believe in matching same <span className="text-green-600">locale</span>{' '}
                    people for better
                    <span className="text-blue-500 ms-1">long term relationships</span> irrespective
                    of language/community etc, and believe it should not be so{' '}
                    <span className="fw-bolder">difficult</span> or{' '}
                    <span className="fw-bolder">tedious </span>
                    and <span className="fw-bolder">cost as much</span>.
                  </span>
                </li>
                <li className="text-lg p-2">
                  <span>
                    We use your <span className="text-green-600">GEO location</span> (GPS
                    co-ordinates) and show you matches in the selected radius of{' '}
                    <span className="fw-bolder">10/25/35/50/..</span>{' '}
                    <span className="fw-bolder me-2">kms</span>
                    around you. all matches shown will be from your state, also from your
                    neighboring cities if they fall within your search distance.
                  </span>
                </li>
                <li className="text-lg p-2">
                  <span>
                    We do not <span className="text-blue-500 me-1">control/restrict</span>
                    access to contact information of any user to anyone. You may set/unset your
                    contact information visibility on your{' '}
                    <span className="text-blue-500 fs-5 fw-bold">Settings</span> page. Only caveat
                    is you cannot restrict your <span className="text-blue-500 ms-1">email id</span>{' '}
                    visibility. It will be visible to all.
                  </span>
                </li>
                <li className="text-lg p-2">
                  <span>
                    We verify every user.
                    <span className="fw-bold"> scammers</span> or{' '}
                    <span className="fw-bold">fake profiles</span> or
                    <span className="ms-1 fw-bold">duplicates</span> or{' '}
                    <span className="ms-1 fw-bold">match making agents</span> are
                    <span className="ms-1 fw-bold text-dark">NOT</span> allowed.Only one profile per
                    person is allowed and your
                    <span className="ms-1 fw-bold">name/date of birth</span> should match the
                    verifiable documents you provide.Report us if you notice any of the above.
                  </span>
                </li>
                <li className="text-lg p-2">
                  <span>
                    This app is created with{' '}
                    <span className="me-1 text-green-600">good intentions</span> to help people, in
                    a way people want. You suggestions to help and improve this app are always
                    welcome. Please <span className="text-blue-500">email</span> us for that.
                  </span>
                </li>
                <li className="text-lg p-2">
                  <span>
                    Please help by sharing this app with your connections on
                    <span className="ms-1 fs-4">
                      <span className="text-green-600">WhatsApp</span>/
                      <span className="text-red-700">Instagram</span>/
                      <span className="text-blue-500">Facebook</span>.
                    </span>
                    <span hidden>We all grow as we grow.</span>
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      {!user ? <Footer /> : <></>}
    </>
  );
}
