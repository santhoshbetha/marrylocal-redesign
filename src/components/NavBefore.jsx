import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Menu, UserPlus, LogIn } from 'lucide-react';
import { Login } from '@/pages/auth/Login';
import { usePageGradient } from '@/hooks/usePageGradient';

export function NavBefore({ openLogin, setOpenLogin }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const gradient = usePageGradient();

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <header className={`border-b border-border/40 bg-gradient-to-r ${gradient} backdrop-blur supports-[backdrop-filter]:bg-blue-600/90 sticky top-0 z-50 shadow-lg`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="font-custom text-white">MarryLocal</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <Dialog open={openLogin} onOpenChange={setOpenLogin}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setOpenLogin(true)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 hover:text-white border-white/20"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </DialogTrigger>
            <Login
              setOpenLogin={setOpenLogin}
            />
          </Dialog>
          <Button
            onClick={handleRegister}
            size="sm"
            className="bg-white text-blue-600 hover:bg-blue-50 font-medium shadow-md"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Register
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className={`w-[300px] sm:w-[400px] bg-gradient-to-b ${gradient} text-white border-l-0`}>
            <SheetHeader>
              <SheetTitle className="flex items-center space-x-2 text-white">
                <img src="/logo.png" alt="Logo" className="h-8 w-8" />
                <span className="font-custom">MarryLocal</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-4 mt-8">
              <Link
                to="/"
                className="text-lg font-medium text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                🏠 Home
              </Link>
              <Link
                to="/about"
                className="text-lg font-medium text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                ℹ️ About
              </Link>
              <Link
                to="/contact"
                className="text-lg font-medium text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                📞 Contact
              </Link>
              <div className="pt-6 space-y-3 border-t border-white/20">
                <Dialog open={openLogin} onOpenChange={setOpenLogin}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </DialogTrigger>
                  <Login
                    setOpenLogin={setOpenLogin}
                  />
                </Dialog>
                <Button
                  variant="outline"
                  className="w-full bg-white text-blue-600 hover:bg-blue-50 border-white font-medium"
                  onClick={() => {
                    setIsOpen(false);
                    handleRegister();
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
