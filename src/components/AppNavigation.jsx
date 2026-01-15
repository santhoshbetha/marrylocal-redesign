import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/use-mobile';
import {
  Search,
  Plus,
  Ticket,
  User,
  Heart,
  Images,
  Settings,
  UserPen,
  BadgeCheck,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { updateUserInfo } from '../services/userService';
import { toast } from 'sonner';
import supabase from '../lib/supabase';

export function AppNavigation({ children }) {
  const { user, profiledata, setProfiledata } = useAuth();
  const location = useLocation();
  useIsMobile();
  const [showReactivateDialog, setShowReactivateDialog] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);

  useEffect(() => {
    if (user && profiledata?.userstate === 'inactive') {
      setShowReactivateDialog(true);
    }
  }, [user, profiledata]);

  const handleCancel = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      // Force reload anyway
      window.location.reload();
    }
  };

  const handleReactivate = async () => {
    setIsReactivating(true);
    try {
      const userstatedata = {
        userstate: 'active',
        onetimefeespaid: false
      };
      const res = await updateUserInfo(user?.id, userstatedata);
      if (res.success) {
        setProfiledata({ ...profiledata, ...userstatedata });
        toast.success('Profile reactivated successfully!');
        setShowReactivateDialog(false);
      } else {
        toast.error('Failed to reactivate profile. Please try again.');
      }
    } catch (error) {
      console.error('Reactivation error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsReactivating(false);
    }
  };

  const navigationItems = [
    {
      href: '/search',
      label: 'Search',
      icon: Search,
      isActive: location.pathname === '/search',
      requireAuth: true,
    },
    {
      href: '/location',
      label: 'Location',
      icon: MapPin,
      isActive: location.pathname === '/location',
      requireAuth: true,
    },
    {
      href: '/profile',
      label: 'Profile',
      icon: UserPen,
      isActive: location.pathname === '/profile',
      requireAuth: true,
    },
    {
      href: '/photos',
      label: 'Photos',
      icon: Images,
      isActive: location.pathname === '/photos',
      requireAuth: true,
    },
    {
      href: '/verify',
      label: 'Verify',
      icon: BadgeCheck,
      isActive: location.pathname === '/verify',
      requireAuth: true,
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
      isActive: location.pathname === '/settings',
      requireAuth: true,
    },
  ];

  // Add service fees button if required
  if (profiledata?.onetimefeesrequired && !profiledata?.onetimefeespaid) {
    navigationItems.splice(1, 0, {
      href: '/servicefees',
      label: 'Service Fees',
      icon: CreditCard,
      isActive: location.pathname === '/servicefees',
      requireAuth: true,
    });
  }

  // Desktop sidebar navigation
  const DesktopSidebar = () => (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader className="border-b border-border/50">
        <div className="h-10" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="p-4 space-y-2">
          {navigationItems.map(item => {
            //if (item.requireAuth && !user) return null;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={item.isActive}
                  size="lg"
                  className={cn(
                    'rounded-2xl transition-all duration-200 hover:scale-105',
                    item.isActive && 'bg-primary/15 text-primary',
                  )}
                >
                  <Link to={item.href} onClick={item.onClick}>
                    <item.icon
                      className={cn(
                        '!h-6 !w-6 !min-h-6 !min-w-6 transition-transform',
                        item.isActive && 'animate-bounce-gentle',
                      )}
                    />
                    <span className="text-base font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );

  return (
    <>
      <Dialog open={showReactivateDialog} modal={true}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reactivate Your Profile</DialogTitle>
            <DialogDescription>
              Your profile is currently inactive. To continue using our services, please reactivate your profile.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isReactivating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReactivate}
              disabled={isReactivating}
            >
              {isReactivating ? 'Reactivating...' : 'Reactivate Profile'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {user ? (
        <>
          <SidebarProvider defaultOpen={true}>
            <DesktopSidebar />
            <main className="container animate-slide-up">{children}</main>
          </SidebarProvider>
        </>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
