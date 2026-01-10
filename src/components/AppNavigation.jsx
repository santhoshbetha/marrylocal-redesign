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
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppNavigation({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  useIsMobile();

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
