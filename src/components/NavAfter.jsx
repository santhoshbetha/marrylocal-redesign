// removed unused useState import
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function NavAfter() {
  const navigate = useNavigate();
  const { profiledata } = useAuth();

  async function onLogout() {
    navigate('/logout');
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#0288D1]/90 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/myspace" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="font-custom text-[#FFD700]">MarryLocal</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/about"
            className="text-sm font-medium text-white hover:text-white/80 transition-colors"
          >
            ABOUT
          </Link>
          <Link
            to="/search"
            className="text-sm font-medium text-white hover:text-white/80 transition-colors"
          >
            SEARCH
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-white hover:text-white/80 transition-colors"
          >
            CONTACT
          </Link>
          <Link
            to="/referrals"
            className="text-sm font-medium text-white hover:text-white/80 transition-colors"
          >
            REFERRALS
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9" style={{ cursor: 'pointer' }}>
                <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                <AvatarFallback>
                  {profiledata?.firstname[0]?.toUpperCase()}
                  {profiledata?.lastname[0]?.toUpperCase()}
                </AvatarFallback>
                <span className="sr-only">Toggle user menu</span>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuGroup className="space-y-1">
                <DropdownMenuItem onSelect={() => navigate('/forgotpassword')}>
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate('/delete')}>Delete</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onLogout()}>Log out</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
