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
import { useLogout } from '../hooks/useLogout';
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
  Wifi,
  WifiOff,
  Shield,
  Trash2,
  Lock,
  Users,
  Mail,
  Loader2,
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
  const { user, profiledata, setProfiledata, isLoggingOut } = useAuth();
  const location = useLocation();
  useIsMobile();
  const [showReactivateDialog, setShowReactivateDialog] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const { handleLogout } = useLogout();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored!');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Connection lost. Please check your internet connection.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
        onetimefeespaid: false,
        dateofactivation: new Date().toISOString()
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

  // Check if user is admin
  const isAdmin = profiledata?.role === 'admin';

  const navigationItems = isAdmin ? [
    {
      href: '/admin',
      label: 'User Management',
      icon: Shield,
      isActive: location.pathname === '/admin',
      requireAuth: true,
    },
    {
      href: '/admin/bulk',
      label: 'Bulk Operations',
      icon: Users,
      isActive: location.pathname === '/admin/bulk',
      requireAuth: true,
    },
    {
      href: '/admin/profiles',
      label: 'User Profiles',
      icon: User,
      isActive: location.pathname === '/admin/profiles',
      requireAuth: true,
    },
    {
      href: '/admin/userlist',
      label: 'User List by Location',
      icon: MapPin,
      isActive: location.pathname === '/admin/userlist',
      requireAuth: true,
    },
    {
      href: '/admin/emails',
      label: 'Email Templates',
      icon: Mail,
      isActive: location.pathname === '/admin/emails',
      requireAuth: true,
    },
    /*{
      href: '#',
      label: isLoggingOut ? 'Logging out...' : 'Logout',
      icon: Lock,
      isActive: false,
      requireAuth: true,
      onClick: handleLogout,
    },*/
    /*{
      href: '/changepassword',
      label: 'Change Password',
      icon: Lock,
      isActive: location.pathname === '/changepassword',
      requireAuth: true,
    },
    {
      href: '/delete',
      label: 'Delete Account',
      icon: Trash2,
      isActive: location.pathname === '/delete',
      requireAuth: true,
    },*/
  ] : [
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
    /*{
      href: '#',
      label: isLoggingOut ? 'Logging out...' : 'Logout',
      icon: Lock,
      isActive: false,
      requireAuth: true,
      onClick: handleLogout,
    },*/
  ];

  // Add service fees button if required (only for non-admin users)
  if (!isAdmin && profiledata?.onetimefeesrequired && !profiledata?.onetimefeespaid) {
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
        {isAdmin && (
          <div className="px-2 py-2 mt-18 text-center">
                <h2 className="text-lg font-semibold text-foreground">
                  Admin Panel
                </h2>
          </div>
        )}
        {!isAdmin && (
          <div className="h-10" />
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="p-4 space-y-2">
          {navigationItems.map(item => {
            //if (item.requireAuth && !user) return null;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild={item.href !== '#'}
                  isActive={item.isActive}
                  size="lg"
                  disabled={!isOnline || isLoggingOut}
                  className={cn(
                    'rounded-2xl transition-all duration-200 hover:scale-105',
                    item.isActive && 'bg-primary/15 text-primary',
                    (!isOnline || isLoggingOut) && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={item.href === '#' ? () => {
                    if (!isOnline) {
                      toast.error('Please check your internet connection and try again.');
                      return;
                    }
                    item.onClick?.();
                  } : undefined}
                >
                  {item.href !== '#' ? (
                    <Link 
                      to={item.href} 
                      onClick={(e) => {
                        if (!isOnline) {
                          e.preventDefault();
                          toast.error('Please check your internet connection and try again.');
                          return;
                        }
                        item.onClick?.(e);
                      }}
                    >
                      <item.icon
                        className={cn(
                          '!h-6 !w-6 !min-h-6 !min-w-6 transition-transform',
                          item.isActive && 'animate-bounce-gentle',
                        )}
                      />
                      <span className="text-base font-medium">{item.label}</span>
                    </Link>
                  ) : (
                    <>
                      {isLoggingOut ? (
                        <Loader2 className="!h-6 !w-6 !min-h-6 !min-w-6 animate-spin" />
                      ) : (
                        <item.icon
                          className={cn(
                            '!h-6 !w-6 !min-h-6 !min-w-6 transition-transform',
                            item.isActive && 'animate-bounce-gentle',
                          )}
                        />
                      )}
                      <span className="text-base font-medium">{item.label}</span>
                    </>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        {/* Logout Button */}
        <div className="px-4 pb-4">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild={false}
              size="lg"
              disabled={!isOnline || isLoggingOut}
              className={cn(
                'w-full rounded-2xl transition-all duration-200 hover:scale-105 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200',
                (!isOnline || isLoggingOut) && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => {
                if (!isOnline) {
                  toast.error('Please check your internet connection and try again.');
                  return;
                }
                handleLogout();
              }}
            >
              {isLoggingOut ? (
                <Loader2 className="!h-6 !w-6 !min-h-6 !min-w-6 animate-spin" />
              ) : (
                <Lock className="!h-6 !w-6 !min-h-6 !min-w-6 transition-transform" />
              )}
              <span className="text-base font-medium">
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </div>

        {/* Connection Status */}
        <div className={cn(
          "mx-4 mt-4 p-3 rounded-lg border flex items-center gap-2 text-sm font-medium",
          isOnline 
            ? "bg-green-50 border-green-200 text-green-700" 
            : "bg-red-50 border-red-200 text-red-700"
        )}>
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4" />
              Online
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              Offline - Try later
            </>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );

  // Mobile bottom navigation
  const MobileBottomNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-lg">
      <div className="grid grid-cols-5 h-16">
        {navigationItems.slice(0, 5).map(item => (
          item.href === '#' ? (
            <button
              key={item.href}
              type="button"
              onClick={() => {
                if (!isOnline) {
                  toast.error('Please check your internet connection and try again.');
                  return;
                }
                item.onClick?.();
              }}
              disabled={!isOnline || isLoggingOut}
              className={cn(
                'flex flex-col items-center justify-center text-xs font-medium transition-colors',
                'text-muted-foreground hover:text-primary',
                (!isOnline || isLoggingOut) && 'opacity-50'
              )}
            >
              {isLoggingOut ? (
                <Loader2 className="h-5 w-5 mb-1 animate-spin" />
              ) : (
                <item.icon className="h-5 w-5 mb-1" />
              )}
              <span>{item.label}</span>
            </button>
          ) : (
            <Link
              key={item.href}
              to={item.href}
              onClick={(e) => {
                if (!isOnline) {
                  e.preventDefault();
                  toast.error('Please check your internet connection and try again.');
                  return;
                }
              }}
              className={cn(
                'flex flex-col items-center justify-center text-xs font-medium transition-colors',
                item.isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-primary',
                !isOnline && 'opacity-50'
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.label}</span>
            </Link>
          )
        ))}
      </div>
      {/* Connection Status for Mobile */}
      <div className={cn(
        "px-4 py-2 text-xs font-medium text-center",
        isOnline 
          ? "bg-green-50 text-green-700 border-t border-green-200" 
          : "bg-red-50 text-red-700 border-t border-red-200"
      )}>
        {isOnline ? (
          <div className="flex items-center justify-center gap-1">
            <Wifi className="h-3 w-3" />
            <span>Online</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1">
            <WifiOff className="h-3 w-3" />
            <span>Offline - Try later</span>
          </div>
        )}
      </div>
    </div>
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
            <main className="container animate-slide-up relative md:pb-0 pb-20">
              {!isOnline && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm mx-4">
                    <WifiOff className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Internet Connection</h3>
                    <p className="text-gray-600 mb-4">
                      Please check your internet connection and try again later.
                    </p>
                    <Button 
                      onClick={() => window.location.reload()}
                      className="w-full"
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              )}
              {isLoggingOut && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm mx-4">
                    <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Logging Out</h3>
                    <p className="text-gray-600">
                      Please wait while we securely log you out...
                    </p>
                  </div>
                </div>
              )}
              {children}
            </main>
          </SidebarProvider>
          <MobileBottomNav />
        </>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
