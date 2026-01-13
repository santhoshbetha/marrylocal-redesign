import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Login } from '@/pages/auth/Login';

export function HeroSection({ openLogin, setOpenLogin }) {
  const navigate = useNavigate();

  const handleRegister = e => {
    //setIsShowLogin(false)
    navigate('/register');
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 sm:py-16 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left bg-yellow-700d lg:w-[120%] lg:ps-24">
            <div className="space-y-4">
              <Badge
                variant="secondary"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Search with confidence
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-serif font-bold text-balance leading-tight text-white">
                Find matches in your locality
              </h1>
              <p className="text-base sm:text-lg text-white/80 text-pretty max-w-lg mx-auto lg:mx-0">
                This app is made for people to have more choice/freedom. Register to search people
                in your proximity.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Dialog open={openLogin} onOpenChange={setOpenLogin}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setOpenLogin(true)}
                    size="lg"
                    className="bg-white text-slate-900 hover:bg-white/90 font-medium"
                  >
                    Login
                  </Button>
                </DialogTrigger>
                <Login
                  setOpenLogin={setOpenLogin}
                  //setOpenSignup={setOpenSignup}
                />
              </Dialog>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent hover:text-white/80"
                onClick={handleRegister}
              >
                Register
              </Button>
            </div>

            <div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 pt-4"
              hidden
            >
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">10K+</div>
                <div className="text-xs sm:text-sm text-white/70">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">500+</div>
                <div className="text-xs sm:text-sm text-white/70">Success Stories</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">50+</div>
                <div className="text-xs sm:text-sm text-white/70">Cities</div>
              </div>
            </div>
          </div>

          <div className="relative order-first lg:order-last bg-green-80d0 lg:pe-24">
            <div className="relative z-10">
              <img
                src="/CoupleLocal.png"
                alt="Happy couple illustration"
                className="w-[120%] max-w-sm md:max-w-3xl mx-auto"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-3xl blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
