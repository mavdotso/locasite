'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  LayoutDashboard, 
  Globe, 
  Settings, 
  User, 
  Menu,
  X,
  LogOut,
  MessageSquare,
  BarChart3,
  PlusCircle,
  Shield
} from 'lucide-react';
import { cn } from '@/app/lib/utils';
import Logo from '@/app/components/ui/logo';

const navigation = [
  { 
    name: 'Overview', 
    href: '/dashboard', 
    icon: LayoutDashboard, 
    description: 'Dashboard overview and quick stats' 
  },
  { 
    name: 'My Sites', 
    href: '/dashboard/sites', 
    icon: Globe, 
    description: 'Manage your business websites' 
  },
  { 
    name: 'Claims', 
    href: '/dashboard/claims', 
    icon: Shield, 
    description: 'Business ownership claims' 
  },
  { 
    name: 'Messages', 
    href: '/dashboard/messages', 
    icon: MessageSquare, 
    description: 'Customer inquiries and contact forms',
    badge: 'unreadCount'
  },
  { 
    name: 'Analytics', 
    href: '/dashboard/analytics', 
    icon: BarChart3, 
    description: 'Website performance and visitor insights' 
  },
  { 
    name: 'Settings', 
    href: '/dashboard/settings', 
    icon: Settings, 
    description: 'Account settings and preferences' 
  },
];

export default function DashboardNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const user = useQuery(api.auth.currentUser);
  
  // Get unread messages count for badge
  const unreadCount = useQuery(api.contactMessages.getTotalUnreadCount) || 0;

  const getBadgeValue = (badgeType: string) => {
    switch (badgeType) {
      case 'unreadCount':
        return unreadCount > 0 ? unreadCount : null;
      default:
        return null;
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/dashboard">
                <Logo width={24} height={24} />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const badgeValue = item.badge ? getBadgeValue(item.badge) : null;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'relative px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                      {badgeValue && (
                        <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5">
                          {badgeValue}
                        </Badge>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/sites/new">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New Site
                </Link>
              </Button>
              
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {user?.name || user?.email || 'User'}
                </span>
              </div>

              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-2 space-y-1">
              {/* User Info */}
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg mb-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {user?.name || user?.email || 'User'}
                </span>
              </div>

              {/* Navigation Links */}
              {navigation.map((item) => {
                const badgeValue = item.badge ? getBadgeValue(item.badge) : null;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <div>
                        <div>{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                    </div>
                    {badgeValue && (
                      <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                        {badgeValue}
                      </Badge>
                    )}
                  </Link>
                );
              })}

              {/* Actions */}
              <div className="pt-3 border-t border-border mt-3">
                <Button variant="outline" size="sm" className="w-full mb-2" asChild>
                  <Link href="/dashboard/sites/new">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    New Site
                  </Link>
                </Button>
                
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}