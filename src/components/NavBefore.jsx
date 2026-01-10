import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Menu } from 'lucide-react';
import { Login } from '@/pages/auth/Login';

export function NavBefore({ openLogin, setOpenLogin }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="font-custom text-[#0F172B] dark:text-white">MarryLocal</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </nav>
        <Dialog open={openLogin} onOpenChange={setOpenLogin}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpenLogin(true)} size="lg" variant="outline">
              Login
            </Button>
          </DialogTrigger>
          <Login
            setOpenLogin={setOpenLogin}
            //setOpenSignup={setOpenSignup}
          />
        </Dialog>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-accent fill-accent" />
                <span className="font-serif text-lg font-semibold">MarryLocal</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-4 mt-8">
              <Link
                to="/"
                className="text-lg font-medium text-foreground hover:text-accent transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-lg font-medium text-foreground hover:text-accent transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-lg font-medium text-foreground hover:text-accent transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4 space-y-3">
                <Button className="w-full" onClick={() => setIsOpen(false)}>
                  Login
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setIsOpen(false)}
                >
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
