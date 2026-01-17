// removed unused useState import
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLogout } from '@/hooks/useLogout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Heart, Menu, User, Settings, LogOut, Search, Users, MessageCircle, Home, Key, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { usePageGradient } from '@/hooks/usePageGradient';

export function NavAfter() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { profiledata } = useAuth();
  const { handleLogout, isLoggingOut } = useLogout();
  const gradient = usePageGradient();

  const getInitials = () => {
    if (profiledata?.firstname && profiledata?.lastname) {
      return `${profiledata.firstname[0]}${profiledata.lastname[0]}`.toUpperCase();
    }
    return 'U';
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-border/40 bg-gradient-to-r ${gradient} backdrop-blur supports-[backdrop-filter]:bg-blue-600/90 shadow-lg`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to={profiledata?.role === 'admin' ? '/admin' : '/myspace'} className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="font-custom text-white">MarryLocal</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to={profiledata?.role === 'admin' ? '/admin' : '/myspace'}
            className="flex items-center space-x-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link
            to="/about"
            className="flex items-center space-x-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200"
          >
            <Users className="h-4 w-4" />
            <span>About</span>
          </Link>
          {profiledata?.role !== 'admin' && (
            <Link
              to="/search"
              className="flex items-center space-x-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Link>
          )}
          <Link
            to="/contact"
            className="flex items-center space-x-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Contact</span>
          </Link>
          {profiledata?.role !== 'admin' && (
            <Link
              to="/referrals"
              className="flex items-center space-x-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-200"
            >
              <Users className="h-4 w-4" />
              <span>Referrals</span>
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10 transition-colors">
                <Avatar className="h-10 w-10 border-2 border-white/20">
                  <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                  <AvatarFallback className="bg-white/20 text-white font-semibold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-4" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {profiledata?.firstname} {profiledata?.lastname}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {profiledata?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {profiledata?.role !== 'admin' && (
                <DropdownMenuItem onSelect={() => navigate('/profile')} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              )}
              {profiledata?.role !== 'admin' && (
                <DropdownMenuItem onSelect={() => navigate('/settings')} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onSelect={() => navigate('/forgotpassword')} className="cursor-pointer">
                <Key className="mr-2 h-4 w-4" />
                <span>Change Password</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate('/delete')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Delete Account</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => handleLogout()} className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
                  <span className="font-custom text-lg">MarryLocal</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-8">
                <Link
                  to={profiledata?.role === 'admin' ? '/admin' : '/myspace'}
                  className="flex items-center space-x-3 text-lg font-medium text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/about"
                  className="flex items-center space-x-3 text-lg font-medium text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  <span>About</span>
                </Link>
                <Link
                  to="/search"
                  className="flex items-center space-x-3 text-lg font-medium text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <Search className="h-5 w-5" />
                  <span>Search</span>
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center space-x-3 text-lg font-medium text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Contact</span>
                </Link>
                <Link
                  to="/referrals"
                  className="flex items-center space-x-3 text-lg font-medium text-white/90 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  <span>Referrals</span>
                </Link>
                <div className="pt-6 border-t border-white/20 hidden md:block">
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-10 w-10 border-2 border-white/20">
                      <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                      <AvatarFallback className="bg-white/20 text-white font-semibold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-white">
                        {profiledata?.firstname} {profiledata?.lastname}
                      </p>
                      <p className="text-xs text-white/70">{profiledata?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10"
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/profile');
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10"
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/settings');
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10"
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/forgotpassword');
                      }}
                    >
                      <Key className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/10"
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/delete');
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-300 hover:bg-red-500/20 hover:text-red-200"
                      disabled={isLoggingOut}
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                    >
                      {isLoggingOut ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="mr-2 h-4 w-4" />
                      )}
                      {isLoggingOut ? 'Logging out...' : 'Log out'}
                    </Button>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
